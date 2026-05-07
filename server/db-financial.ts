import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  productCosts,
  financialMetrics,
  skuPricing,
  InsertProductCost,
  ProductCost,
  InsertFinancialMetric,
  FinancialMetric,
  InsertSkuPricing,
  SkuPricing,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Product Costs
 */

export async function upsertProductCost(data: InsertProductCost): Promise<ProductCost> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(productCosts)
    .where(
      and(
        eq(productCosts.userId, data.userId),
        eq(productCosts.skuId, data.skuId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(productCosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productCosts.id, existing[0].id));
    return { ...existing[0], ...data, updatedAt: new Date() };
  } else {
    await db.insert(productCosts).values(data);
    const inserted = await db
      .select()
      .from(productCosts)
      .where(
        and(
          eq(productCosts.userId, data.userId),
          eq(productCosts.skuId, data.skuId)
        )
      )
      .limit(1);
    return inserted[0] || ({ ...data, createdAt: new Date(), updatedAt: new Date() } as ProductCost);
  }
}

export async function getProductCostBySkuId(userId: number, skuId: number): Promise<ProductCost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(productCosts)
    .where(and(eq(productCosts.userId, userId), eq(productCosts.skuId, skuId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getProductCostsByUserId(userId: number): Promise<ProductCost[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(productCosts).where(eq(productCosts.userId, userId));
}

/**
 * Financial Metrics
 */

export async function upsertFinancialMetric(data: InsertFinancialMetric): Promise<FinancialMetric> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(financialMetrics)
    .where(
      and(
        eq(financialMetrics.userId, data.userId),
        eq(financialMetrics.metricDate, data.metricDate)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(financialMetrics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(financialMetrics.id, existing[0].id));
    return { ...existing[0], ...data, updatedAt: new Date() };
  } else {
    await db.insert(financialMetrics).values(data);
    const inserted = await db
      .select()
      .from(financialMetrics)
      .where(
        and(
          eq(financialMetrics.userId, data.userId),
          eq(financialMetrics.metricDate, data.metricDate)
        )
      )
      .limit(1);
    return inserted[0] || ({ ...data, createdAt: new Date(), updatedAt: new Date() } as FinancialMetric);
  }
}

export async function getFinancialMetricsByUserId(
  userId: number,
  limit: number = 30
): Promise<FinancialMetric[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(financialMetrics)
    .where(eq(financialMetrics.userId, userId))
    .orderBy((fm) => fm.metricDate)
    .limit(limit);
}

export async function getTodayMetric(userId: number): Promise<FinancialMetric | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date().toISOString().split("T")[0];
  const result = await db
    .select()
    .from(financialMetrics)
    .where(
      and(
        eq(financialMetrics.userId, userId),
        eq(financialMetrics.metricDate, today)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * SKU Pricing
 */

export async function upsertSkuPricing(data: InsertSkuPricing): Promise<SkuPricing> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(skuPricing)
    .where(
      and(
        eq(skuPricing.userId, data.userId),
        eq(skuPricing.skuId, data.skuId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(skuPricing)
      .set({ ...data, lastUpdatedAt: new Date() })
      .where(eq(skuPricing.id, existing[0].id));
    return { ...existing[0], ...data, lastUpdatedAt: new Date() };
  } else {
    await db.insert(skuPricing).values(data);
    const inserted = await db
      .select()
      .from(skuPricing)
      .where(
        and(
          eq(skuPricing.userId, data.userId),
          eq(skuPricing.skuId, data.skuId)
        )
      )
      .limit(1);
    return inserted[0] || ({ ...data, createdAt: new Date(), lastUpdatedAt: new Date() } as SkuPricing);
  }
}

export async function getSkuPricingBySkuId(userId: number, skuId: number): Promise<SkuPricing | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(skuPricing)
    .where(and(eq(skuPricing.userId, userId), eq(skuPricing.skuId, skuId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getSkuPricingsByUserId(userId: number): Promise<SkuPricing[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(skuPricing).where(eq(skuPricing.userId, userId));
}

/**
 * Financial Calculations
 */

export function calculateTotalCost(
  productCost: number,
  labelCost: number = 0,
  packagingCost: number = 0,
  bubbleWrapCost: number = 0,
  otherCosts: number = 0
): number {
  return productCost + labelCost + packagingCost + bubbleWrapCost + otherCosts;
}

export function calculateProfitMargin(
  sellingPrice: number,
  totalCost: number
): { marginPercent: number; marginValue: number } {
  const marginValue = sellingPrice - totalCost;
  const marginPercent = totalCost > 0 ? (marginValue / totalCost) * 100 : 0;

  return {
    marginPercent: Math.round(marginPercent * 100) / 100,
    marginValue: Math.round(marginValue * 100) / 100,
  };
}

export function calculateDailyMetrics(
  skuPricings: SkuPricing[],
  productCosts: ProductCost[],
  quantitiesSold: Map<number, number>
): {
  totalCost: number;
  estimatedRevenue: number;
  estimatedProfit: number;
  averageMargin: number;
} {
  let totalCost = 0;
  let estimatedRevenue = 0;
  let totalMargin = 0;
  let count = 0;

  for (const pricing of skuPricings) {
    const quantity = quantitiesSold.get(pricing.skuId) || 0;
    if (quantity === 0) continue;

    const cost = parseFloat(productCosts.find((pc) => pc.skuId === pricing.skuId)?.totalCost || "0");
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
    averageMargin: count > 0 ? Math.round((totalMargin / count) * 100) / 100 : 0,
  };
}
