import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // optional filter: active | draft | archived
    const forCatalog = searchParams.get("catalog") === "true" // frontend catalog: only active, minimal fields

    const where = status ? { status } : {}
    const orders = forCatalog ? { createdAt: "desc" as const } : { createdAt: "desc" as const }

    if (forCatalog) {
      const products = await prisma.product.findMany({
        where: { status: "active" },
        orderBy: [{ popular: "desc" }, { createdAt: "asc" }],
      })
      const byCategory = new Map<string, { name: string; image: string; price: number; popular: boolean }>()
      for (const p of products) {
        if (!byCategory.has(p.category)) {
          byCategory.set(p.category, {
            name: p.name,
            image: p.image,
            price: Number(p.price),
            popular: p.popular,
          })
        }
      }
      const list = Array.from(byCategory.entries()).map(([category, v]) => ({
        id: category,
        name: v.name,
        image: v.image,
        startingPrice: `$${v.price.toFixed(2)}`,
        popular: v.popular,
        category,
      }))
      return NextResponse.json(list)
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: orders,
    })
    const list = products.map((p) => ({
      ...p,
      price: Number(p.price),
      quantityTiers: p.quantityTiers as Array<{ quantity: number; price: number }>,
    }))
    return NextResponse.json(list)
  } catch (e) {
    console.error("GET /api/products", e)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, image, price, stock, status, popular, quantityTiers } = body as {
      name: string
      category: string
      image: string
      price: number
      stock?: number
      status?: string
      popular?: boolean
      quantityTiers: Array<{ quantity: number; price: number }>
    }
    if (!name || !category || !image || typeof price !== "number" || !Array.isArray(quantityTiers)) {
      return NextResponse.json(
        { error: "Missing or invalid: name, category, image, price, quantityTiers" },
        { status: 400 }
      )
    }
    const product = await prisma.product.create({
      data: {
        name,
        category,
        image,
        price: new Decimal(price),
        stock: typeof stock === "number" ? stock : 0,
        status: status ?? "active",
        popular: popular ?? false,
        quantityTiers: quantityTiers ?? [],
      },
    })
    return NextResponse.json({
      ...product,
      price: Number(product.price),
      quantityTiers: product.quantityTiers as Array<{ quantity: number; price: number }>,
    })
  } catch (e) {
    console.error("POST /api/products", e)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
