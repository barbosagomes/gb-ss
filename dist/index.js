var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, tiktokApps, accessTokens, products, skus, syncLogs, syncErrors, productCosts, financialMetrics, skuPricing;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    tiktokApps = mysqlTable("tiktok_apps", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      appKey: varchar("appKey", { length: 255 }).notNull(),
      appSecret: varchar("appSecret", { length: 255 }).notNull(),
      redirectUrl: varchar("redirectUrl", { length: 512 }),
      isSandbox: int("isSandbox").default(1).notNull(),
      // 1 = sandbox, 0 = production
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    accessTokens = mysqlTable("access_tokens", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      accessToken: text("accessToken").notNull(),
      refreshToken: text("refreshToken").notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      sellerId: varchar("sellerId", { length: 255 }).notNull(),
      shopName: varchar("shopName", { length: 255 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      tiktokProductId: varchar("tiktokProductId", { length: 255 }).notNull(),
      productName: varchar("productName", { length: 512 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
      // ACTIVE, FREEZE, DELETED
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    skus = mysqlTable("skus", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      productId: int("productId").notNull().references(() => products.id),
      tiktokSkuId: varchar("tiktokSkuId", { length: 255 }).notNull(),
      skuName: varchar("skuName", { length: 512 }).notNull(),
      totalQuantity: int("totalQuantity").default(0).notNull(),
      availableQuantity: int("availableQuantity").default(0).notNull(),
      reservedQuantity: int("reservedQuantity").default(0).notNull(),
      lastSyncedAt: timestamp("lastSyncedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    syncLogs = mysqlTable("sync_logs", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      skuId: int("skuId").notNull().references(() => skus.id),
      triggerSource: varchar("triggerSource", { length: 100 }).notNull(),
      // order_created, manual_adjustment, api_sync, etc
      direction: varchar("direction", { length: 20 }).notNull(),
      // INBOUND (TikTok→App), OUTBOUND (App→TikTok)
      quantityBefore: int("quantityBefore").notNull(),
      quantityAfter: int("quantityAfter").notNull(),
      delta: int("delta").notNull(),
      status: varchar("status", { length: 50 }).default("SUCCESS").notNull(),
      // SUCCESS, FAILED, PENDING
      errorMessage: text("errorMessage"),
      tiktokEventId: varchar("tiktokEventId", { length: 255 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    syncErrors = mysqlTable("sync_errors", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      skuId: int("skuId"),
      errorType: varchar("errorType", { length: 100 }).notNull(),
      // API_ERROR, WEBHOOK_ERROR, TOKEN_ERROR, etc
      errorMessage: text("errorMessage").notNull(),
      retryCount: int("retryCount").default(0).notNull(),
      maxRetries: int("maxRetries").default(3).notNull(),
      nextRetryAt: timestamp("nextRetryAt"),
      isResolved: int("isResolved").default(0).notNull(),
      resolvedAt: timestamp("resolvedAt"),
      notificationSent: int("notificationSent").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productCosts = mysqlTable("product_costs", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      skuId: int("skuId").notNull().references(() => skus.id),
      productCost: varchar("productCost", { length: 20 }).notNull(),
      // Custo do produto
      labelCost: varchar("labelCost", { length: 20 }).default("0"),
      // Custo da etiqueta
      packagingCost: varchar("packagingCost", { length: 20 }).default("0"),
      // Custo da embalagem
      bubbleWrapCost: varchar("bubbleWrapCost", { length: 20 }).default("0"),
      // Custo do plástico bolha
      otherCosts: varchar("otherCosts", { length: 20 }).default("0"),
      // Outros custos
      totalCost: varchar("totalCost", { length: 20 }).notNull(),
      // Total = produto + etiqueta + embalagem + bolha + outros
      notes: text("notes"),
      // Notas adicionais
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    financialMetrics = mysqlTable("financial_metrics", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      metricDate: varchar("metricDate", { length: 10 }).notNull(),
      // Data do registro (YYYY-MM-DD)
      totalCostDay: varchar("totalCostDay", { length: 20 }).default("0"),
      // Custo total do dia
      estimatedRevenueDay: varchar("estimatedRevenueDay", { length: 20 }).default("0"),
      // Receita estimada do dia
      estimatedProfitDay: varchar("estimatedProfitDay", { length: 20 }).default("0"),
      // Lucro estimado do dia
      averageProfitMargin: varchar("averageProfitMargin", { length: 10 }).default("0"),
      // Margem média em %
      productsCount: int("productsCount").default(0),
      // Quantidade de produtos vendidos
      skusCount: int("skusCount").default(0),
      // Quantidade de SKUs vendidos
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    skuPricing = mysqlTable("sku_pricing", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      skuId: int("skuId").notNull().references(() => skus.id),
      sellingPrice: varchar("sellingPrice", { length: 20 }).notNull(),
      // Preço de venda
      profitMarginPercent: varchar("profitMarginPercent", { length: 10 }).notNull(),
      // Margem de lucro em %
      profitMarginValue: varchar("profitMarginValue", { length: 20 }).notNull(),
      // Valor da margem de lucro
      lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET || "tiktok-stock-sync-secret-key-2024-production",
      databaseUrl: process.env.DATABASE_URL || "mysql://root:dRdUwIkTZLudTBVIeuftBlFFGNDyeJfN@mysql.railway.internal:3306/railway",
      oAuthServerUrl: "https://github.com/login/oauth/access_token",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      tiktokAppKey: process.env.TIKTOK_APP_KEY || "6jspb65e6m9ov",
      tiktokAppSecret: process.env.TIKTOK_APP_SECRET || "6151679f3dee318f7aa6b3ffc6cc812c5cf0fb84",
      tiktokAppId: process.env.TIKTOK_APP_ID ?? "",
      tiktokRedirectUrl: "https://gb-ss-production.up.railway.app/api/oauth/tiktok/callback",
      githubClientId: process.env.GITHUB_CLIENT_ID || "Ov23li2gjbSYAvEN6Iua",
      githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      googleClientId: process.env.GOOGLE_CLIENT_ID || "38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com",
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "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"
    };
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  const dbUrl = process.env.DATABASE_URL || ENV.databaseUrl;
  if (!_db && dbUrl) {
    try {
      _db = drizzle(dbUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/tiktok-api.ts
var tiktok_api_exports = {};
__export(tiktok_api_exports, {
  TiktokShopClient: () => TiktokShopClient,
  createTiktokClient: () => createTiktokClient
});
import crypto from "crypto";
import axios2 from "axios";
function createTiktokClient(config) {
  return new TiktokShopClient(config);
}
var TiktokShopClient;
var init_tiktok_api = __esm({
  "server/tiktok-api.ts"() {
    "use strict";
    TiktokShopClient = class {
      config;
      baseUrl;
      client;
      constructor(config) {
        this.config = config;
        this.baseUrl = config.isSandbox ? "https://test-shop.tiktok.com/api" : "https://shop.tiktok.com/api";
        this.client = axios2.create({
          baseURL: this.baseUrl,
          timeout: 1e4
        });
      }
      /**
       * Generate OAuth authorization URL
       */
      getAuthorizationUrl(state) {
        const authUrl = this.config.isSandbox ? "https://test-seller.tiktok.com/oauth/authorize" : "https://seller.tiktok.com/oauth/authorize";
        const params = new URLSearchParams({
          client_key: this.config.appKey,
          response_type: "code",
          scope: "product.read,product.write,order.read",
          redirect_uri: this.config.redirectUrl,
          state
        });
        return `${authUrl}?${params.toString()}`;
      }
      /**
       * Exchange authorization code for access token
       */
      async exchangeCodeForToken(code) {
        const timestamp2 = Math.floor(Date.now() / 1e3);
        const signature = this.generateSignature({
          client_key: this.config.appKey,
          code,
          grant_type: "authorization_code",
          timestamp: timestamp2
        });
        try {
          const response = await this.client.post("/v1/oauth/token", {
            client_key: this.config.appKey,
            code,
            grant_type: "authorization_code",
            timestamp: timestamp2,
            sign: signature
          });
          return response.data.data;
        } catch (error) {
          console.error("[TikTok API] Failed to exchange code for token:", error);
          throw error;
        }
      }
      /**
       * Refresh access token
       */
      async refreshToken(refreshToken) {
        const timestamp2 = Math.floor(Date.now() / 1e3);
        const signature = this.generateSignature({
          client_key: this.config.appKey,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          timestamp: timestamp2
        });
        try {
          const response = await this.client.post("/v1/oauth/token", {
            client_key: this.config.appKey,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            timestamp: timestamp2,
            sign: signature
          });
          return response.data.data;
        } catch (error) {
          console.error("[TikTok API] Failed to refresh token:", error);
          throw error;
        }
      }
      /**
       * Get list of products
       */
      async getProducts(accessToken, offset = 0, limit = 50) {
        const timestamp2 = Math.floor(Date.now() / 1e3);
        const signature = this.generateSignature(
          {
            access_token: accessToken,
            app_key: this.config.appKey,
            timestamp: timestamp2
          },
          "GET"
        );
        try {
          const response = await this.client.get("/product/202309/products", {
            params: {
              access_token: accessToken,
              app_key: this.config.appKey,
              timestamp: timestamp2,
              sign: signature,
              offset,
              limit
            }
          });
          return response.data;
        } catch (error) {
          console.error("[TikTok API] Failed to get products:", error);
          throw error;
        }
      }
      /**
       * Get SKUs for a product
       */
      async getSkus(accessToken, productId, offset = 0, limit = 50) {
        const timestamp2 = Math.floor(Date.now() / 1e3);
        const signature = this.generateSignature(
          {
            access_token: accessToken,
            app_key: this.config.appKey,
            timestamp: timestamp2
          },
          "GET"
        );
        try {
          const response = await this.client.get(`/product/202309/products/${productId}/skus`, {
            params: {
              access_token: accessToken,
              app_key: this.config.appKey,
              timestamp: timestamp2,
              sign: signature,
              offset,
              limit
            }
          });
          return response.data;
        } catch (error) {
          console.error("[TikTok API] Failed to get SKUs:", error);
          throw error;
        }
      }
      /**
       * Update inventory for a product's SKUs
       */
      async updateInventory(accessToken, productId, skus2) {
        const timestamp2 = Math.floor(Date.now() / 1e3);
        const body = {
          product_id: productId,
          skus: skus2
        };
        const signature = this.generateSignature(
          {
            access_token: accessToken,
            app_key: this.config.appKey,
            timestamp: timestamp2
          },
          "POST",
          body
        );
        try {
          await this.client.post(`/product/202309/products/${productId}/inventory/update`, body, {
            params: {
              access_token: accessToken,
              app_key: this.config.appKey,
              timestamp: timestamp2,
              sign: signature
            }
          });
        } catch (error) {
          console.error("[TikTok API] Failed to update inventory:", error);
          throw error;
        }
      }
      /**
       * Verify webhook signature
       */
      verifyWebhookSignature(payload, signature) {
        const expectedSignature = crypto.createHmac("sha256", this.config.appSecret).update(payload).digest("hex");
        return crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );
      }
      /**
       * Generate API signature
       */
      generateSignature(params, method = "POST", body) {
        const sortedParams = Object.keys(params).sort().map((key) => `${key}${params[key]}`).join("");
        let signString = sortedParams;
        if (method === "POST" && body) {
          const bodyString = JSON.stringify(body);
          signString += bodyString;
        }
        signString += this.config.appSecret;
        return crypto.createHash("sha256").update(signString).digest("hex");
      }
    };
  }
});

// server/db-tiktok.ts
var db_tiktok_exports = {};
__export(db_tiktok_exports, {
  createSyncError: () => createSyncError,
  createSyncLog: () => createSyncLog,
  getAccessTokenByUserId: () => getAccessTokenByUserId,
  getErrorsNeedingRetry: () => getErrorsNeedingRetry,
  getProductByTiktokId: () => getProductByTiktokId,
  getProductsByUserId: () => getProductsByUserId,
  getSkuByTiktokId: () => getSkuByTiktokId,
  getSkusByProductId: () => getSkusByProductId,
  getSyncErrorsByUserId: () => getSyncErrorsByUserId,
  getSyncLogsBySkuId: () => getSyncLogsBySkuId,
  getSyncLogsByUserId: () => getSyncLogsByUserId,
  getTiktokAppByUserId: () => getTiktokAppByUserId,
  markSyncErrorAsResolved: () => markSyncErrorAsResolved,
  refreshAccessToken: () => refreshAccessToken,
  updateSkuInventory: () => updateSkuInventory,
  updateSyncError: () => updateSyncError,
  upsertAccessToken: () => upsertAccessToken,
  upsertProduct: () => upsertProduct,
  upsertSku: () => upsertSku,
  upsertTiktokApp: () => upsertTiktokApp
});
import { eq as eq2, and, desc, lt } from "drizzle-orm";
async function getTiktokAppByUserId(userId) {
  try {
    const db = await getDb();
    if (!db) return void 0;
    const result = await db.select().from(tiktokApps).where(eq2(tiktokApps.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  } catch (error) {
    console.error("[getTiktokAppByUserId] Error:", error);
    return void 0;
  }
}
async function upsertTiktokApp(userId, data) {
  const db = await getDb();
  if (!db) return;
  const existing = await getTiktokAppByUserId(userId);
  if (existing) {
    await db.update(tiktokApps).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(tiktokApps.userId, userId));
  } else {
    await db.insert(tiktokApps).values({ userId, ...data });
  }
}
async function getAccessTokenByUserId(userId) {
  try {
    const db = await getDb();
    if (!db) return void 0;
    const result = await db.select().from(accessTokens).where(eq2(accessTokens.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  } catch (error) {
    console.error("[getAccessTokenByUserId] Error:", error);
    return void 0;
  }
}
async function upsertAccessToken(data) {
  const db = await getDb();
  if (!db) return;
  const existing = await getAccessTokenByUserId(data.userId);
  if (existing) {
    await db.update(accessTokens).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(accessTokens.userId, data.userId));
  } else {
    await db.insert(accessTokens).values(data);
  }
}
async function refreshAccessToken(userId, newAccessToken, newRefreshToken, expiresAt) {
  const db = await getDb();
  if (!db) return;
  await db.update(accessTokens).set({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(accessTokens.userId, userId));
}
async function getProductsByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq2(products.userId, userId));
}
async function getProductByTiktokId(userId, tiktokProductId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(and(eq2(products.userId, userId), eq2(products.tiktokProductId, tiktokProductId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertProduct(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getProductByTiktokId(data.userId, data.tiktokProductId);
  if (existing) {
    await db.update(products).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(products.id, existing.id));
    return { ...existing, ...data, updatedAt: /* @__PURE__ */ new Date() };
  } else {
    await db.insert(products).values(data);
    const inserted = await getProductByTiktokId(data.userId, data.tiktokProductId);
    return inserted || { ...data, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
  }
}
async function getSkusByProductId(productId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skus).where(eq2(skus.productId, productId));
}
async function getSkuByTiktokId(userId, tiktokSkuId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(skus).where(and(eq2(skus.userId, userId), eq2(skus.tiktokSkuId, tiktokSkuId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertSku(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSkuByTiktokId(data.userId, data.tiktokSkuId);
  if (existing) {
    await db.update(skus).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(skus.id, existing.id));
    return { ...existing, ...data, updatedAt: /* @__PURE__ */ new Date() };
  } else {
    await db.insert(skus).values(data);
    const inserted = await getSkuByTiktokId(data.userId, data.tiktokSkuId);
    return inserted || { ...data, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
  }
}
async function updateSkuInventory(skuId, totalQuantity, availableQuantity, reservedQuantity) {
  const db = await getDb();
  if (!db) return;
  await db.update(skus).set({
    totalQuantity,
    availableQuantity,
    reservedQuantity,
    lastSyncedAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(skus.id, skuId));
}
async function createSyncLog(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(syncLogs).values(data);
  return { ...data, createdAt: /* @__PURE__ */ new Date() };
}
async function getSyncLogsBySkuId(skuId, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(syncLogs).where(eq2(syncLogs.skuId, skuId)).orderBy(desc(syncLogs.createdAt)).limit(limit);
}
async function getSyncLogsByUserId(userId, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(syncLogs).where(eq2(syncLogs.userId, userId)).orderBy(desc(syncLogs.createdAt)).limit(limit);
}
async function createSyncError(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(syncErrors).values(data);
  return { ...data, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
}
async function getSyncErrorsByUserId(userId, isResolved = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(syncErrors).where(and(eq2(syncErrors.userId, userId), eq2(syncErrors.isResolved, isResolved))).orderBy(desc(syncErrors.createdAt));
}
async function updateSyncError(errorId, updates) {
  const db = await getDb();
  if (!db) return;
  await db.update(syncErrors).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(syncErrors.id, errorId));
}
async function markSyncErrorAsResolved(errorId) {
  const db = await getDb();
  if (!db) return;
  await db.update(syncErrors).set({
    isResolved: 1,
    resolvedAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(syncErrors.id, errorId));
}
async function getErrorsNeedingRetry() {
  const db = await getDb();
  if (!db) return [];
  const now = /* @__PURE__ */ new Date();
  return db.select().from(syncErrors).where(
    and(
      eq2(syncErrors.isResolved, 0),
      lt(syncErrors.retryCount, syncErrors.maxRetries),
      lt(syncErrors.nextRetryAt || /* @__PURE__ */ new Date(0), now)
    )
  );
}
var init_db_tiktok = __esm({
  "server/db-tiktok.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
init_env();
import axios3 from "axios";
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function handleGitHubCallback(req, res) {
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
    const tokenResponse = await axios3.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: ENV.githubClientId,
        client_secret: ENV.githubClientSecret,
        code,
        redirect_uri: GITHUB_REDIRECT_URI
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    console.log("EXCHANGE RESPONSE STATUS:", tokenResponse.status);
    console.log("EXCHANGE RESPONSE BODY:", tokenResponse.data);
    if (tokenResponse.data.error) {
      throw new Error(`GitHub OAuth error: ${tokenResponse.data.error_description}`);
    }
    const userResponse = await axios3.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    });
    const userEmailResponse = await axios3.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
      }
    );
    const primaryEmail = userEmailResponse.data.find(
      (e) => e.primary
    )?.email;
    const openId = `github_${userResponse.data.id}`;
    await upsertUser({
      openId,
      name: userResponse.data.name || userResponse.data.login,
      email: primaryEmail || userResponse.data.email,
      loginMethod: "github",
      lastSignedIn: /* @__PURE__ */ new Date()
    });
    const sessionToken = await sdk.createSessionToken(openId, {
      name: userResponse.data.name || userResponse.data.login,
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(req);
    console.log("SESSION AFTER LOGIN:", { openId, name: userResponse.data.name || userResponse.data.login });
    console.log("COOKIE OPTIONS:", cookieOptions);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS
    });
    console.log("COOKIE HEADER SENT:", res.getHeader("set-cookie"));
    res.redirect(302, redirectUrl || "/");
  } catch (error) {
    console.error("[OAuth GitHub] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}
async function handleGoogleCallback(req, res) {
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");
  if (!code || !state) {
    res.status(400).json({ error: "code and state are required" });
    return;
  }
  try {
    const redirectUrl = Buffer.from(state, "base64").toString("utf-8");
    const tokenResponse = await axios3.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: ENV.googleClientId,
        client_secret: ENV.googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `https://${req.get("host")}/api/oauth/google/callback`
      }
    );
    const userResponse = await axios3.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
      }
    );
    const openId = `google_${userResponse.data.id}`;
    await upsertUser({
      openId,
      name: userResponse.data.name,
      email: userResponse.data.email,
      loginMethod: "google",
      lastSignedIn: /* @__PURE__ */ new Date()
    });
    const sessionToken = await sdk.createSessionToken(openId, {
      name: userResponse.data.name,
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(req);
    console.log("SESSION AFTER LOGIN:", { openId, name: userResponse.data.name || userResponse.data.login });
    console.log("COOKIE OPTIONS:", cookieOptions);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS
    });
    console.log("COOKIE HEADER SENT:", res.getHeader("set-cookie"));
    res.redirect(302, redirectUrl || "/");
  } catch (error) {
    console.error("[OAuth Google] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}
async function handleTikTokCallback(req, res) {
  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");
  if (!code) {
    res.status(400).json({ error: "code is required" });
    return;
  }
  try {
    let userId = null;
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
        userId = decoded.userId;
      } catch (e) {
        console.error("[OAuth TikTok] Failed to decode state", e);
      }
    }
    const { createTiktokClient: createTiktokClient2 } = await Promise.resolve().then(() => (init_tiktok_api(), tiktok_api_exports));
    const client = createTiktokClient2({
      appKey: ENV.tiktokAppKey,
      appSecret: ENV.tiktokAppSecret,
      redirectUrl: ENV.tiktokRedirectUrl,
      isSandbox: false
    });
    const tokenResponse = await client.exchangeCodeForToken(code);
    if (userId) {
      const { upsertAccessToken: upsertAccessToken2 } = await Promise.resolve().then(() => (init_db_tiktok(), db_tiktok_exports));
      const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1e3);
      await upsertAccessToken2({
        userId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        sellerId: tokenResponse.seller_id,
        shopName: tokenResponse.shop_name
      });
    }
    res.redirect(302, "/settings?tiktok=connected");
  } catch (error) {
    console.error("[OAuth TikTok] Callback failed", error);
    res.redirect(302, "/settings?tiktok=error");
  }
}
var GITHUB_REDIRECT_URI = "https://gb-ss-production.up.railway.app/api/oauth/github/callback";
function registerOAuthRoutes(app) {
  app.get("/api/oauth/github", (req, res) => {
    const redirectUri = GITHUB_REDIRECT_URI;
    const postLoginRedirect = "/";
    const state = Buffer.from(postLoginRedirect).toString("base64");
    const url = `https://github.com/login/oauth/authorize?client_id=${ENV.githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=user:email`;
    res.redirect(url);
  });
  app.get("/api/oauth/google", (req, res) => {
    const redirectUri = `https://${req.get("host")}/api/oauth/google/callback`;
    const postLoginRedirect = "/";
    const state = Buffer.from(postLoginRedirect).toString("base64");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV.googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&state=${state}`;
    res.redirect(url);
  });
  app.get("/api/oauth/github/callback", handleGitHubCallback);
  app.get("/api/oauth/google/callback", handleGoogleCallback);
  app.get("/api/oauth/tiktok/callback", handleTikTokCallback);
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const data = await forgeResp.json();
      const url = data.url;
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db_tiktok();
init_tiktok_api();
import { z as z3 } from "zod";

// server/routers-financial.ts
import { z as z2 } from "zod";

// server/db-financial.ts
init_schema();
init_db();
import { eq as eq3, and as and2 } from "drizzle-orm";
async function upsertProductCost(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(productCosts).where(
    and2(
      eq3(productCosts.userId, data.userId),
      eq3(productCosts.skuId, data.skuId)
    )
  ).limit(1);
  if (existing.length > 0) {
    await db.update(productCosts).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(productCosts.id, existing[0].id));
    return { ...existing[0], ...data, updatedAt: /* @__PURE__ */ new Date() };
  } else {
    await db.insert(productCosts).values(data);
    const inserted = await db.select().from(productCosts).where(
      and2(
        eq3(productCosts.userId, data.userId),
        eq3(productCosts.skuId, data.skuId)
      )
    ).limit(1);
    return inserted[0] || { ...data, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
  }
}
async function getProductCostBySkuId(userId, skuId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(productCosts).where(and2(eq3(productCosts.userId, userId), eq3(productCosts.skuId, skuId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductCostsByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productCosts).where(eq3(productCosts.userId, userId));
}
async function upsertFinancialMetric(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(financialMetrics).where(
    and2(
      eq3(financialMetrics.userId, data.userId),
      eq3(financialMetrics.metricDate, data.metricDate)
    )
  ).limit(1);
  if (existing.length > 0) {
    await db.update(financialMetrics).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(financialMetrics.id, existing[0].id));
    return { ...existing[0], ...data, updatedAt: /* @__PURE__ */ new Date() };
  } else {
    await db.insert(financialMetrics).values(data);
    const inserted = await db.select().from(financialMetrics).where(
      and2(
        eq3(financialMetrics.userId, data.userId),
        eq3(financialMetrics.metricDate, data.metricDate)
      )
    ).limit(1);
    return inserted[0] || { ...data, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
  }
}
async function getFinancialMetricsByUserId(userId, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(financialMetrics).where(eq3(financialMetrics.userId, userId)).orderBy((fm) => fm.metricDate).limit(limit);
}
async function getTodayMetric(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const result = await db.select().from(financialMetrics).where(
    and2(
      eq3(financialMetrics.userId, userId),
      eq3(financialMetrics.metricDate, today)
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertSkuPricing(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(skuPricing).where(
    and2(
      eq3(skuPricing.userId, data.userId),
      eq3(skuPricing.skuId, data.skuId)
    )
  ).limit(1);
  if (existing.length > 0) {
    await db.update(skuPricing).set({ ...data, lastUpdatedAt: /* @__PURE__ */ new Date() }).where(eq3(skuPricing.id, existing[0].id));
    return { ...existing[0], ...data, lastUpdatedAt: /* @__PURE__ */ new Date() };
  } else {
    await db.insert(skuPricing).values(data);
    const inserted = await db.select().from(skuPricing).where(
      and2(
        eq3(skuPricing.userId, data.userId),
        eq3(skuPricing.skuId, data.skuId)
      )
    ).limit(1);
    return inserted[0] || { ...data, createdAt: /* @__PURE__ */ new Date(), lastUpdatedAt: /* @__PURE__ */ new Date() };
  }
}
async function getSkuPricingBySkuId(userId, skuId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(skuPricing).where(and2(eq3(skuPricing.userId, userId), eq3(skuPricing.skuId, skuId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getSkuPricingsByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(skuPricing).where(eq3(skuPricing.userId, userId));
}
function calculateTotalCost(productCost, labelCost = 0, packagingCost = 0, bubbleWrapCost = 0, otherCosts = 0) {
  return productCost + labelCost + packagingCost + bubbleWrapCost + otherCosts;
}
function calculateProfitMargin(sellingPrice, totalCost) {
  const marginValue = sellingPrice - totalCost;
  const marginPercent = totalCost > 0 ? marginValue / totalCost * 100 : 0;
  return {
    marginPercent: Math.round(marginPercent * 100) / 100,
    marginValue: Math.round(marginValue * 100) / 100
  };
}
function calculateDailyMetrics(skuPricings, productCosts2, quantitiesSold) {
  let totalCost = 0;
  let estimatedRevenue = 0;
  let totalMargin = 0;
  let count = 0;
  for (const pricing of skuPricings) {
    const quantity = quantitiesSold.get(pricing.skuId) || 0;
    if (quantity === 0) continue;
    const cost = parseFloat(productCosts2.find((pc) => pc.skuId === pricing.skuId)?.totalCost || "0");
    const price = parseFloat(pricing.sellingPrice);
    totalCost += cost * quantity;
    estimatedRevenue += price * quantity;
    totalMargin += parseFloat(pricing.profitMarginPercent);
    count++;
  }
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
    estimatedProfit: Math.round((estimatedRevenue - totalCost) * 100) / 100,
    averageMargin: count > 0 ? Math.round(totalMargin / count * 100) / 100 : 0
  };
}

// server/routers-financial.ts
init_db_tiktok();
var financialRouter = router({
  // Get or create product cost
  getProductCost: protectedProcedure.input(z2.object({ skuId: z2.number() })).query(async ({ ctx, input }) => {
    const cost = await getProductCostBySkuId(ctx.user.id, input.skuId);
    return cost || null;
  }),
  // Save product cost
  saveProductCost: protectedProcedure.input(
    z2.object({
      skuId: z2.number(),
      productCost: z2.string(),
      labelCost: z2.string().optional(),
      packagingCost: z2.string().optional(),
      bubbleWrapCost: z2.string().optional(),
      otherCosts: z2.string().optional(),
      notes: z2.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const totalCost = calculateTotalCost(
      parseFloat(input.productCost),
      parseFloat(input.labelCost || "0"),
      parseFloat(input.packagingCost || "0"),
      parseFloat(input.bubbleWrapCost || "0"),
      parseFloat(input.otherCosts || "0")
    );
    await upsertProductCost({
      userId: ctx.user.id,
      skuId: input.skuId,
      productCost: input.productCost,
      labelCost: input.labelCost || "0",
      packagingCost: input.packagingCost || "0",
      bubbleWrapCost: input.bubbleWrapCost || "0",
      otherCosts: input.otherCosts || "0",
      totalCost: totalCost.toString(),
      notes: input.notes
    });
    return { success: true, totalCost };
  }),
  // Get SKU pricing
  getSkuPricing: protectedProcedure.input(z2.object({ skuId: z2.number() })).query(async ({ ctx, input }) => {
    const pricing = await getSkuPricingBySkuId(ctx.user.id, input.skuId);
    return pricing || null;
  }),
  // Save SKU pricing
  saveSkuPricing: protectedProcedure.input(
    z2.object({
      skuId: z2.number(),
      sellingPrice: z2.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const productCost = await getProductCostBySkuId(ctx.user.id, input.skuId);
    if (!productCost) {
      throw new Error("Custo do produto n\xE3o encontrado. Configure o custo antes de definir o pre\xE7o.");
    }
    const sellingPrice = parseFloat(input.sellingPrice);
    const totalCost = parseFloat(productCost.totalCost);
    const { marginPercent, marginValue } = calculateProfitMargin(
      sellingPrice,
      totalCost
    );
    await upsertSkuPricing({
      userId: ctx.user.id,
      skuId: input.skuId,
      sellingPrice: input.sellingPrice,
      profitMarginPercent: marginPercent.toString(),
      profitMarginValue: marginValue.toString()
    });
    return { success: true, marginPercent, marginValue };
  }),
  // Get all product costs
  getAllProductCosts: protectedProcedure.query(async ({ ctx }) => {
    return await getProductCostsByUserId(ctx.user.id);
  }),
  // Get all SKU pricing
  getAllSkuPricing: protectedProcedure.query(async ({ ctx }) => {
    return await getSkuPricingsByUserId(ctx.user.id);
  }),
  // Get today's financial metrics
  getTodayMetrics: protectedProcedure.query(async ({ ctx }) => {
    const metrics = await getTodayMetric(ctx.user.id);
    return metrics || null;
  }),
  // Get financial metrics history
  getMetricsHistory: protectedProcedure.input(z2.object({ days: z2.number().default(30) })).query(async ({ ctx, input }) => {
    return await getFinancialMetricsByUserId(ctx.user.id, input.days);
  }),
  // Calculate and save daily metrics
  calculateDailyMetrics: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const skuPricings = await getSkuPricingsByUserId(ctx.user.id);
      const productCosts2 = await getProductCostsByUserId(ctx.user.id);
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const syncLogs2 = await getSyncLogsByUserId(ctx.user.id, 1e3);
      const quantitiesSold = /* @__PURE__ */ new Map();
      for (const log of syncLogs2) {
        const logDate = new Date(log.createdAt).toISOString().split("T")[0];
        if (logDate === today && log.direction === "OUTBOUND") {
          const current = quantitiesSold.get(log.skuId) || 0;
          quantitiesSold.set(log.skuId, current + Math.abs(log.delta));
        }
      }
      const metrics = calculateDailyMetrics(skuPricings, productCosts2, quantitiesSold);
      await upsertFinancialMetric({
        userId: ctx.user.id,
        metricDate: today,
        totalCostDay: metrics.totalCost.toString(),
        estimatedRevenueDay: metrics.estimatedRevenue.toString(),
        estimatedProfitDay: metrics.estimatedProfit.toString(),
        averageProfitMargin: metrics.averageMargin.toString(),
        productsCount: quantitiesSold.size,
        skusCount: quantitiesSold.size
      });
      return { success: true, metrics };
    } catch (error) {
      throw new Error(
        `Erro ao calcular m\xE9tricas di\xE1rias: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }),
  // Get products with low profit margin
  getLowMarginProducts: protectedProcedure.input(z2.object({ threshold: z2.number().default(10) })).query(async ({ ctx, input }) => {
    const pricings = await getSkuPricingsByUserId(ctx.user.id);
    return pricings.filter((p) => parseFloat(p.profitMarginPercent) < input.threshold);
  }),
  // Get most profitable products
  getMostProfitableProducts: protectedProcedure.input(z2.object({ limit: z2.number().default(10) })).query(async ({ ctx, input }) => {
    const pricings = await getSkuPricingsByUserId(ctx.user.id);
    return pricings.sort((a, b) => parseFloat(b.profitMarginValue) - parseFloat(a.profitMarginValue)).slice(0, input.limit);
  })
});

// server/routers.ts
init_env();
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  financial: financialRouter,
  tiktok: router({
    // Get all products from DB (synced from TikTok)
    getProducts: protectedProcedure.query(async ({ ctx }) => {
      const products2 = await getProductsByUserId(ctx.user.id);
      if (products2.length === 0) {
        return [];
      }
      const enriched = await Promise.all(
        products2.map(async (p) => {
          const skuList = await getSkusByProductId(p.id);
          const totalStock = skuList.reduce((sum, s) => sum + (s.availableQuantity || 0), 0);
          return {
            id: p.id,
            tiktokProductId: p.tiktokProductId,
            productName: p.productName,
            description: p.description,
            status: p.status,
            skuCount: skuList.length,
            totalStock,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
          };
        })
      );
      return enriched;
    }),
    // Get or create TikTok app configuration (uses ENV defaults)
    getAppConfig: protectedProcedure.query(async ({ ctx }) => {
      const config = await getTiktokAppByUserId(ctx.user.id);
      if (config) {
        return {
          appKey: config.appKey,
          redirectUrl: config.redirectUrl,
          isSandbox: config.isSandbox === 1,
          isConfigured: true
        };
      }
      if (ENV.tiktokAppKey) {
        return {
          appKey: ENV.tiktokAppKey,
          redirectUrl: ENV.tiktokRedirectUrl,
          isSandbox: false,
          isConfigured: true
        };
      }
      return null;
    }),
    // Save TikTok app configuration
    saveAppConfig: protectedProcedure.input(
      z3.object({
        appKey: z3.string().min(1),
        appSecret: z3.string().min(1),
        redirectUrl: z3.string().url(),
        isSandbox: z3.boolean()
      })
    ).mutation(async ({ ctx, input }) => {
      await upsertTiktokApp(ctx.user.id, {
        appKey: input.appKey,
        appSecret: input.appSecret,
        redirectUrl: input.redirectUrl,
        isSandbox: input.isSandbox ? 1 : 0
      });
      return { success: true };
    }),
    // Get OAuth authorization URL (uses ENV credentials by default)
    getAuthorizationUrl: protectedProcedure.query(async ({ ctx }) => {
      const config = await getTiktokAppByUserId(ctx.user.id);
      const appKey = config?.appKey || ENV.tiktokAppKey;
      const appSecret = config?.appSecret || ENV.tiktokAppSecret;
      const redirectUrl = config?.redirectUrl || ENV.tiktokRedirectUrl;
      const isSandbox = config ? config.isSandbox === 1 : false;
      if (!appKey || !appSecret) {
        throw new Error("TikTok app credentials not configured");
      }
      const client = createTiktokClient({
        appKey,
        appSecret,
        redirectUrl,
        isSandbox
      });
      const state = Buffer.from(JSON.stringify({ userId: ctx.user.id })).toString("base64");
      const url = client.getAuthorizationUrl(state);
      return { url };
    }),
    // Handle OAuth callback (uses ENV credentials by default)
    handleOAuthCallback: protectedProcedure.input(
      z3.object({
        code: z3.string(),
        state: z3.string()
      })
    ).mutation(async ({ ctx, input }) => {
      const config = await getTiktokAppByUserId(ctx.user.id);
      const appKey = config?.appKey || ENV.tiktokAppKey;
      const appSecret = config?.appSecret || ENV.tiktokAppSecret;
      const redirectUrl = config?.redirectUrl || ENV.tiktokRedirectUrl;
      const isSandbox = config ? config.isSandbox === 1 : false;
      if (!appKey || !appSecret) {
        throw new Error("TikTok app credentials not configured");
      }
      const client = createTiktokClient({
        appKey,
        appSecret,
        redirectUrl,
        isSandbox
      });
      const tokenResponse = await client.exchangeCodeForToken(input.code);
      const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1e3);
      await upsertAccessToken({
        userId: ctx.user.id,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        sellerId: tokenResponse.seller_id,
        shopName: tokenResponse.shop_name
      });
      return { success: true, sellerId: tokenResponse.seller_id };
    }),
    // Get access token status
    getTokenStatus: protectedProcedure.query(async ({ ctx }) => {
      const token = await getAccessTokenByUserId(ctx.user.id);
      if (!token) {
        return { connected: false };
      }
      const isExpired = /* @__PURE__ */ new Date() > token.expiresAt;
      return {
        connected: true,
        sellerId: token.sellerId,
        shopName: token.shopName,
        isExpired,
        expiresAt: token.expiresAt
      };
    }),
    // Get SKUs for a product
    getSkus: protectedProcedure.input(z3.object({ productId: z3.number() })).query(async ({ input }) => {
      const skus2 = await getSkusByProductId(input.productId);
      return skus2;
    }),
    // Get sync logs
    getSyncLogs: protectedProcedure.query(async ({ ctx }) => {
      const logs = await getSyncLogsByUserId(ctx.user.id, 100);
      return logs;
    }),
    // Get sync errors
    getSyncErrors: protectedProcedure.query(async ({ ctx }) => {
      const errors = await getSyncErrorsByUserId(ctx.user.id, 0);
      return errors;
    }),
    // Sync products from TikTok Shop
    syncProducts: protectedProcedure.mutation(async ({ ctx, input: _ }) => {
      const config = await getTiktokAppByUserId(ctx.user.id);
      const token = await getAccessTokenByUserId(ctx.user.id);
      if (!token) {
        throw new Error("TikTok not connected. Please authorize first.");
      }
      const appKey = config?.appKey || ENV.tiktokAppKey;
      const appSecret = config?.appSecret || ENV.tiktokAppSecret;
      const redirectUrl = config?.redirectUrl || ENV.tiktokRedirectUrl;
      const isSandbox = config ? config.isSandbox === 1 : false;
      const client = createTiktokClient({
        appKey,
        appSecret,
        redirectUrl,
        isSandbox
      });
      try {
        const productsResponse = await client.getProducts(token.accessToken);
        for (const product of productsResponse.data.products) {
          const savedProduct = await upsertProduct({
            userId: ctx.user.id,
            tiktokProductId: product.id,
            productName: product.title,
            description: product.description ?? void 0,
            status: product.status
          });
          const skusResponse = await client.getSkus(token.accessToken, product.id);
          for (const sku of skusResponse.data.skus) {
            if (savedProduct.id) {
              await upsertSku({
                userId: ctx.user.id,
                productId: savedProduct.id,
                tiktokSkuId: sku.id,
                skuName: sku.title,
                totalQuantity: sku.inventory.total_quantity,
                availableQuantity: sku.inventory.available_quantity,
                reservedQuantity: sku.inventory.reserved_quantity
              });
            }
          }
        }
        return { success: true, productCount: productsResponse.data.products.length };
      } catch (error) {
        throw new Error(
          `Failed to sync products: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }),
    // Update SKU inventory
    updateSkuInventory: protectedProcedure.input(
      z3.object({
        productId: z3.string(),
        skuId: z3.string(),
        quantity: z3.number().int().min(0)
      })
    ).mutation(async ({ ctx, input }) => {
      const config = await getTiktokAppByUserId(ctx.user.id);
      const token = await getAccessTokenByUserId(ctx.user.id);
      if (!token) {
        throw new Error("TikTok not connected. Please authorize first.");
      }
      const appKey = config?.appKey || ENV.tiktokAppKey;
      const appSecret = config?.appSecret || ENV.tiktokAppSecret;
      const redirectUrl = config?.redirectUrl || ENV.tiktokRedirectUrl;
      const isSandbox = config ? config.isSandbox === 1 : false;
      const client = createTiktokClient({
        appKey,
        appSecret,
        redirectUrl,
        isSandbox
      });
      try {
        await client.updateInventory(token.accessToken, input.productId, [
          { sku_id: input.skuId, quantity: input.quantity }
        ]);
        const sku = await getSkuByTiktokId(ctx.user.id, input.skuId);
        if (sku) {
          await createSyncLog({
            userId: ctx.user.id,
            skuId: sku.id,
            triggerSource: "manual_adjustment",
            direction: "OUTBOUND",
            quantityBefore: sku.totalQuantity,
            quantityAfter: input.quantity,
            delta: input.quantity - sku.totalQuantity,
            status: "SUCCESS"
          });
        }
        return { success: true };
      } catch (error) {
        throw new Error(
          `Failed to update inventory: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".up.railway.app",
      "localhost",
      "127.0.0.1"
    ]
  }
});

// server/_core/vite.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const clientTemplate = path2.resolve(process.cwd(), "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/webhooks.ts
init_env();
import { Router } from "express";
import crypto2 from "crypto";
var router2 = Router();
function verifyWebhookSignature(req, res, next) {
  const signature = req.headers["x-tiktok-signature"];
  const timestamp2 = req.headers["x-tiktok-timestamp"];
  const nonce = req.headers["x-tiktok-nonce"];
  if (!signature || !timestamp2 || !nonce) {
    console.error("[Webhook] Missing signature headers");
    return res.status(401).json({ error: "Missing signature headers" });
  }
  const body = JSON.stringify(req.body);
  const message = `${timestamp2}.${nonce}.${body}`;
  const calculatedSignature = crypto2.createHmac("sha256", ENV.tiktokAppSecret).update(message).digest("hex");
  if (calculatedSignature !== signature) {
    console.error("[Webhook] Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }
  const currentTime = Math.floor(Date.now() / 1e3);
  const webhookTime = parseInt(timestamp2);
  const timeDiff = Math.abs(currentTime - webhookTime);
  if (timeDiff > 300) {
    console.error("[Webhook] Timestamp too old");
    return res.status(401).json({ error: "Timestamp too old" });
  }
  next();
}
router2.post("/inventory-changed", verifyWebhookSignature, async (req, res) => {
  try {
    console.log("[Webhook] Received inventory-changed event", req.body);
    const event = req.body;
    console.log(`[Webhook] Inventory changed for SKU: ${event.sku_id}, Delta: ${event.change_detail?.delta}`);
    res.json({
      success: true,
      message: "Inventory change processed",
      eventId: event.event_id
    });
  } catch (error) {
    console.error("[Webhook] Error processing inventory-changed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router2.post("/order-status-change", verifyWebhookSignature, async (req, res) => {
  try {
    console.log("[Webhook] Received order-status-change event", req.body);
    const event = req.body;
    console.log(`[Webhook] Order status changed: Order ${event.order_id}, Status: ${event.order_status}`);
    res.json({
      success: true,
      message: "Order status change processed",
      eventId: event.event_id
    });
  } catch (error) {
    console.error("[Webhook] Error processing order-status-change:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router2.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var webhooks_default = router2;

// server/_core/index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(`https://${req.get("host")}${req.url}`);
      }
      next();
    });
  }
  if (process.env.NODE_ENV === "production") {
    const distPath = path3.join(__dirname2, "public");
    app.use(express.static(distPath, {
      // Cache longo para assets com hash no nome
      setHeaders(res, filePath) {
        if (/\.(js|css|woff2?|ttf|svg|png|jpg|ico)$/.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
  }
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use("/api/webhooks/tiktok", webhooks_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      const distPath = path3.join(__dirname2, "public");
      res.sendFile(path3.join(distPath, "index.html"), (err) => {
        if (err) next(err);
      });
    });
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  server.listen(port, () => {
    console.log(`\u2705 Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
