"use client";

import { useEffect } from "react";

/**
 * وظيفة لإنشاء أو تحديث الـ Device ID
 */
export const RefreshDeviceID = () => {
  const newID = crypto.randomUUID();
  localStorage.setItem("X-Device-ID", newID);
};

/**
 * مكون يقوم بالتحقق من وجود Device ID عند تشغيل التطبيق
 */
export default function DeviceIDProvider() {
  useEffect(() => {
    const existing = localStorage.getItem("X-Device-ID");
    if (!existing) {
      RefreshDeviceID();
    }
  }, []);

  return null;
}
// export  function RedirectResetPassword() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
// const { locale } = useTranslation();

// useEffect(() => {
//   const token = searchParams.get("token");
//   const savedLang = localStorage.getItem("lang");
//   const locale = savedLang === "AR" ? "ar" : "en";

//   console.log("token:", token); // هل فيه token؟
//   console.log("locale:", locale); // en أو ar؟
//   console.log("full URL:", window.location.href); // الـ URL الكامل

//   const dest = token
//     ? `/${locale}/reset-password?token=${token}`
//     : ``;

//   console.log("redirecting to:", dest); // الـ destination
//   router.replace(dest);
// }, [router, searchParams]);
//   return null;
// }
