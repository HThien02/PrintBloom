import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

// export async function POST(request: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify user exists in database
//     const userExists = await prisma.user.findUnique({
//       where: { id: session.user.id },
//     });

//     if (!userExists) {
//       console.error("User not found in database:", session.user.id);
//       return NextResponse.json(
//         { error: "User not found. Please login again." },
//         { status: 401 },
//       );
//     }

//     const body = await request.json();
//     console.log("--- DEBUG PAYLOAD ---", body);

//     const {
//       productId,
//       productName,
//       materialId,
//       materialName,
//       designOption,
//       quantity,
//       unitPrice,
//       isCustomQuantity,
//     } = body;

//     // Validate required fields
//     if (!productId || !productName || !quantity || !unitPrice) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     // 1. Kiểm tra User & tạo Cart (Dùng upsert để tối ưu)
//     const cart = await prisma.cart.upsert({
//       where: { userId: session.user.id },
//       update: {},
//       create: { userId: session.user.id },
//     });

//     // 2. Thêm Item vào cart
//     const newCartItem = await prisma.cartItem.create({
//       data: {
//         cartId: cart.id,
//         productId,
//         productName,
//         materialId,
//         materialName,
//         designOption,
//         quantity: Number(quantity), // Đảm bảo là kiểu số
//         unitPrice: Number(unitPrice), // Đảm bảo là kiểu số
//         isCustomQuantity: isCustomQuantity || false,
//       },
//     });

//     const allItems = await prisma.cartItem.findMany({
//       where: { cartId: cart.id },
//     });

//     return NextResponse.json({ items: allItems });
//   } catch (error: any) {
//     // ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT
//     console.error("--- LỖI SERVER THỰC TẾ ---");
//     console.error(error);

//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, productName, quantity, unitPrice } = body;

    // Lúc này userId đã KHỚP 100% với bảng User trong Database
    const cart = await prisma.cart.upsert({
      where: { userId: userId },
      update: {},
      create: { userId: userId },
    });

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        productName,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        materialId: body.materialId || null,
        materialName: body.materialName || null,
        designOption: body.designOption || null,
        isCustomQuantity: body.isCustomQuantity || false,
      },
    });

    return NextResponse.json({ success: true, item: cartItem });
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to cart" },
      { status: 500 },
    );
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
