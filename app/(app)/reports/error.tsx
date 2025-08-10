"use client"

import { Button } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="p-4">
      <div className="text-sm text-destructive mb-2">Failed to load reports.</div>
      <Button variant="outline" onClick={reset}>Retry</Button>
    </div>
  )
}


