"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Cog, Home, Shirt, ShoppingBag, Users, Warehouse } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useApp } from "@/hooks/use-app"

const nav = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Fabrics", href: "/fabrics", icon: Warehouse },
  { title: "Orders", href: "/orders", icon: ShoppingBag },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Cog },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useApp()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold mb-4">Sew-In</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={user ? item.href : "/login"}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/fabrics">
                    <Shirt />
                    <span>{"Garments & Types"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground px-2 pb-2">
        <div className="px-2">{"v1.0 — Next.js App Router"}</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
