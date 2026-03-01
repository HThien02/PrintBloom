"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { portfolioItems, categories } from "@/lib/portfolio-data"

const displayItems = portfolioItems.slice(0, 8)

export function PortfolioSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)

    // Auto-scroll right
    const interval = setInterval(() => {
      if (!el) return
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" })
      }
    }, 4000)

    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
      clearInterval(interval)
    }
  }, [])

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    })
  }

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="mb-2 inline-block text-sm font-medium text-primary">Our Work</span>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">Completed Products</h2>
            <p className="mt-2 text-muted-foreground">A selection of our recent printing projects.</p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayItems.map((item) => {
            const catLabel = categories.find((c) => c.id === item.category)?.label ?? item.category
            return (
              <div
                key={item.id}
                className="w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg md:w-[320px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Badge className="absolute left-3 top-3 z-10">{catLabel}</Badge>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base text-foreground line-clamp-1">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* View all link */}
        <div className="mt-6 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
