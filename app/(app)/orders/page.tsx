"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollText, Plus, Search } from "lucide-react"
import { useApp } from "@/hooks/use-app"

export default function OrdersPage() {
  const { orders, customers } = useApp()
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return orders
    return orders.filter((o) => o.code.toLowerCase().includes(term))
  }, [q, orders])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button asChild className="ml-auto">
          <Link href="/orders/new">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => {
          const customer = customers.find((c) => c.id === o.customerId)
          return (
            <Card key={o.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3">
                <ScrollText className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base">{o.code}</CardTitle>
                <Badge className="ml-auto">{o.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Customer: </span>
                  {customer?.name}
                </div>
                {o.dueDate && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Due: </span>
                    {new Date(o.dueDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge variant="secondary">{o.items.length} item(s)</Badge>
                  <Badge variant={o.payment.status === "Paid" ? "default" : "secondary"}>{o.payment.status}</Badge>
                </div>
                <Button asChild size="sm" className="mt-2">
                  <Link href={`/orders/${o.id}`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
