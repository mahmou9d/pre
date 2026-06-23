/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://web-production-6e53d4.up.railway.app/api";

export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

publicClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const selectedLanguage =
      localStorage.getItem("lang")?.toLowerCase() || "ar";
    config.headers["Accept-Language"] = selectedLanguage;
  }
  return config;
});
