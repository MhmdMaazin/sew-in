"use client"

import { useMemo, useRef, useState } from "react"
import { Plus, Search, Upload } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export default function FabricsPage() {
  const { fabrics, addFabric, updateFabric } = useApp()
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return fabrics
    return fabrics.filter(
      (f) =>
        f.name.toLowerCase().includes(t) ||
        f.category.toLowerCase().includes(t) ||
        f.color?.toLowerCase().includes(t) ||
        f.pattern?.toLowerCase().includes(t),
    )
  }, [q, fabrics])

  return (
    <div className="space-y-6" id="top">
      <div className="flex items-center gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search fabrics..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button asChild className="ml-auto">
          <a href="#new-fabric">
            <Plus className="w-4 h-4 mr-2" />
            Add Fabric
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <Card key={f.id} id={f.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={f.texturePhoto || "/placeholder.svg?height=80&width=80&query=fabric%20texture%20photo"}
                  alt={`${f.name}`}
                  className="h-20 w-20 rounded-md object-cover border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.category} • {f.color} • {f.pattern}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{`$${f.pricePerMeter}/m`}</Badge>
                    <Badge>{f.stockMeters} m</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateFabric(f.id, { stockMeters: f.stockMeters + 1 })}
                >
                  +1 m
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewFabricForm onSubmit={addFabric} />
    </div>
  )
}

function NewFabricForm({
  onSubmit,
}: {
  onSubmit: (f: {
    name: string
    category: any
    type?: string
    color?: string
    pattern?: string
    supplier?: string
    pricePerMeter: number
    stockMeters: number
    texturePhoto?: string
  }) => string
}) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<"Coat" | "Trouser" | "Shirt" | "Tie">("Shirt")
  const [type, setType] = useState("")
  const [color, setColor] = useState("")
  const [pattern, setPattern] = useState("")
  const [supplier, setSupplier] = useState("")
  const [pricePerMeter, setPrice] = useState<number>(10)
  const [stock, setStock] = useState<number>(5)
  const [photo, setPhoto] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function pickFileToDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  return (
    <Card id="new-fabric">
      <CardHeader>
        <CardTitle>Add Fabric</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            className="border rounded-md h-9 px-3 bg-background"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option>Coat</option>
            <option>Trouser</option>
            <option>Shirt</option>
            <option>Tie</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Wool, Cotton, Silk..." />
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Pattern</Label>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Solid, Twill, Stripes..." />
        </div>
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Price per meter</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={pricePerMeter}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Stock (meters)</Label>
          <Input type="number" min={0} step="0.1" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Texture photo</Label>
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) setPhoto(await pickFileToDataURL(f))
              }}
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            {photo && (
              <img
                src={photo || "/placeholder.svg"}
                alt="texture"
                className="h-12 w-12 rounded-md object-cover border"
              />
            )}
          </div>
        </div>
        <div className="md:col-span-3">
          <Button
            onClick={() => {
              if (!name.trim()) return
              onSubmit({
                name: name.trim(),
                category,
                type,
                color,
                pattern,
                supplier,
                pricePerMeter,
                stockMeters: stock,
                texturePhoto: photo,
              })
              // reset
              setName("")
              setType("")
              setColor("")
              setPattern("")
              setSupplier("")
              setPrice(10)
              setStock(5)
              setPhoto(undefined)
              location.hash = "#top"
            }}
          >
            Add Fabric
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
