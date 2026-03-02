"use client";

import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminLayout } from "@/components/admin-layout";

interface OrderItem {
  id: string;
  productName: string;
  materialName: string | null;
  designOption: string | null;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "printed", label: "Printed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusFlow: Order["status"][] = [
  "pending",
  "processing",
  "printed",
  "shipped",
  "delivered",
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  printed: "bg-indigo-100 text-indigo-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = orders.filter((o) => {
    const customerName = `${o.firstName} ${o.lastName}`.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      customerName.includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function updateStatus(orderId: string, newStatus: Order["status"]) {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders();
      if (detailOrder?.id === orderId) {
        const updated = orders.find((o) => o.id === orderId);
        if (updated) setDetailOrder({ ...updated, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <h2 className="font-serif text-2xl text-foreground">Order Tracking</h2>

        {/* Status summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statusOptions.slice(1).map((s) => (
            <button
              key={s.value}
              onClick={() =>
                setFilterStatus(filterStatus === s.value ? "all" : s.value)
              }
              className={`rounded-xl border p-3 text-center transition-colors ${
                filterStatus === s.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <p className="font-serif text-2xl text-foreground">
                {statusCounts[s.value] || 0}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {s.label}
              </p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading orders...
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-4 font-medium text-muted-foreground">
                        Order ID
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Items
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => (
                      <tr key={order.id} className="border-b border-border/50">
                        <td className="p-4 font-medium text-foreground">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-foreground">
                              {order.firstName} {order.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {order.items.length} item(s)
                        </td>
                        <td className="p-4 text-foreground">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setDetailOrder(order)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label={`View order ${order.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <Select
                                  value={order.status}
                                  onValueChange={(v) =>
                                    updateStatus(order.id, v as Order["status"])
                                  }
                                >
                                  <SelectTrigger className="h-8 w-8 border-0 p-0 shadow-none [&>svg]:hidden">
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusFlow.map((s) => (
                                      <SelectItem
                                        key={s}
                                        value={s}
                                        className="capitalize"
                                      >
                                        {s}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!loading && filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No orders found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Order Details</DialogTitle>
          </DialogHeader>

          {detailOrder && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {detailOrder.id}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[detailOrder.status]}`}
                >
                  {detailOrder.status}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">
                    {detailOrder.firstName} {detailOrder.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {detailOrder.email}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">
                    {detailOrder.phone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shipping</p>
                  <p className="font-medium text-foreground capitalize">
                    {detailOrder.shippingMethod}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">
                    {detailOrder.address}
                    {detailOrder.apartment
                      ? `, ${detailOrder.apartment}`
                      : ""}, {detailOrder.city}, {detailOrder.state}{" "}
                    {detailOrder.zip}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">
                  Items
                </p>
                <div className="flex flex-col gap-2">
                  {detailOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="text-foreground">{item.productName}</p>
                        {item.materialName && (
                          <p className="text-xs text-muted-foreground">
                            {item.materialName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-foreground">
                          ${item.unitPrice.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ${detailOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    ${detailOrder.shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">
                    ${detailOrder.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    ${detailOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Status timeline */}
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">
                  Order Progress
                </p>
                <div className="flex items-center gap-1">
                  {statusFlow.map((step, i) => {
                    const currentIdx = statusFlow.indexOf(
                      detailOrder.status as (typeof statusFlow)[number],
                    );
                    const isCompleted =
                      detailOrder.status !== "cancelled" && i <= currentIdx;
                    const isCancelled = detailOrder.status === "cancelled";

                    return (
                      <div
                        key={step}
                        className="flex flex-1 flex-col items-center"
                      >
                        <div
                          className={`mb-1 h-2 w-full rounded-full ${
                            isCancelled
                              ? "bg-red-200"
                              : isCompleted
                                ? "bg-primary"
                                : "bg-border"
                          }`}
                        />
                        <span className="text-[10px] capitalize text-muted-foreground">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
