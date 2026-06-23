"use client";

import { apiClient } from "@/lib/apiClient";
import { storage } from "@/lib/storage";
import {
  google,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  Role,
  SignupRequest,
  SignupResponse,
} from "../type/type";


export const authAPI = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login/",
      payload,
    );
    storage.setToken("access", data.access);
    storage.setToken("refresh", data.refresh);
    
    return data;
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await apiClient.post<SignupResponse>(
      "/auth/signup/",
      payload,
    );
    return data;
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    const refreshToken = storage.getToken("refresh");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const { data } = await apiClient.post<RefreshResponse>(
      "/auth/token/refresh/",
      { refresh: refreshToken },
    );

    storage.setToken("access", data.access);
    storage.setToken("refresh", data.refresh);
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = storage.getToken("refresh");

    if (refreshToken) {
      await apiClient.post("/auth/logout/", { refresh: refreshToken });
    }

    storage.clearAll();
  },

  getRole: async (): Promise<Role> => {
    const { data } = await apiClient.get<Role>("/auth/me/");
    localStorage.setItem("role", String(data?.is_admin));
    return data;
  },
  passwordReset: async (email: string): Promise<{ status :string}> => {
    const { data } = await apiClient.post<{ status: string }>(
      "/password_reset/",
      { email },
    );
    // console.log(data);
    return data;
  },

  passwordResetConfirm: async (payload: {
    token: string;
    password: string;
  }): Promise<{ message :string}> => {
    const { data } = await apiClient.post<{ message: string }>(
      "/password_reset/confirm/",
      payload,
    );
    // console.log(data);
    return data;
  },

  google: async (payload: { credential: string }): Promise<google> => {
    const { data } = await apiClient.post<google>("/auth/google/", payload);
    // console.log("🔍 Backend response:", data);
    storage.setToken("access", data.access);
    storage.setToken("refresh", data.refresh);
    return data;
  },
};
