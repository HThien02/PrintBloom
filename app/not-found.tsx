import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <span className="font-serif text-3xl text-primary">P</span>
        </div>

        <h1 className="font-serif text-8xl tracking-tight text-foreground md:text-9xl">404</h1>

        <h2 className="mt-4 font-serif text-2xl text-foreground md:text-3xl">
          Page not found
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground leading-relaxed">
          {"The page you're looking for doesn't exist or has been moved. Let's get you back to familiar territory."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mt-16 flex gap-6 text-sm text-muted-foreground">
          <Link href="/about" className="transition-colors hover:text-foreground">About</Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground">Portfolio</Link>
          <Link href="/feedback" className="transition-colors hover:text-foreground">Feedback</Link>
        </div>
      </div>
    </div>
  )
}
