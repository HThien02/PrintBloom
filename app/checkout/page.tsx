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
import { getApiHeaders } from "@/lib/api"
import { VietnamAddressSelector } from "@/components/vietnam-address-selector"

function CheckoutContent() {
  const { t, locale } = useLanguage()
  const { items, getCartTotal, clearCart } = useCart()
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [selectedProvinceName, setSelectedProvinceName] = useState("")

  const subtotal = getCartTotal()
  const shippingCost =
    shippingMethod === "express" ? 12.99 : shippingMethod === "overnight" ? 24.99 : 0
  const taxRate = 0.08
  const tax = subtotal * taxRate
  const total = subtotal + shippingCost + tax

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setFieldErrors({})
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const address = formData.get("address") as string
    const apartment = formData.get("apartment") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const zip = formData.get("zip") as string

    const payload = {
      email,
      firstName,
      lastName,
      phone: phone || undefined,
      address,
      apartment: apartment || undefined,
      city,
      state,
      zip,
      shippingMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.productName,
        materialId: item.material?.id ?? null,
        materialName: item.material?.name ?? null,
        designOption: item.designOption ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: getApiHeaders(locale),
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        
        // Handle field-specific errors
        if (data.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors)
          return
        }
        
        throw new Error(data.error || t.validation.somethingWentWrong)
      }
      setShowSuccess(true)
      clearCart()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.validation.somethingWentWrong)
    } finally {
      setIsSubmitting(false)
    }
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
            <span className="font-serif text-xl text-foreground">TPrint</span>
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
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder={t.checkout.emailPlaceholder} 
                      className={`h-11 ${fieldErrors.email ? 'border-red-500' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">{t.checkout.phone}</Label>
                    <Input id="phone" name="phone" type="tel" placeholder={t.checkout.phonePlaceholder} className="h-11" />
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
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        placeholder={t.checkout.firstName} 
                        className={`h-11 ${fieldErrors.firstName ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-sm text-red-500">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">{t.checkout.lastName}</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        placeholder={t.checkout.lastName} 
                        className={`h-11 ${fieldErrors.lastName ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-sm text-red-500">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address">{t.checkout.address}</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      placeholder={t.checkout.addressPlaceholder} 
                      className={`h-11 ${fieldErrors.address ? 'border-red-500' : ''}`}
                    />
                    {fieldErrors.address && (
                      <p className="text-sm text-red-500">{fieldErrors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="apartment">{t.checkout.apartment}</Label>
                    <Input id="apartment" name="apartment" placeholder={t.checkout.apartmentPlaceholder} className="h-11" />
                  </div>
                  
                  {/* Vietnamese Address Selector for Vietnamese locale */}
                  {locale === 'vi' ? (
                    <div className="space-y-4">
                      <VietnamAddressSelector
                        onProvinceChange={(provinceCode: string, provinceName: string) => {
                          setSelectedProvince(provinceCode)
                          setSelectedProvinceName(provinceName)
                          
                          // Update hidden inputs for form submission
                          const cityInput = document.getElementById('city') as HTMLInputElement
                          const stateInput = document.getElementById('state') as HTMLInputElement
                          if (cityInput) cityInput.value = provinceName
                          if (stateInput) stateInput.value = provinceName
                        }}
                        onWardChange={(wardCode: string, wardName: string) => {
                          setSelectedWard(wardCode)
                          
                          // Update hidden inputs with selected ward name
                          const wardInput = document.getElementById('address_line1') as HTMLInputElement
                          if (wardInput) {
                            wardInput.value = wardName
                          }
                        }}
                      />
                      {/* Hidden inputs for form submission */}
                      <input type="hidden" id="city" name="city" />
                      <input type="hidden" id="state" name="state" />
                      <input type="hidden" id="zip" name="zip" value="000000" />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="city">{t.checkout.city}</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder={t.checkout.cityPlaceholder} 
                          className={`h-11 ${fieldErrors.city ? 'border-red-500' : ''}`}
                        />
                        {fieldErrors.city && (
                          <p className="text-sm text-red-500">{fieldErrors.city}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="state">{t.checkout.state}</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          placeholder={t.checkout.statePlaceholder} 
                          className={`h-11 ${fieldErrors.state ? 'border-red-500' : ''}`}
                        />
                        {fieldErrors.state && (
                          <p className="text-sm text-red-500">{fieldErrors.state}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="zip">{t.checkout.zip}</Label>
                        <Input 
                          id="zip" 
                          name="zip" 
                          placeholder={t.checkout.zipPlaceholder} 
                          className={`h-11 ${fieldErrors.zip ? 'border-red-500' : ''}`}
                        />
                        {fieldErrors.zip && (
                          <p className="text-sm text-red-500">{fieldErrors.zip}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Shipping Method */}
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-serif text-lg text-foreground">{t.checkout.shippingMethod}</h2>
                {fieldErrors.shippingMethod && (
                  <p className="mb-3 text-sm text-red-500">{fieldErrors.shippingMethod}</p>
                )}
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
                    <Input id="cardNumber" placeholder={t.checkout.cardPlaceholder} className="h-11" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiry">{t.checkout.expiry}</Label>
                      <Input id="expiry" placeholder={t.checkout.expiryPlaceholder} className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cvc">{t.checkout.cvc}</Label>
                      <Input id="cvc" placeholder={t.checkout.cvcPlaceholder} className="h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cardholderName">{t.checkout.cardholderName}</Label>
                      <Input id="cardholderName" placeholder={t.checkout.cardholderPlaceholder} className="h-11" />
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
                  <p className="mb-4 text-sm text-muted-foreground">{t.checkout.noItemsInCart}</p>
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

                {fieldErrors.items && (
                  <p className="mb-3 text-sm text-red-500">{fieldErrors.items}</p>
                )}
                {submitError && (
                  <p className="mb-3 text-sm text-destructive">{submitError}</p>
                )}
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={items.length === 0 || isSubmitting}>
                  {isSubmitting ? t.checkout.placingOrder : t.checkout.placeOrder}
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
