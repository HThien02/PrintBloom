"use client"

import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from "react"
import { Upload, X, FileImage, Check, Box, Loader2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextureMockupService, type MockupTemplate } from "@/lib/texture-mockup-service"

interface TextureUploadSelectorProps {
  productId: string
  onTexturesSelected: (frontTexture: File | null, backTexture: File | null) => void
  onMockupGenerated?: (mockupUrl: string) => void
}

export function TextureUploadSelector({ 
  productId, 
  onTexturesSelected, 
  onMockupGenerated 
}: TextureUploadSelectorProps) {
  const [frontTexture, setFrontTexture] = useState<File | undefined>(undefined)
  const [backTexture, setBackTexture] = useState<File | undefined>(undefined)
  const [frontDragging, setFrontDragging] = useState(false)
  const [backDragging, setBackDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [mockupUrl, setMockupUrl] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [templates, setTemplates] = useState<MockupTemplate[]>([])
  const [error, setError] = useState<string>('')
  const [materialType, setMaterialType] = useState<'paper' | 'card' | 'metal' | 'plastic'>('paper')
  const [lighting, setLighting] = useState<'studio' | 'outdoor' | 'natural'>('studio')
  const [resolution, setResolution] = useState<'low' | 'medium' | 'high'>('high')
  
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  // Load templates on mount
  useEffect(() => {
    const availableTemplates = TextureMockupService.getTemplates(productId)
    setTemplates(availableTemplates)
    
    const defaultTemplate = TextureMockupService.getDefaultTemplate(productId)
    const dualTemplate = TextureMockupService.getDualSideTemplate(productId)
    
    // Prefer dual-side template if available
    setSelectedTemplate(dualTemplate?.id || defaultTemplate?.id || '')
  }, [productId])

  function handleFrontTextureChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFrontTexture(file)
      setError('')
    }
  }

  function handleBackTextureChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setBackTexture(file)
      setError('')
    }
  }

  function handleFrontDragOver(e: DragEvent) {
    e.preventDefault()
    setFrontDragging(true)
  }

  function handleFrontDragLeave(e: DragEvent) {
    e.preventDefault()
    setFrontDragging(false)
  }

  function handleFrontDrop(e: DragEvent) {
    e.preventDefault()
    setFrontDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setFrontTexture(file)
      setError('')
    }
  }

  function handleBackDragOver(e: DragEvent) {
    e.preventDefault()
    setBackDragging(true)
  }

  function handleBackDragLeave(e: DragEvent) {
    e.preventDefault()
    setBackDragging(false)
  }

  function handleBackDrop(e: DragEvent) {
    e.preventDefault()
    setBackDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setBackTexture(file)
      setError('')
    }
  }

  function removeFrontTexture() {
    setFrontTexture(undefined)
    setMockupUrl('')
    if (frontInputRef.current) {
      frontInputRef.current.value = ''
    }
  }

  function removeBackTexture() {
    setBackTexture(undefined)
    if (backInputRef.current) {
      backInputRef.current.value = ''
    }
  }

  async function generateMockup() {
    if (!frontTexture) {
      setError('Front texture is required')
      return
    }

    setGenerating(true)
    setError('')

    try {
      const config = {
        frontTexture,
        backTexture: backTexture || undefined,
        templateId: selectedTemplate,
        materialType,
        lighting,
        resolution
      }

      const result = await TextureMockupService.generateTextureMockup(config)
      
      setMockupUrl(result.mockupUrl)
      onMockupGenerated?.(result.mockupUrl)
      onTexturesSelected(frontTexture, backTexture || null)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate mockup'
      setError(errorMessage)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Front Texture Upload */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Front Texture (Required)</h3>
          
          {frontTexture ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileImage className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">{frontTexture.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(frontTexture.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFrontTexture}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className={`relative rounded-xl border-2 border-dashed transition-colors ${
                frontDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleFrontDragOver}
              onDragLeave={handleFrontDragLeave}
              onDrop={handleFrontDrop}
            >
              <input
                ref={frontInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFrontTextureChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Upload front texture image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG or JPG with transparency recommended
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Texture Upload */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Back Texture (Optional)</h3>
          
          {backTexture ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileImage className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">{backTexture.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(backTexture.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeBackTexture}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className={`relative rounded-xl border-2 border-dashed transition-colors ${
                backDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleBackDragOver}
              onDragLeave={handleBackDragLeave}
              onDrop={handleBackDrop}
            >
              <input
                ref={backInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleBackTextureChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Upload back texture image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG or JPG with transparency recommended
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material & Lighting Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Material & Lighting Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Material Type</label>
              <select 
                value={materialType} 
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="paper">Paper</option>
                <option value="card">Card Stock</option>
                <option value="metal">Metal</option>
                <option value="plastic">Plastic</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Lighting</label>
              <select 
                value={lighting} 
                onChange={(e) => setLighting(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="studio">Studio</option>
                <option value="outdoor">Outdoor</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Resolution</label>
              <select 
                value={resolution} 
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="low">Low (Fast)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Best)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      {templates.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Mockup Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative rounded-lg border-2 p-3 text-left transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="aspect-[4/3] bg-muted rounded mb-2 flex items-center justify-center">
                    <Box className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">
                    {template.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Mockup Button */}
      <Button
        onClick={generateMockup}
        disabled={!frontTexture || generating}
        className="w-full"
        size="lg"
      >
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Texture Mockup...
          </>
        ) : (
          <>
            <Palette className="mr-2 h-4 w-4" />
            Generate Texture Mockup
          </>
        )}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Mockup Result */}
      {mockupUrl && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Texture Mockup Preview</h3>
            <div className="relative">
              <img
                src={mockupUrl}
                alt="Generated texture mockup"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Texture Mockup Generated
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a href={mockupUrl} download="texture-mockup.jpg">
                  Download Mockup
                </a>
              </Button>
              <Button className="flex-1" onClick={() => setMockupUrl('')}>
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
