"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistAPI } from "../api/wishlistApi";
import { useAuth } from "./useAuth";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/type/type";

export const wishlistKeys = {
    all: ["wishlist"] as const,
    items: () => [...wishlistKeys.all, "items"] as const,
};

export const useGetWishlist = () => {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: wishlistKeys.items(),
        queryFn: wishlistAPI.getWishlist,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
};

export const useToggleWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: wishlistAPI.toggleWishlist,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      },
      onError: (error:AxiosError<ErrorResponse>) => {
        // console.error("Toggle wishlist failed:", error);
      },
    });
};