"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/authApi";
import { ErrorResponse, LoginRequest, SignupRequest } from "../type/type";
import { storage } from "@/lib/storage";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const authKeys = {
  all: ["auth"] as const,
  role: () => [...authKeys.all, "role"] as const,
};

export const useGetRole = () => {
  return useQuery({
    queryKey: authKeys.role(),
    queryFn: authAPI.getRole,
    enabled: !!storage.getToken("access"),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
  });
};
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authAPI.login(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.role() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Login failed:", error);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload: SignupRequest) => authAPI.signup(payload),
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Signup failed:", error);
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authAPI.refreshToken,
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Refresh failed:", error);
    },
  });
};

export const usePasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.passwordReset(email),
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Password reset failed:", error);
    },
  });
};

export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      authAPI.passwordResetConfirm(payload),
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Password reset confirmation failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");
      storage.clearAll();
      queryClient.clear();
      router.replace("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");

      storage.clearAll();
      queryClient.clear();
      router.replace("/");
    },
  });
};

export const useLoginGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { credential: string }) => authAPI.google(payload),
    onSuccess: (data) => {
      storage.setToken("access", data.access);
      storage.setToken("refresh", data.refresh);
      queryClient.invalidateQueries({ queryKey: authKeys.role() });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // console.error("Google login failed:", error);
    },
  });
};
export const useAuth = () => {
  const { data: user, isLoading, isFetching } = useGetRole();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();

  // نقوم بالتأكد من وجود التوكن أولاً بشكل متزامن
  const hasToken =
    typeof window !== "undefined" && !!storage.getToken("access");

  // يكون المستخدم "مفترض" أنه مسجل دخول إذا كان هناك توكن والطلب لا يزال جارياً
  // أو إذا اكتمل الطلب بنجاح ووجدنا بيانات المستخدم
  const isAuthenticated = !!user && hasToken;

  const isAdmin = user?.is_admin ?? false;

  return {
    user,
    isLoading: isLoading || isFetching, // استخدم هذه الحالة في المكونات لإظهار "Loading Spinner"
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
};
