"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, MessageCircle, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useLanguage } from "@/lib/language-context"

export interface Material {
  id: string
  name: string
  description: string
  detailedDescription?: string
  image?: string
  priceModifier: string
  finish: string
}

export interface QuantityOption {
  quantity: number
  price: number
}

const materialsByProduct: Record<string, Material[]> = {
  "business-cards": [
    { 
      id: "matte-350", 
      name: "Matte Cardstock", 
      description: "350gsm smooth matte finish", 
      detailedDescription: "Professional matte finish with a smooth, non-reflective surface. Ideal for business cards that need to look sophisticated and modern. The matte coating reduces glare and provides a premium feel.",
      image: "/materials/matte-cardstock.jpg",
      priceModifier: "+$0", 
      finish: "Matte" 
    },
    { 
      id: "glossy-350", 
      name: "Glossy Cardstock", 
      description: "350gsm high-shine glossy", 
      detailedDescription: "Eye-catching glossy finish that makes colors pop. Perfect for designs with vibrant colors and photographs. The high-shine coating adds durability and a professional polish.",
      image: "/materials/glossy-cardstock.jpg",
      priceModifier: "+$2", 
      finish: "Glossy" 
    },
    { 
      id: "linen", 
      name: "Linen Texture", 
      description: "300gsm textured linen paper", 
      detailedDescription: "Elegant textured finish with a subtle linen pattern. Adds a tactile element to your business cards, creating a memorable first impression. The texture provides both visual and physical interest.",
      image: "/materials/linen-texture.jpg",
      priceModifier: "+$4", 
      finish: "Textured" 
    },
    { 
      id: "kraft", 
      name: "Kraft Paper", 
      description: "300gsm recycled kraft", 
      detailedDescription: "Eco-friendly kraft paper with natural fibers. Perfect for organic, rustic, or environmentally conscious brands. The natural brown color and texture convey authenticity and sustainability.",
      image: "/materials/kraft-paper.jpg",
      priceModifier: "+$3", 
      finish: "Natural" 
    },
    { 
      id: "cotton", 
      name: "Cotton Paper", 
      description: "600gsm luxury cotton blend", 
      detailedDescription: "Premium cotton paper with exceptional durability and a soft, luxurious feel. The heavyweight cotton blend provides unmatched quality and a prestigious appearance for high-end business cards.",
      image: "/materials/cotton-paper.jpg",
      priceModifier: "+$8", 
      finish: "Premium" 
    },
  ],
  flyers: [
    { 
      id: "matte-170", 
      name: "Matte Coated", 
      description: "170gsm matte coated paper", 
      detailedDescription: "Professional matte coating that provides excellent readability and a sophisticated appearance. The non-reflective surface is perfect for text-heavy flyers and documents.",
      image: "/materials/matte-coated.jpg",
      priceModifier: "+$0", 
      finish: "Matte" 
    },
    { 
      id: "glossy-170", 
      name: "Glossy Coated", 
      description: "170gsm glossy coated paper", 
      detailedDescription: "Vibrant glossy coating that makes colors appear brighter and more saturated. Ideal for promotional flyers with photographic content and colorful designs.",
      image: "/materials/glossy-coated.jpg",
      priceModifier: "+$1", 
      finish: "Glossy" 
    },
    { 
      id: "silk-250", 
      name: "Silk Finish", 
      description: "250gsm silk laminated", 
      detailedDescription: "Premium silk lamination provides a smooth, sophisticated finish with subtle sheen. Offers excellent durability and a luxurious tactile experience.",
      image: "/materials/silk-finish.jpg",
      priceModifier: "+$3", 
      finish: "Silk" 
    },
    { 
      id: "recycled", 
      name: "Recycled Paper", 
      description: "160gsm eco-friendly recycled", 
      detailedDescription: "Environmentally responsible paper made from post-consumer recycled fibers. Features natural flecks and texture that convey your commitment to sustainability.",
      image: "/materials/recycled-paper.jpg",
      priceModifier: "+$2", 
      finish: "Eco" 
    },
  ],
  banners: [
    { id: "vinyl", name: "Vinyl Banner", description: "13oz scrim vinyl, weatherproof", priceModifier: "+$0", finish: "Vinyl" },
    { id: "fabric", name: "Fabric Banner", description: "Wrinkle-resistant polyester", priceModifier: "+$10", finish: "Fabric" },
    { id: "mesh", name: "Mesh Banner", description: "Wind-resistant mesh vinyl", priceModifier: "+$5", finish: "Mesh" },
    { id: "canvas", name: "Canvas Print", description: "Premium artist canvas", priceModifier: "+$15", finish: "Canvas" },
  ],
  stickers: [
    { id: "vinyl-gloss", name: "Glossy Vinyl", description: "Waterproof glossy vinyl", priceModifier: "+$0", finish: "Glossy" },
    { id: "vinyl-matte", name: "Matte Vinyl", description: "Waterproof matte vinyl", priceModifier: "+$1", finish: "Matte" },
    { id: "paper", name: "Paper Stickers", description: "Standard paper with adhesive", priceModifier: "-$2", finish: "Paper" },
    { id: "holographic", name: "Holographic", description: "Eye-catching holographic finish", priceModifier: "+$5", finish: "Holographic" },
    { id: "clear", name: "Clear Vinyl", description: "Transparent vinyl stickers", priceModifier: "+$3", finish: "Clear" },
  ],
  invitations: [
    { id: "cotton-inv", name: "Cotton Rag", description: "600gsm premium cotton", priceModifier: "+$0", finish: "Cotton" },
    { id: "pearl", name: "Pearlescent", description: "300gsm shimmer pearlescent", priceModifier: "+$4", finish: "Shimmer" },
    { id: "vellum", name: "Vellum Overlay", description: "Translucent vellum paper", priceModifier: "+$6", finish: "Translucent" },
    { id: "handmade", name: "Handmade Paper", description: "Artisan deckle-edge paper", priceModifier: "+$10", finish: "Artisan" },
  ],
  packaging: [
    { id: "corrugated", name: "Corrugated Board", description: "E-flute corrugated cardboard", priceModifier: "+$0", finish: "Standard" },
    { id: "rigid", name: "Rigid Board", description: "2mm rigid chipboard", priceModifier: "+$8", finish: "Rigid" },
    { id: "kraft-box", name: "Kraft Board", description: "Recycled kraft cardboard", priceModifier: "+$3", finish: "Natural" },
    { id: "magnetic", name: "Magnetic Closure", description: "Luxury magnetic box board", priceModifier: "+$15", finish: "Luxury" },
  ],
}

export const quantityOptionsByProduct: Record<string, QuantityOption[]> = {
  "business-cards": [
    { quantity: 100, price: 24.99 },
    { quantity: 250, price: 49.99 },
    { quantity: 500, price: 89.99 },
    { quantity: 1000, price: 149.99 },
  ],
  flyers: [
    { quantity: 100, price: 19.99 },
    { quantity: 250, price: 39.99 },
    { quantity: 500, price: 69.99 },
    { quantity: 1000, price: 119.99 },
  ],
  banners: [
    { quantity: 1, price: 39.99 },
    { quantity: 3, price: 99.99 },
    { quantity: 5, price: 159.99 },
    { quantity: 10, price: 289.99 },
  ],
  stickers: [
    { quantity: 50, price: 14.99 },
    { quantity: 100, price: 24.99 },
    { quantity: 250, price: 49.99 },
    { quantity: 500, price: 84.99 },
  ],
  invitations: [
    { quantity: 50, price: 29.99 },
    { quantity: 100, price: 49.99 },
    { quantity: 200, price: 89.99 },
    { quantity: 500, price: 199.99 },
  ],
  packaging: [
    { quantity: 25, price: 49.99 },
    { quantity: 50, price: 89.99 },
    { quantity: 100, price: 159.99 },
    { quantity: 250, price: 349.99 },
  ],
}

interface MaterialSelectorProps {
  productId: string
  selectedMaterial: Material | null
  onSelectMaterial: (material: Material) => void
  selectedQuantityOption: QuantityOption | null
  onSelectQuantityOption: (option: QuantityOption | null) => void
  customQuantity: string
  onCustomQuantityChange: (value: string) => void
  isCustomQuantity: boolean
  onToggleCustomQuantity: (isCustom: boolean) => void
}

function MaterialInfoPopup({ material }: { material: Material }) {
  const { t } = useLanguage()
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
          <Info className="h-3 w-3" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" align="end" side="top">
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">{material.name}</h4>
          
          {material.image && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
              <img 
                src={material.image} 
                alt={material.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              {!material.image && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Info className="h-8 w-8" />
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Description:</p>
            <p className="text-sm text-muted-foreground">
              {material.id === 'matte-350' && t.materials.matteCardstockDetailed}
              {material.id === 'glossy-350' && t.materials.glossyCardstockDetailed}
              {material.id === 'linen' && t.materials.linenTextureDetailed}
              {material.id === 'kraft' && t.materials.kraftPaperDetailed}
              {!['matte-350', 'glossy-350', 'linen', 'kraft'].includes(material.id) && (material.detailedDescription || material.description)}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Finish: {material.finish}</span>
            <span className="font-medium text-primary">{material.priceModifier}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function MaterialSelector({
  productId,
  selectedMaterial,
  onSelectMaterial,
  selectedQuantityOption,
  onSelectQuantityOption,
  customQuantity,
  onCustomQuantityChange,
  isCustomQuantity,
  onToggleCustomQuantity,
}: MaterialSelectorProps) {
  const { t } = useLanguage()
  const materials = materialsByProduct[productId] || materialsByProduct["business-cards"]
  const quantityOptions = quantityOptionsByProduct[productId] || quantityOptionsByProduct["business-cards"]

  return (
    <div className="flex flex-col gap-8">
      {/* Material selection */}
      <div>
        <h3 className="mb-1 font-serif text-xl text-foreground">{t.materials.title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.materials.subtitle}</p>

        <div className="flex flex-col gap-3">
          {materials.map((material) => (
            <button
              key={material.id}
              onClick={() => onSelectMaterial(material)}
              className={cn(
                "relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                selectedMaterial?.id === material.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                {selectedMaterial?.id === material.id ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <span>{material.finish.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{material.name}</span>
                  <span className="text-xs text-primary">{material.priceModifier}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {material.id === 'matte-350' && t.materials.matteCardstock}
                  {material.id === 'glossy-350' && t.materials.glossyCardstock}
                  {material.id === 'linen' && t.materials.linenTexture}
                  {material.id === 'kraft' && t.materials.kraftPaper}
                  {!['matte-350', 'glossy-350', 'linen', 'kraft'].includes(material.id) && material.description}
                </span>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <MaterialInfoPopup material={material} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity selection */}
      <div>
        <h3 className="mb-1 font-serif text-xl text-foreground">
          {t.quantitySelector?.title || "Select Quantity"}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {t.quantitySelector?.subtitle || "Choose a quantity package or enter your own."}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {quantityOptions.map((option) => (
            <button
              key={option.quantity}
              onClick={() => {
                onToggleCustomQuantity(false)
                onSelectQuantityOption(option)
              }}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-4 transition-all duration-200",
                !isCustomQuantity && selectedQuantityOption?.quantity === option.quantity
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <span className="text-2xl font-bold text-foreground">{option.quantity.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">
                {t.quantitySelector?.pieces || "pieces"}
              </span>
              <span className="mt-1 text-sm font-semibold text-primary">${option.price.toFixed(2)}</span>
              {!isCustomQuantity && selectedQuantityOption?.quantity === option.quantity && (
                <Check className="mt-1 h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Custom quantity option */}
        <div className="mt-3">
          <button
            onClick={() => {
              onToggleCustomQuantity(true)
              onSelectQuantityOption(null)
            }}
            className={cn(
              "flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200",
              isCustomQuantity
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                isCustomQuantity ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {isCustomQuantity ? <Check className="h-5 w-5" /> : "#"}
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  {t.quantitySelector?.customLabel || "Custom Quantity"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {t.quantitySelector?.customDescription || "Need a different amount? Enter your desired quantity."}
                </p>
              </div>
            </div>

            {isCustomQuantity && (
              <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                <Input
                  type="number"
                  min="1"
                  placeholder={t.quantitySelector?.customPlaceholder || "Enter quantity..."}
                  value={customQuantity}
                  onChange={(e) => onCustomQuantityChange(e.target.value)}
                  className="h-10"
                  autoFocus
                />
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                    {t.quantitySelector?.customNotice ||
                      "For custom quantities, our team will review your order and contact you with a personalized quote and estimated delivery time."}
                  </p>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
