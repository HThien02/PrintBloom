"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MessageCircle, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { CartProvider, useCart } from "@/lib/cart-context"
import { LanguageSwitcher } from "@/components/language-switcher"

function QuoteContent() {
  const { t } = useLanguage()
  const { items, removeFromCart } = useCart()
  const [submitted, setSubmitted] = useState(false)

  const customItems = items.filter((item) => item.isCustomQuantity)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    customItems.forEach((item) => removeFromCart(item.id))
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-3xl text-foreground">Quote Request Sent!</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Thank you for your quote request. Our team will review your order and contact you within 24 hours with a personalized quote and delivery timeline.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-8">
              <Link href="/">Continue Shopping</Link>
            </Button>
            {items.filter((i) => !i.isCustomQuantity).length > 0 && (
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/cart">Back to Cart</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (customItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl text-foreground">No Quote Items</h2>
          <p className="mt-2 text-muted-foreground">
            You don't have any items with custom quantities that need a quote.
          </p>
          <Button asChild className="mt-6 rounded-full px-8">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {t.checkout?.backToCart || "Back to Cart"}
        </Link>
      </div>

      <h1 className="mb-2 font-serif text-3xl text-foreground">{t.cart.getQuote}</h1>
      <p className="mb-8 text-muted-foreground">
        {t.cart.getQuoteNote}
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Items to quote */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-serif text-lg text-foreground">Items for Quote</h2>
            <div className="flex flex-col gap-4">
              {customItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border border-border/50 bg-background p-3">
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
                        {item.quantity.toLocaleString()} {t.quantitySelector?.pieces || "pieces"} ({t.cart.customQuantityTag})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                {t.cart.hasCustomItemsNote}
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-serif text-lg text-foreground">Contact Details</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="quote-name">Full Name</Label>
                <Input id="quote-name" placeholder="Your full name" required className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="quote-email">{t.checkout?.email || "Email"}</Label>
                <Input id="quote-email" type="email" placeholder="you@example.com" required className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="quote-phone">{t.checkout?.phone || "Phone"}</Label>
                <Input id="quote-phone" type="tel" placeholder="+1 (555) 000-0000" required className="h-10" />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Label htmlFor="quote-notes">Additional Notes</Label>
                <Textarea
                  id="quote-notes"
                  placeholder="Any specific requirements, deadlines, or special instructions..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button type="submit" className="w-full rounded-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Quote Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function QuotePage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
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
          <QuoteContent />
        </div>
      </CartProvider>
    </LanguageProvider>
  )
}
