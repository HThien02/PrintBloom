export type Locale = "en" | "vi"

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image: string
  client: string
  date: string
}

const portfolioItemsVi: PortfolioItem[] = [
  { id: "1", title: "Danh thiếp ép nhũ vàng cao cấp", description: "Danh thiếp cao cấp ép nhũ vàng trên giấy cotton 400gsm cho công ty bất động sản.", category: "business-cards", image: "/images/portfolio-business-cards.jpg", client: "Prestige Realty", date: "2025-12" },
  { id: "2", title: "Brochure hội nghị công nghệ", description: "Brochure gấp ba với lớp phủ mờ cho hội nghị công nghệ thường niên, kiểu chữ hiện đại.", category: "flyers", image: "/images/portfolio-brochures.jpg", client: "TechVault Summit", date: "2025-11" },
  { id: "3", title: "Bao bì cà phê thủ công", description: "Bao bì kraft tùy chỉnh in UV từng điểm cho bộ sưu tập theo mùa của thương hiệu cà phê.", category: "packaging", image: "/images/portfolio-packaging.jpg", client: "Bean & Bloom Coffee", date: "2025-10" },
  { id: "4", title: "Băng rôn sự kiện lễ hội", description: "Băng rôn vinyl khổ lớn in full màu sống động cho lễ hội âm nhạc ngoài trời.", category: "banners", image: "/images/portfolio-banners.jpg", client: "SoundWave Festival", date: "2025-09" },
  { id: "5", title: "Bộ sưu tập nhãn dán thương hiệu thủ công", description: "Nhãn dán cắt khuôn holographic phủ chống nước cho thương hiệu mỹ phẩm thủ công.", category: "stickers", image: "/images/portfolio-stickers.jpg", client: "Glow Naturals", date: "2025-08" },
  { id: "6", title: "Thiệp mời đám cưới vườn", description: "Thiệp mời in letterpress trên giấy thủ công với minh họa hoa và lót phong bì.", category: "invitations", image: "/images/portfolio-invitations.jpg", client: "Khách hàng riêng", date: "2025-07" },
  { id: "7", title: "Danh thiếp tối giản cho startup", description: "Danh thiếp sạch sẽ, nổi bóng trên giấy tái chế cho startup công nghệ xanh.", category: "business-cards", image: "/images/portfolio-business-cards.jpg", client: "GreenByte Labs", date: "2025-06" },
  { id: "8", title: "Tờ rơi thực đơn nhà hàng", description: "Tờ rơi thực đơn A4 phủ mờ mềm và bóng cục bộ cho nhà hàng Ý mới khai trương.", category: "flyers", image: "/images/portfolio-brochures.jpg", client: "Trattoria Bella", date: "2025-05" },
  { id: "9", title: "Poster cửa hàng bán lẻ", description: "Poster khổ lớn in trên giấy ảnh cao cấp cho cửa sổ trưng bày theo mùa.", category: "banners", image: "/images/portfolio-banners.jpg", client: "Thread & Stitch", date: "2025-04" },
  { id: "10", title: "Bộ nhãn sản phẩm", description: "Nhãn dán tùy chỉnh in mực kim loại cho dòng sản phẩm chăm sóc da hữu cơ.", category: "stickers", image: "/images/portfolio-stickers.jpg", client: "Pure Botanics", date: "2025-03" },
  { id: "11", title: "Thiệp mời sinh nhật", description: "Thiệp mời minh họa vui nhộn, góc bo tròn và phong bì đồng bộ cho tiệc trẻ em.", category: "invitations", image: "/images/portfolio-invitations.jpg", client: "Khách hàng riêng", date: "2025-02" },
  { id: "12", title: "Hộp quà cao cấp", description: "Hộp quà cứng đóng nam châm in full màu cho thương hiệu sô-cô-la cao cấp.", category: "packaging", image: "/images/portfolio-packaging.jpg", client: "Velvet Cocoa", date: "2025-01" },
]

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

export function getPortfolioItems(locale: Locale): PortfolioItem[] {
  return locale === "vi" ? portfolioItemsVi : portfolioItems
}
