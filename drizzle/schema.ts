import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * TikTok Shop App Configuration
 * Stores the app credentials and configuration for each seller
 */
export const tiktokApps = mysqlTable("tiktok_apps", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  appKey: varchar("appKey", { length: 255 }).notNull(),
  appSecret: varchar("appSecret", { length: 255 }).notNull(),
  redirectUrl: varchar("redirectUrl", { length: 512 }),
  isSandbox: int("isSandbox").default(1).notNull(), // 1 = sandbox, 0 = production
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TiktokApp = typeof tiktokApps.$inferSelect;
export type InsertTiktokApp = typeof tiktokApps.$inferInsert;

/**
 * Access Tokens
 * Stores OAuth tokens for each seller account
 */
export const accessTokens = mysqlTable("access_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  sellerId: varchar("sellerId", { length: 255 }).notNull(),
  shopName: varchar("shopName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AccessToken = typeof accessTokens.$inferSelect;
export type InsertAccessToken = typeof accessTokens.$inferInsert;

/**
 * Products
 * Stores product information synced from TikTok Shop
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  tiktokProductId: varchar("tiktokProductId", { length: 255 }).notNull(),
  productName: varchar("productName", { length: 512 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // ACTIVE, FREEZE, DELETED
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * SKUs
 * Stores SKU information and current inventory levels
 */
export const skus = mysqlTable("skus", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sku = typeof skus.$inferSelect;
export type InsertSku = typeof skus.$inferInsert;

/**
 * Sync Logs
 * Records every inventory synchronization event
 */
export const syncLogs = mysqlTable("sync_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  skuId: int("skuId").notNull().references(() => skus.id),
  triggerSource: varchar("triggerSource", { length: 100 }).notNull(), // order_created, manual_adjustment, api_sync, etc
  direction: varchar("direction", { length: 20 }).notNull(), // INBOUND (TikTok→App), OUTBOUND (App→TikTok)
  quantityBefore: int("quantityBefore").notNull(),
  quantityAfter: int("quantityAfter").notNull(),
  delta: int("delta").notNull(),
  status: varchar("status", { length: 50 }).default("SUCCESS").notNull(), // SUCCESS, FAILED, PENDING
  errorMessage: text("errorMessage"),
  tiktokEventId: varchar("tiktokEventId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SyncLog = typeof syncLogs.$inferSelect;
export type InsertSyncLog = typeof syncLogs.$inferInsert;

/**
 * Sync Errors
 * Tracks synchronization errors for alerting and retry
 */
export const syncErrors = mysqlTable("sync_errors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  skuId: int("skuId"),
  errorType: varchar("errorType", { length: 100 }).notNull(), // API_ERROR, WEBHOOK_ERROR, TOKEN_ERROR, etc
  errorMessage: text("errorMessage").notNull(),
  retryCount: int("retryCount").default(0).notNull(),
  maxRetries: int("maxRetries").default(3).notNull(),
  nextRetryAt: timestamp("nextRetryAt"),
  isResolved: int("isResolved").default(0).notNull(),
  resolvedAt: timestamp("resolvedAt"),
  notificationSent: int("notificationSent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SyncError = typeof syncErrors.$inferSelect;
export type InsertSyncError = typeof syncErrors.$inferInsert;

/**
 * Product Costs
 * Stores cost breakdown for each SKU
 */
export const productCosts = mysqlTable("product_costs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  skuId: int("skuId").notNull().references(() => skus.id),
  productCost: varchar("productCost", { length: 20 }).notNull(), // Custo do produto
  labelCost: varchar("labelCost", { length: 20 }).default("0"), // Custo da etiqueta
  packagingCost: varchar("packagingCost", { length: 20 }).default("0"), // Custo da embalagem
  bubbleWrapCost: varchar("bubbleWrapCost", { length: 20 }).default("0"), // Custo do plástico bolha
  otherCosts: varchar("otherCosts", { length: 20 }).default("0"), // Outros custos
  totalCost: varchar("totalCost", { length: 20 }).notNull(), // Total = produto + etiqueta + embalagem + bolha + outros
  notes: text("notes"), // Notas adicionais
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductCost = typeof productCosts.$inferSelect;
export type InsertProductCost = typeof productCosts.$inferInsert;

/**
 * Financial Metrics
 * Stores daily financial metrics for analysis
 */
export const financialMetrics = mysqlTable("financial_metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  metricDate: varchar("metricDate", { length: 10 }).notNull(), // Data do registro (YYYY-MM-DD)
  totalCostDay: varchar("totalCostDay", { length: 20 }).default("0"), // Custo total do dia
  estimatedRevenueDay: varchar("estimatedRevenueDay", { length: 20 }).default("0"), // Receita estimada do dia
  estimatedProfitDay: varchar("estimatedProfitDay", { length: 20 }).default("0"), // Lucro estimado do dia
  averageProfitMargin: varchar("averageProfitMargin", { length: 10 }).default("0"), // Margem média em %
  productsCount: int("productsCount").default(0), // Quantidade de produtos vendidos
  skusCount: int("skusCount").default(0), // Quantidade de SKUs vendidos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialMetric = typeof financialMetrics.$inferSelect;
export type InsertFinancialMetric = typeof financialMetrics.$inferInsert;

/**
 * SKU Pricing
 * Stores selling price and profit margin for each SKU
 */
export const skuPricing = mysqlTable("sku_pricing", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  skuId: int("skuId").notNull().references(() => skus.id),
  sellingPrice: varchar("sellingPrice", { length: 20 }).notNull(), // Preço de venda
  profitMarginPercent: varchar("profitMarginPercent", { length: 10 }).notNull(), // Margem de lucro em %
  profitMarginValue: varchar("profitMarginValue", { length: 20 }).notNull(), // Valor da margem de lucro
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkuPricing = typeof skuPricing.$inferSelect;
export type InsertSkuPricing = typeof skuPricing.$inferInsert;
