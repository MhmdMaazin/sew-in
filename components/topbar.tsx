"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Bell, LogOut, Search, User2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/hooks/use-app"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Topbar() {
  const { user, signOut, customers, orders, fabrics } = useApp()
  const [q, setQ] = useState("")
  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    const cx = customers
      .filter((c) => c.name.toLowerCase().includes(term) || c.phone?.includes(term))
      .map((c) => ({ type: "Customer", label: c.name, href: `/customers/${c.id}` }))
    const ox = orders
      .filter((o) => o.code.toLowerCase().includes(term))
      .map((o) => ({ type: "Order", label: o.code, href: `/orders/${o.id}` }))
    const fx = fabrics
      .filter((f) => f.name.toLowerCase().includes(term))
      .map((f) => ({ type: "Fabric", label: f.name, href: `/fabrics#${f.id}` }))
    return [...cx, ...ox, ...fx].slice(0, 6)
  }, [q, customers, orders, fabrics])

  return (
    <header className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background px-2 sm:px-4 h-14 w-full">
      <SidebarTrigger className="-ml-1 sm:-ml-1 shrink-0" />
      <div className="relative flex-1 min-w-0 max-w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers, orders, fabrics..."
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 max-h-[60svh] overflow-auto rounded-md border bg-popover text-popover-foreground shadow z-50">
            {results.map((r, i) => (
              <Link key={i} href={r.href} className="block px-3 py-2 text-sm hover:bg-accent">
                <span className="text-muted-foreground mr-2">{r.type}:</span>
                <span className="font-medium">{r.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="w-5 h-5" />
        <span className="sr-only">Notifications</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 shrink-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="avatar" />
              <AvatarFallback>
                <User2 className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm">{user?.name ?? "Guest"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login">Sign in</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
