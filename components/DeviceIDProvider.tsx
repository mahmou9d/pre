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
