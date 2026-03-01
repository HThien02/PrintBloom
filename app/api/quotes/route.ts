import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid: name, email, items (non-empty array)" },
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
