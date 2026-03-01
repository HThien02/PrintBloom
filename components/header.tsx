"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLanguage()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const navLinks = [
    { label: t.nav.products, href: "#products" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.about, href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Feedback", href: "/feedback" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            P
          </div>
          <span className="font-serif text-xl text-foreground">PrintBloom</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t.nav.login}
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t.nav.cartLabel}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <Button asChild size="sm" className="hidden rounded-full md:flex">
            <a href="#products">{t.nav.getStarted}</a>
          </Button>

          <button
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.nav.toggleMenu}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              {t.nav.login}
            </Link>
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              {t.nav.cart} {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Button asChild size="sm" className="mt-2 rounded-full">
              <a href="#products">{t.nav.getStarted}</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
