"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export interface Product {
  id: string
  image: string
  startingPrice: string
  popular?: boolean
}

const fallbackProducts: Product[] = [
  { id: "business-cards", image: "/images/business-cards.jpg", startingPrice: "$24.99", popular: true },
  { id: "flyers", image: "/images/flyers.jpg", startingPrice: "$19.99" },
  { id: "banners", image: "/images/banners.jpg", startingPrice: "$39.99" },
  { id: "stickers", image: "/images/stickers.jpg", startingPrice: "$14.99", popular: true },
  { id: "invitations", image: "/images/invitations.jpg", startingPrice: "$29.99" },
  { id: "packaging", image: "/images/packaging.jpg", startingPrice: "$49.99" },
]

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void
}

export function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?catalog=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Product[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="products" className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-medium text-primary">{t.catalog.label}</span>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t.catalog.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t.catalog.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const productText = t.catalog.products[product.id as keyof typeof t.catalog.products]

            return (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => onSelectProduct(product)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.popular && (
                      <Badge className="absolute left-3 top-3 z-10">{t.catalog.popular}</Badge>
                    )}
                    <Image
                      src={product.image}
                      alt={productText.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-foreground">{productText.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{productText.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {t.catalog.from} {product.startingPrice}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                        {t.catalog.customize} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        )}
      </div>
    </section>
  )
}
