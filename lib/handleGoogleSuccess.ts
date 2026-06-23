import { useCallback } from "react";
import { AxiosError } from "axios";
import { useLoginGoogle } from "@/hooks/useAuth";
import { ErrorResponse, GoogleLoginData } from "@/type/type";
import { useCartMerge } from "@/hooks/useCart";
import { useRouter } from "next/navigation";


export const useHandleGoogleSuccess = (
  showNotification: (message: string, type: "success" | "error") => void,
) => {
  const { mutate: loginWithGoogle } = useLoginGoogle();
  const mergeCart = useCartMerge();
  const router = useRouter();

  const handleGoogleSuccess = useCallback(
    (credential: string) => {
      loginWithGoogle(
        { credential },
        {
          onSuccess: (data: GoogleLoginData) => {
            try {
              if (data.access) localStorage.setItem("access", data.access);
              if (data.refresh) localStorage.setItem("refresh", data.refresh);

              const savedToken = localStorage.getItem("access");
          const deviceId = localStorage.getItem("X-Device-ID");

          if (deviceId && savedToken) {
            mergeCart.mutate(deviceId, {});
          }
              if (savedToken) {
                showNotification("تم تسجيل الدخول بنجاح ✓", "success");

                setTimeout(() => {
                  router.push("/");
                }, 1500);
              } else {
                showNotification(
                   "فشل في حفظ جلسة تسجيل الدخول",
                  "error",
                );
              }
            } catch (errorData: unknown) {
              const error = errorData as AxiosError<ErrorResponse>;
              showNotification(
                error?.response?.data?.message ||
                  error?.message ||
                  "فشل تسجيل الدخول بواسطة جوجل. يرجى المحاولة مرة أخرى.",
                "error",
              );
            }
          },
          onError: (error: AxiosError<ErrorResponse>) => {
            showNotification(
              error?.response?.data?.message ||
                error?.message ||
                "فشل تسجيل الدخول بواسطة جوجل. يرجى المحاولة مرة أخرى.",
              "error",
            );
          },
        },
      );
    },
    [ loginWithGoogle, router, showNotification],
  );

  return handleGoogleSuccess;
};
