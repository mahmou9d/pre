import { apiClient } from "@/lib/apiClient";
import { publicClient } from "@/lib/publicClient";
import {
  AddImageVariants,
  AddVariants,
  CreateProduct,
  CreateProductResponse,
  Product,
  ProductsData,
  ProductsDataRes,
  SubVariant,
  updateProduct,
  updateProductResponse,
} from "@/type/type";

export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    all?: boolean;
    search?: string;
    category?: string;
    max_price?: number;
    min_price?: number;
  }): Promise<ProductsData> => {
    const { data } = await apiClient.get<ProductsDataRes>(`/products/`, {
      params: {
        page: params?.page,
        all: params?.all,
        search: params?.search,
        category: params?.category,
        max_price: params?.max_price,
        min_price: params?.min_price,
      },
    });

    return {
      products: data.results || [],
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getSingleProducts: async (
    id: number,
    all: boolean = false,
  ): Promise<Product> => {
      if (!id || id <= 0) {
        throw new Error("Invalid product ID");
      }

      const { data } = await apiClient.get<Product>(`/products/${id}/`, {
        params: all===true ? { all: true } : undefined,
      });

      // console.log("Single Product Response:", data);

      return data;
  },
  createProduct: async (
    payload: CreateProduct,
  ): Promise<CreateProductResponse> => {
    console.log(payload);
    const { data } = await apiClient.post<CreateProductResponse>(
      "/dashboard/products/create/",
      payload,
    );
    return data;
  },
  addVariantsProduct: async (
    payload: AddVariants[],
    product_id: number,
  ): Promise<AddVariants[]> => {
    const { data } = await apiClient.post<AddVariants[]>(
      `/dashboard/products/${product_id}/variants/add/`,
      payload,
    );
    return data;
  },
  addImageVariantsProduct: async (
    payload: FormData,
    variant_id: number,
  ): Promise<AddImageVariants> => {
    const { data } = await apiClient.post<AddImageVariants>(
      `/dashboard/variants/${variant_id}/upload-image/`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },

  updateProduct: async (
    id: number,
    payload: updateProduct,
  ): Promise<updateProductResponse> => {
    console.log(payload);
    const { data } = await apiClient.patch<updateProductResponse>(
      `/dashboard/products/${id}/manage/`,
      payload,
    );
    return data;
  },
  updateProductVariants: async (
    id: number,
    payload: Partial<SubVariant>,
  ): Promise<SubVariant> => {
    const { data } = await apiClient.patch<SubVariant>(
      `/dashboard/variants/${id}/manage/`,
      payload,
    );
    return data;
  },
  deleteProduct: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/dashboard/products/${id}/manage/?hard=true`,
    );
    return data;
  },
  deleteProductVariants: async (id: number): Promise<SubVariant> => {
    const { data } = await apiClient.delete<SubVariant>(
      `/dashboard/variants/${id}/manage/?hard=true`,
    );
    return data;
  },
  setThumbnail: async (image_id: number) => {
    const { data } = await apiClient.patch(
      `/dashboard/images/${image_id}/set-thumbnail/`,
      image_id,
    );
    return data;
  },
  updateThumbnail: async (image_id: number) => {
    const { data } = await apiClient.patch(
      `/dashboard/images/${image_id}/set-thumbnail/`,
      image_id,
    );
    return data;
  },
  deleteThumbnail: async (image_id: number) => {
    const { data } = await apiClient.delete(
      `/dashboard/images/${image_id}/delete/`,
    );
    return data;
  },
  getBestsellers: async (): Promise<Product> => {
    const { data } = await publicClient.get<Product>("/products/best-sellers/");
    return data;
  },
  getFirstBestsellers: async (): Promise<Product> => {
    const { data } = await publicClient.get<Product>(
      "/products/top-selling-overall/",
    );
    console.log(data)
    return data;
  },
};
