"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Printer, Palette, Truck, Award, Users, Clock } from "lucide-react"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const values = [
  {
    icon: Award,
    title: "Quality First",
    description: "We use only premium materials and state-of-the-art printing technology to ensure every product meets the highest standards.",
  },
  {
    icon: Palette,
    title: "Creative Excellence",
    description: "Our team of skilled designers helps bring your vision to life with creativity and attention to detail.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "We understand deadlines matter. Most orders are printed and shipped within 24 hours.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Your satisfaction is our priority. We work closely with you to deliver results that exceed expectations.",
  },
]

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "50K+", label: "Products Delivered" },
  { value: "5+", label: "Years Experience" },
  { value: "99%", label: "Satisfaction Rate" },
]

const timeline = [
  { year: "2021", title: "The Beginning", description: "PrintBloom was founded with a simple mission: make premium printing accessible to everyone." },
  { year: "2022", title: "Growing Team", description: "Expanded our team of designers and invested in cutting-edge printing equipment." },
  { year: "2023", title: "Online Platform", description: "Launched our online customization platform, making ordering easier than ever." },
  { year: "2024", title: "National Reach", description: "Extended delivery services nationwide with express shipping options." },
  { year: "2025", title: "Design Studio", description: "Opened our in-house design studio offering professional design services." },
]

function AboutContent() {
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
              Back to Home
            </Link>

            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <span className="mb-2 inline-block text-sm font-medium text-primary">About PrintBloom</span>
                <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
                  Bringing your creative vision to life through print
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  We are a team of passionate printers, designers, and craftspeople dedicated to
                  transforming your ideas into beautiful, tangible products. From business cards to
                  large-format banners, every piece we create is a reflection of our commitment to quality.
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
                  alt="PrintBloom printing workshop"
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
              <span className="mb-2 inline-block text-sm font-medium text-primary">Our Mission</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                Making premium printing accessible to everyone
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                We believe every brand, big or small, deserves access to high-quality print materials.
                Our mission is to combine cutting-edge technology with traditional craftsmanship to
                deliver prints that make your brand bloom.
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
              <span className="mb-2 inline-block text-sm font-medium text-primary">Our Values</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">What drives us every day</h2>
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
              <span className="mb-2 inline-block text-sm font-medium text-primary">Our Journey</span>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">How we got here</h2>
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
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">Ready to start your project?</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Browse our products and let us help bring your vision to life with premium printing.
              </p>
              <Link
                href="/#products"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Products
              </Link>
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
