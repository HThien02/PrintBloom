export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image: string
  client: string
  date: string
}

export const categories = [
  { id: "all", label: "All" },
  { id: "business-cards", label: "Business Cards" },
  { id: "flyers", label: "Flyers & Brochures" },
  { id: "banners", label: "Banners & Posters" },
  { id: "stickers", label: "Stickers & Labels" },
  { id: "invitations", label: "Invitations" },
  { id: "packaging", label: "Custom Packaging" },
]

export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Luxury Gold Foil Business Cards",
    description: "Premium business cards with gold foil stamping on 400gsm cotton paper for a high-end real estate firm.",
    category: "business-cards",
    image: "/images/portfolio-business-cards.jpg",
    client: "Prestige Realty",
    date: "2025-12",
  },
  {
    id: "2",
    title: "Tech Conference Brochures",
    description: "Tri-fold brochures with matte lamination for an annual technology summit, featuring modern typography.",
    category: "flyers",
    image: "/images/portfolio-brochures.jpg",
    client: "TechVault Summit",
    date: "2025-11",
  },
  {
    id: "3",
    title: "Artisan Coffee Packaging",
    description: "Custom kraft packaging with spot UV printing for a specialty coffee brand's seasonal collection.",
    category: "packaging",
    image: "/images/portfolio-packaging.jpg",
    client: "Bean & Bloom Coffee",
    date: "2025-10",
  },
  {
    id: "4",
    title: "Festival Event Banners",
    description: "Large format vinyl banners with vibrant full-color printing for an outdoor music festival.",
    category: "banners",
    image: "/images/portfolio-banners.jpg",
    client: "SoundWave Festival",
    date: "2025-09",
  },
  {
    id: "5",
    title: "Craft Brand Sticker Collection",
    description: "Die-cut holographic stickers with waterproof coating for a handmade cosmetics brand.",
    category: "stickers",
    image: "/images/portfolio-stickers.jpg",
    client: "Glow Naturals",
    date: "2025-08",
  },
  {
    id: "6",
    title: "Garden Wedding Invitations",
    description: "Letterpress invitations on handmade paper with floral illustrations and envelope liners.",
    category: "invitations",
    image: "/images/portfolio-invitations.jpg",
    client: "Private Client",
    date: "2025-07",
  },
  {
    id: "7",
    title: "Minimalist Startup Cards",
    description: "Clean, embossed business cards on recycled paper stock for an eco-conscious tech startup.",
    category: "business-cards",
    image: "/images/portfolio-business-cards.jpg",
    client: "GreenByte Labs",
    date: "2025-06",
  },
  {
    id: "8",
    title: "Restaurant Menu Flyers",
    description: "A4 menu flyers with soft-touch lamination and spot gloss for a new Italian restaurant launch.",
    category: "flyers",
    image: "/images/portfolio-brochures.jpg",
    client: "Trattoria Bella",
    date: "2025-05",
  },
  {
    id: "9",
    title: "Retail Store Posters",
    description: "Large poster prints on premium photo paper for seasonal window displays at a fashion retailer.",
    category: "banners",
    image: "/images/portfolio-banners.jpg",
    client: "Thread & Stitch",
    date: "2025-04",
  },
  {
    id: "10",
    title: "Product Label Set",
    description: "Custom adhesive labels with metallic ink printing for an organic skincare product line.",
    category: "stickers",
    image: "/images/portfolio-stickers.jpg",
    client: "Pure Botanics",
    date: "2025-03",
  },
  {
    id: "11",
    title: "Birthday Party Invitations",
    description: "Playful illustrated invitations with rounded corners and matching envelopes for a children's party.",
    category: "invitations",
    image: "/images/portfolio-invitations.jpg",
    client: "Private Client",
    date: "2025-02",
  },
  {
    id: "12",
    title: "Premium Gift Boxes",
    description: "Rigid gift boxes with magnetic closure and full-color printing for a luxury chocolate brand.",
    category: "packaging",
    image: "/images/portfolio-packaging.jpg",
    client: "Velvet Cocoa",
    date: "2025-01",
  },
]
