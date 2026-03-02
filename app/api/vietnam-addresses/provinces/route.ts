import { NextResponse } from "next/server"
import { fetchProvinces } from "@/lib/vietnam-address-api"

export async function GET() {
  try {
    console.log("Fetching provinces from Vietnam API")
    
    const provinces = await fetchProvinces()
    console.log("Fetched provinces count:", provinces.length)
    
    return NextResponse.json(provinces)
  } catch (error) {
    console.error("Error fetching provinces:", error)
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: 500 }
    )
  }
}
