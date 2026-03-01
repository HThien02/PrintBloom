"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { CartProvider, useCart } from "@/lib/cart-context"
import { LanguageSwitcher } from "@/components/language-switcher"

function CheckoutContent() {
  const { t } = useLanguage()
  const { items, getCartTotal, clearCart } = useCart()
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [showSuccess, setShowSuccess] = useState(false)

  const subtotal = getCartTotal()
  const shippingCost =
    shippingMethod === "express" ? 12.99 : shippingMethod === "overnight" ? 24.99 : 0
  const taxRate = 0.08
  const tax = subtotal * taxRate
  const total = subtotal + shippingCost + tax

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setShowSuccess(true)
    clearCart()
  }

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
          <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t.checkout.backToCart}
          </Link>
        </div>

        <h1 className="mb-8 font-serif text-3xl text-foreground">{t.checkout.title}</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Form sections */}
            <div className="flex flex-col gap-8 lg:col-span-2">
              {/* Contact Info */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-lg text-foreground">
                  {t.checkout.contactInfo}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">{t.checkout.email}</Label>
                    <Input id="email" type="email" placeholder={t.checkout.emailPlaceholder} required className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">{t.checkout.phone}</Label>
                    <Input id="phone" type="tel" placeholder={t.checkout.phonePlaceholder} className="h-11" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-lg text-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  {t.checkout.shippingAddress}
                </h2>
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">{t.checkout.firstName}</Label>
                      <Input id="firstName" placeholder={t.checkout.firstName} required className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">{t.checkout.lastName}</Label>
                      <Input id="lastName" placeholder={t.checkout.lastName} required className="h-11" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address">{t.checkout.address}</Label>
                    <Input id="address" placeholder={t.checkout.addressPlaceholder} required className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="apartment">{t.checkout.apartment}</Label>
                    <Input id="apartment" placeholder={t.checkout.apartmentPlaceholder} className="h-11" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="city">{t.checkout.city}</Label>
                      <Input id="city" placeholder={t.checkout.cityPlaceholder} required className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="state">{t.checkout.state}</Label>
                      <Input id="state" placeholder={t.checkout.statePlaceholder} required className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="zip">{t.checkout.zip}</Label>
                      <Input id="zip" placeholder={t.checkout.zipPlaceholder} required className="h-11" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-serif text-lg text-foreground">{t.checkout.shippingMethod}</h2>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.checkout.standard}</p>
                        <p className="text-xs text-muted-foreground">{t.checkout.standardTime}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">{t.checkout.standardPrice}</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.checkout.express}</p>
                        <p className="text-xs text-muted-foreground">{t.checkout.expressTime}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{t.checkout.expressPrice}</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="overnight" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.checkout.overnight}</p>
                        <p className="text-xs text-muted-foreground">{t.checkout.overnightTime}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{t.checkout.overnightPrice}</span>
                  </label>
                </RadioGroup>
              </section>

              {/* Payment */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-lg text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {t.checkout.payment}
                </h2>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
                    <Input id="cardNumber" placeholder={t.checkout.cardPlaceholder} required className="h-11" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiry">{t.checkout.expiry}</Label>
                      <Input id="expiry" placeholder={t.checkout.expiryPlaceholder} required className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cvc">{t.checkout.cvc}</Label>
                      <Input id="cvc" placeholder={t.checkout.cvcPlaceholder} required className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cardholderName">{t.checkout.cardholderName}</Label>
                      <Input id="cardholderName" placeholder={t.checkout.cardholderPlaceholder} required className="h-11" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Order summary */}
            <div>
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-serif text-xl text-foreground">{t.checkout.orderSummary}</h2>

                {items.length > 0 ? (
                  <div className="mb-4 flex flex-col gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.product.image}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.productName}</p>
                            {item.material && (
                              <p className="text-xs text-muted-foreground">{item.material.name}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-4 text-sm text-muted-foreground">No items in cart.</p>
                )}

                <Separator className="my-4" />

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.checkout.subtotal}</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.checkout.shipping}</span>
                    <span className="font-medium text-foreground">
                      {shippingCost === 0 ? t.checkout.standardPrice : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.checkout.tax}</span>
                    <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6 flex justify-between">
                  <span className="font-semibold text-foreground">{t.checkout.total}</span>
                  <span className="font-serif text-xl text-foreground">${total.toFixed(2)}</span>
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full" disabled={items.length === 0}>
                  {t.checkout.placeOrder}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="font-serif text-2xl">{t.checkout.orderSuccess}</DialogTitle>
            <DialogDescription>{t.checkout.orderSuccessMessage}</DialogDescription>
          </DialogHeader>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/">{t.checkout.backToHome}</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <CheckoutContent />
      </CartProvider>
    </LanguageProvider>
  )
}
