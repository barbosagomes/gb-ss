import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";
import axios from "axios";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

async function handleGitHubCallback(req: Request, res: Response) {
  console.log("RAW CALLBACK HIT:", req.url, req.query);
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");

  if (!code || !state) {
    res.status(400).json({ error: "code and state are required" });
    return;
  }

  try {
    const redirectUrl = Buffer.from(state, "base64").toString("utf-8");

    console.log("EXCHANGE REQUEST:", {
      client_id: ENV.githubClientId,
      client_secret: ENV.githubClientSecret?.slice(0, 4) + "...",
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    });

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: ENV.githubClientId,
        client_secret: ENV.githubClientSecret,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      },
      {
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      }
    );

    console.log("EXCHANGE RESPONSE STATUS:", tokenResponse.status);
    console.log("EXCHANGE RESPONSE BODY:", tokenResponse.data);

    if (tokenResponse.data.error) {
      throw new Error(`GitHub OAuth error: ${tokenResponse.data.error_description}`);
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    const userEmailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      }
    );

    const primaryEmail = userEmailResponse.data.find(
      (e: any) => e.primary
    )?.email;

    const openId = `github_${userResponse.data.id}`;

    await db.upsertUser({
      openId,
      name: userResponse.data.name || userResponse.data.login,
      email: primaryEmail || userResponse.data.email,
      loginMethod: "github",
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(openId, {
      name: userResponse.data.name || userResponse.data.login,
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    res.redirect(302, redirectUrl || "/");
  } catch (error) {
    console.error("[OAuth GitHub] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}

async function handleGoogleCallback(req: Request, res: Response) {
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");

  if (!code || !state) {
    res.status(400).json({ error: "code and state are required" });
    return;
  }

  try {
    const redirectUrl = Buffer.from(state, "base64").toString("utf-8");

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: ENV.googleClientId,
        client_secret: ENV.googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `https://${req.get("host")}/api/oauth/google/callback`,
      }
    );

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      }
    );

    const openId = `google_${userResponse.data.id}`;

    await db.upsertUser({
      openId,
      name: userResponse.data.name,
      email: userResponse.data.email,
      loginMethod: "google",
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(openId, {
      name: userResponse.data.name,
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    res.redirect(302, redirectUrl || "/");
  } catch (error) {
    console.error("[OAuth Google] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}

async function handleTikTokCallback(req: Request, res: Response) {
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");

  if (!code) {
    res.status(400).json({ error: "code is required" });
    return;
  }

  try {
    let userId: number | null = null;
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
        userId = decoded.userId;
      } catch (e) {
        console.error("[OAuth TikTok] Failed to decode state", e);
      }
    }

    const { createTiktokClient } = await import("../tiktok-api");
    const client = createTiktokClient({
      appKey: ENV.tiktokAppKey,
      appSecret: ENV.tiktokAppSecret,
      redirectUrl: ENV.tiktokRedirectUrl,
      isSandbox: false,
    });

    const tokenResponse = await client.exchangeCodeForToken(code);

    if (userId) {
      const { upsertAccessToken } = await import("../db-tiktok");
      const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
      await upsertAccessToken({
        userId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        sellerId: tokenResponse.seller_id,
        shopName: tokenResponse.shop_name,
      });
    }

    res.redirect(302, "/settings?tiktok=connected");
  } catch (error) {
    console.error("[OAuth TikTok] Callback failed", error);
    res.redirect(302, "/settings?tiktok=error");
  }
}

const GITHUB_REDIRECT_URI = "https://gb-ss-production.up.railway.app/api/oauth/github/callback";

export function registerOAuthRoutes(app: Express) {
  // Rotas que iniciam o login (Essenciais para destravar o botão)
  app.get("/api/oauth/github", (req, res) => {
    // Hardcode total para evitar qualquer erro de redirecionamento HTTP
    const redirectUri = GITHUB_REDIRECT_URI;
    const state = Buffer.from(redirectUri).toString("base64");
    const url = `https://github.com/login/oauth/authorize?client_id=${ENV.githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=user:email`;
    res.redirect(url);
  });

  app.get("/api/oauth/google", (req, res) => {
    const redirectUri = `https://${req.get("host")}/api/oauth/google/callback`;
    const state = Buffer.from(redirectUri).toString("base64");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV.googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&state=${state}`;
    res.redirect(url);
  });

  // Callbacks
  app.get("/api/oauth/github/callback", handleGitHubCallback);
  app.get("/api/oauth/google/callback", handleGoogleCallback);
  app.get("/api/oauth/tiktok/callback", handleTikTokCallback);
}
