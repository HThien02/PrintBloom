import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { translations } from "@/lib/translations"

export async function GET() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(quotes)
  } catch (e) {
    console.error("GET /api/quotes", e)
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get language from request headers or default to English
    const lang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    const messages = translations[lang as keyof typeof translations]?.validation || translations.en.validation
    
    const { name, email, phone, notes, items } = body as {
      name: string
      email: string
      phone?: string
      notes?: string
      items: Array<{
        productId?: string
        productName: string
        materialId?: string | null
        materialName?: string | null
        quantity: number
      }>
    }

    // Field validation
    const errors: Record<string, string> = {}

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.name = messages.quoteNameRequired
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = messages.quoteEmailRequired
    } else if (!email.includes("@") || !email.includes(".")) {
      errors.email = messages.quoteEmailInvalid
    }

    if (!Array.isArray(items) || items.length === 0) {
      errors.items = messages.apiItemsRequired
    } else {
      // Validate each item
      items.forEach((item, index) => {
        if (!item.productName || typeof item.productName !== "string" || !item.productName.trim()) {
          errors[`items.${index}.productName`] = messages.apiProductNameRequired
        }
        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          errors[`items.${index}.quantity`] = messages.apiValidQuantityRequired
        }
      })
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { errors },
        { status: 400 }
      )
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        notes: notes ?? null,
        items,
      },
    })
    return NextResponse.json(quote)
  } catch (e) {
    console.error("POST /api/quotes", e)
    return NextResponse.json({ error: "Failed to create quote request" }, { status: 500 })
  }
}
