"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useRef, useState } from "react"
import { Plus, Upload } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MeasurementSet } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function NewCustomerPage() {
  const router = useRouter()
  const { addCustomer } = useApp()
  const [photo, setPhoto] = useState<string | undefined>()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [ms, setMs] = useState<MeasurementSet[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function pickFileToDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const id = addCustomer({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      photo,
      measurementSets: ms,
    })
    router.replace(`/customers/${id}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24 md:pb-0">
      <Card>
        <CardHeader>
          <CardTitle>New Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2 min-w-0">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2 min-w-0">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2 min-w-0">
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Profile Photo (optional)</Label>
              <div className="flex items-center gap-3 flex-wrap">
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
                  Upload
                </Button>
                {photo && (
                  <img
                    src={photo || "/placeholder.svg"}
                    alt="preview"
                    className="h-12 w-12 rounded-md object-cover border shrink-0"
                  />
                )}
              </div>
            </div>
          </div>

          <MeasurementBuilder sets={ms} onChange={setMs} />

          {/* Desktop actions */}
          <div className="hidden md:flex gap-3">
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              Create
            </Button>
            <Button type="button" variant="outline" onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile sticky action bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Create
          </Button>
          <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}

function MeasurementBuilder({
  sets,
  onChange,
}: {
  sets: MeasurementSet[]
  onChange: (v: MeasurementSet[]) => void
}) {
  const [name, setName] = useState("Office Suit")
  const [garmentType, setGarmentType] = useState<MeasurementSet["garmentType"]>("Shirt")
  const [values, setValues] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState("")

  const presets: Record<MeasurementSet["garmentType"], string[]> = {
    Shirt: ["chest", "sleeve", "neck", "shoulder", "length"],
    Trouser: ["waist", "hip", "length", "thigh", "rise"],
    Coat: ["chest", "length", "arm", "shoulder"],
    Tie: ["length", "width"],
  }

  const fields = presets[garmentType]

  function setField(k: string, v: number) {
    setValues((x) => ({ ...x, [k]: v }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement Sets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 min-w-0">
            <Label>Set name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2 min-w-0">
            <Label>Garment type</Label>
            <select
              className="border bg-background rounded-md h-9 px-3 w-full"
              value={garmentType}
              onChange={(e) => setGarmentType(e.target.value as any)}
            >
              <option>Shirt</option>
              <option>Trouser</option>
              <option>Coat</option>
              <option>Tie</option>
            </select>
          </div>
          <div className="space-y-2 min-w-0">
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., extra slim fit" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {fields.map((f) => (
            <div key={f} className="space-y-2 min-w-0">
              <Label className="capitalize">{f}</Label>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={values[f] ?? ""}
                onChange={(e) => setField(f, Number(e.target.value))}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => {
            const set: MeasurementSet = {
              id: crypto.randomUUID(),
              name: name || `${garmentType} Set`,
              garmentType,
              values,
              notes,
              createdAt: new Date().toISOString(),
            }
            onChange([set, ...sets])
            // reset
            setName("")
            setValues({})
            setNotes("")
          }}
        >
          Add Set
        </Button>

        {sets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sets.map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name} — {s.garmentType}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
