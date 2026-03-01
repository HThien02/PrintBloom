"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Star, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    rating: 5,
    text: "PrintBloom delivered our business cards in record time. The quality is outstanding and our clients always comment on them.",
  },
  {
    name: "Michael Torres",
    role: "Event Planner",
    rating: 5,
    text: "The wedding invitations were absolutely stunning. The paper quality and printing precision exceeded our expectations.",
  },
  {
    name: "Emily Park",
    role: "Small Business Owner",
    rating: 4,
    text: "Great packaging solutions for my brand. The design team was incredibly helpful in creating something unique for us.",
  },
  {
    name: "David Nguyen",
    role: "Graphic Designer",
    rating: 5,
    text: "As a designer, I'm very particular about print quality. PrintBloom nails it every time with accurate colors and sharp details.",
  },
  {
    name: "Lisa Rodriguez",
    role: "Restaurant Owner",
    rating: 5,
    text: "Our menus and promotional materials look fantastic. Fast turnaround and the online ordering process is so easy.",
  },
  {
    name: "James Kim",
    role: "Startup Founder",
    rating: 4,
    text: "From stickers to banners, PrintBloom has been our go-to printing partner. Reliable quality and great customer service.",
  },
]

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
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

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
              Back to Home
            </Link>

            <div className="text-center">
              <span className="mb-2 inline-block text-sm font-medium text-primary">Feedback</span>
              <h1 className="font-serif text-4xl text-foreground md:text-5xl">We value your opinion</h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Your feedback helps us improve and deliver even better products and services. Share your experience with us.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback Form + Testimonials */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <div>
                <h2 className="mb-6 font-serif text-2xl text-foreground">Share Your Feedback</h2>

                {submitted ? (
                  <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">Thank you!</h3>
                    <p className="mt-2 text-muted-foreground">
                      Your feedback has been submitted successfully. We appreciate you taking the time to share your thoughts.
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
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:p-8">
                    <div className="flex flex-col gap-2">
                      <Label>Overall Rating</Label>
                      <RatingStars rating={rating} interactive onRate={setRating} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="feedback-name">Name</Label>
                        <Input
                          id="feedback-name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="feedback-email">Email</Label>
                        <Input
                          id="feedback-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="feedback-category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-quality">Product Quality</SelectItem>
                          <SelectItem value="delivery">Delivery & Shipping</SelectItem>
                          <SelectItem value="design-service">Design Service</SelectItem>
                          <SelectItem value="customer-support">Customer Support</SelectItem>
                          <SelectItem value="website">Website Experience</SelectItem>
                          <SelectItem value="pricing">Pricing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="feedback-message">Your Feedback</Label>
                      <Textarea
                        id="feedback-message"
                        placeholder="Tell us about your experience..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="rounded-full" disabled={rating === 0}>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </form>
                )}
              </div>

              {/* Testimonials */}
              <div>
                <h2 className="mb-6 font-serif text-2xl text-foreground">What Our Customers Say</h2>
                <div className="flex flex-col gap-4">
                  {testimonials.map((t) => (
                    <div key={t.name} className="rounded-xl border border-border bg-card p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                        <RatingStars rating={t.rating} />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
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
