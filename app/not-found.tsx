import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-[60svh] grid place-items-center p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders/new">Try /orders/new</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
