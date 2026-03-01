"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Star, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const testimonialRatings = [5, 5, 4, 5, 5, 4]

function RatingStars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || rating)
                ? "fill-primary text-primary"
                : "fill-none text-border"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function FeedbackContent() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")

  const testimonials = t.feedback.testimonials.map((item, i) => ({ ...item, rating: testimonialRatings[i] ?? 5 }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.feedback.backToHome}
            </Link>

            <div className="text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">{t.feedback.badge}</span>
              <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t.feedback.title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {t.feedback.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 font-serif text-2xl text-foreground">{t.feedback.shareFeedback}</h2>

                {submitted ? (
                  <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">{t.feedback.thankYou}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {t.feedback.thankYouMessage}
                    </p>
                    <Button
                      className="mt-6 rounded-full"
                      onClick={() => {
                        setSubmitted(false)
                        setRating(0)
                        setName("")
                        setEmail("")
                        setCategory("")
                        setMessage("")
                      }}
                    >
                      {t.feedback.submitAnother}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:p-8">
                    <div className="flex flex-col gap-2">
                      <Label>{t.feedback.overallRating}</Label>
                      <RatingStars rating={rating} interactive onRate={setRating} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="feedback-name">{t.feedback.name}</Label>
                        <Input
                          id="feedback-name"
                          placeholder={t.feedback.namePlaceholder}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="feedback-email">{t.feedback.email}</Label>
                        <Input
                          id="feedback-email"
                          type="email"
                          placeholder={t.checkout.emailPlaceholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="feedback-category">{t.feedback.category}</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t.feedback.categoryPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-quality">{t.feedback.categories.productQuality}</SelectItem>
                          <SelectItem value="delivery">{t.feedback.categories.delivery}</SelectItem>
                          <SelectItem value="design-service">{t.feedback.categories.designService}</SelectItem>
                          <SelectItem value="customer-support">{t.feedback.categories.customerSupport}</SelectItem>
                          <SelectItem value="website">{t.feedback.categories.website}</SelectItem>
                          <SelectItem value="pricing">{t.feedback.categories.pricing}</SelectItem>
                          <SelectItem value="other">{t.feedback.categories.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="feedback-message">{t.feedback.yourFeedback}</Label>
                      <Textarea
                        id="feedback-message"
                        placeholder={t.feedback.feedbackPlaceholder}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="rounded-full" disabled={rating === 0}>
                      <Send className="mr-2 h-4 w-4" />
                      {t.feedback.submitFeedback}
                    </Button>
                  </form>
                )}
              </div>

              <div>
                <h2 className="mb-6 font-serif text-2xl text-foreground">{t.feedback.customerSay}</h2>
                <div className="flex flex-col gap-4">
                  {testimonials.map((item) => (
                    <div key={item.name} className="rounded-xl border border-border bg-card p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.role}</p>
                        </div>
                        <RatingStars rating={item.rating} />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <FeedbackContent />
      </CartProvider>
    </LanguageProvider>
  )
}
