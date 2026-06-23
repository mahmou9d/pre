/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/apiClient";
import {
  AddToCartRequest,
  CartItem,
  CartResponse,
  Product,
  UpdateQuantityRequest,
} from "../type/type";

export const cartAPI = {
  getCartItems: async (): Promise<CartItem[]> => {
    const { data } = await apiClient.get<CartResponse>("/cart/");
    return data.items.map((item:any) => ({
      ...item,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.subtotal),
    })) as unknown as CartItem[];
  },

  addToCart: async (payload: AddToCartRequest): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/cart/add/", payload);
    return data;
  },

  updateQuantity: async (payload: UpdateQuantityRequest): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(
      `/cart/update/${payload.item_id}/`,
      { quantity: payload.quantity },
    );
    return data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/remove/${itemId}/`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart/clear/");
  },
  mergeCart: async (device_id: string): Promise<void> => {
    await apiClient.post("/cart/merge/", { device_id });
  },
};
