import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as dbTiktok from "./db-tiktok";
import { createTiktokClient } from "./tiktok-api";
import { financialRouter } from "./routers-financial";
import { ENV } from "./_core/env";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  financial: financialRouter,

  tiktok: router({
    // Get all products from DB (synced from TikTok)
    getProducts: protectedProcedure
      .query(async ({ ctx }) => {
        const products = await dbTiktok.getProductsByUserId(ctx.user.id);
        if (products.length === 0) {
          return [];
        }
        // Enrich with SKU counts
        const enriched = await Promise.all(
          products.map(async (p) => {
            const skuList = await dbTiktok.getSkusByProductId(p.id);
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
              updatedAt: p.updatedAt,
            };
          })
        );
        return enriched;
      }),

    // Get or create TikTok app configuration (uses ENV defaults)
    getAppConfig: protectedProcedure.query(async ({ ctx }) => {
      const config = await dbTiktok.getTiktokAppByUserId(ctx.user.id);
      if (config) {
        return {
          appKey: config.appKey,
          redirectUrl: config.redirectUrl,
          isSandbox: config.isSandbox === 1,
          isConfigured: true,
        };
      }
      // Return ENV defaults if no per-user config exists
      if (ENV.tiktokAppKey) {
        return {
          appKey: ENV.tiktokAppKey,
          redirectUrl: ENV.tiktokRedirectUrl,
          isSandbox: false,
          isConfigured: true,
        };
      }
      return null;
    }),

    // Save TikTok app configuration
    saveAppConfig: protectedProcedure
      .input(
        z.object({
          appKey: z.string().min(1),
          appSecret: z.string().min(1),
          redirectUrl: z.string().url(),
          isSandbox: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await dbTiktok.upsertTiktokApp(ctx.user.id, {
          appKey: input.appKey,
          appSecret: input.appSecret,
          redirectUrl: input.redirectUrl,
          isSandbox: input.isSandbox ? 1 : 0,
        });
        return { success: true };
      }),

    // Get OAuth authorization URL (uses ENV credentials by default)
    getAuthorizationUrl: protectedProcedure.query(async ({ ctx }) => {
      // Try per-user config first, fall back to ENV
      const config = await dbTiktok.getTiktokAppByUserId(ctx.user.id);
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
        isSandbox,
      });

      const state = Buffer.from(JSON.stringify({ userId: ctx.user.id })).toString("base64");
      const url = client.getAuthorizationUrl(state);

      return { url };
    }),

    // Handle OAuth callback (uses ENV credentials by default)
    handleOAuthCallback: protectedProcedure
      .input(
        z.object({
          code: z.string(),
          state: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const config = await dbTiktok.getTiktokAppByUserId(ctx.user.id);
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
          isSandbox,
        });

        const tokenResponse = await client.exchangeCodeForToken(input.code);

        // Store access token
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        await dbTiktok.upsertAccessToken({
          userId: ctx.user.id,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt,
          sellerId: tokenResponse.seller_id,
          shopName: tokenResponse.shop_name,
        });

        return { success: true, sellerId: tokenResponse.seller_id };
      }),

    // Get access token status
    getTokenStatus: protectedProcedure.query(async ({ ctx }) => {
      const token = await dbTiktok.getAccessTokenByUserId(ctx.user.id);
      if (!token) {
        return { connected: false };
      }

      const isExpired = new Date() > token.expiresAt;
      return {
        connected: true,
        sellerId: token.sellerId,
        shopName: token.shopName,
        isExpired,
        expiresAt: token.expiresAt,
      };
    }),



    // Get SKUs for a product
    getSkus: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const skus = await dbTiktok.getSkusByProductId(input.productId);
        return skus;
      }),

    // Get sync logs
    getSyncLogs: protectedProcedure.query(async ({ ctx }) => {
      const logs = await dbTiktok.getSyncLogsByUserId(ctx.user.id, 100);
      return logs;
    }),

    // Get sync errors
    getSyncErrors: protectedProcedure.query(async ({ ctx }) => {
      const errors = await dbTiktok.getSyncErrorsByUserId(ctx.user.id, 0);
      return errors;
    }),

    // Sync products from TikTok Shop
    syncProducts: protectedProcedure.mutation(async ({ ctx, input: _ }) => {
      const config = await dbTiktok.getTiktokAppByUserId(ctx.user.id);
      const token = await dbTiktok.getAccessTokenByUserId(ctx.user.id);

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
        isSandbox,
      });

      try {
        const productsResponse = await client.getProducts(token.accessToken);

        for (const product of productsResponse.data.products) {
          const savedProduct = await dbTiktok.upsertProduct({
            userId: ctx.user.id,
            tiktokProductId: product.id,
            productName: product.title,
            description: product.description ?? undefined,
            status: product.status,
          });

          // Get SKUs for this product
          const skusResponse = await client.getSkus(token.accessToken, product.id);
          for (const sku of skusResponse.data.skus) {
            if (savedProduct.id) {
              await dbTiktok.upsertSku({
                userId: ctx.user.id,
                productId: savedProduct.id,
                tiktokSkuId: sku.id,
                skuName: sku.title,
                totalQuantity: sku.inventory.total_quantity,
                availableQuantity: sku.inventory.available_quantity,
                reservedQuantity: sku.inventory.reserved_quantity,
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
    updateSkuInventory: protectedProcedure
      .input(
        z.object({
          productId: z.string(),
          skuId: z.string(),
          quantity: z.number().int().min(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const config = await dbTiktok.getTiktokAppByUserId(ctx.user.id);
        const token = await dbTiktok.getAccessTokenByUserId(ctx.user.id);

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
          isSandbox,
        });

        try {
          await client.updateInventory(token.accessToken, input.productId, [
            { sku_id: input.skuId, quantity: input.quantity },
          ]);

          // Log the sync
          const sku = await dbTiktok.getSkuByTiktokId(ctx.user.id, input.skuId);
          if (sku) {
            await dbTiktok.createSyncLog({
              userId: ctx.user.id,
              skuId: sku.id,
              triggerSource: "manual_adjustment",
              direction: "OUTBOUND",
              quantityBefore: sku.totalQuantity,
              quantityAfter: input.quantity,
              delta: input.quantity - sku.totalQuantity,
              status: "SUCCESS",
            });
          }

          return { success: true };
        } catch (error) {
          throw new Error(
            `Failed to update inventory: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
