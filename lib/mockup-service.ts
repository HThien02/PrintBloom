// Mockup service for legacy review functionality
export interface MockupTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export interface MockupGenerationParams {
  frontImage: string | File
  backImage?: string | File
  template: string
  options?: {
    background?: string
    shadow?: boolean
    resolution?: 'low' | 'medium' | 'high'
  }
}

export interface MockupResult {
  mockupUrl: string
  template: string
  generatedAt: string
  processingTime: number
}

// Legacy templates for compatibility
export const MOCKUP_TEMPLATES: Record<string, MockupTemplate[]> = {
  'business-cards': [
    {
      id: 'business-card-front',
      name: 'Business Card Front',
      description: 'Front side of business card',
      preview: '/images/mockups/business-card-front.jpg'
    },
    {
      id: 'business-card-back', 
      name: 'Business Card Back',
      description: 'Back side of business card',
      preview: '/images/mockups/business-card-back.jpg'
    },
    {
      id: 'business-card-dual',
      name: 'Business Card Front & Back',
      description: 'Both front and back sides visible',
      preview: '/images/mockups/business-card-dual.jpg'
    }
  ]
}

export class MockupService {
  
  static async generateMockup(params: MockupGenerationParams): Promise<MockupResult> {
    // Return empty result for now - legacy compatibility
    return {
      mockupUrl: '',
      template: params.template,
      generatedAt: new Date().toISOString(),
      processingTime: 0
    }
  }
  
  static getTemplates(productType: string): MockupTemplate[] {
    return MOCKUP_TEMPLATES[productType] || []
  }
  
  static getDefaultTemplate(productType: string): MockupTemplate | null {
    const templates = this.getTemplates(productType)
    return templates[0] || null
  }
  
  static getDualSideTemplate(productType: string): MockupTemplate | null {
    const templates = this.getTemplates(productType)
    return templates.find(t => t.id.includes('dual')) || null
  }
}
