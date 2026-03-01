import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const allowedStatuses = ["pending", "processing", "printed", "shipped", "delivered", "cancelled"]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
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
    console.error("GET /api/orders/[id]", e)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { status } = body as { status?: string }
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${allowedStatuses.join(", ")}` },
        { status: 400 }
      )
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
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
    console.error("PATCH /api/orders/[id]", e)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
