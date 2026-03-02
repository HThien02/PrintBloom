"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

// Exchange rates (VND base)
const EXCHANGE_RATES = {
  VND: { USD: 0.000041, CNY: 0.000293 }, // 1 VND = 0.000041 USD, 0.000293 CNY
  USD: { VND: 24300, CNY: 7.15 },        // 1 USD = 24300 VND, 7.15 CNY  
  CNY: { VND: 3415, USD: 0.14 },         // 1 CNY = 3415 VND, 0.14 USD
} as const;

// Language to default currency mapping
const LANGUAGE_CURRENCY_MAP = {
  vi: "VND",
  en: "USD", 
  zh: "CNY",
} as const;

type Currency = "VND" | "USD" | "CNY";
type Locale = "vi" | "en" | "zh";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (amountVND: number) => number;
  formatPrice: (amountVND: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = "tprint-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currency, setCurrencyState] = useState<Currency>("VND");

  // Load currency from localStorage or language preference
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["VND", "USD", "CNY"].includes(stored)) {
      setCurrencyState(stored as Currency);
    } else {
      // Default based on language
      const lang = localStorage.getItem("tprint-locale") as Locale;
      const defaultCurrency = LANGUAGE_CURRENCY_MAP[lang] || "VND";
      setCurrencyState(defaultCurrency);
      localStorage.setItem(STORAGE_KEY, defaultCurrency);
    }
  }, []); // Only run on mount

  // Listen for language changes and update currency if no manual selection
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLang = event.detail as Locale;
      const stored = localStorage.getItem(STORAGE_KEY);
      
      // Only update currency if user hasn't manually selected one
      if (!stored || stored === LANGUAGE_CURRENCY_MAP[localStorage.getItem("tprint-locale") as Locale]) {
        const defaultCurrency = LANGUAGE_CURRENCY_MAP[newLang] || "VND";
        setCurrencyState(defaultCurrency);
        localStorage.setItem(STORAGE_KEY, defaultCurrency);
      }
    };

    // Listen for custom language change event
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  };

  // Convert price from VND to target currency with profit-friendly rounding
  const convertPrice = (amountVND: number): number => {
    if (currency === "VND") return amountVND;
    
    const rate = EXCHANGE_RATES.VND[currency];
    let convertedAmount = amountVND * rate;

    // Profit-friendly rounding strategy
    if (currency === "USD") {
      // Round up to nearest 0.05 (nickel rounding) - always round up for profit
      convertedAmount = Math.ceil(convertedAmount * 20) / 20;
      // Minimum $0.99
      if (convertedAmount < 0.99) convertedAmount = 0.99;
    } else if (currency === "CNY") {
      // Round up to nearest 0.5 CNY
      convertedAmount = Math.ceil(convertedAmount * 2) / 2;
      // Minimum ¥1.00
      if (convertedAmount < 1.00) convertedAmount = 1.00;
    }

    return convertedAmount;
  };

  // Format price with appropriate currency symbol and decimals
  const formatPrice = (amountVND: number): string => {
    const convertedAmount = convertPrice(amountVND);
    
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(convertedAmount);
    } else if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    } else if (currency === "CNY") {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    }
    
    return convertedAmount.toString();
  };

  const getCurrencySymbol = (): string => {
    switch (currency) {
      case "VND": return "₫";
      case "USD": return "$";
      case "CNY": return "¥";
      default: return "₫";
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
