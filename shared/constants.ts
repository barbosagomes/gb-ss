/**
 * Application Constants
 */

export const APP_NAME = "TikTok Stock Sync";
export const APP_VERSION = "1.0.0";

export const WEBHOOK_EVENTS = {
  INVENTORY_CHANGED: 68,
  ORDER_STATUS_CHANGE: 1,
} as const;

export const MARKET_REGIONS = {
  BRAZIL: "BR",
  USA: "US",
} as const;

export const ENVIRONMENT = {
  SANDBOX: "sandbox",
  PRODUCTION: "production",
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 5000,
} as const;

export const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes before expiry
