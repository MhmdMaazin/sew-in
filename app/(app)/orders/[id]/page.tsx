"use client"

import { notFound } from "next/navigation"
import { ArrowRight, Download, MoveRight } from "lucide-react"
import { jsPDF } from "jspdf"

import { useApp } from "@/hooks/use-app"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { OrderStatus } from "@/lib/types"

const flow: OrderStatus[] = ["Pending", "Cutting", "Sewing", "Ready", "Delivered"]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { orders, customers, fabrics, updateOrderStatus, recordPayment } = useApp()
  const order = orders.find((o) => o.id === params.id)
  if (!order) return notFound()

  const customer = customers.find((c) => c.id === order.customerId)
  const totalDue = Math.max(0, order.payment.total - order.payment.paidAmount)

  function nextStatus(s: OrderStatus): OrderStatus | null {
    const i = flow.indexOf(s)
    if (i === -1 || i === flow.length - 1) return null
    return flow[i + 1]
  }

  function generatePDF() {
    const doc = new jsPDF()
    let y = 10
    doc.setFontSize(16)
    doc.text("Sew-In Receipt / Invoice", 10, y)
    y += 8
    doc.setFontSize(12)
    doc.text(`Order: ${order.code}`, 10, y)
    y += 6
    doc.text(`Customer: ${customer?.name ?? ""}`, 10, y)
    y += 6
    doc.text(`Status: ${order.status}`, 10, y)
    y += 10

    doc.setFontSize(12)
    doc.text("Items:", 10, y)
    y += 6
    order.items.forEach((it, idx) => {
      const f = fabrics.find((fa) => fa.id === it.fabricId)
      doc.text(`${idx + 1}. ${it.garmentType} — Fabric: ${f?.name ?? "N/A"} — ${it.fabricMeters ?? 0} m`, 12, y)
      y += 6
      if (it.fabricSamplePhoto) {
        try {
          doc.addImage(it.fabricSamplePhoto, "JPEG", 12, y, 20, 20)
          y += 22
        } catch {
          // ignore if unsupported
        }
      }
    })
    y += 4
    doc.text(`Fabric: $${order.payment.fabricCost.toFixed(2)}`, 10, y)
    y += 6
    doc.text(`Sewing: $${order.payment.sewingCost.toFixed(2)}`, 10, y)
    y += 6
    if (order.payment.extras) {
      doc.text(`Extras: $${order.payment.extras.toFixed(2)}`, 10, y)
      y += 6
    }
    if (order.payment.discount) {
      doc.text(`Discount: -$${order.payment.discount.toFixed(2)}`, 10, y)
      y += 6
    }
    doc.text(`Total: $${order.payment.total.toFixed(2)}`, 10, y)
    y += 6
    doc.text(`Paid: $${order.payment.paidAmount.toFixed(2)} — Status: ${order.payment.status}`, 10, y)
    y += 10
    doc.text("Thank you!", 10, y)

    doc.save(`${order.code}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">{order.code}</div>
        <Badge className="ml-2">{order.status}</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={generatePDF} className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Invoice PDF
          </Button>
          {nextStatus(order.status) && (
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, nextStatus(order.status) as OrderStatus)}
              className="gap-2"
            >
              Move to {nextStatus(order.status)} <MoveRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Customer</div>
            <div className="font-medium">{customer?.name}</div>
          </div>
          <div>
            {order.dueDate && (
              <>
                <div className="text-sm text-muted-foreground">Due Date</div>
                <div className="font-medium">{new Date(order.dueDate).toLocaleDateString()}</div>
              </>
            )}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Assigned</div>
            <div className="font-medium">{order.assignedTo || "-"}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((it) => {
            const f = fabrics.find((fa) => fa.id === it.fabricId)
            return (
              <div key={it.id} className="border rounded-md p-4 flex items-center gap-3">
                <div className="font-medium w-28">{it.garmentType}</div>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Fabric: </span>
                    {f?.name ?? "N/A"} {it.fabricMeters ? `• ${it.fabricMeters} m` : ""}
                  </div>
                  {it.notes && <div className="text-xs text-muted-foreground">{it.notes}</div>}
                </div>
                {it.fabricSamplePhoto && (
                  <img
                    src={it.fabricSamplePhoto || "/placeholder.svg"}
                    alt="sample"
                    className="h-12 w-12 rounded-md object-cover border"
                  />
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-medium">{`$${order.payment.total.toFixed(2)}`}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="font-medium">{`$${order.payment.paidAmount.toFixed(2)}`}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Due</div>
            <div className="font-medium">{`$${totalDue.toFixed(2)}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Amount"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = Number((e.target as HTMLInputElement).value)
                  if (v > 0) {
                    recordPayment(order.id, v)
                    ;(e.target as HTMLInputElement).value = ""
                  }
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                const input = document.activeElement as HTMLInputElement
                const v = Number(input?.value ?? 0)
                if (v > 0) {
                  recordPayment(order.id, v)
                  if (input) input.value = ""
                }
              }}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {flow.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <Badge variant={s === order.status ? "default" : "secondary"}>{s}</Badge>
                {i < flow.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Updated {new Date(order.timeline[order.timeline.length - 1].at).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
