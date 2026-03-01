import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    })
    if (!product) {
      const byCategory = await prisma.product.findFirst({
        where: { category: id, status: "active" },
      })
      if (!byCategory) return NextResponse.json({ error: "Product not found" }, { status: 404 })
      return NextResponse.json({
        ...byCategory,
        price: Number(byCategory.price),
        quantityTiers: byCategory.quantityTiers as Array<{ quantity: number; price: number }>,
      })
    }
    return NextResponse.json({
      ...product,
      price: Number(product.price),
      quantityTiers: product.quantityTiers as Array<{ quantity: number; price: number }>,
    })
  } catch (e) {
    console.error("GET /api/products/[id]", e)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, category, image, price, stock, status, popular, quantityTiers } = body as {
      name?: string
      category?: string
      image?: string
      price?: number
      stock?: number
      status?: string
      popular?: boolean
      quantityTiers?: Array<{ quantity: number; price: number }>
    }
    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (category !== undefined) data.category = category
    if (image !== undefined) data.image = image
    if (typeof price === "number") data.price = new Decimal(price)
    if (typeof stock === "number") data.stock = stock
    if (status !== undefined) data.status = status
    if (popular !== undefined) data.popular = popular
    if (quantityTiers !== undefined) data.quantityTiers = quantityTiers

    const product = await prisma.product.update({
      where: { id },
      data,
    })
    return NextResponse.json({
      ...product,
      price: Number(product.price),
      quantityTiers: product.quantityTiers as Array<{ quantity: number; price: number }>,
    })
  } catch (e) {
    console.error("PATCH /api/products/[id]", e)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
