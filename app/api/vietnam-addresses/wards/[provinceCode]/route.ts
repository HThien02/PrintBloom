import { NextResponse } from "next/server"
import { fetchWards } from "@/lib/vietnam-address-api"

export async function GET(
  request: Request,
  { params }: { params: { provinceCode: string } }
) {
  try {
    const { provinceCode } = params
    
    console.log("Fetching wards for provinceCode:", provinceCode)
    
    if (!provinceCode) {
      return NextResponse.json(
        { error: "Province code is required" },
        { status: 400 }
      )
    }
    
    // Fetch from official Vietnam government APIs
    const wards = await fetchWards(provinceCode)
    
    console.log("Wards fetched:", wards.length)
    
    if (wards.length === 0) {
      return NextResponse.json(
        { error: "Province not found or no wards available" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(wards)
  } catch (error) {
    console.error("Error fetching wards:", error)
    return NextResponse.json(
      { error: "Failed to fetch wards" },
      { status: 500 }
    )
  }
}
