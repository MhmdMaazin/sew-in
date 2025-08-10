"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useApp } from "@/hooks/use-app"

export default function LoginPage() {
  const router = useRouter()
  const { user, setUser } = useApp()
  const sp = useSearchParams()
  const [name, setName] = useState("")
  const [role, setRole] = useState<"admin" | "staff">("admin")

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-[calc(100svh)] grid place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sew-In</CardTitle>
          <CardDescription>Sign in to manage customers, fabrics, and orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" placeholder="e.g., Aisha" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-3">
            <Label>User role</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as "admin" | "staff")}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem id="r1" value="admin" />
                <Label htmlFor="r1" className="cursor-pointer">
                  Admin
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem id="r2" value="staff" />
                <Label htmlFor="r2" className="cursor-pointer">
                  Staff/Tailor
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              if (!name.trim()) return
              setUser({ id: crypto.randomUUID(), name: name.trim(), role })
              const next = sp.get("next") || "/dashboard"
              router.replace(next)
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
