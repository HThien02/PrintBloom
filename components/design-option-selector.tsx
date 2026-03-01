"use client"

import { useState, useRef, type ChangeEvent, type DragEvent } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { Upload, Palette, X, FileImage, Check, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"

const MockupViewer = dynamic(
  () => import("@/components/mockup-viewer").then((m) => m.MockupViewer),
  { ssr: false }
)

type DesignOption = "upload" | "hire"

interface DesignOptionSelectorProps {
  selectedOption: DesignOption | null
  onSelectOption: (option: DesignOption) => void
  uploadedFile: File | null
  onFileUpload: (file: File | null) => void
  designBrief: string
  onDesignBriefChange: (brief: string) => void
  productId: string
}

export function DesignOptionSelector({
  selectedOption,
  onSelectOption,
  uploadedFile,
  onFileUpload,
  designBrief,
  onDesignBriefChange,
  productId,
}: DesignOptionSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showMockup, setShowMockup] = useState(false)
  const { t } = useLanguage()

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    if (file) onFileUpload(file)
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0] || null
    if (file) onFileUpload(file)
  }

  return (
    <div>
      <h3 className="mb-1 font-serif text-xl text-foreground">{t.designOptions.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{t.designOptions.subtitle}</p>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelectOption("upload")}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all duration-200",
            selectedOption === "upload"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-background hover:border-primary/30"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{t.designOptions.uploadTitle}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t.designOptions.uploadSubtitle}</div>
          </div>
        </button>

        <button
          onClick={() => onSelectOption("hire")}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all duration-200",
            selectedOption === "hire"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-background hover:border-primary/30"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{t.designOptions.hireTitle}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t.designOptions.hireSubtitle}</div>
          </div>
        </button>
      </div>

      {selectedOption === "upload" && (
        <div className="mt-4">
          {uploadedFile ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileImage className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => onFileUpload(null)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={t.designOptions.removeFile}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {uploadedFile.type.startsWith("image/") && (
                <>
                  <Button variant="outline" className="mt-3 w-full" onClick={() => setShowMockup(true)}>
                    <Box className="mr-2 h-4 w-4" />
                    {t.mockup.viewMockup}
                  </Button>
                  <MockupViewer
                    open={showMockup}
                    onOpenChange={setShowMockup}
                    file={uploadedFile}
                    productId={productId}
                  />
                </>
              )}
            </>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{t.designOptions.dragDrop}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.designOptions.dragDropSub}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.ai,.psd"
                onChange={handleFileChange}
                aria-label={t.designOptions.uploadLabel}
              />
            </div>
          )}
        </div>
      )}

      {selectedOption === "hire" && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{t.designOptions.designService}</p>
                <p className="text-xs text-primary">{t.designOptions.designPrice}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t.designOptions.designBrief}
            </label>
            <Textarea
              placeholder={t.designOptions.designPlaceholder}
              value={designBrief}
              onChange={(e) => onDesignBriefChange(e.target.value)}
              className="mt-2 min-h-[120px] resize-none"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">{t.designOptions.designHint}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">{t.designOptions.whatYouGet}</p>
            {t.designOptions.benefits.map((item) => (
              <div key={item} className="flex items-start gap-2 py-1">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
