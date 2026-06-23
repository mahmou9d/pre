/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://web-production-6e53d4.up.railway.app/api";
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let isRefreshing = false;

// Request Interceptor - Attach token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const selectedLanguage =
        localStorage.getItem("lang")?.toLowerCase() || "ar";
      config.headers["Accept-Language"] = selectedLanguage;
      const isCartRequest =
        config.url?.startsWith("/cart") ||
        config.url?.startsWith("/orders/place") ||
        config.url?.startsWith("/paypal/create-order") ||
        config.url?.startsWith("/payment/paymob/create-checkout") ||
        config.url?.startsWith("/payment/create-checkout-session") ||
        config.url?.startsWith("/orders/history");
      if (isCartRequest) {
        const deviceId = localStorage.getItem("X-Device-ID");
        if (deviceId) {
          config.headers["x-Device-ID"] = deviceId;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) return Promise.reject(error);

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
