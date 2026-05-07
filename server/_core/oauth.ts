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
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");

  if (!code || !state) {
    res.status(400).json({ error: "code and state are required" });
    return;
  }

  try {
    console.log("[OAuth GitHub] Received code:", code);
    console.log("[OAuth GitHub] State:", state);
    console.log("[OAuth GitHub] Using ENV.githubClientId:", ENV.githubClientId);
    console.log("[OAuth GitHub] Using ENV.githubClientSecret:", ENV.githubClientSecret ? "***" : "NOT SET");
    
    // Decode state to get redirect URL
    const redirectUrl = Buffer.from(state, "base64").toString("utf-8");
    console.log("[OAuth GitHub] Redirect URL:", redirectUrl);

    // Exchange code for token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: ENV.githubClientId,
        client_secret: ENV.githubClientSecret,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    console.log("[OAuth GitHub] Token response status:", tokenResponse.status);
    console.log("[OAuth GitHub] Token response data:", tokenResponse.data);
    
    if (tokenResponse.data.error) {
      console.error("[OAuth GitHub] Error from GitHub:", tokenResponse.data.error, tokenResponse.data.error_description);
      throw new Error(`GitHub OAuth error: ${tokenResponse.data.error_description}`);
    }

    // Get user info
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
    console.log("[OAuth GitHub] User ID:", openId);

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
    console.error("[OAuth GitHub] Error details:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "OAuth callback failed", details: error instanceof Error ? error.message : "Unknown error" });
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
    // Decode state to get redirect URL
    const redirectUrl = Buffer.from(state, "base64").toString("utf-8");

    // Exchange code for token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: ENV.googleClientId,
        client_secret: ENV.googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${req.protocol}://${req.get("host")}/api/oauth/google/callback`,
      }
    );

    // Get user info
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
    console.error("[OAuth GitHub] Callback failed:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes("404")) {
      res.status(404).json({ error: "GitHub OAuth endpoint not found", details: error.message });
    } else {
      res.status(500).json({ error: "OAuth callback failed", details: error instanceof Error ? error.message : String(error) });
    }
  }
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/github/callback", handleGitHubCallback);
  app.get("/api/oauth/google/callback", handleGoogleCallback);

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
