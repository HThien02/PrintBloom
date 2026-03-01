import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const seedProducts = [
  {
    name: "Premium Business Cards",
    category: "business-cards",
    image: "/images/business-cards.jpg",
    price: 24.99,
    stock: 500,
    status: "active",
    popular: true,
    quantityTiers: [
      { quantity: 100, price: 24.99 },
      { quantity: 250, price: 49.99 },
      { quantity: 500, price: 89.99 },
      { quantity: 1000, price: 149.99 },
    ],
  },
  {
    name: "Standard Flyers",
    category: "flyers",
    image: "/images/flyers.jpg",
    price: 19.99,
    stock: 300,
    status: "active",
    popular: false,
    quantityTiers: [
      { quantity: 100, price: 19.99 },
      { quantity: 250, price: 39.99 },
      { quantity: 500, price: 69.99 },
      { quantity: 1000, price: 119.99 },
    ],
  },
  {
    name: "Vinyl Banners",
    category: "banners",
    image: "/images/banners.jpg",
    price: 39.99,
    stock: 120,
    status: "active",
    popular: false,
    quantityTiers: [
      { quantity: 1, price: 39.99 },
      { quantity: 3, price: 99.99 },
      { quantity: 5, price: 159.99 },
      { quantity: 10, price: 289.99 },
    ],
  },
  {
    name: "Die-Cut Stickers",
    category: "stickers",
    image: "/images/stickers.jpg",
    price: 14.99,
    stock: 800,
    status: "active",
    popular: true,
    quantityTiers: [
      { quantity: 50, price: 14.99 },
      { quantity: 100, price: 24.99 },
      { quantity: 250, price: 49.99 },
      { quantity: 500, price: 84.99 },
    ],
  },
  {
    name: "Wedding Invitations",
    category: "invitations",
    image: "/images/invitations.jpg",
    price: 29.99,
    stock: 200,
    status: "active",
    popular: false,
    quantityTiers: [
      { quantity: 50, price: 29.99 },
      { quantity: 100, price: 49.99 },
      { quantity: 200, price: 89.99 },
      { quantity: 500, price: 199.99 },
    ],
  },
  {
    name: "Custom Gift Boxes",
    category: "packaging",
    image: "/images/packaging.jpg",
    price: 49.99,
    stock: 80,
    status: "active",
    popular: false,
    quantityTiers: [
      { quantity: 25, price: 49.99 },
      { quantity: 50, price: 89.99 },
      { quantity: 100, price: 159.99 },
      { quantity: 250, price: 349.99 },
    ],
  },
]

async function main() {
  console.log("Seeding database...")
  const existing = await prisma.product.count()
  if (existing > 0) {
    console.log("Products already exist, skipping seed.")
    return
  }
  for (const p of seedProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        image: p.image,
        price: p.price,
        stock: p.stock,
        status: p.status,
        popular: p.popular,
        quantityTiers: p.quantityTiers,
      },
    })
  }
  console.log("Seed done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
