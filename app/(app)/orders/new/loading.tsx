export default function Loading() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-6 w-40 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="h-24 bg-muted rounded animate-pulse" />
    </div>
  )
}
