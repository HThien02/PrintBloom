import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}
async function getFullCart(userId: string) {
  return await prisma.cart.findUnique({
    where: { userId },
    include: { items: { orderBy: { createdAt: 'asc' } } },
  });
}
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { productId, productName, materialId, materialName, designOption, quantity, unitPrice, isCustomQuantity } = body;

    // Đảm bảo có Cart cho User
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // TÌM SẢN PHẨM TRÙNG (Cùng ID, Material và Design Option)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        materialId: materialId || null,
        designOption: designOption || null,
      }
    });

    if (existingItem) {
      // NẾU CÓ: Cập nhật cộng dồn số lượng
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + Number(quantity) }
      });
    } else {
      // NẾU CHƯA: Tạo mới
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          productName,
          materialId,
          materialName,
          designOption,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          isCustomQuantity: !!isCustomQuantity,
        },
      });
    }

    const updatedCart = await getFullCart(userId);
    return NextResponse.json({ items: updatedCart?.items || [] });
  } catch (error) {
    console.error("API_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Update cart item
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    // Get all cart items
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (itemId) {
      // Delete specific item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // Get all cart items
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: "Failed to delete from cart" },
      { status: 500 },
    );
  }
}
