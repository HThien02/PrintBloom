// Demo data for admin panel

export interface QuantityTier {
  quantity: number
  price: number
}

export interface AdminProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  image: string
  status: "active" | "draft" | "archived"
  quantityTiers: QuantityTier[]
}

export interface AdminOrder {
  id: string
  customer: string
  email: string
  product: string
  quantity: number
  total: number
  status: "pending" | "processing" | "printed" | "shipped" | "delivered" | "cancelled"
  date: string
}

export interface FinancialEntry {
  date: string
  income: number
  expense: number
}

export const adminProducts: AdminProduct[] = [
  { id: "P001", name: "Premium Business Cards", category: "business-cards", price: 24.99, stock: 500, image: "/images/business-cards.jpg", status: "active", quantityTiers: [{ quantity: 100, price: 24.99 }, { quantity: 250, price: 49.99 }, { quantity: 500, price: 89.99 }, { quantity: 1000, price: 149.99 }] },
  { id: "P002", name: "Standard Flyers", category: "flyers", price: 19.99, stock: 300, image: "/images/flyers.jpg", status: "active", quantityTiers: [{ quantity: 100, price: 19.99 }, { quantity: 250, price: 39.99 }, { quantity: 500, price: 69.99 }, { quantity: 1000, price: 119.99 }] },
  { id: "P003", name: "Vinyl Banners", category: "banners", price: 39.99, stock: 120, image: "/images/banners.jpg", status: "active", quantityTiers: [{ quantity: 1, price: 39.99 }, { quantity: 3, price: 99.99 }, { quantity: 5, price: 159.99 }, { quantity: 10, price: 289.99 }] },
  { id: "P004", name: "Die-Cut Stickers", category: "stickers", price: 14.99, stock: 800, image: "/images/stickers.jpg", status: "active", quantityTiers: [{ quantity: 50, price: 14.99 }, { quantity: 100, price: 24.99 }, { quantity: 250, price: 49.99 }, { quantity: 500, price: 84.99 }] },
  { id: "P005", name: "Wedding Invitations", category: "invitations", price: 29.99, stock: 200, image: "/images/invitations.jpg", status: "active", quantityTiers: [{ quantity: 50, price: 29.99 }, { quantity: 100, price: 49.99 }, { quantity: 200, price: 89.99 }, { quantity: 500, price: 199.99 }] },
  { id: "P006", name: "Custom Gift Boxes", category: "packaging", price: 49.99, stock: 80, image: "/images/packaging.jpg", status: "active", quantityTiers: [{ quantity: 25, price: 49.99 }, { quantity: 50, price: 89.99 }, { quantity: 100, price: 159.99 }, { quantity: 250, price: 349.99 }] },
  { id: "P007", name: "Embossed Business Cards", category: "business-cards", price: 34.99, stock: 250, image: "/images/business-cards.jpg", status: "active", quantityTiers: [{ quantity: 100, price: 34.99 }, { quantity: 250, price: 69.99 }, { quantity: 500, price: 119.99 }, { quantity: 1000, price: 199.99 }] },
  { id: "P008", name: "Tri-Fold Brochures", category: "flyers", price: 24.99, stock: 0, image: "/images/flyers.jpg", status: "draft", quantityTiers: [{ quantity: 100, price: 24.99 }, { quantity: 250, price: 49.99 }, { quantity: 500, price: 89.99 }, { quantity: 1000, price: 149.99 }] },
  { id: "P009", name: "Roll-Up Banners", category: "banners", price: 59.99, stock: 60, image: "/images/banners.jpg", status: "active", quantityTiers: [{ quantity: 1, price: 59.99 }, { quantity: 3, price: 149.99 }, { quantity: 5, price: 229.99 }, { quantity: 10, price: 429.99 }] },
  { id: "P010", name: "Holographic Stickers", category: "stickers", price: 19.99, stock: 400, image: "/images/stickers.jpg", status: "archived", quantityTiers: [{ quantity: 50, price: 19.99 }, { quantity: 100, price: 34.99 }, { quantity: 250, price: 69.99 }, { quantity: 500, price: 119.99 }] },
]

export const adminOrders: AdminOrder[] = [
  { id: "ORD-1001", customer: "Sarah Chen", email: "sarah@example.com", product: "Premium Business Cards", quantity: 500, total: 124.95, status: "delivered", date: "2026-02-28" },
  { id: "ORD-1002", customer: "Michael Torres", email: "michael@example.com", product: "Wedding Invitations", quantity: 100, total: 299.90, status: "shipped", date: "2026-02-27" },
  { id: "ORD-1003", customer: "Emily Park", email: "emily@example.com", product: "Custom Gift Boxes", quantity: 50, total: 249.95, status: "printed", date: "2026-02-26" },
  { id: "ORD-1004", customer: "David Nguyen", email: "david@example.com", product: "Vinyl Banners", quantity: 3, total: 119.97, status: "processing", date: "2026-02-25" },
  { id: "ORD-1005", customer: "Lisa Rodriguez", email: "lisa@example.com", product: "Standard Flyers", quantity: 1000, total: 199.90, status: "pending", date: "2026-02-24" },
  { id: "ORD-1006", customer: "James Kim", email: "james@example.com", product: "Die-Cut Stickers", quantity: 200, total: 29.98, status: "delivered", date: "2026-02-23" },
  { id: "ORD-1007", customer: "Anna White", email: "anna@example.com", product: "Premium Business Cards", quantity: 250, total: 62.48, status: "delivered", date: "2026-02-22" },
  { id: "ORD-1008", customer: "Robert Lee", email: "robert@example.com", product: "Roll-Up Banners", quantity: 2, total: 119.98, status: "cancelled", date: "2026-02-21" },
  { id: "ORD-1009", customer: "Maria Garcia", email: "maria@example.com", product: "Tri-Fold Brochures", quantity: 500, total: 124.95, status: "shipped", date: "2026-02-20" },
  { id: "ORD-1010", customer: "Tom Wilson", email: "tom@example.com", product: "Custom Gift Boxes", quantity: 30, total: 149.97, status: "processing", date: "2026-02-19" },
  { id: "ORD-1011", customer: "Julia Brown", email: "julia@example.com", product: "Embossed Business Cards", quantity: 300, total: 104.97, status: "delivered", date: "2026-02-18" },
  { id: "ORD-1012", customer: "Chris Adams", email: "chris@example.com", product: "Standard Flyers", quantity: 2000, total: 399.80, status: "pending", date: "2026-02-17" },
]

// Generate financial data for charts
function generateFinancialData(): FinancialEntry[] {
  const data: FinancialEntry[] = []
  const today = new Date(2026, 1, 28) // Feb 28 2026

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]

    // Semi-random but consistent data
    const dayOfWeek = d.getDay()
    const month = d.getMonth()
    const dayOfMonth = d.getDate()

    const baseIncome = 800 + (month * 50) + (dayOfMonth * 10)
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1
    const seasonalBoost = month >= 10 || month <= 1 ? 1.3 : 1

    const income = Math.round(baseIncome * weekendDip * seasonalBoost + (Math.sin(i * 0.7) * 200))
    const expense = Math.round(income * (0.35 + Math.sin(i * 0.3) * 0.1))

    data.push({
      date: dateStr,
      income: Math.max(income, 100),
      expense: Math.max(expense, 50),
    })
  }

  return data
}

export const financialData = generateFinancialData()

export type DateRange = "day" | "week" | "month" | "quarter" | "year"

export function filterFinancialData(data: FinancialEntry[], range: DateRange): FinancialEntry[] {
  const today = new Date(2026, 1, 28)
  let startDate: Date

  switch (range) {
    case "day":
      startDate = new Date(today)
      break
    case "week":
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 7)
      break
    case "month":
      startDate = new Date(today)
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case "quarter":
      startDate = new Date(today)
      startDate.setMonth(startDate.getMonth() - 3)
      break
    case "year":
      startDate = new Date(today)
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
  }

  const startStr = startDate.toISOString().split("T")[0]
  return data.filter((entry) => entry.date >= startStr)
}

export function aggregateForChart(data: FinancialEntry[], range: DateRange) {
  if (range === "day" || range === "week") {
    return data.map((d) => ({
      label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      income: d.income,
      expense: d.expense,
      profit: d.income - d.expense,
    }))
  }

  if (range === "month") {
    // Group by week
    const weeks: Record<string, { income: number; expense: number; count: number }> = {}
    data.forEach((d) => {
      const dt = new Date(d.date)
      const weekStart = new Date(dt)
      weekStart.setDate(dt.getDate() - dt.getDay())
      const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!weeks[key]) weeks[key] = { income: 0, expense: 0, count: 0 }
      weeks[key].income += d.income
      weeks[key].expense += d.expense
      weeks[key].count++
    })
    return Object.entries(weeks).map(([label, v]) => ({
      label,
      income: v.income,
      expense: v.expense,
      profit: v.income - v.expense,
    }))
  }

  // Quarter/year - group by month
  const months: Record<string, { income: number; expense: number }> = {}
  data.forEach((d) => {
    const key = new Date(d.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    if (!months[key]) months[key] = { income: 0, expense: 0 }
    months[key].income += d.income
    months[key].expense += d.expense
  })
  return Object.entries(months).map(([label, v]) => ({
    label,
    income: v.income,
    expense: v.expense,
    profit: v.income - v.expense,
  }))
}
