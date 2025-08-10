import type React from "react"
import { DataProvider } from "@/components/data-provider"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Ensure auth pages cannot overflow horizontally on mobile
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <DataProvider>{children}</DataProvider>
    </div>
  )
}
