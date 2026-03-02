// Vietnamese Administrative Divisions API Integration
// Using official Vietnam government APIs (2025 version)

export interface Province {
  code: number
  name: string
  name_en?: string
}

export interface Ward {
  code: string
  name: string
  name_en?: string
  province_code: string
  division_type?: string
  codename?: string
}

// API Endpoints for Vietnam Administrative Divisions (2025 version)
const VIETNAM_ADDRESS_API = {
  PROVINCES: 'https://provinces.open-api.vn/api/v2/p/',
  WARDS: (provinceCode: string) => `https://provinces.open-api.vn/api/v2/w/?province=${provinceCode}`,
  WARD_DETAIL: (wardCode: string) => `https://provinces.open-api.vn/api/v2/w/${wardCode}`,
}

export async function fetchProvinces(): Promise<Province[]> {
  console.log("fetchProvinces called")
  
  try {
    const response = await fetch(VIETNAM_ADDRESS_API.PROVINCES, {
      headers: {
        'User-Agent': 'TPrint-Checkout/1.0',
      },
      next: { revalidate: 86400 },
    })
    
    console.log("Provinces API response status:", response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log("Provinces API response data length:", data.length)
      
      // API returns direct array of provinces
      return data.map((item: any) => ({
        code: item.code,
        name: item.name,
        name_en: item.codename || item.name,
      }))
    }
  } catch (error) {
    console.warn('Primary province API failed:', error)
  }

  // Ultimate fallback - return hardcoded current provinces
  return getFallbackProvinces()
}

export async function fetchWards(provinceCode: string | number): Promise<Ward[]> {
  console.log("fetchWards called with provinceCode:", provinceCode)
  
  try {
    // Use v2 wards API with province filter from documentation
    const apiUrl = VIETNAM_ADDRESS_API.WARDS(String(provinceCode))
    console.log("Fetching wards from:", apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'TPrint-Checkout/1.0',
      },
      next: { revalidate: 86400 },
    })
    
    console.log("Wards API response status:", response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log("Wards API response data length:", data.length)
      
      if (data.length > 0) {
        const wards = data.map((item: any) => ({
          code: item.code.toString(),
          name: item.name,
          name_en: item.codename || item.name,
          province_code: String(provinceCode),
          division_type: item.division_type,
          codename: item.codename,
        }))
        console.log("Processed wards:", wards)
        return wards
      } else {
        console.log("No wards found for province:", provinceCode)
      }
    }
  } catch (error) {
    console.warn('Primary ward API failed:', error)
  }

  return []
}

// Fallback data for critical situations
function getFallbackProvinces(): Province[] {
  return [
    { code: 1, name: "Thành phố Hà Nội" },
    { code: 79, name: "Thành phố Hồ Chí Minh" },
    { code: 48, name: "Thành phố Đà Nẵng" },
    { code: 31, name: "Thành phố Hải Phòng" },
    { code: 46, name: "Tỉnh Thừa Thiên Huế" },
  ]
}
