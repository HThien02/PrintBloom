"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Province {
  code: number
  name: string
  name_en?: string
}

interface Ward {
  code: string
  name: string
  name_en?: string
  province_code: string
}

interface VietnamAddressSelectorProps {
  onProvinceChange?: (provinceCode: string, provinceName: string) => void
  onWardChange?: (wardCode: string, wardName: string) => void
  className?: string
  disabled?: boolean
}

export function VietnamAddressSelector({
  onProvinceChange,
  onWardChange,
  className = "",
  disabled = false,
}: VietnamAddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedWard, setSelectedWard] = useState<string>("")
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingWards, setLoadingWards] = useState(false)

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/v2/p/")
        if (response.ok) {
          const data = await response.json()
          setProvinces(data)
        }
      } catch (error) {
        console.error("Error fetching provinces:", error)
      } finally {
        setLoadingProvinces(false)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch wards when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setWards([])
      setSelectedWard("")
      return
    }

    const fetchWards = async () => {
      setLoadingWards(true)
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/v2/w/?province=${selectedProvince}`)
        if (response.ok) {
          const data = await response.json()
          setWards(data)
          setSelectedWard("")
        }
      } catch (error) {
        console.error("Error fetching wards:", error)
        setWards([])
        setSelectedWard("")
      } finally {
        setLoadingWards(false)
      }
    }

    fetchWards()
  }, [selectedProvince])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedWard("")
    
    // Find province name from fetched data
    const province = provinces.find(p => p.code.toString() === value)
    const provinceName = province ? province.name : ""
    
    onProvinceChange?.(value, provinceName)
  }

  const handleWardChange = (value: string) => {
    setSelectedWard(value)
    
    // Find ward name from fetched data
    const ward = wards.find(w => w.code === value)
    const wardName = ward ? ward.name : ""
    
    onWardChange?.(value, wardName)
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="province">Tỉnh/Thành phố</Label>
        <Select
          value={selectedProvince}
          onValueChange={handleProvinceChange}
          disabled={disabled || loadingProvinces}
        >
          <SelectTrigger id="province" className="h-11">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.code} value={province.code.toString()}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ward">Phường/Xã</Label>
        <Select
          value={selectedWard}
          onValueChange={handleWardChange}
          disabled={disabled || !selectedProvince || loadingWards}
        >
          <SelectTrigger id="ward" className="h-11">
            <SelectValue placeholder="Chọn phường/xã" />
          </SelectTrigger>
          <SelectContent>
            {wards.map((ward) => (
              <SelectItem key={ward.code} value={ward.code}>
                {ward.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
