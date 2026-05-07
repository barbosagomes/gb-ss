import { Router } from "express";
import crypto from "crypto";
import { ENV } from "./_core/env";
import { handleInventoryChanged, handleOrderStatusChange } from "./webhook-handler";

const router = Router();

/**
 * Middleware para verificar assinatura HMAC-SHA256 dos webhooks do TikTok Shop
 */
function verifyWebhookSignature(req: any, res: any, next: any) {
  const signature = req.headers["x-tiktok-signature"] as string;
  const timestamp = req.headers["x-tiktok-timestamp"] as string;
  const nonce = req.headers["x-tiktok-nonce"] as string;

  if (!signature || !timestamp || !nonce) {
    console.error("[Webhook] Missing signature headers");
    return res.status(401).json({ error: "Missing signature headers" });
  }

  // Construir a string para assinar
  const body = JSON.stringify(req.body);
  const message = `${timestamp}.${nonce}.${body}`;

  // Calcular HMAC-SHA256
  const calculatedSignature = crypto
    .createHmac("sha256", ENV.tiktokAppSecret)
    .update(message)
    .digest("hex");

  // Comparar assinaturas
  if (calculatedSignature !== signature) {
    console.error("[Webhook] Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Verificar timestamp (deve estar dentro de 5 minutos)
  const currentTime = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  const timeDiff = Math.abs(currentTime - webhookTime);

  if (timeDiff > 300) {
    console.error("[Webhook] Timestamp too old");
    return res.status(401).json({ error: "Timestamp too old" });
  }

  next();
}

/**
 * Webhook para mudanças de inventário (Inventory Changed #68)
 */
router.post("/inventory-changed", verifyWebhookSignature, async (req, res) => {
  try {
    console.log("[Webhook] Received inventory-changed event", req.body);

    // Log the event for now - full implementation will be integrated with tRPC
    const event = req.body;
    console.log(`[Webhook] Inventory changed for SKU: ${event.sku_id}, Delta: ${event.change_detail?.delta}`);

    res.json({
      success: true,
      message: "Inventory change processed",
      eventId: event.event_id,
    });
  } catch (error) {
    console.error("[Webhook] Error processing inventory-changed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Webhook para mudanças de status de pedido (Order Status Change #1)
 */
router.post("/order-status-change", verifyWebhookSignature, async (req, res) => {
  try {
    console.log("[Webhook] Received order-status-change event", req.body);

    // Log the event for now - full implementation will be integrated with tRPC
    const event = req.body;
    console.log(`[Webhook] Order status changed: Order ${event.order_id}, Status: ${event.order_status}`);

    res.json({
      success: true,
      message: "Order status change processed",
      eventId: event.event_id,
    });
  } catch (error) {
    console.error("[Webhook] Error processing order-status-change:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Health check para webhooks
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
