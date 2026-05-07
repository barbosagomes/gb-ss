import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as dbFinancial from "./db-financial";
import * as dbTiktok from "./db-tiktok";

export const financialRouter = router({
  // Get or create product cost
  getProductCost: protectedProcedure
    .input(z.object({ skuId: z.number() }))
    .query(async ({ ctx, input }) => {
      const cost = await dbFinancial.getProductCostBySkuId(ctx.user.id, input.skuId);
      return cost || null;
    }),

  // Save product cost
  saveProductCost: protectedProcedure
    .input(
      z.object({
        skuId: z.number(),
        productCost: z.string(),
        labelCost: z.string().optional(),
        packagingCost: z.string().optional(),
        bubbleWrapCost: z.string().optional(),
        otherCosts: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const totalCost = dbFinancial.calculateTotalCost(
        parseFloat(input.productCost),
        parseFloat(input.labelCost || "0"),
        parseFloat(input.packagingCost || "0"),
        parseFloat(input.bubbleWrapCost || "0"),
        parseFloat(input.otherCosts || "0")
      );

      await dbFinancial.upsertProductCost({
        userId: ctx.user.id,
        skuId: input.skuId,
        productCost: input.productCost,
        labelCost: input.labelCost || "0",
        packagingCost: input.packagingCost || "0",
        bubbleWrapCost: input.bubbleWrapCost || "0",
        otherCosts: input.otherCosts || "0",
        totalCost: totalCost.toString(),
        notes: input.notes,
      });

      return { success: true, totalCost };
    }),

  // Get SKU pricing
  getSkuPricing: protectedProcedure
    .input(z.object({ skuId: z.number() }))
    .query(async ({ ctx, input }) => {
      const pricing = await dbFinancial.getSkuPricingBySkuId(ctx.user.id, input.skuId);
      return pricing || null;
    }),

  // Save SKU pricing
  saveSkuPricing: protectedProcedure
    .input(
      z.object({
        skuId: z.number(),
        sellingPrice: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get product cost
      const productCost = await dbFinancial.getProductCostBySkuId(ctx.user.id, input.skuId);
      if (!productCost) {
        throw new Error("Custo do produto não encontrado. Configure o custo antes de definir o preço.");
      }

      const sellingPrice = parseFloat(input.sellingPrice);
      const totalCost = parseFloat(productCost.totalCost);

      const { marginPercent, marginValue } = dbFinancial.calculateProfitMargin(
        sellingPrice,
        totalCost
      );

      await dbFinancial.upsertSkuPricing({
        userId: ctx.user.id,
        skuId: input.skuId,
        sellingPrice: input.sellingPrice,
        profitMarginPercent: marginPercent.toString(),
        profitMarginValue: marginValue.toString(),
      });

      return { success: true, marginPercent, marginValue };
    }),

  // Get all product costs
  getAllProductCosts: protectedProcedure.query(async ({ ctx }) => {
    return await dbFinancial.getProductCostsByUserId(ctx.user.id);
  }),

  // Get all SKU pricing
  getAllSkuPricing: protectedProcedure.query(async ({ ctx }) => {
    return await dbFinancial.getSkuPricingsByUserId(ctx.user.id);
  }),

  // Get today's financial metrics
  getTodayMetrics: protectedProcedure.query(async ({ ctx }) => {
    const metrics = await dbFinancial.getTodayMetric(ctx.user.id);
    return metrics || null;
  }),

  // Get financial metrics history
  getMetricsHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      return await dbFinancial.getFinancialMetricsByUserId(ctx.user.id, input.days);
    }),

  // Calculate and save daily metrics
  calculateDailyMetrics: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Get all SKU pricing and product costs
      const skuPricings = await dbFinancial.getSkuPricingsByUserId(ctx.user.id);
      const productCosts = await dbFinancial.getProductCostsByUserId(ctx.user.id);

      // Get today's SKU quantities from sync logs
      const today = new Date().toISOString().split("T")[0];
      const syncLogs = await dbTiktok.getSyncLogsByUserId(ctx.user.id, 1000);

      // Calculate quantities sold today
      const quantitiesSold = new Map<number, number>();
      for (const log of syncLogs) {
        const logDate = new Date(log.createdAt).toISOString().split("T")[0];
        if (logDate === today && log.direction === "OUTBOUND") {
          const current = quantitiesSold.get(log.skuId) || 0;
          quantitiesSold.set(log.skuId, current + Math.abs(log.delta));
        }
      }

      // Calculate metrics
      const metrics = dbFinancial.calculateDailyMetrics(skuPricings, productCosts, quantitiesSold);

      // Save metrics
      await dbFinancial.upsertFinancialMetric({
        userId: ctx.user.id,
        metricDate: today,
        totalCostDay: metrics.totalCost.toString(),
        estimatedRevenueDay: metrics.estimatedRevenue.toString(),
        estimatedProfitDay: metrics.estimatedProfit.toString(),
        averageProfitMargin: metrics.averageMargin.toString(),
        productsCount: quantitiesSold.size,
        skusCount: quantitiesSold.size,
      });

      return { success: true, metrics };
    } catch (error) {
      throw new Error(
        `Erro ao calcular métricas diárias: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }),

  // Get products with low profit margin
  getLowMarginProducts: protectedProcedure
    .input(z.object({ threshold: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const pricings = await dbFinancial.getSkuPricingsByUserId(ctx.user.id);
      return pricings.filter((p) => parseFloat(p.profitMarginPercent) < input.threshold);
    }),

  // Get most profitable products
  getMostProfitableProducts: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const pricings = await dbFinancial.getSkuPricingsByUserId(ctx.user.id);
      return pricings
        .sort((a, b) => parseFloat(b.profitMarginValue) - parseFloat(a.profitMarginValue))
        .slice(0, input.limit);
    }),
});
