"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardAPI } from "../api/dashboardApi";
import { ErrorResponse, OrderStatus, SiteSettings } from "../type/type";
import { AxiosError } from "axios";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  orders: () => [...dashboardKeys.all, "orders"] as const,
  recentOrders: (page?: number) =>
    [...dashboardKeys.orders(), "recent", page] as const,
  ordersCount: () => [...dashboardKeys.orders(), "count"] as const,

  statusCount: () => [...dashboardKeys.all, "stats", "count"] as const,
  reviewsCount: () => [...dashboardKeys.all, "reviews", "count"] as const,
  reviews: () => [...dashboardKeys.all, "reviews"] as const,
  allReviews: (page?: number) =>
    [...dashboardKeys.reviews(), "all", page] as const,

  users: () => [...dashboardKeys.all, "users"] as const,
  usersCount: () => [...dashboardKeys.users(), "count"] as const,
  admins: () => [...dashboardKeys.users(), "admins"] as const,

  sales: () => [...dashboardKeys.all, "sales"] as const,
  totalSales: () => [...dashboardKeys.sales(), "total"] as const,
  salesOrders: () => [...dashboardKeys.sales(), "orders"] as const,

  products: () => [...dashboardKeys.all, "products"] as const,
  product: (id: number) => [...dashboardKeys.products(), id] as const,

  productVariants: (productId: number) =>
    [...dashboardKeys.product(productId), "variants"] as const,

  productVariant: (variantId: number) =>
    [...dashboardKeys.products(), "variant", variantId] as const,

  topSelling: () => [...dashboardKeys.products(), "top-selling"] as const,

  productLow: () => [...dashboardKeys.products(), "low-stock"] as const,

  categories: () => [...dashboardKeys.all, "categories"] as const,
  category: (id: number) => [...dashboardKeys.categories(), id] as const,

  banners: () => [...dashboardKeys.all, "banners"] as const,

  settings: () => [...dashboardKeys.all, "settings"] as const,
  dashboardSettings: () => [...dashboardKeys.settings(), "dashboard"] as const,

  governorates: () => [...dashboardKeys.all, "governorates"] as const,
  governorate: (id: number) => [...dashboardKeys.governorates(), id] as const,
  shippingGovernorates: () =>
    [...dashboardKeys.all, "shipping-governorates"] as const,
};

export const useGetRecentOrders = (
  page: number,
  search: string = "",
  status: string = "",
) => {
  const isFiltered = search.trim() !== "" || status.trim() !== "";

  return useQuery({
    queryKey: [
      ...dashboardKeys.recentOrders(isFiltered ? undefined : page),
      search,
      status,
    ],
    queryFn: () =>
      dashboardAPI.getRecentOrders({
        
        page: isFiltered ? undefined : page,
        search: search || undefined,
        status: status || undefined,
      }),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetStatusCount = () => {
  return useQuery({
    queryKey: dashboardKeys.statusCount(),
    queryFn: dashboardAPI.getStatusCount,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetReviewsCount = () => {
  return useQuery({
    queryKey: dashboardKeys.reviewsCount(),
    queryFn: dashboardAPI.getReviewsCount,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTopSelling = () => {
  return useQuery({
    queryKey: dashboardKeys.topSelling(),
    queryFn: dashboardAPI.getTopSelling,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetProductLow = () => {
  return useQuery({
    queryKey: dashboardKeys.productLow(),
    queryFn: dashboardAPI.getProductLow,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePatchOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: OrderStatus }) =>
      dashboardAPI.patchOrders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.ordersCount() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.statusCount() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Patch order failed:", error);
    },
  });
};

export const useGetCategory = (params?: { all?: boolean }) => {
  return useQuery({
    queryKey: dashboardKeys.categories(),
    queryFn: () => dashboardAPI.getCategories(params),
    staleTime: 0,
  });
};

export const useGetPublicCategory = () => {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: () => dashboardAPI.getPublicCategories(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name_en: string; name_ar: string }) =>
      dashboardAPI.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.categories() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create category failed:", error);
    },
  });
};

export const usePatchCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: number;
      body: Partial<{
        name: string;
        name_ar: string;
        name_en: string;
        is_active: boolean;
      }>;
    }) => dashboardAPI.patchCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.categories() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Patch category failed:", error);
    },
  });
};

export const useDeleteCategory = (options?: { hard?: boolean }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dashboardAPI.deleteCategory(id, options?.hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.categories() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Delete category failed:", error);
    },
  });
};

// ─── Banners ───────────────────────────────────────────────────────────────
export const useGetBannersPublic = () => {
  return useQuery({
    queryKey: dashboardKeys.banners(),
    queryFn: dashboardAPI.getBannersPublic,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetBanners = () => {
  return useQuery({
    queryKey: dashboardKeys.banners(),
    queryFn: dashboardAPI.getBanners,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => dashboardAPI.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.banners() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create banner failed:", error);
    },
  });
};

export const usePatchBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: number;
      body: Partial<{ name_ar: string; name_en: string; is_active: boolean }>;
    }) => dashboardAPI.patchBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.banners() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Patch banner failed:", error);
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dashboardAPI.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.banners() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Delete banner failed:", error);
    },
  });
};
// ─── Governorates ──────────────────────────────────────────────────────────

export const useGetShippingGovernorates = () => {
  return useQuery({
    queryKey: dashboardKeys.governorates(),
    queryFn: dashboardAPI.getShippingGovernorates,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetDashboardGovernorates = () => {
  return useQuery({
    queryKey: dashboardKeys.governorates(),
    queryFn: dashboardAPI.getDashboardGovernorates,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePostGovernorate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      name_en: string;
      name_ar: string;
      shipping_fee: number;
    }) => dashboardAPI.postDashboardGovernorates(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.governorates() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {},
  });
};

export const usePatchGovernorate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: number;
      body: Partial<{
        name_en: string;
        name_ar: string;
        shipping_fee: number;
        is_active: boolean;
      }>;
    }) =>
      dashboardAPI.patchGovernorate(
        payload as {
          id: number;
          body: {
            name_en: string;
            name_ar: string;
            shipping_fee: number;
            is_active: boolean;
          };
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.governorates() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {},
  });
};
// ─── Settings ──────────────────────────────────────────────────────────────
export const useGetPublicSettings = () => {
  return useQuery({
    queryKey: dashboardKeys.dashboardSettings(),
    queryFn: dashboardAPI.getDashboardSettingsPublic,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetDashboardSettings = () => {
  return useQuery({
    queryKey: dashboardKeys.dashboardSettings(),
    queryFn: dashboardAPI.getDashboardSettings,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePatchDashboardSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<SiteSettings>) =>
      dashboardAPI.patchDashboardSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.settings() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Patch settings failed:", error);
    },
  });
};

// TODO

export const useGetAllReviews = (page: number = 1) => {
  return useQuery({
    queryKey: dashboardKeys.allReviews(page),
    queryFn: () => dashboardAPI.getAllReviews(page),
    staleTime: 60 * 1000,
  });
};

export const useGetSalesOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.salesOrders(),
    queryFn: dashboardAPI.getSalesOrders,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMakeAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => dashboardAPI.makeAdmin(email),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admins() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.users() });
      // console.log("Success:", data.message);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Make admin failed:", error);
    },
  });
};
