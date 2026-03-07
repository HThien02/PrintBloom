"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Printer, Award, Palette, Users, Clock } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const valueIcons = [Award, Palette, Clock, Users]

function AboutContent() {
  const { t } = useLanguage()
  const values = t.about.values.map((v, i) => ({ ...v, icon: valueIcons[i] }))
  const stats = t.about.stats
  const timeline = t.about.timeline

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.about.backToHome}
            </Link>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <span className="mb-2 inline-block text-sm font-medium text-primary">{t.about.badge}</span>
                <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
                  {t.about.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {t.about.intro}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="font-serif text-3xl text-foreground">{stat.value}</span>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/about-team.jpg"
                  alt="TPrint printing workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">{t.about.missionBadge}</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                {t.about.missionTitle}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {t.about.missionText}
              </p>
            </div>

            <div className="mt-16 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Printer className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">{t.about.valuesTitle}</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t.about.valuesSubtitle}</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg text-foreground">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">{t.about.journeyBadge}</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t.about.journeyTitle}</h2>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="relative border-l-2 border-border pl-8">
                {timeline.map((item, i) => (
                  <div key={item.year} className={`relative ${i < timeline.length - 1 ? "pb-10" : ""}`}>
                    <div className="absolute -left-[calc(2rem+5px)] flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.year}</span>
                    <h3 className="mt-1 font-serif text-lg text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-16 text-center">
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t.about.ctaTitle}</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                {t.about.ctaSubtitle}
              </p>
              <button
                onClick={() => {
                  window.location.href = "/#products";
                }}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.about.browseProducts}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AboutContent />
      </CartProvider>
    </LanguageProvider>
  )
}
