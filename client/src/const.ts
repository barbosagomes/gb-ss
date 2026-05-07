export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || 'https://api.manus.im';
  const appId = import.meta.env.VITE_APP_ID || 'tiktok-stock-sync-app';
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// GitHub OAuth login URL
export const getGitHubLoginUrl = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23li2gjbSYAvEN6Iua';
  const redirectUri = `${window.location.origin}/api/oauth/github/callback`;
  const state = btoa(redirectUri);
  const scope = 'user:email';

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  return url.toString();
};

// Google OAuth login URL
export const getGoogleLoginUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com';
  const redirectUri = `${window.location.origin}/api/oauth/google/callback`;
  const scope = 'openid profile email';
  const responseType = 'code';

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', responseType);
  url.searchParams.set('scope', scope);

  return url.toString();
};
