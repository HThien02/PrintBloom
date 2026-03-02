"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/language-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>{children}</CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
