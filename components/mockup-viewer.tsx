"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface MockupViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: File
  productId: string
}

interface Transform {
  x: number
  y: number
  w: number
  h: number
}

interface MockupConfig {
  canvasWidth: number
  canvasHeight: number
  bgColor: string
  placements: {
    transform: Transform
    opacity: number
    shadow?: boolean
    rounded?: number
  }[]
  drawTemplate: (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void
}

function drawRoundedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  opacity = 1
) {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
}

function drawShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.save()
  ctx.shadowColor = "rgba(0,0,0,0.18)"
  ctx.shadowBlur = 32
  ctx.shadowOffsetX = 6
  ctx.shadowOffsetY = 10
  ctx.fillStyle = "rgba(0,0,0,0.01)"
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawRotatedCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number,
  radius: number,
  opacity = 1,
  shadow = true
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)
  if (shadow) drawShadow(ctx, -w / 2, -h / 2, w, h, radius)
  drawRoundedImage(ctx, img, -w / 2, -h / 2, w, h, radius, opacity)
  ctx.restore()
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function getConfig(productId: string): MockupConfig {
  switch (productId) {
    case "business-cards":
      return {
        canvasWidth: 1200, canvasHeight: 800, bgColor: "#f5f0eb", placements: [],
        drawTemplate: (ctx, cw, ch) => {
          ctx.save()
          for (let i = 0; i < 60; i++) {
            ctx.fillStyle = `rgba(200,190,180,${Math.random() * 0.15})`
            ctx.beginPath()
            ctx.arc(Math.random() * cw, Math.random() * ch, Math.random() * 3 + 1, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        },
      }
    case "flyers":
      return {
        canvasWidth: 1200, canvasHeight: 900, bgColor: "#eee8e0", placements: [],
        drawTemplate: (ctx, cw, ch) => {
          ctx.save()
          for (let i = 0; i < ch; i += 6) {
            ctx.strokeStyle = `rgba(180,165,145,${0.06 + Math.random() * 0.05})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(0, i + Math.sin(i * 0.05) * 3)
            ctx.lineTo(cw, i + Math.cos(i * 0.03) * 4)
            ctx.stroke()
          }
          ctx.restore()
        },
      }
    default:
      return {
        canvasWidth: 1200, canvasHeight: 800, bgColor: "#f5f0eb", placements: [],
        drawTemplate: () => {},
      }
  }
}

function compositeImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  productId: string,
  cw: number,
  ch: number
) {
  switch (productId) {
    case "business-cards": {
      const cardW = 420, cardH = 250, r = 12
      const cx = cw / 2, cy = ch / 2
      drawRotatedCard(ctx, img, cx - 30, cy + 20, cardW, cardH, -0.12, r, 0.5)
      drawRotatedCard(ctx, img, cx + 10, cy - 5, cardW, cardH, 0.04, r, 0.75)
      drawRotatedCard(ctx, img, cx + 40, cy - 30, cardW, cardH, 0.08, r, 1)
      break
    }
    case "flyers": {
      const flyerW = 440, flyerH = 600, r = 4
      const cx = cw / 2, cy = ch / 2
      drawRotatedCard(ctx, img, cx - 60, cy + 15, flyerW, flyerH, -0.06, r, 0.4, true)
      drawRotatedCard(ctx, img, cx + 30, cy - 10, flyerW, flyerH, 0.03, r, 1, true)
      break
    }
    default: {
      const w = 440, h = 300
      drawRotatedCard(ctx, img, cw / 2, ch / 2, w, h, 0, 8)
      break
    }
  }
}

export function MockupViewer({ open, onOpenChange, file, productId }: MockupViewerProps) {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)

  const renderMockup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setLoading(true)

    const config = getConfig(productId)
    canvas.width = config.canvasWidth
    canvas.height = config.canvasHeight

    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight)
    config.drawTemplate(ctx, config.canvasWidth, config.canvasHeight)

    const userImg = new Image()
    userImg.crossOrigin = "anonymous"
    userImg.onload = () => {
      compositeImage(ctx, userImg, productId, config.canvasWidth, config.canvasHeight)
      setLoading(false)
    }
    userImg.onerror = () => setLoading(false)
    userImg.src = URL.createObjectURL(file)

    return () => URL.revokeObjectURL(userImg.src)
  }, [file, productId])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(renderMockup, 100)
      return () => clearTimeout(timer)
    }
  }, [open, renderMockup])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `mockup-${productId}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{t.mockup.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t.mockup.subtitle}</p>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl bg-muted">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <canvas ref={canvasRef} className="h-auto w-full" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{t.mockup.hint}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              {t.mockup.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
