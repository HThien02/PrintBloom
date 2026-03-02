import { useLanguage } from "@/lib/language-context"

// Helper function to make API requests with language header
export function createApiRequest() {
  const { locale } = useLanguage()
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    }
  }
}

// For usage outside React components
export function getApiHeaders(locale?: string) {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': locale || 'en',
  }
}
