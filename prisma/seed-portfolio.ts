import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const portfolioItems = [
  {
    title: "Luxury Gold Foil Business Cards",
    description:
      "Premium business cards with gold foil stamping on 400gsm cotton paper for a high-end real estate firm.",
    category: "business-cards",
    image: "/images/portfolio-business-cards.jpg",
    client: "Prestige Realty",
    date: "2025-12",
  },
  {
    title: "Tech Conference Brochures",
    description:
      "Tri-fold brochures with matte lamination for an annual technology summit, featuring modern typography.",
    category: "flyers",
    image: "/images/portfolio-brochures.jpg",
    client: "TechVault Summit",
    date: "2025-11",
  },
  {
    title: "Artisan Coffee Packaging",
    description:
      "Custom kraft packaging with spot UV printing for a specialty coffee brand's seasonal collection.",
    category: "packaging",
    image: "/images/portfolio-packaging.jpg",
    client: "Bean & Bloom Coffee",
    date: "2025-10",
  },
  {
    title: "Festival Event Banners",
    description:
      "Large format vinyl banners with vibrant full-color printing for an outdoor music festival.",
    category: "banners",
    image: "/images/portfolio-banners.jpg",
    client: "SoundWave Festival",
    date: "2025-09",
  },
  {
    title: "Craft Brand Sticker Collection",
    description:
      "Die-cut holographic stickers with waterproof coating for a handmade cosmetics brand.",
    category: "stickers",
    image: "/images/portfolio-stickers.jpg",
    client: "Glow Naturals",
    date: "2025-08",
  },
  {
    title: "Garden Wedding Invitations",
    description:
      "Letterpress invitations on handmade paper with floral illustrations and envelope liners.",
    category: "invitations",
    image: "/images/portfolio-invitations.jpg",
    client: "Private Client",
    date: "2025-07",
  },
  {
    title: "Minimalist Startup Cards",
    description:
      "Clean, embossed business cards on recycled paper stock for an eco-conscious tech startup.",
    category: "business-cards",
    image: "/images/portfolio-business-cards.jpg",
    client: "GreenByte Labs",
    date: "2025-06",
  },
  {
    title: "Restaurant Menu Flyers",
    description:
      "A4 menu flyers with soft-touch lamination and spot gloss for a new Italian restaurant launch.",
    category: "flyers",
    image: "/images/portfolio-brochures.jpg",
    client: "Trattoria Bella",
    date: "2025-05",
  },
  {
    title: "Retail Store Posters",
    description:
      "Large poster prints on premium photo paper for seasonal window displays at a fashion retailer.",
    category: "banners",
    image: "/images/portfolio-banners.jpg",
    client: "Thread & Stitch",
    date: "2025-04",
  },
  {
    title: "Product Label Set",
    description:
      "Custom adhesive labels with metallic ink printing for an organic skincare product line.",
    category: "stickers",
    image: "/images/portfolio-stickers.jpg",
    client: "Pure Botanics",
    date: "2025-03",
  },
  {
    title: "Birthday Party Invitations",
    description:
      "Playful illustrated invitations with rounded corners and matching envelopes for a children's party.",
    category: "invitations",
    image: "/images/portfolio-invitations.jpg",
    client: "Private Client",
    date: "2025-02",
  },
  {
    title: "Premium Gift Boxes",
    description:
      "Rigid gift boxes with magnetic closure and full-color printing for a luxury chocolate brand.",
    category: "packaging",
    image: "/images/portfolio-packaging.jpg",
    client: "Velvet Cocoa",
    date: "2025-01",
  },
  {
    title: "Corporate Event Flyers",
    description:
      "Professional bi-fold brochures for a corporate annual meeting with custom die-cut accents.",
    category: "flyers",
    image: "/images/flyers.jpg",
    client: "Global Tech Inc",
    date: "2024-12",
  },
  {
    title: "Vinyl Window Decals",
    description:
      "Custom vinyl decals with contour cutting for retail store front windows and glass doors.",
    category: "stickers",
    image: "/images/stickers.jpg",
    client: "Urban Fashion House",
    date: "2024-11",
  },
  {
    title: "Restaurant Business Cards",
    description:
      "Matte finish business cards with spot UV on premium cardstock for a fine dining restaurant.",
    category: "business-cards",
    image: "/images/business-cards.jpg",
    client: "Le Petit Bistro",
    date: "2024-10",
  },
  {
    title: "Trade Show Banners",
    description:
      "Retractable banner stands with high-resolution printing for trade show booth presentations.",
    category: "banners",
    image: "/images/banners.jpg",
    client: "Innovate 2024",
    date: "2024-09",
  },
  {
    title: "Luxury Brand Packaging",
    description:
      "Premium rigid box packaging with foil stamping and custom inserts for jewelry brand.",
    category: "packaging",
    image: "/images/packaging.jpg",
    client: "Luxe Jewel Co",
    date: "2024-08",
  },
  {
    title: "Corporate Invitations",
    description:
      "Elegant corporate event invitations with embossed logo and metallic envelope liners.",
    category: "invitations",
    image: "/images/invitations.jpg",
    client: "Premier Events",
    date: "2024-07",
  },
];

async function main() {
  console.log("Seeding Portfolio data...");

  // Clear existing portfolio items
  await prisma.portfolio.deleteMany();
  console.log("Cleared existing portfolio items");

  // Seed English portfolio items
  for (const item of portfolioItems) {
    await prisma.portfolio.create({
      data: {
        ...item,
      },
    });
  }
  console.log(`Seeded ${portfolioItems.length} portfolio items`);

  console.log("Portfolio seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
