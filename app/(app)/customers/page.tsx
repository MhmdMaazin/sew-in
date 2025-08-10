"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CustomersPage() {
  const { customers } = useApp()
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(t) || c.phone?.includes(t) || c.email?.toLowerCase().includes(t),
    )
  }, [q, customers])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button asChild className="ml-auto">
          <Link href="/customers/new">
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={c.photo || "/placeholder.svg?height=80&width=80&query=customer%20profile"}
                  alt={`${c.name} photo`}
                />
                <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.phone || c.email}</div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/customers/${c.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
