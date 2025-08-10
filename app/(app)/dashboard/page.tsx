"use client"

import Link from "next/link"
import { AlertTriangle, CalendarDays, ScrollText, Shirt, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/hooks/use-app"

export default function DashboardPage() {
  const { customers, orders, fabrics, lowStock, upcoming } = useApp()

  const totalRevenue = orders.reduce((acc, o) => acc + o.payment.total, 0)
  const paid = orders.reduce((acc, o) => acc + o.payment.paidAmount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Customers</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold">{customers.length}</div>
            <Users className="w-8 h-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold">{orders.length}</div>
            <ScrollText className="w-8 h-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-2 min-w-0">
            <div className="text-3xl font-bold">{`$${totalRevenue.toFixed(2)}`}</div>
            <Badge variant="secondary" className="sm:ml-2 self-start md:self-auto">Paid {`$${paid.toFixed(2)}`}</Badge>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fabrics</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold">{fabrics.length}</div>
            <Shirt className="w-8 h-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Low Stock Fabrics</CardTitle>
            <Badge variant="destructive" className="ml-auto">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {lowStock.length}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {lowStock.length === 0 && <div className="p-4 text-sm text-muted-foreground">All good 🎉</div>}
              {lowStock.map((f) => (
                <div key={f.id} className="p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.category} • {f.color} • {f.pattern}
                    </div>
                  </div>
                  <Badge variant="secondary">{f.stockMeters} m</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/fabrics#${f.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Upcoming Due Dates</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {upcoming.length === 0 && <div className="p-4 text-sm text-muted-foreground">No upcoming deadlines</div>}
              {upcoming.map((o) => (
                <div key={o.id} className="p-4 flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{o.code}</div>
                    <div className="text-xs text-muted-foreground">Due {new Date(o.dueDate!).toLocaleDateString()}</div>
                  </div>
                  <Badge>{o.status}</Badge>
                  <Button asChild size="sm">
                    <Link href={`/orders/${o.id}`}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/orders/new">New Order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/customers/new">Add Customer</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/fabrics/#new-fabric">Add Fabric</Link>
        </Button>
      </div>
    </div>
  )
}
