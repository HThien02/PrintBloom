"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MaterialSelector, type Material, type QuantityOption, quantityOptionsByProduct } from "@/components/material-selector"
import { DesignOptionSelector } from "@/components/design-option-selector"
import type { Product } from "@/components/product-catalog"
import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface ProductCustomizerProps {
  product: Product
  onBack: () => void
}

export function ProductCustomizer({ product, onBack }: ProductCustomizerProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<QuantityOption | null>(null)
  const [customQuantity, setCustomQuantity] = useState("")
  const [isCustomQuantity, setIsCustomQuantity] = useState(false)
  const [designOption, setDesignOption] = useState<"upload" | "hire" | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [designBrief, setDesignBrief] = useState("")
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()
  const { addToCart } = useCart()

  const productText = t.catalog.products[product.id as keyof typeof t.catalog.products]

  const hasQuantitySelected = isCustomQuantity
    ? customQuantity.trim().length > 0 && parseInt(customQuantity) > 0
    : selectedQuantityOption !== null

  const canProceedToStep2 = selectedMaterial !== null && hasQuantitySelected
  const canSubmit = designOption !== null && (designOption === "upload" ? uploadedFile !== null : designBrief.trim().length > 0)

  const currentQuantity = isCustomQuantity ? parseInt(customQuantity) || 0 : selectedQuantityOption?.quantity || 0
  const currentPrice = isCustomQuantity ? null : selectedQuantityOption?.price || 0

  function handleAddToCart() {
    const basePrice = isCustomQuantity ? 0 : (selectedQuantityOption?.price || 0)
    const materialMod = selectedMaterial
      ? parseFloat(selectedMaterial.priceModifier.replace("+$", "").replace("-$", (m: string) => `-${m}`).replace("$", ""))
      : 0
    const designMod = designOption === "hire" ? 49.99 : 0
    const unitPrice = basePrice + materialMod + designMod

    addToCart({
      product,
      productName: productText.name,
      material: selectedMaterial,
      designOption,
      quantity: currentQuantity,
      unitPrice,
    })

    if (isCustomQuantity) {
      toast.success(t.quantitySelector?.addedCustom || `${productText.name} added! We'll contact you with a quote for ${currentQuantity} pieces.`)
    } else {
      toast.success(`${productText.name} added to cart!`)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-foreground">{t.customizer.orderSubmitted}</h2>
          <p className="mt-2 text-muted-foreground">
            {t.customizer.thankYou} {productText.name.toLowerCase()} {t.customizer.customization}
            {isCustomQuantity
              ? (t.quantitySelector?.customConfirmation || " Our team will contact you shortly with a personalized quote for your custom quantity.")
              : designOption === "hire" ? t.customizer.hireResponse : t.customizer.uploadResponse}
          </p>
          <Button className="mt-6 rounded-full px-8" onClick={onBack}>
            {t.customizer.browseMore}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {t.customizer.backToProducts}
        </button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Product preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="overflow-hidden rounded-2xl bg-muted">
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={productText.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="font-serif text-2xl text-foreground">{productText.name}</h2>
                <p className="text-sm text-muted-foreground">{productText.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {currentPrice !== null && currentPrice > 0 ? (
                    <span className="text-lg font-semibold text-foreground">${currentPrice.toFixed(2)}</span>
                  ) : isCustomQuantity && currentQuantity > 0 ? (
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {t.quantitySelector?.quotePending || "Quote pending"}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-foreground">{t.catalog.from} {product.startingPrice}</span>
                  )}
                  {selectedMaterial && (
                    <span className="text-sm text-primary">{selectedMaterial.priceModifier}</span>
                  )}
                </div>
              </div>

              {/* Order summary on desktop */}
              <div className="mt-6 hidden rounded-xl border border-border bg-card p-4 lg:block">
                <h3 className="mb-3 text-sm font-semibold text-foreground">{t.customizer.orderSummary}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.customizer.product}</span>
                    <span className="text-foreground">{productText.name}</span>
                  </div>
                  {selectedMaterial && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.customizer.material}</span>
                      <span className="text-foreground">{selectedMaterial.name}</span>
                    </div>
                  )}
                  {hasQuantitySelected && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.quantitySelector?.quantityLabel || "Quantity"}
                      </span>
                      <span className="text-foreground">
                        {currentQuantity.toLocaleString()} {t.quantitySelector?.pieces || "pcs"}
                        {isCustomQuantity && (
                          <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                            ({t.quantitySelector?.custom || "custom"})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {!isCustomQuantity && currentPrice !== null && currentPrice > 0 && (
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-muted-foreground">{t.quantitySelector?.priceLabel || "Price"}</span>
                      <span className="font-semibold text-foreground">${currentPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {designOption && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.customizer.design}</span>
                      <span className="text-foreground">
                        {designOption === "upload" ? t.customizer.ownDesign : t.customizer.hireDesigner}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Steps */}
          <div className="lg:col-span-3">
            {/* Step indicators */}
            <div className="mb-6 flex items-center gap-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {canProceedToStep2 ? <Check className="h-3.5 w-3.5" /> : "1"}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {t.customizer.materialStep} & {t.quantitySelector?.quantityLabel || "Quantity"}
                </span>
              </button>

              <Separator className="flex-1" />

              <button
                onClick={() => canProceedToStep2 && setStep(2)}
                className="flex items-center gap-2"
                disabled={!canProceedToStep2}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  2
                </span>
                <span className="text-sm font-medium text-foreground">{t.customizer.designStep}</span>
              </button>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <MaterialSelector
                  productId={product.id}
                  selectedMaterial={selectedMaterial}
                  onSelectMaterial={setSelectedMaterial}
                  selectedQuantityOption={selectedQuantityOption}
                  onSelectQuantityOption={setSelectedQuantityOption}
                  customQuantity={customQuantity}
                  onCustomQuantityChange={setCustomQuantity}
                  isCustomQuantity={isCustomQuantity}
                  onToggleCustomQuantity={setIsCustomQuantity}
                />
                <Button className="w-full rounded-full" disabled={!canProceedToStep2} onClick={() => setStep(2)}>
                  {t.customizer.continueToDesign}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <DesignOptionSelector
                  selectedOption={designOption}
                  onSelectOption={setDesignOption}
                  uploadedFile={uploadedFile}
                  onFileUpload={setUploadedFile}
                  designBrief={designBrief}
                  onDesignBriefChange={setDesignBrief}
                  productId={product.id}
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep(1)}>
                    {t.customizer.backToMaterial}
                  </Button>
                  <Button className="flex-1 rounded-full" disabled={!canSubmit} onClick={handleAddToCart}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t.customizer.addToCart}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
