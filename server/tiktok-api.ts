import crypto from "crypto";
import axios, { AxiosInstance } from "axios";

/**
 * TikTok Shop API Client
 * Handles OAuth flow and API requests
 */

interface TiktokApiConfig {
  appKey: string;
  appSecret: string;
  redirectUrl: string;
  isSandbox: boolean;
}

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  seller_id: string;
  shop_name?: string;
}

interface ProductsListResponse {
  data: {
    products: Array<{
      id: string;
      title: string;
      description?: string;
      status: string;
    }>;
    pagination?: {
      offset: number;
      limit: number;
      total: number;
    };
  };
}

interface SkusListResponse {
  data: {
    skus: Array<{
      id: string;
      product_id: string;
      title: string;
      inventory: {
        total_quantity: number;
        available_quantity: number;
        reserved_quantity: number;
      };
    }>;
    pagination?: {
      offset: number;
      limit: number;
      total: number;
    };
  };
}

interface InventoryUpdateRequest {
  product_id: string;
  skus: Array<{
    sku_id: string;
    quantity: number;
  }>;
}

export class TiktokShopClient {
  private config: TiktokApiConfig;
  private baseUrl: string;
  private client: AxiosInstance;

  constructor(config: TiktokApiConfig) {
    this.config = config;
    this.baseUrl = config.isSandbox
      ? "https://test-shop.tiktok.com/api"
      : "https://shop.tiktok.com/api";

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const authUrl = this.config.isSandbox
      ? "https://test-seller.tiktok.com/oauth/authorize"
      : "https://seller.tiktok.com/oauth/authorize";

    const params = new URLSearchParams({
      client_key: this.config.appKey,
      response_type: "code",
      scope: "product.read,product.write,order.read",
      redirect_uri: this.config.redirectUrl,
      state,
    });

    return `${authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature({
      client_key: this.config.appKey,
      code,
      grant_type: "authorization_code",
      timestamp,
    });

    try {
      const response = await this.client.post("/v1/oauth/token", {
        client_key: this.config.appKey,
        code,
        grant_type: "authorization_code",
        timestamp,
        sign: signature,
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
  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature({
      client_key: this.config.appKey,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      timestamp,
    });

    try {
      const response = await this.client.post("/v1/oauth/token", {
        client_key: this.config.appKey,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        timestamp,
        sign: signature,
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
  async getProducts(accessToken: string, offset: number = 0, limit: number = 50): Promise<ProductsListResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature(
      {
        access_token: accessToken,
        app_key: this.config.appKey,
        timestamp,
      },
      "GET"
    );

    try {
      const response = await this.client.get("/product/202309/products", {
        params: {
          access_token: accessToken,
          app_key: this.config.appKey,
          timestamp,
          sign: signature,
          offset,
          limit,
        },
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
  async getSkus(
    accessToken: string,
    productId: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<SkusListResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature(
      {
        access_token: accessToken,
        app_key: this.config.appKey,
        timestamp,
      },
      "GET"
    );

    try {
      const response = await this.client.get(`/product/202309/products/${productId}/skus`, {
        params: {
          access_token: accessToken,
          app_key: this.config.appKey,
          timestamp,
          sign: signature,
          offset,
          limit,
        },
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
  async updateInventory(
    accessToken: string,
    productId: string,
    skus: Array<{ sku_id: string; quantity: number }>
  ): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);
    const body: InventoryUpdateRequest = {
      product_id: productId,
      skus,
    };

    const signature = this.generateSignature(
      {
        access_token: accessToken,
        app_key: this.config.appKey,
        timestamp,
      },
      "POST",
      body
    );

    try {
      await this.client.post(`/product/202309/products/${productId}/inventory/update`, body, {
        params: {
          access_token: accessToken,
          app_key: this.config.appKey,
          timestamp,
          sign: signature,
        },
      });
    } catch (error) {
      console.error("[TikTok API] Failed to update inventory:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.config.appSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Generate API signature
   */
  private generateSignature(
    params: Record<string, any>,
    method: string = "POST",
    body?: Record<string, any>
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}${params[key]}`)
      .join("");

    let signString = sortedParams;

    if (method === "POST" && body) {
      const bodyString = JSON.stringify(body);
      signString += bodyString;
    }

    signString += this.config.appSecret;

    return crypto.createHash("sha256").update(signString).digest("hex");
  }
}

export function createTiktokClient(config: TiktokApiConfig): TiktokShopClient {
  return new TiktokShopClient(config);
}
