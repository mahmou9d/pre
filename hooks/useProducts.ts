"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { productsAPI } from "../api/productsApi";
import {
  AddVariants,
  CreateProduct,
  ErrorResponse,
  Product,
  ProductsData,
  SubVariant,
  updateProduct,
} from "../type/type";
import { AxiosError } from "axios";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,
  list: (page?: number, all?: boolean, category?: string, search?: string) =>
    [...productKeys.lists(), { page, all, category, search }] as const,

  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number, all?: boolean) =>
    [...productKeys.details(), id, ...(all ? [{ all: true }] : [])] as const,

  variant: (id: number) => [...productKeys.all, "variant", id] as const,

  count: () => [...productKeys.all, "count"] as const,
  bestsellers: () => [...productKeys.all, "bestsellers"] as const,
};

export const useGetProducts = (params?: {
  page?: number;
  all?: boolean;
  search?: string;
  category?: string;
  max_price?: number;
  min_price?: number;
}): UseQueryResult<ProductsData, Error> => {
  return useQuery({
    queryKey: [
      ...productKeys.list(params?.page, params?.all),
      params?.search,
      params?.category,
      params?.max_price,
      params?.min_price,
    ],
    queryFn: () => productsAPI.getProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetSingleProduct = (
  productId: number,
  all: boolean = false,
): UseQueryResult<Product, Error> => {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(productId, all),
    queryFn: () => productsAPI.getSingleProducts(productId, all),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId && productId > 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProduct) => productsAPI.createProduct(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
      // console.log("Product created:", data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create product failed:", error);
    },
  });
};

export const useAddVariantsProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      product_id,
    }: {
      payload: AddVariants[];
      product_id: number;
    }) => productsAPI.addVariantsProduct(payload, product_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.product_id),
      });

      // console.log("Variants added successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Add variants failed:", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      product_id,
      payload,
    }: {
      product_id: number;
      payload: updateProduct;
    }) => productsAPI.updateProduct(product_id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.product_id),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Update product failed:", error);
    },
  });
};

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variant_id,
      payload,
    }: {
      variant_id: number;
      payload: Partial<SubVariant>;
    }) => productsAPI.updateProductVariants(variant_id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variant(variables.variant_id),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Update variant failed:", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product_id }: { product_id: number }) =>
      productsAPI.deleteProduct(product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Delete product failed:", error);
    },
  });
};

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variant_id }: { variant_id: number }) =>
      productsAPI.deleteProductVariants(variant_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Delete variant failed:", error);
    },
  });
};

export const useAddImageVariantsProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      variant_id,
    }: {
      payload: FormData;
      variant_id: number;
    }) => productsAPI.addImageVariantsProduct(payload, variant_id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variant(variables.variant_id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
      // console.log("Variant image uploaded successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Upload image failed:", error);
    },
  });
};
export const useSetThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image_id: number) => productsAPI.setThumbnail(image_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Set thumbnail failed:", error);
    },
  });
};

export const useUpdateThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image_id: number) => productsAPI.updateThumbnail(image_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Update thumbnail failed:", error);
    },
  });
};

export const useDeleteThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image_id: number) => productsAPI.deleteThumbnail(image_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Delete thumbnail failed:", error);
    },
  });
};
export const useGetBestsellers = () => {
  return useQuery({
    queryKey: ["bestsellers"],
    queryFn: productsAPI.getBestsellers,
    staleTime: 10 * 60 * 1000,
  });
  };
  export const useGetFirstBestsellers = () => {
    return useQuery({
      queryKey: ["first-bestseller"],
      queryFn: productsAPI.getFirstBestsellers,
      staleTime: 10 * 60 * 1000,
    });
  };