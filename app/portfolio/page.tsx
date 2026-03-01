"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { categories, getPortfolioItems } from "@/lib/portfolio-data"
import { useLanguage } from "@/lib/language-context"

function PortfolioContent() {
  const { t, locale } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("all")
  const portfolioItems = getPortfolioItems(locale)

  const filtered =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.portfolio.backToHome}
            </Link>

            <div className="text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">{t.portfolio.badge}</span>
              <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t.portfolio.title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {t.portfolio.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Filters + Gallery */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            {/* Category Filters */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border hover:text-foreground"
                  }`}
                >
                  {t.portfolio.categories[cat.id as keyof typeof t.portfolio.categories] ?? cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {t.portfolio.showing} {filtered.length} {filtered.length === 1 ? t.portfolio.project : t.portfolio.projects}
            </p>

            {/* Gallery Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const catLabel = t.portfolio.categories[item.category as keyof typeof t.portfolio.categories] ?? item.category
                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Badge className="absolute left-3 top-3 z-10">{catLabel}</Badge>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t.portfolio.client} {item.client}</span>
                        <span>{new Date(item.date).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", { month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-serif text-xl text-foreground">{t.portfolio.noProjects}</p>
                <p className="mt-2 text-muted-foreground">{t.portfolio.tryDifferent}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <PortfolioContent />
      </CartProvider>
    </LanguageProvider>
  )
}
