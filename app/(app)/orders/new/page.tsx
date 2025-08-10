"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Upload } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { OrderItem } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function NewOrderPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const presetCustomerId = sp.get("customerId") || undefined

  const { customers, fabrics, createOrder } = useApp()
  const [customerId, setCustomerId] = useState<string | undefined>(presetCustomerId)
  const [assignedTo, setAssignedTo] = useState("")
  const [dueDate, setDueDate] = useState<string | undefined>(undefined)
  const [items, setItems] = useState<OrderItem[]>([])
  const [sewingCost, setSewingCost] = useState(20)
  const [extras, setExtras] = useState(0)
  const [discount, setDiscount] = useState(0)

  const totalFabricCost = useMemo(() => {
    return items.reduce((acc, it) => {
      const f = fabrics.find((x) => x.id === it.fabricId)
      const meters = it.fabricMeters ?? 0
      return acc + (f ? f.pricePerMeter * meters : 0)
    }, 0)
  }, [items, fabrics])

  const total = Math.max(0, totalFabricCost + sewingCost + extras - discount)

  function addItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), garmentType: "Shirt", notes: "", fabricMeters: 1 }])
  }

  function updateItem(id: string, patch: Partial<OrderItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function handleCreate() {
    if (!customerId || items.length === 0) return
    const id = createOrder({
      customerId,
      items,
      assignedTo: assignedTo || undefined,
      dueDate,
      payment: {
        total,
        fabricCost: totalFabricCost,
        sewingCost,
        extras,
        discount,
        paidAmount: 0,
        status: "Pending",
      },
    })
    router.replace(`/orders/${id}`)
  }

  return (
    <div className="space-y-6 pb-28 md:pb-0">
      <Card>
        <CardHeader>
          <CardTitle>New Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2 min-w-0">
              <Label>Customer</Label>
              <select
                className="border rounded-md h-9 px-3 bg-background w-full"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value || undefined)}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 min-w-0">
              <Label>Assigned to</Label>
              <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Tailor/staff" />
            </div>
            <div className="space-y-2 min-w-0">
              <Label>Delivery date</Label>
              <Input type="date" value={dueDate || ""} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="font-medium">Items</div>
            <Button type="button" onClick={addItem}>
              Add item
            </Button>
          </div>

          <div className="space-y-4">
            {items.length === 0 && <div className="text-sm text-muted-foreground">No items yet.</div>}
            {items.map((it, idx) => (
              <OrderItemEditor
                key={it.id}
                index={idx + 1}
                item={it}
                onChange={(p) => updateItem(it.id, p)}
                onRemove={() => removeItem(it.id)}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1 min-w-0">
              <Label>Fabric cost</Label>
              <div className="font-medium">{`$${totalFabricCost.toFixed(2)}`}</div>
            </div>
            <div className="space-y-1 min-w-0">
              <Label>Sewing cost</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={sewingCost}
                onChange={(e) => setSewingCost(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 min-w-0">
              <Label>Extras</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={extras}
                onChange={(e) => setExtras(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 min-w-0">
              <Label>Discount</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">Items: {items.length}</Badge>
            <Badge>Total: {`$${total.toFixed(2)}`}</Badge>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex gap-3">
            <Button onClick={handleCreate}>Create Order</Button>
            <Button variant="outline" onClick={() => history.back()}>
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
          <Button className="flex-1" onClick={handleCreate} disabled={!customerId || items.length === 0}>
            Create Order
          </Button>
          <Button className="flex-1 bg-transparent" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function OrderItemEditor({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number
  item: OrderItem
  onChange: (patch: Partial<OrderItem>) => void
  onRemove: () => void
}) {
  const { customers, fabrics } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)

  function pickFileToDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const sets = customers.flatMap((c) => c.measurementSets).filter((s) => s.garmentType === item.garmentType)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Item {index}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2 min-w-0">
          <Label>Garment type</Label>
          <select
            className="border rounded-md h-9 px-3 bg-background w-full"
            value={item.garmentType}
            onChange={(e) => onChange({ garmentType: e.target.value as any, measurementSetId: undefined })}
          >
            <option>Shirt</option>
            <option>Trouser</option>
            <option>Coat</option>
            <option>Tie</option>
          </select>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Measurement set</Label>
          <select
            className="border rounded-md h-9 px-3 bg-background w-full"
            value={item.measurementSetId || ""}
            onChange={(e) => onChange({ measurementSetId: e.target.value || undefined })}
          >
            <option value="">Select set</option>
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.garmentType})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Fabric</Label>
          <select
            className="border rounded-md h-9 px-3 bg-background w-full"
            value={item.fabricId || ""}
            onChange={(e) => onChange({ fabricId: e.target.value || undefined })}
          >
            <option value="">Select fabric</option>
            {fabrics.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — ${f.pricePerMeter}/m
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Meters</Label>
          <Input
            type="number"
            min={0}
            step="0.1"
            value={item.fabricMeters ?? ""}
            onChange={(e) => onChange({ fabricMeters: Number(e.target.value) })}
          />
        </div>
        <div className="sm:col-span-2 md:col-span-4 space-y-2 min-w-0">
          <Label>Notes</Label>
          <Textarea value={item.notes || ""} onChange={(e) => onChange({ notes: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2 md:col-span-4 min-w-0">
          <Label>Attach fabric sample photo</Label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              ref={fileRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) onChange({ fabricSamplePhoto: await pickFileToDataURL(f) })
              }}
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            {item.fabricSamplePhoto && (
              <img
                src={item.fabricSamplePhoto || "/placeholder.svg"}
                alt="sample"
                className="h-12 w-12 object-cover rounded-md border shrink-0"
              />
            )}
          </div>
        </div>
        <div className="sm:col-span-2 md:col-span-4">
          <Button variant="outline" onClick={onRemove} className="w-full sm:w-auto bg-transparent">
            Remove Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
