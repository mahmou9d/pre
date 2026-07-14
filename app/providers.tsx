"use client";

import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CatsProvider } from "@/context/CatsContext";
import DeviceIDProvider from "@/components/DeviceIDProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PaymentPopup } from "@/components/Paymentresult";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { useCats } from "@/context/CatsContext";

const PixelTracker = () => {
  useFacebookPixel();
  return null;
};

/** Wrapper that reads cart state from context and passes it down to CartDrawer */
function CartDrawerConnected() {
  const { cartOpen, setCartOpen } = useCats();
  return (
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CatsProvider>
            <Toaster />
            <Sonner />
            <DeviceIDProvider />
            <Suspense fallback={null}>
              <PixelTracker />
            </Suspense>
            <CartDrawerConnected />
            <WhatsAppButton />
            <PaymentPopup />
            {children}
          </CatsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
