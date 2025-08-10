"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useApp } from "@/hooks/use-app"

export default function ReportsPage() {
  const { orders, fabrics } = useApp()

  const byMonth: { month: string; count: number }[] = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const cnt = orders.filter((o) => {
      const od = new Date(o.createdAt)
      return `${od.getFullYear()}-${od.getMonth()}` === key
    }).length
    return { month: d.toLocaleString(undefined, { month: "short" }), count: cnt }
  })

  const fabricPopularity = fabrics
    .map((f) => ({
      name: f.name,
      used: orders.reduce((acc, o) => acc + o.items.filter((it) => it.fabricId === f.id).length, 0),
    }))
    .sort((a, b) => b.used - a.used)
    .slice(0, 5)

  const revenueByMonth = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const sum = orders.reduce((acc, o) => {
      const od = new Date(o.createdAt)
      const k = `${od.getFullYear()}-${od.getMonth()}`
      return acc + (k === key ? o.payment.total : 0)
    }, 0)
    return { month: d.toLocaleString(undefined, { month: "short" }), revenue: sum }
  })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Orders (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Orders", color: "hsl(var(--primary))" },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer>
              <LineChart data={byMonth}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} />
                <ChartsTooltip content={<ChartTooltipContent />} />
                <Line dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Fabrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              used: { label: "Used", color: "hsl(var(--chart-2))" },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer>
              <BarChart data={fabricPopularity}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} />
                <ChartsTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="used" fill="var(--color-used)" radius={6}>
                  <LabelList dataKey="used" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-4))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer>
              <LineChart data={revenueByMonth}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartsTooltip content={<ChartTooltipContent />} />
                <Line dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
