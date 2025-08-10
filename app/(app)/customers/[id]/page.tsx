"use client"

import { notFound, useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import { Edit, Plus, Upload } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { customers, updateCustomer } = useApp()
  const customer = useMemo(() => customers.find((c) => c.id === params.id), [customers, params.id])
  const fileRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(customer?.name ?? "")
  const [phone, setPhone] = useState(customer?.phone ?? "")
  const [email, setEmail] = useState(customer?.email ?? "")
  const [address, setAddress] = useState(customer?.address ?? "")
  const [photo, setPhoto] = useState<string | undefined>(customer?.photo)

  if (!customer) return notFound()

  function pickFileToDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const measurementSets = customer.measurementSets

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <CardTitle className="flex-1">{customer.name}</CardTitle>
          <Button variant="outline" onClick={() => setEditing((s) => !s)} className="gap-2">
            <Edit className="w-4 h-4" />
            {editing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input disabled={!editing} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input disabled={!editing} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled={!editing} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Input disabled={!editing} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              <img
                src={photo || "/placeholder.svg?height=64&width=64&query=customer%20profile"}
                alt="profile"
                className="h-14 w-14 rounded-md object-cover border"
              />
              {editing && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (f) {
                        const data = await pickFileToDataURL(f)
                        setPhoto(data)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
                    <Upload className="w-4 h-4" />
                    Replace
                  </Button>
                </>
              )}
            </div>
          </div>

          {editing && (
            <div className="md:col-span-3">
              <Button
                onClick={() => {
                  updateCustomer(customer.id, { name, phone, email, address, photo })
                  setEditing(false)
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>Measurement Sets</CardTitle>
          <Button asChild className="ml-auto">
            <a href={`/orders/new?customerId=${customer.id}`}>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </a>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {measurementSets.length === 0 && <div className="text-sm text-muted-foreground">No sets yet.</div>}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {measurementSets.map((s) => (
              <div key={s.id} className="border rounded-md p-4">
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{s.garmentType}</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(s.values).map(([k, v]) => (
                    <Badge key={k} variant="secondary" className="capitalize">
                      {k}: {v}
                    </Badge>
                  ))}
                </div>
                {s.notes && <div className="text-xs text-muted-foreground mt-2">{s.notes}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
