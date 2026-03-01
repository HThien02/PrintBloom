"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import { adminProducts, type AdminProduct } from "@/lib/admin-data"

const categoryOptions = [
  { value: "business-cards", label: "Business Cards" },
  { value: "flyers", label: "Flyers & Brochures" },
  { value: "banners", label: "Banners & Posters" },
  { value: "stickers", label: "Stickers & Labels" },
  { value: "invitations", label: "Invitations" },
  { value: "packaging", label: "Custom Packaging" },
]

const emptyProduct: AdminProduct = {
  id: "",
  name: "",
  category: "business-cards",
  price: 0,
  stock: 0,
  image: "/images/business-cards.jpg",
  status: "active",
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(adminProducts)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === "all" || p.category === filterCategory
    return matchSearch && matchCategory
  })

  function openAdd() {
    setEditProduct({ ...emptyProduct, id: `P${String(products.length + 1).padStart(3, "0")}` })
    setDialogOpen(true)
  }

  function openEdit(product: AdminProduct) {
    setEditProduct({ ...product })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!editProduct) return
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === editProduct.id)
      if (exists) {
        return prev.map((p) => (p.id === editProduct.id ? editProduct : p))
      }
      return [...prev, editProduct]
    })
    setDialogOpen(false)
    setEditProduct(null)
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const statusStyles: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    draft: "bg-amber-100 text-amber-800",
    archived: "bg-muted text-muted-foreground",
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-foreground">Products</h2>
          <Button onClick={openAdd} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-4 font-medium text-muted-foreground">Product</th>
                    <th className="p-4 font-medium text-muted-foreground">Category</th>
                    <th className="p-4 font-medium text-muted-foreground">Price</th>
                    <th className="p-4 font-medium text-muted-foreground">Stock</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const catLabel = categoryOptions.find((c) => c.value === product.category)?.label ?? product.category
                    return (
                      <tr key={product.id} className="border-b border-border/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{catLabel}</td>
                        <td className="p-4 text-foreground">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={product.stock === 0 ? "text-red-500 font-medium" : "text-foreground"}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[product.status]}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEdit(product)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-red-600"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No products found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editProduct && adminProducts.find((p) => p.id === editProduct.id) ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          {editProduct && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="prod-name">Product Name</Label>
                <Input
                  id="prod-name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="prod-category">Category</Label>
                <Select
                  value={editProduct.category}
                  onValueChange={(v) => setEditProduct({ ...editProduct, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="prod-price">Price ($)</Label>
                  <Input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="prod-stock">Stock</Label>
                  <Input
                    id="prod-stock"
                    type="number"
                    min="0"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="prod-status">Status</Label>
                <Select
                  value={editProduct.status}
                  onValueChange={(v) => setEditProduct({ ...editProduct, status: v as AdminProduct["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Product</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
