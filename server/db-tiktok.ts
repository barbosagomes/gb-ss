import { eq, and, desc, gt, lt } from "drizzle-orm";
import { getDb } from "./db";
import {
  tiktokApps,
  accessTokens,
  products,
  skus,
  syncLogs,
  syncErrors,
  InsertTiktokApp,
  InsertAccessToken,
  InsertProduct,
  InsertSku,
  InsertSyncLog,
  InsertSyncError,
  AccessToken,
  TiktokApp,
  Product,
  Sku,
  SyncLog,
  SyncError,
} from "../drizzle/schema";

/**
 * TikTok App Configuration
 */

export async function getTiktokAppByUserId(userId: number): Promise<TiktokApp | undefined> {
  try {
    const db = await getDb();
    if (!db) return undefined;

    const result = await db
      .select()
      .from(tiktokApps)
      .where(eq(tiktokApps.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[getTiktokAppByUserId] Error:", error);
    return undefined;
  }
}

export async function upsertTiktokApp(
  userId: number,
  data: Omit<InsertTiktokApp, "userId">
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getTiktokAppByUserId(userId);

  if (existing) {
    await db
      .update(tiktokApps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tiktokApps.userId, userId));
  } else {
    await db.insert(tiktokApps).values({ userId, ...data } as InsertTiktokApp);
  }
}

/**
 * Access Tokens
 */

export async function getAccessTokenByUserId(userId: number): Promise<AccessToken | undefined> {
  try {
    const db = await getDb();
    if (!db) return undefined;

    const result = await db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[getAccessTokenByUserId] Error:", error);
    return undefined;
  }
}

export async function upsertAccessToken(data: InsertAccessToken): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getAccessTokenByUserId(data.userId);

  if (existing) {
    await db
      .update(accessTokens)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accessTokens.userId, data.userId));
  } else {
    await db.insert(accessTokens).values(data);
  }
}

export async function refreshAccessToken(
  userId: number,
  newAccessToken: string,
  newRefreshToken: string,
  expiresAt: Date
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(accessTokens)
    .set({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(accessTokens.userId, userId));
}

/**
 * Products
 */

export async function getProductsByUserId(userId: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(products).where(eq(products.userId, userId));
}

export async function getProductByTiktokId(
  userId: number,
  tiktokProductId: string
): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.userId, userId), eq(products.tiktokProductId, tiktokProductId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProduct(data: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getProductByTiktokId(data.userId, data.tiktokProductId);

  if (existing) {
    await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, existing.id));
    return { ...existing, ...data, updatedAt: new Date() };
  } else {
    await db.insert(products).values(data);
    const inserted = await getProductByTiktokId(data.userId, data.tiktokProductId);
    return inserted || ({ ...data, createdAt: new Date(), updatedAt: new Date() } as Product);
  }
}

/**
 * SKUs
 */

export async function getSkusByProductId(productId: number): Promise<Sku[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skus).where(eq(skus.productId, productId));
}

export async function getSkuByTiktokId(
  userId: number,
  tiktokSkuId: string
): Promise<Sku | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(skus)
    .where(and(eq(skus.userId, userId), eq(skus.tiktokSkuId, tiktokSkuId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSku(data: InsertSku): Promise<Sku> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSkuByTiktokId(data.userId, data.tiktokSkuId);

  if (existing) {
    await db
      .update(skus)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(skus.id, existing.id));
    return { ...existing, ...data, updatedAt: new Date() };
  } else {
    await db.insert(skus).values(data);
    const inserted = await getSkuByTiktokId(data.userId, data.tiktokSkuId);
    return inserted || ({ ...data, createdAt: new Date(), updatedAt: new Date() } as Sku);
  }
}

export async function updateSkuInventory(
  skuId: number,
  totalQuantity: number,
  availableQuantity: number,
  reservedQuantity: number
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(skus)
    .set({
      totalQuantity,
      availableQuantity,
      reservedQuantity,
      lastSyncedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(skus.id, skuId));
}

/**
 * Sync Logs
 */

export async function createSyncLog(data: InsertSyncLog): Promise<SyncLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(syncLogs).values(data);
  return { ...data, createdAt: new Date() } as SyncLog;
}

export async function getSyncLogsBySkuId(
  skuId: number,
  limit: number = 50
): Promise<SyncLog[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(syncLogs)
    .where(eq(syncLogs.skuId, skuId))
    .orderBy(desc(syncLogs.createdAt))
    .limit(limit);
}

export async function getSyncLogsByUserId(
  userId: number,
  limit: number = 100
): Promise<SyncLog[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(syncLogs)
    .where(eq(syncLogs.userId, userId))
    .orderBy(desc(syncLogs.createdAt))
    .limit(limit);
}

/**
 * Sync Errors
 */

export async function createSyncError(data: InsertSyncError): Promise<SyncError> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(syncErrors).values(data);
  return { ...data, createdAt: new Date(), updatedAt: new Date() } as SyncError;
}

export async function getSyncErrorsByUserId(
  userId: number,
  isResolved: number = 0
): Promise<SyncError[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(syncErrors)
    .where(and(eq(syncErrors.userId, userId), eq(syncErrors.isResolved, isResolved)))
    .orderBy(desc(syncErrors.createdAt));
}

export async function updateSyncError(
  errorId: number,
  updates: Partial<SyncError>
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(syncErrors)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(syncErrors.id, errorId));
}

export async function markSyncErrorAsResolved(errorId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(syncErrors)
    .set({
      isResolved: 1,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(syncErrors.id, errorId));
}

export async function getErrorsNeedingRetry(): Promise<SyncError[]> {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();

  return db
    .select()
    .from(syncErrors)
    .where(
      and(
        eq(syncErrors.isResolved, 0),
        lt(syncErrors.retryCount, syncErrors.maxRetries),
        lt(syncErrors.nextRetryAt || new Date(0), now)
      )
    );
}
