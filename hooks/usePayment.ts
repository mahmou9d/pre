"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentAPI } from "../api/paymentApi";
import {
  CheckoutFormData,
  ErrorResponse,
  PaymentPayload,
  PayPalCapture,
} from "@/type/type";
import { AxiosError } from "axios";

export const usePaymentPaymob = () => {
  return useMutation({
    mutationFn: (data: PaymentPayload) =>
      paymentAPI.paymentPaymob(
        data.order_id,
        data.payment_method,
        data.wallet_number,
      ),

    onSuccess: (data) => {
      // console.log("Checkout session created:", data);
      if (data.url) {
        window.location.href = data.url;
      }
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create checkout session failed:", error);
    },
  });
};

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (orderData: CheckoutFormData) =>
      paymentAPI.placeOrder(orderData),
    onSuccess: (data) => {
      // console.log("Order placed successfully:", data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Place order failed:", error);
    },
  });
};

//TODO

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ["orderHistory"],
    queryFn: () => paymentAPI.orderHistory(),
    staleTime: 60 * 1000,
  });
};

export const useCreateStripeSession = () => {
  return useMutation({
    mutationFn: (order_id: number) =>
      paymentAPI.createCheckoutSession(order_id),
    onSuccess: (data) => {
      // console.log("Checkout session created:", data);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create checkout session failed:", error);
    },
  });
};

export const useCreatePayPalOrder = () => {
  return useMutation({
    mutationFn: (order_id: number) => paymentAPI.createPayPalOrder(order_id),
    onSuccess: (data) => {
      // console.log("PayPal order created:", data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Create PayPal order failed:", error);
    },
  });
};

export const useCapturePayPalOrder = () => {
  return useMutation({
    mutationFn: (payload: PayPalCapture) =>
      paymentAPI.capturePayPalOrder(payload),
    onSuccess: (data) => {
      // console.log("PayPal payment captured:", data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Capture PayPal order failed:", error);
    },
  });
};
// export const useCreateBostaShipment = () => {
//   return useMutation({
//     mutationFn: (orderId: number) => paymentAPI.createBostaShipment(orderId),
//     onSuccess: (data: ShippingResponse) => {
//       // يمكنك هنا إظهار رسالة نجاح أو تحديث حالة الطلب في الواجهة
//       // console.log("Bosta Shipment Created:", data.trackingNumber);
//     },
//     onError: (error: AxiosError<ErrorResponse>) => {
//       // console.error("Bosta Shipment Creation Failed:", error);
//     },
//   });
// };
// export const useTrackBostaShipment = (trackingNumber: string) => {
//   return useQuery({
//     queryKey: ["trackShipment", trackingNumber],
//     queryFn: () => paymentAPI.trackBostaShipment(trackingNumber),
//     // لا تقم بطلب البيانات إلا إذا كان رقم التتبع موجوداً فعلياً
//     enabled: !!trackingNumber,
//     // يفضل تقليل الـ staleTime لأن حالة الشحن قد تتغير
//     staleTime: 5 * 60 * 1000,
//     // إعادة المحاولة في حالة الفشل (مثلاً لو السيرفر وقع)
//     retry: 1,
//   });
// };