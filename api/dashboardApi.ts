"use client";

import { apiClient } from "@/lib/apiClient";
import {
  LowStockResponse,
  OrderStatus,
  RecentOrdersData,
  RecentOrdersDatares,
  DashboardStats,
  ReviewsResponse,
  SalesOrdersResponse,
  Order,
  TopSellingResponse,
  ReviewsDataRes,
  Banner,
  SiteSettings,
} from "../type/type";
import { publicClient } from "@/lib/publicClient";
type OrderFilters = {
  page?: number;
  // all?: boolean;
  search?: string;
  status?: string;
};
export const dashboardAPI = {
  getRecentOrders: async (params?: OrderFilters): Promise<RecentOrdersData> => {
    const { data } = await apiClient.get<RecentOrdersDatares>(
      `/dashboard/orders/recent/`,
      {
        params: {
          page: params?.page,
          // all: params?.all,
          search: params?.search,
          status: params?.status,
        },
      },
    );

    return {
      orders: data.results || [],
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getStatusCount: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats/");
    return data;
  },

  getTopSelling: async (): Promise<TopSellingResponse> => {
    const { data } = await apiClient.get<TopSellingResponse>(
      "/charts/products/top-selling/",
    );
    return data;
  },

  patchOrders: async (payload: {
    id: string;
    status: OrderStatus;
  }): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(
      `/dashboard/order/${payload.id}/`,
      { status: payload.status },
    );
    return data;
  },

  getReviewsCount: async (): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get<ReviewsResponse>(
      "/dashboard/reviews/",
    );
    return data;
  },

  getProductLow: async (): Promise<LowStockResponse> => {
    const { data } = await apiClient.get<LowStockResponse>(
      "/charts/products/low/",
    );
    return data;
  },

  getCategories: async (params?: {
    all?: boolean;
  }): Promise<
    {
      id: number;
      name: string;
      name_ar: string;
      name_en: string;
      is_active: boolean;
    }[]
  > => {
    const { data } = await apiClient.get<
      {
        id: number;
        name: string;
        name_ar: string;
        name_en: string;
        is_active: boolean;
      }[]
    >("/dashboard/categories/", {
      params: params?.all ? { all: true } : undefined,
    });
    return data;
  },

  getPublicCategories: async (): Promise<
    {
      id: number;
      name: string;
      name_ar: string;
      name_en: string;
      is_active: boolean;
    }[]
  > => {
    const { data } = await publicClient.get<
      {
        id: number;
        name: string;
        name_ar: string;
        name_en: string;
        is_active: boolean;
      }[]
    >("/dashboard/categories/");
    return data;
  },

  createCategory: async (payload: { name_en: string; name_ar: string }) => {
    const { data } = await apiClient.post("/dashboard/categories/", payload);
    return data;
  },

  patchCategory: async (payload: {
    id: number;
    body: Partial<{
      name_ar: string;
      name_en: string;
      is_active: boolean;
    }>;
  }): Promise<{
    id: number;
    name_ar: string;
    name_en: string;
    is_active: boolean;
  }> => {
    const { data } = await apiClient.patch<{
      id: number;
      name_ar: string;
      name_en: string;
      is_active: boolean;
    }>(`/dashboard/categories/${payload.id}/`, payload.body);
    return data;
  },

  deleteCategory: async (id: number, hard?: boolean): Promise<void> => {
    await apiClient.delete(`/dashboard/categories/${id}/`, {
      params: hard ? { hard: true } : undefined,
    });
  },
  // TODO
  getAllReviews: async (page: number = 1): Promise<ReviewsDataRes> => {
    const { data } = await apiClient.get<ReviewsDataRes>(
      `/dashboard/reviews/`,
      { params: { page } },
    );
    return data;
  },
  makeAdmin: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      `/dashboard/make-admin/`,
      { email: email },
    );
    return data;
  },
  getSalesOrders: async (): Promise<SalesOrdersResponse> => {
    const { data } = await apiClient.get<SalesOrdersResponse>(
      "/charts/sales-orders/",
    );
    return data;
  },
  // ─── Banners ───────────────────────────────────────────────────────────────
  getBannersPublic: async (): Promise<Banner[]> => {
    const { data } = await publicClient.get<Banner[]>("/banners/");
    return data;
  },
  getBanners: async (): Promise<Banner[]> => {
    const { data } = await apiClient.get<Banner[]>("/dashboard/banners/");
    return data;
  },

  createBanner: async (payload: FormData): Promise<Banner> => {
    const { data } = await apiClient.post<Banner>(
      "/dashboard/banners/",
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  patchBanner: async (payload: {
    id: number;
    body: Partial<{
      title_en: string;
      title_ar: string;
      link: string;
      order: number;
      is_active: boolean;
    }>;
  }): Promise<Banner> => {
    const { data } = await apiClient.patch<Banner>(
      `/dashboard/banners/${payload.id}/`,
      payload.body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },

  deleteBanner: async (id: number): Promise<void> => {
    await apiClient.delete(`/dashboard/banners/${id}/`);
  },
  // ─── Governorates ──────────────────────────────────────────────────────────

  getShippingGovernorates: async () => {
    const { data } = await publicClient.get("/shipping/governorates/");
    return data;
  },
  getDashboardGovernorates: async () => {
    const { data } = await apiClient.get<{
      id: number;
      name_en: string;
      name_ar: string;
      shipping_fee: number;
    }>("/dashboard/governorates/?all=true");
    return data;
  },
  postDashboardGovernorates: async (body: {
    name_en: string;
    name_ar: string;
    shipping_fee: number;
  }) => {
    const { data } = await apiClient.post("/dashboard/governorates/", body);
    return data;
  },
  patchGovernorate: async ({
    id,
    body,
  }: {
    id: number;
    body: {
      name_en: string;
      name_ar: string;
      shipping_fee: number;
      is_active: boolean;
    };
  }) => {
    const { data } = await apiClient.patch(
      `/dashboard/governorates/${id}/`,
      body,
    );
    return data;
  },
  // ─── Settings ──────────────────────────────────────────────────────────────
  getDashboardSettingsPublic: async (): Promise<SiteSettings> => {
    const { data } = await publicClient.get<SiteSettings>("/settings/");
    return data;
  },

  getDashboardSettings: async (): Promise<SiteSettings> => {
    const { data } = await apiClient.get<SiteSettings>("/dashboard/settings/");
    return data;
  },

  patchDashboardSettings: async (
    payload: Partial<SiteSettings>,
  ): Promise<SiteSettings> => {
    const { data } = await apiClient.patch<SiteSettings>(
      "/dashboard/settings/",
      payload,
    );
    return data;
  },
};
