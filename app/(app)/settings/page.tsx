"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  // For prototype only. You could persist shop settings similarly in localStorage or to a DB later.
  const [shopName, setShopName] = useState("Sew-In Demo Shop")
  const [currency, setCurrency] = useState("USD")
  const [defaultSewingCost, setDefaultSewingCost] = useState(20)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Shop name</Label>
            <Input value={shopName} onChange={(e) => setShopName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Default sewing cost</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={defaultSewingCost}
              onChange={(e) => setDefaultSewingCost(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-3">
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
