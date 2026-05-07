import { TiktokShopClient } from "./tiktok-api";
import * as dbTiktok from "./db-tiktok";
import { notifyOwner } from "./_core/notification";

/**
 * Webhook event types
 */

interface InventoryChangedEvent {
  event_id: string;
  occurred_at: number;
  seller_id: string;
  product_id: string;
  sku_id: string;
  quantity_snapshot_after_change: {
    total_quantity: number;
    total_available_quantity: number;
    total_reserved_quantity: number;
  };
  change_detail: {
    trigger_source: string;
    delta: number;
  };
}

interface OrderStatusChangeEvent {
  event_id: string;
  occurred_at: number;
  seller_id: string;
  order_id: string;
  order_status: string;
}

/**
 * Process Inventory Changed webhook (#68)
 */
export async function handleInventoryChanged(
  userId: number,
  event: InventoryChangedEvent,
  client: TiktokShopClient
): Promise<void> {
  try {
    // Find the SKU
    const sku = await dbTiktok.getSkuByTiktokId(userId, event.sku_id);

    if (!sku) {
      console.warn(`[Webhook] SKU not found: ${event.sku_id}`);
      await dbTiktok.createSyncError({
        userId,
        skuId: undefined,
        errorType: "WEBHOOK_ERROR",
        errorMessage: `SKU não encontrado: ${event.sku_id}`,
        retryCount: 0,
        maxRetries: 1,
        nextRetryAt: new Date(),
        isResolved: 0,
        notificationSent: 0,
      });
      return;
    }

    // Calculate delta
    const delta =
      event.quantity_snapshot_after_change.total_quantity - sku.totalQuantity;

    // Create sync log
    await dbTiktok.createSyncLog({
      userId,
      skuId: sku.id,
      triggerSource: event.change_detail.trigger_source,
      direction: "INBOUND",
      quantityBefore: sku.totalQuantity,
      quantityAfter: event.quantity_snapshot_after_change.total_quantity,
      delta,
      status: "SUCCESS",
      tiktokEventId: event.event_id,
    });

    // Update SKU inventory
    await dbTiktok.updateSkuInventory(
      sku.id,
      event.quantity_snapshot_after_change.total_quantity,
      event.quantity_snapshot_after_change.total_available_quantity,
      event.quantity_snapshot_after_change.total_reserved_quantity
    );

    console.log(`[Webhook] Inventory updated for SKU ${event.sku_id}: ${delta > 0 ? "+" : ""}${delta}`);
  } catch (error) {
    console.error("[Webhook] Error processing inventory changed event:", error);

    // Create error record
    await dbTiktok.createSyncError({
      userId,
      skuId: undefined,
      errorType: "WEBHOOK_ERROR",
      errorMessage: `Erro ao processar webhook de inventário: ${error instanceof Error ? error.message : String(error)}`,
      retryCount: 0,
      maxRetries: 1,
      nextRetryAt: new Date(),
      isResolved: 0,
      notificationSent: 0,
    });

    // Notify owner
    await notifyOwner({
      title: "Erro na Sincronização de Estoque",
      content: `Falha ao processar webhook de inventário para SKU ${event.sku_id}: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Process Order Status Change webhook (#1)
 */
export async function handleOrderStatusChange(
  userId: number,
  event: OrderStatusChangeEvent
): Promise<void> {
  try {
    // Log order status change
    console.log(`[Webhook] Order ${event.order_id} status changed to ${event.order_status}`);

    // For now, just log the event
    // Future: implement order-specific logic if needed
  } catch (error) {
    console.error("[Webhook] Error processing order status change event:", error);

    // Create error record
    await dbTiktok.createSyncError({
      userId,
      skuId: undefined,
      errorType: "WEBHOOK_ERROR",
      errorMessage: `Erro ao processar webhook de pedido: ${error instanceof Error ? error.message : String(error)}`,
      retryCount: 0,
      maxRetries: 1,
      nextRetryAt: new Date(),
      isResolved: 0,
      notificationSent: 0,
    });
  }
}

/**
 * Parse webhook payload and determine event type
 */
export function parseWebhookEvent(payload: any): {
  type: "inventory_changed" | "order_status_change" | "unknown";
  event: InventoryChangedEvent | OrderStatusChangeEvent | null;
} {
  // Check for inventory changed event
  if (payload.sku_id && payload.quantity_snapshot_after_change) {
    return {
      type: "inventory_changed",
      event: payload as InventoryChangedEvent,
    };
  }

  // Check for order status change event
  if (payload.order_id && payload.order_status) {
    return {
      type: "order_status_change",
      event: payload as OrderStatusChangeEvent,
    };
  }

  return {
    type: "unknown",
    event: null,
  };
}
