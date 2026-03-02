import { NextRequest, NextResponse } from "next/server"
import { TextureMockupService } from "@/lib/texture-mockup-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract parameters
    const productType = formData.get('productType') as string
    const frontTextureFile = formData.get('frontTexture') as File
    const backTextureFile = formData.get('backTexture') as File | null
    const templateId = formData.get('templateId') as string
    const materialType = formData.get('materialType') as string || 'paper'
    const lighting = formData.get('lighting') as string || 'studio'
    const resolution = formData.get('resolution') as string || 'high'
    
    // Validate required parameters
    if (!productType || !frontTextureFile || !templateId) {
      return NextResponse.json(
        { error: 'ProductType, frontTexture, and templateId are required' },
        { status: 400 }
      )
    }
    
    // Prepare texture mockup configuration
    const config = {
      frontTexture: frontTextureFile,
      backTexture: backTextureFile || undefined,
      templateId,
      materialType: materialType as 'paper' | 'card' | 'metal' | 'plastic',
      lighting: lighting as 'studio' | 'outdoor' | 'natural',
      resolution: resolution as 'low' | 'medium' | 'high'
    }
    
    // Generate texture mockup
    const result = await TextureMockupService.generateTextureMockup(config)
    
    return NextResponse.json({
      success: true,
      mockupUrl: result.mockupUrl,
      previewUrl: result.previewUrl,
      textureUrls: result.textureUrls,
      templateId: result.templateId,
      materialType,
      lighting,
      resolution,
      generatedAt: result.generatedAt,
      processingTime: result.processingTime
    })
    
  } catch (error) {
    console.error('Texture Mockup API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productType = searchParams.get('productType')
    
    if (!productType) {
      return NextResponse.json(
        { error: 'Product type parameter is required' },
        { status: 400 }
      )
    }
    
    const templates = TextureMockupService.getTemplates(productType)
    
    return NextResponse.json({
      success: true,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        preview: t.preview,
        dimensions: t.dimensions,
        hasBackTexture: !!t.textureMaps.back
      })),
      defaultTemplate: TextureMockupService.getDefaultTemplate(productType)?.id || null,
      dualSideTemplate: TextureMockupService.getDualSideTemplate(productType)?.id || null
    })
    
  } catch (error) {
    console.error('Texture Mockup templates API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch texture templates' },
      { status: 500 }
    )
  }
}
