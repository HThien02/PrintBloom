"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/language-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CartProvider>{children}</CartProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
