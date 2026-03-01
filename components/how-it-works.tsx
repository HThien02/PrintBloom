"use client"

import { Package, Palette, Upload, Truck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const stepIcons = [Package, Palette, Upload, Truck]

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section id="how-it-works" className="bg-background px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-medium text-primary">{t.steps.label}</span>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t.steps.title}</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.items.map((step, index) => {
            const Icon = stepIcons[index]
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.steps.stepLabel} {index + 1}
                </span>
                <h3 className="mb-2 font-serif text-lg text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
