"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency-context";
import { Globe, ChevronDown } from "lucide-react";

const currencies = [
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
] as const;

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrency = currencies.find(c => c.code === currency);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 h-9 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentCurrency?.symbol} {currency}
        </span>
        <ChevronDown className="h-3 w-3" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent cursor-pointer ${
                  curr.code === currency ? "bg-accent" : ""
                }`}
              >
                <span className="font-medium">{curr.symbol}</span>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{curr.code}</span>
                  <span className="text-xs text-muted-foreground">
                    {curr.name}
                  </span>
                </div>
                {curr.code === currency && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
