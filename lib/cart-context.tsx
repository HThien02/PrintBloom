"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "@/components/product-catalog";
import type { Material } from "@/components/material-selector";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: string;
  product: Product;
  productName: string;
  material: Material | null;
  designOption: "upload" | "hire" | null;
  quantity: number;
  unitPrice: number;
  isCustomQuantity?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "tprint-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isGuest = status === "unauthenticated" || status === "loading";

  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const fetchCartFromDB = useCallback(async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      if (data.items) {
        const dbItems = data.items.map((item: any) => ({
          id: item.id,
          product: { id: item.productId } as Product,
          productName: item.productName,
          material: item.materialId
            ? ({
                id: item.materialId,
                name: item.materialName || "",
              } as Material)
            : null,
          designOption: item.designOption as "upload" | "hire" | null,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          isCustomQuantity: item.isCustomQuantity,
        }));
        setItems(dbItems);
      }
    } catch (error) {
      console.error("Error fetching cart from DB:", error);
    }
    setLoaded(true);
  }, []);

  // Load cart based on auth status
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartFromDB();
    } else if (isGuest) {
      loadFromLocalStorage();
    }
  }, [isLoggedIn, isGuest, fetchCartFromDB, loadFromLocalStorage]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (loaded && isGuest) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, loaded, isGuest]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, "id">) => {
      if (isLoggedIn) {
        // Add to database
        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.product.id,
              productName: item.productName,
              materialId: item.material?.id || null,
              materialName: item.material?.name || null,
              designOption: item.designOption,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              isCustomQuantity: item.isCustomQuantity,
            }),
          });
          const data = await response.json();
          if (data.items) {
            const dbItems = data.items.map((dbItem: any) => ({
              id: dbItem.id,
              product: { id: dbItem.productId } as Product,
              productName: dbItem.productName,
              material: dbItem.materialId
                ? ({
                    id: dbItem.materialId,
                    name: dbItem.materialName || "",
                  } as Material)
                : null,
              designOption: dbItem.designOption as "upload" | "hire" | null,
              quantity: dbItem.quantity,
              unitPrice: Number(dbItem.unitPrice),
              isCustomQuantity: dbItem.isCustomQuantity,
            }));
            setItems(dbItems);
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      } else {
        // Add to localStorage for guest users
        const id = `${item.product.id}-${item.material?.id ?? "none"}-${item.designOption ?? "none"}-${Date.now()}`;
        setItems((prev) => [...prev, { ...item, id }]);
      }
    },
    [isLoggedIn],
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (isLoggedIn) {
        try {
          const response = await fetch(`/api/cart?itemId=${id}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (data.items) {
            const dbItems = data.items.map((item: any) => ({
              id: item.id,
              product: { id: item.productId } as Product,
              productName: item.productName,
              material: item.materialId
                ? ({
                    id: item.materialId,
                    name: item.materialName || "",
                  } as Material)
                : null,
              designOption: item.designOption as "upload" | "hire" | null,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              isCustomQuantity: item.isCustomQuantity,
            }));
            setItems(dbItems);
          }
        } catch (error) {
          console.error("Error removing from cart:", error);
        }
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [isLoggedIn],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity < 1) return;

      if (isLoggedIn) {
        try {
          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: id, quantity }),
          });
          const data = await response.json();
          if (data.items) {
            const dbItems = data.items.map((item: any) => ({
              id: item.id,
              product: { id: item.productId } as Product,
              productName: item.productName,
              material: item.materialId
                ? ({
                    id: item.materialId,
                    name: item.materialName || "",
                  } as Material)
                : null,
              designOption: item.designOption as "upload" | "hire" | null,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              isCustomQuantity: item.isCustomQuantity,
            }));
            setItems(dbItems);
          }
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
      }
    },
    [isLoggedIn],
  );

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
    setItems([]);
  }, [isLoggedIn]);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
