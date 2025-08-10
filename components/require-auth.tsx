"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useApp } from "@/hooks/use-app"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) {
      const next = encodeURIComponent(pathname || "/dashboard")
      router.replace(`/login?next=${next}`)
    }
  }, [user, router, pathname])

  if (!user) return null
  return children as React.ReactElement
}


