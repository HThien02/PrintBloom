"use client"

import { useState, useMemo } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package,
  Users,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { AdminLayout } from "@/components/admin-layout"
import {
  financialData,
  filterFinancialData,
  aggregateForChart,
  adminOrders,
  adminProducts,
  type DateRange,
} from "@/lib/admin-data"

const dateRanges: { value: DateRange; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
]

export default function AdminDashboard() {
  const [range, setRange] = useState<DateRange>("month")

  const filteredData = useMemo(() => filterFinancialData(financialData, range), [range])
  const chartData = useMemo(() => aggregateForChart(filteredData, range), [filteredData, range])

  const totalIncome = filteredData.reduce((s, d) => s + d.income, 0)
  const totalExpense = filteredData.reduce((s, d) => s + d.expense, 0)
  const totalProfit = totalIncome - totalExpense

  const pendingOrders = adminOrders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length
  const activeProducts = adminProducts.filter((p) => p.status === "active").length

  const summaryCards = [
    {
      label: "Total Income",
      value: `$${totalIncome.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      up: true,
    },
    {
      label: "Total Expenses",
      value: `$${totalExpense.toLocaleString()}`,
      icon: TrendingDown,
      trend: "+3.2%",
      up: false,
    },
    {
      label: "Net Profit",
      value: `$${totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      trend: "+18.7%",
      up: true,
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      icon: ShoppingBag,
      trend: "",
      up: true,
    },
    {
      label: "Active Products",
      value: activeProducts.toString(),
      icon: Package,
      trend: "",
      up: true,
    },
    {
      label: "Customers",
      value: "2,847",
      icon: Users,
      trend: "+5.4%",
      up: true,
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Date range filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-foreground">Financial Overview</h2>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            {dateRanges.map((dr) => (
              <button
                key={dr.value}
                onClick={() => setRange(dr.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  range === dr.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.label} className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="font-serif text-2xl text-foreground">{card.value}</p>
                </div>
                {card.trend && (
                  <span
                    className={`text-xs font-medium ${
                      card.up ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {card.trend}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Income vs Expense Bar Chart */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="mb-4 font-serif text-lg text-foreground">Income vs Expenses</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: 13,
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" name="Income" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Profit Line Chart */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="mb-4 font-serif text-lg text-foreground">Profit Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: 13,
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Profit"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="var(--chart-2)"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="4 4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent orders */}
        <Card className="border-border">
          <CardContent className="p-5">
            <h3 className="mb-4 font-serif text-lg text-foreground">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Order</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Product</th>
                    <th className="pb-3 pr-4 font-medium text-muted-foreground">Total</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">{order.id}</td>
                      <td className="py-3 pr-4 text-foreground">{order.customer}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{order.product}</td>
                      <td className="py-3 pr-4 text-foreground">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    printed: "bg-indigo-100 text-indigo-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}
