/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * TikTok Shop Integration Types
 */

export interface TiktokAppConfig {
  appKey: string;
  redirectUrl?: string;
  isSandbox: boolean;
}

export interface TokenStatus {
  connected: boolean;
  sellerId?: string;
  shopName?: string;
  isExpired?: boolean;
  expiresAt?: Date;
}

export interface ProductInfo {
  id: number;
  tiktokProductId: string;
  productName: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkuInfo {
  id: number;
  tiktokSkuId: string;
  skuName: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncLogInfo {
  id: number;
  triggerSource: string;
  direction: "INBOUND" | "OUTBOUND";
  quantityBefore: number;
  quantityAfter: number;
  delta: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  errorMessage?: string;
  createdAt: Date;
}

export interface SyncErrorInfo {
  id: number;
  errorType: string;
  errorMessage: string;
  retryCount: number;
  maxRetries: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const SYNC_TRIGGER_SOURCES = {
  ORDER_CREATED: "order_created",
  MANUAL_ADJUSTMENT: "manual_adjustment",
  API_SYNC: "api_sync",
  WEBHOOK: "webhook",
} as const;

export const SYNC_DIRECTIONS = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
} as const;

export const SYNC_STATUSES = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  PENDING: "PENDING",
} as const;

export const ERROR_TYPES = {
  API_ERROR: "API_ERROR",
  WEBHOOK_ERROR: "WEBHOOK_ERROR",
  TOKEN_ERROR: "TOKEN_ERROR",
  SYNC_ERROR: "SYNC_ERROR",
} as const;
