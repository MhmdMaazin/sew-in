"use client"

const KEY = "sewin:v1"

export type PersistShape = {
  user?: any
  customers: any[]
  fabrics: any[]
  orders: any[]
  seq: number
}

export function loadStore(): PersistShape {
  if (typeof window === "undefined") return { customers: [], fabrics: [], orders: [], seq: 1 }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { customers: [], fabrics: [], orders: [], seq: 1 }
    const data = JSON.parse(raw)
    return { customers: [], fabrics: [], orders: [], seq: 1, ...data }
  } catch {
    return { customers: [], fabrics: [], orders: [], seq: 1 }
  }
}

export function saveStore(data: PersistShape) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(data))
}
