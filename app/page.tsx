"use client"

import { useState, useEffect } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCatalog, type Product } from "@/components/product-catalog"
import { ProductCustomizer } from "@/components/product-customizer"
import { HowItWorks } from "@/components/how-it-works"
import { PortfolioSlider } from "@/components/portfolio-slider"
import { Footer } from "@/components/footer"

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleBack() {
    setSelectedProduct(null)
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            {selectedProduct ? (
              <ProductCustomizer product={selectedProduct} onBack={handleBack} />
            ) : (
              <>
                <HeroSection />
                <ProductCatalog onSelectProduct={handleSelectProduct} />
                <PortfolioSlider />
                <HowItWorks />
              </>
            )}
          </main>
          <Footer />
        </div>
        <Toaster />
      </CartProvider>
    </LanguageProvider>
  )
}
