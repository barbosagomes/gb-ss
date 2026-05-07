import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const tiktokRouter = router({
  getProducts: protectedProcedure
    .query(async ({ ctx }) => {
      // Mock data - em produção, isso viria da API do TikTok Shop
      const mockProducts = [
        {
          id: "prod_1",
          name: "Camiseta Premium",
          skuCount: 3,
          totalStock: 150,
          price: 79.9,
          image: "https://via.placeholder.com/100",
        },
        {
          id: "prod_2",
          name: "Calça Jeans",
          skuCount: 5,
          totalStock: 85,
          price: 129.9,
          image: "https://via.placeholder.com/100",
        },
        {
          id: "prod_3",
          name: "Jaqueta Inverno",
          skuCount: 2,
          totalStock: 45,
          price: 199.9,
          image: "https://via.placeholder.com/100",
        },
        {
          id: "prod_4",
          name: "Tênis Esportivo",
          skuCount: 4,
          totalStock: 200,
          price: 249.9,
          image: "https://via.placeholder.com/100",
        },
        {
          id: "prod_5",
          name: "Bolsa Casual",
          skuCount: 1,
          totalStock: 8,
          price: 89.9,
          image: "https://via.placeholder.com/100",
        },
      ];

      return mockProducts;
    }),

  syncProducts: protectedProcedure
    .input(
      z.object({
        tiktokShopId: z.string(),
        accessToken: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar sincronização real com API do TikTok Shop
      return {
        success: true,
        message: "Sincronização iniciada",
        syncId: `sync_${Date.now()}`,
      };
    }),

  updateStock: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar atualização de estoque
      return {
        success: true,
        message: "Estoque atualizado",
        productId: input.productId,
        newQuantity: input.quantity,
      };
    }),

  getSyncLogs: protectedProcedure
    .query(async ({ ctx }) => {
      // Mock data
      return [
        {
          id: "log_1",
          timestamp: new Date(Date.now() - 3600000),
          status: "success",
          productsSync: 45,
          message: "Sincronização concluída com sucesso",
        },
        {
          id: "log_2",
          timestamp: new Date(Date.now() - 7200000),
          status: "success",
          productsSync: 32,
          message: "Sincronização concluída com sucesso",
        },
        {
          id: "log_3",
          timestamp: new Date(Date.now() - 86400000),
          status: "error",
          productsSync: 0,
          message: "Erro na conexão com TikTok Shop API",
        },
      ];
    }),
});
