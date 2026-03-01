import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

const orderStatuses = ["pending", "processing", "printed", "shipped", "delivered", "cancelled"] as const

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    })
    const serialized = orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      shippingCost: Number(o.shippingCost),
      tax: Number(o.tax),
      total: Number(o.total),
      items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }))
    return NextResponse.json(serialized)
  } catch (e) {
    console.error("GET /api/orders", e)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      apartment,
      city,
      state,
      zip,
      shippingMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      items,
    } = body as {
      email: string
      firstName: string
      lastName: string
      phone?: string
      address: string
      apartment?: string
      city: string
      state: string
      zip: string
      shippingMethod: string
      subtotal: number
      shippingCost: number
      tax: number
      total: number
      items: Array<{
        productId: string
        productName: string
        materialId?: string | null
        materialName?: string | null
        designOption?: string | null
        quantity: number
        unitPrice: number
      }>
    }

    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !shippingMethod ||
      typeof subtotal !== "number" ||
      typeof shippingCost !== "number" ||
      typeof tax !== "number" ||
      typeof total !== "number" ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields: email, firstName, lastName, address, city, state, zip, shippingMethod, subtotal, shippingCost, tax, total, items" },
        { status: 400 }
      )
    }

    const itemCreates = await Promise.all(
      items.map(async (item) => {
        let productId: string | null = null
        if (item.productId) {
          const p = await prisma.product.findFirst({
            where: { category: item.productId, status: "active" },
          })
          if (p) productId = p.id
        }
        return {
          productId,
          productName: item.productName,
          materialId: item.materialId ?? null,
          materialName: item.materialName ?? null,
          designOption: item.designOption ?? null,
          quantity: item.quantity,
          unitPrice: new Decimal(item.unitPrice),
        }
      })
    )

    const order = await prisma.order.create({
      data: {
        email,
        firstName,
        lastName,
        phone: phone ?? null,
        address,
        apartment: apartment ?? null,
        city,
        state,
        zip,
        shippingMethod,
        subtotal: new Decimal(subtotal),
        shippingCost: new Decimal(shippingCost),
        tax: new Decimal(tax),
        total: new Decimal(total),
        items: { create: itemCreates },
      },
      include: { items: true },
    })

    const serialized = {
      ...order,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      tax: Number(order.tax),
      total: Number(order.total),
      items: order.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }
    return NextResponse.json(serialized)
  } catch (e) {
    console.error("POST /api/orders", e)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
