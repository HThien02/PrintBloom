"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  const stats = [
    { value: "10K+", label: t.hero.stats.customers },
    { value: "50+", label: t.hero.stats.papers },
    { value: "24hr", label: t.hero.stats.turnaround },
    { value: "100%", label: t.hero.stats.satisfaction },
  ]

  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            {t.hero.badge}
          </div>

          <h1 className="max-w-3xl text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-6xl md:leading-tight">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.hero.browseProducts}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.hero.howItWorks} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="font-serif text-3xl text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
