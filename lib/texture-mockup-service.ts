export interface TextureMockupConfig {
  frontTexture?: string | File
  backTexture?: string | File
  templateId: string
  materialType: 'paper' | 'card' | 'metal' | 'plastic'
  lighting?: 'studio' | 'outdoor' | 'natural'
  resolution?: 'low' | 'medium' | 'high'
}

export interface TextureMockupResult {
  mockupUrl: string
  previewUrl: string
  textureUrls: {
    front?: string
    back?: string
  }
  templateId: string
  generatedAt: string
  processingTime: number
}

export interface MockupTemplate {
  id: string
  name: string
  description: string
  preview: string
  textureMaps: {
    front?: string
    back?: string
    material: string
    normal?: string
    roughness?: string
  }
  dimensions: {
    width: number
    height: number
    depth: number
  }
}

// Mockup templates với texture maps
export const TEXTURE_MOCKUP_TEMPLATES: Record<string, MockupTemplate[]> = {
  'business-cards': [
    {
      id: 'business-card-studio-front',
      name: 'Business Card Front - Studio',
      description: 'Professional studio lighting front view',
      preview: '/images/mockups/business-card-studio-front.jpg',
      textureMaps: {
        front: '/textures/business-card-front-base.jpg',
        material: '/textures/paper-material.jpg',
        normal: '/textures/paper-normal.jpg',
        roughness: '/textures/paper-roughness.jpg'
      },
      dimensions: { width: 90, height: 50, depth: 0.5 }
    },
    {
      id: 'business-card-studio-back',
      name: 'Business Card Back - Studio',
      description: 'Professional studio lighting back view',
      preview: '/images/mockups/business-card-studio-back.jpg',
      textureMaps: {
        back: '/textures/business-card-back-base.jpg',
        material: '/textures/paper-material.jpg',
        normal: '/textures/paper-normal.jpg',
        roughness: '/textures/paper-roughness.jpg'
      },
      dimensions: { width: 90, height: 50, depth: 0.5 }
    },
    {
      id: 'business-card-hand-front',
      name: 'Business Card in Hand - Front',
      description: 'Business card held in hand front view',
      preview: '/images/mockups/business-card-hand-front.jpg',
      textureMaps: {
        front: '/textures/business-card-front-base.jpg',
        material: '/textures/paper-material.jpg',
        normal: '/textures/paper-normal.jpg'
      },
      dimensions: { width: 90, height: 50, depth: 0.5 }
    },
    {
      id: 'business-card-desk-dual',
      name: 'Business Card on Desk - Dual',
      description: 'Business card on desk showing both sides',
      preview: '/images/mockups/business-card-desk-dual.jpg',
      textureMaps: {
        front: '/textures/business-card-front-base.jpg',
        back: '/textures/business-card-back-base.jpg',
        material: '/textures/paper-material.jpg',
        normal: '/textures/paper-normal.jpg',
        roughness: '/textures/paper-roughness.jpg'
      },
      dimensions: { width: 90, height: 50, depth: 0.5 }
    },
    {
      id: 'business-card-stack-angle',
      name: 'Business Card Stack - Angle',
      description: 'Stack of business cards at angle',
      preview: '/images/mockups/business-card-stack-angle.jpg',
      textureMaps: {
        front: '/textures/business-card-front-base.jpg',
        material: '/textures/paper-material.jpg',
        normal: '/textures/paper-normal.jpg'
      },
      dimensions: { width: 90, height: 50, depth: 0.5 }
    }
  ],
  'flyers': [
    {
      id: 'flyer-wall-front',
      name: 'Flyer on Wall - Front',
      description: 'Flyer pinned to wall front view',
      preview: '/images/mockups/flyer-wall-front.jpg',
      textureMaps: {
        front: '/textures/flyer-front-base.jpg',
        material: '/textures/paper-material.jpg'
      },
      dimensions: { width: 210, height: 297, depth: 0.1 }
    }
  ]
}

export class TextureMockupService {
  
  // Generate mockup using texture mapping
  static async generateTextureMockup(config: TextureMockupConfig): Promise<TextureMockupResult> {
    const startTime = Date.now()
    
    try {
      // Upload textures if files provided
      const textureUrls = await this.uploadTextures(config)
      
      // Get template
      const template = this.getTemplate(config.templateId)
      if (!template) {
        throw new Error(`Template not found: ${config.templateId}`)
      }
      
      // Generate mockup using Three.js/Canvas
      const mockupUrl = await this.renderMockupWithTextures(template, textureUrls, config)
      
      return {
        mockupUrl,
        previewUrl: mockupUrl, // For now, same as mockup
        textureUrls,
        templateId: config.templateId,
        generatedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }
      
    } catch (error) {
      console.error('TextureMockupService error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to generate texture mockup: ${errorMessage}`)
    }
  }
  
  // Upload texture files and get URLs
  private static async uploadTextures(config: TextureMockupConfig): Promise<{ front?: string; back?: string }> {
    const textureUrls: { front?: string; back?: string } = {}
    
    // Upload front texture
    if (config.frontTexture) {
      if (typeof config.frontTexture === 'string') {
        textureUrls.front = config.frontTexture
      } else {
        // Upload file to storage (could be S3, Cloudinary, etc.)
        textureUrls.front = await this.uploadTextureFile(config.frontTexture, 'front')
      }
    }
    
    // Upload back texture
    if (config.backTexture) {
      if (typeof config.backTexture === 'string') {
        textureUrls.back = config.backTexture
      } else {
        textureUrls.back = await this.uploadTextureFile(config.backTexture, 'back')
      }
    }
    
    return textureUrls
  }
  
  // Upload single texture file
  private static async uploadTextureFile(file: File, side: string): Promise<string> {
    // For now, create object URL (in production, upload to cloud storage)
    return URL.createObjectURL(file)
  }
  
  // Render mockup with textures using Canvas
  private static async renderMockupWithTextures(
    template: MockupTemplate,
    textureUrls: { front?: string; back?: string },
    config: TextureMockupConfig
  ): Promise<string> {
    return new Promise((resolve) => {
      // Create canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Set canvas size based on resolution
      const resolution = config.resolution || 'high'
      const scale = resolution === 'high' ? 2 : resolution === 'medium' ? 1.5 : 1
      canvas.width = 800 * scale
      canvas.height = 600 * scale
      
      // Load and render base template
      this.renderTemplateWithTextures(ctx, template, textureUrls, canvas.width, canvas.height)
        .then(() => {
          // Convert canvas to blob URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              resolve(url)
            } else {
              resolve('') // Fallback
            }
          }, 'image/jpeg', 0.9)
        })
    })
  }
  
  // Render template with texture mapping
  private static async renderTemplateWithTextures(
    ctx: CanvasRenderingContext2D,
    template: MockupTemplate,
    textureUrls: { front?: string; back?: string },
    width: number,
    height: number
  ): Promise<void> {
    // For now, create a simple mockup with texture overlay
    // In production, this would use WebGL/Three.js for proper 3D rendering
    
    // Draw background
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
    
    // Draw card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 10
    ctx.shadowOffsetY = 10
    
    // Draw card base
    const cardWidth = width * 0.6
    const cardHeight = cardWidth * 0.6 // Business card ratio
    const cardX = (width - cardWidth) / 2
    const cardY = (height - cardHeight) / 2
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Apply texture if available
    if (textureUrls.front) {
      await this.drawImageTexture(ctx, textureUrls.front, cardX, cardY, cardWidth, cardHeight)
    }
    
    // Add card border
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight)
  }
  
  // Draw image texture on canvas
  private static async drawImageTexture(
    ctx: CanvasRenderingContext2D,
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height)
        resolve()
      }
      img.onerror = () => reject(new Error('Failed to load texture image'))
      img.src = imageUrl
    })
  }
  
  // Get template by ID
  static getTemplate(templateId: string): MockupTemplate | null {
    for (const productType in TEXTURE_MOCKUP_TEMPLATES) {
      const templates = TEXTURE_MOCKUP_TEMPLATES[productType]
      const template = templates.find(t => t.id === templateId)
      if (template) return template
    }
    return null
  }
  
  // Get templates for product type
  static getTemplates(productType: string): MockupTemplate[] {
    return TEXTURE_MOCKUP_TEMPLATES[productType] || []
  }
  
  // Get default template
  static getDefaultTemplate(productType: string): MockupTemplate | null {
    const templates = this.getTemplates(productType)
    return templates[0] || null
  }
  
  // Get dual-side template
  static getDualSideTemplate(productType: string): MockupTemplate | null {
    const templates = this.getTemplates(productType)
    return templates.find(t => t.id.includes('dual') || t.textureMaps.back) || null
  }
}
