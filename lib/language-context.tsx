"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  translations,
  type Locale,
  type Translations,
} from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "tprint-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load locale from localStorage on mount
  useEffect(() => {
    // Check if user is admin
    const isAdmin = session?.user?.role === "ADMIN";
    
    if (isAdmin) {
      // Admin defaults to Vietnamese
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "vi") {
        setLocaleState(stored);
      } else {
        // Force Vietnamese for admin if not already set
        setLocaleState("vi");
        localStorage.setItem(STORAGE_KEY, "vi");
      }
    } else {
      // Regular user uses stored preference or defaults to English
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "vi" || stored === "zh") {
        setLocaleState(stored);
      }
    }
  }, [session]);

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: Locale) => {
    const isAdmin = session?.user?.role === "ADMIN";
    
    // Allow language switch for all users
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    
    // Dispatch custom event for currency context to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLocale }));
  };

  const t = translations[locale] as Translations;
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
