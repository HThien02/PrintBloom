"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { CartProvider, useCart } from "@/lib/cart-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useRouter } from "next/navigation";

function CartContent() {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    router.push('/login?returnUrl=' + encodeURIComponent('/cart'));
    return null;
  }

  const customItems = items.filter((item) => item.isCustomQuantity);
  const buyableItems = items.filter((item) => !item.isCustomQuantity);
  const hasCustomItems = customItems.length > 0;
  const hasBuyableItems = buyableItems.length > 0;

  const subtotal = buyableItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              P
            </div>
            <span className="font-serif text-xl text-foreground">
              TPrint
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.cart.continueShopping}
          </Link>
        </div>

        <h1 className="mb-8 font-serif text-3xl text-foreground">
          {t.cart.title}
          {items.length > 0 && (
            <span className="ml-2 text-lg text-muted-foreground">
              ({items.length} {t.cart.items})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl text-foreground">
              {t.cart.empty}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.cart.emptySubtitle}</p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/">{t.cart.continueShopping}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                {/* Buyable items section */}
                {hasBuyableItems && hasCustomItems && (
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    {t.cart.buyableItems}
                  </h2>
                )}
                {buyableItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    t={t}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  {t.cart.orderSummary}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.cart.tax}</span>
                    <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">{t.cart.total}</span>
                    <span className="font-semibold text-foreground">${(subtotal + tax).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button asChild className="w-full rounded-full">
                    <Link href="/checkout">{t.cart.checkout}</Link>
                  </Button>
                  <Button variant="outline" className="w-full rounded-full">
                    <Link href="/">{t.cart.continueShopping}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CartItemCard({ item, t, onUpdateQuantity, onRemove }: {
  item: any;
  t: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-background p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.product.image}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="text-sm font-medium text-foreground">{item.productName}</h3>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
          {item.material && <span>{item.material.name}</span>}
          <span className="font-medium text-amber-600 dark:text-amber-400">
            {item.quantity.toLocaleString()} {t.cart.pieces}
            {item.isCustomQuantity && (
              <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                ({t.cart.custom})
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            ${(item.unitPrice * item.quantity).toFixed(2)}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={t.cart.remove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <CartContent />
      </CartProvider>
    </LanguageProvider>
  );
}
