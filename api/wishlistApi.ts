"use client";

import { apiClient } from "@/lib/apiClient";
import { toggleWishlist, Product, WishlistResponse } from "../type/type";

export const wishlistAPI = {
  getWishlist: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<WishlistResponse>("/wishlist/");
    return data.products || [];
  },

  toggleWishlist: async (product_id: number): Promise<toggleWishlist> => {
    const { data } = await apiClient.post("/wishlist/toggle/", { product_id });
    return data;
  },
};
