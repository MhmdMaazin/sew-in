import type React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { DataProvider } from "@/components/data-provider"
import RequireAuth from "@/components/require-auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SidebarProvider className="overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="w-full max-w-full min-w-0">
          <Topbar />
          <RequireAuth>
            <main className="w-full max-w-full overflow-x-hidden p-4 md:p-6">{children}</main>
          </RequireAuth>
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  )
}
