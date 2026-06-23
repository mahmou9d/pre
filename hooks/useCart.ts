"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "../api/cartApi";

import { AddToCartRequest, UpdateQuantityRequest } from "../type/type";
import { AxiosError } from "axios";
interface ErrorResponse {
  detail: string;
}
// Query Keys
export const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
};

export const useGetCartItems = () => {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: cartAPI.getCartItems,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartRequest) => cartAPI.addToCart(payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: cartKeys.items() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Add to cart failed:", error?.response?.data?.detail);
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuantityRequest) =>
      cartAPI.updateQuantity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Update quantity failed:", error);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartAPI.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Remove from cart failed:", error);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Clear cart failed:", error);
    },
  });
};

export const useCartMerge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: string) =>
      cartAPI.mergeCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Merge cart failed:", error);
    },
  });
};
