"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { CartProvider, useCart } from "@/lib/cart-context"
import { LanguageSwitcher } from "@/components/language-switcher"

function CartContent() {
  const { t } = useLanguage()
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart()

  // Mock: in production this would come from an auth context
  const isLoggedIn = false

  const customItems = items.filter((item) => item.isCustomQuantity)
  const buyableItems = items.filter((item) => !item.isCustomQuantity)
  const hasCustomItems = customItems.length > 0
  const hasBuyableItems = buyableItems.length > 0

  const subtotal = buyableItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const taxRate = 0.08
  const tax = subtotal * taxRate

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              P
            </div>
            <span className="font-serif text-xl text-foreground">PrintBloom</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
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
            <h2 className="font-serif text-2xl text-foreground">{t.cart.empty}</h2>
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

                {/* Custom quantity items section */}
                {hasCustomItems && (
                  <>
                    {hasBuyableItems && <Separator />}
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <MessageCircle className="h-4 w-4" />
                      {t.cart.quoteItems}
                    </h2>
                    {customItems.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        t={t}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        isQuoteItem
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="sticky top-24 flex flex-col gap-4">
                {/* Buyable summary */}
                {hasBuyableItems && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 font-serif text-xl text-foreground">
                      {t.cart.orderSummary}
                    </h2>

                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.cart.subtotal}</span>
                        <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.cart.shipping}</span>
                        <span className="text-muted-foreground">{t.cart.shippingCalc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.cart.tax}</span>
                        <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6 flex justify-between">
                      <span className="font-semibold text-foreground">{t.cart.total}</span>
                      <span className="font-serif text-xl text-foreground">
                        ${(subtotal + tax).toFixed(2)}
                      </span>
                    </div>

                    {isLoggedIn ? (
                      <Button asChild size="lg" className="w-full rounded-full">
                        <Link href="/checkout">{t.cart.proceedToCheckout}</Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
                          <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {t.cart.loginRequiredNote}
                          </p>
                        </div>
                        <Button asChild size="lg" className="w-full rounded-full">
                          <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            {t.cart.loginToCheckout}
                          </Link>
                        </Button>
                      </div>
                    )}

                    <Button asChild variant="ghost" size="sm" className="mt-3 w-full text-muted-foreground">
                      <Link href="/">{t.cart.continueShopping}</Link>
                    </Button>
                  </div>
                )}

                {/* Quote summary for custom items */}
                {hasCustomItems && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <h2 className="mb-2 flex items-center gap-2 font-serif text-lg text-foreground">
                      <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      {t.cart.getQuote}
                    </h2>

                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                      {t.cart.hasCustomItemsNote}
                    </p>

                    <div className="mb-4 flex flex-col gap-2">
                      {customItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.productName}</span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">
                            {item.quantity.toLocaleString()} {t.quantitySelector?.pieces}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isLoggedIn ? (
                      <Button asChild size="lg" className="w-full rounded-full bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500">
                        <Link href="/quote">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {t.cart.getQuote}
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2 rounded-lg bg-amber-100/60 p-3 dark:bg-amber-900/20">
                          <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
                          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                            {t.cart.loginRequiredNote}
                          </p>
                        </div>
                        <Button asChild size="lg" className="w-full rounded-full bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500">
                          <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            {t.cart.loginToQuote}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

interface CartItemCardProps {
  item: {
    id: string
    product: { image: string }
    productName: string
    material: { name: string } | null
    designOption: "upload" | "hire" | null
    quantity: number
    unitPrice: number
    isCustomQuantity?: boolean
  }
  t: ReturnType<typeof useLanguage>["t"]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  isQuoteItem?: boolean
}

function CartItemCard({ item, t, onUpdateQuantity, onRemove, isQuoteItem }: CartItemCardProps) {
  return (
    <div
      className={`flex gap-4 rounded-xl border p-4 ${
        isQuoteItem
          ? "border-amber-200 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10"
          : "border-border bg-card"
      }`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.product.image}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-foreground">{item.productName}</h3>
            {isQuoteItem && (
              <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {t.cart.customQuantityTag}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {item.material && (
              <span>
                {t.cart.material}: {item.material.name}
              </span>
            )}
            {item.designOption && (
              <span>
                {t.cart.design}:{" "}
                {item.designOption === "upload"
                  ? t.cart.ownDesign
                  : t.cart.hireDesigner}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              aria-label={t.common.decreaseQuantity}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 text-center text-sm font-medium text-foreground">
              {item.quantity.toLocaleString()}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
              aria-label={t.common.increaseQuantity}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isQuoteItem ? (
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {t.quantitySelector?.quotePending}
              </span>
            ) : (
              <span className="font-medium text-foreground">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            )}
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
    </div>
  )
}

export default function CartPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <CartContent />
      </CartProvider>
    </LanguageProvider>
  )
}
