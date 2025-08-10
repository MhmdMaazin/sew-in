"use client"

import type React from "react"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import type { Customer, Fabric, Order, OrderItem, OrderStatus, PaymentStatus, User } from "@/lib/types"
import { loadStore, saveStore, type PersistShape } from "@/lib/local-store"

type Ctx = {
  user?: User | null
  setUser: (u: User) => void
  signOut: () => void

  customers: Customer[]
  fabrics: Fabric[]
  orders: Order[]
  lowStock: Fabric[]
  upcoming: Order[]

  addCustomer: (
    c: Omit<Customer, "id" | "createdAt" | "measurementSets"> & { measurementSets?: Customer["measurementSets"] },
  ) => string
  updateCustomer: (id: string, patch: Partial<Customer>) => void

  addFabric: (f: Omit<Fabric, "id" | "createdAt">) => string
  updateFabric: (id: string, patch: Partial<Fabric>) => void

  createOrder: (o: {
    customerId: string
    items: OrderItem[]
    assignedTo?: string
    dueDate?: string
    payment: Order["payment"]
  }) => string
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void
  recordPayment: (id: string, amount: number) => void
}

export const AppContext = createContext<Ctx | null>(null)

function seed(): PersistShape {
  const now = new Date().toISOString()
  const c1: Customer = {
    id: crypto.randomUUID(),
    name: "John Doe",
    phone: "555-1234",
    email: "john@example.com",
    address: "21 Market St",
    photo: undefined,
    measurementSets: [
      {
        id: crypto.randomUUID(),
        name: "Office Suit",
        garmentType: "Coat",
        values: { chest: 100, length: 75, arm: 64 },
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Casual Shirt",
        garmentType: "Shirt",
        values: { chest: 98, sleeve: 62, neck: 39, shoulder: 46 },
        createdAt: now,
      },
    ],
    createdAt: now,
  }

  const fabrics: Fabric[] = [
    {
      id: crypto.randomUUID(),
      name: "Navy Wool",
      category: "Coat",
      type: "Wool",
      color: "Navy",
      pattern: "Solid",
      supplier: "Fabric Co",
      pricePerMeter: 45,
      stockMeters: 12,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Oxford White",
      category: "Shirt",
      type: "Cotton",
      color: "White",
      pattern: "Solid",
      supplier: "Cotton Mills",
      pricePerMeter: 12,
      stockMeters: 4,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Charcoal Twill",
      category: "Trouser",
      type: "Wool Blend",
      color: "Charcoal",
      pattern: "Twill",
      supplier: "WeaveWorks",
      pricePerMeter: 28,
      stockMeters: 2,
      createdAt: now,
    },
  ]

  const orderId = crypto.randomUUID()
  const code = "TP-0001"
  const orders: Order[] = [
    {
      id: orderId,
      code,
      customerId: c1.id,
      items: [
        {
          id: crypto.randomUUID(),
          garmentType: "Shirt",
          measurementSetId: c1.measurementSets[1].id,
          fabricId: fabrics[1].id,
          fabricMeters: 2,
        },
      ],
      assignedTo: "Sarah",
      status: "Cutting",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      createdAt: now,
      timeline: [
        { at: now, status: "Pending" },
        { at: now, status: "Cutting", note: "Pattern prepared" },
      ],
      payment: {
        total: 48 + 20,
        fabricCost: 24,
        sewingCost: 20,
        extras: 4,
        discount: 0,
        paidAmount: 20,
        status: "Partially Paid",
      },
    },
  ]

  return {
    customers: [c1],
    fabrics,
    orders,
    seq: 2,
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistShape>(() => {
    const loaded = loadStore()
    if (loaded.customers.length === 0 && loaded.fabrics.length === 0 && loaded.orders.length === 0) {
      return seed()
    }
    return loaded
  })

  const [user, setUserState] = useState<User | null>(() => {
    const loaded = loadStore()
    return loaded.user ?? null
  })

  useEffect(() => {
    saveStore({ ...state, user })
  }, [state, user])

  const setUser = useCallback((u: User) => {
    setUserState(u)
  }, [])

  const signOut = useCallback(() => {
    setUserState(null)
  }, [])

  const customers = state.customers as Customer[]
  const fabrics = state.fabrics as Fabric[]
  const orders = state.orders as Order[]

  const lowStock = useMemo(() => fabrics.filter((f) => f.stockMeters <= 3), [fabrics])
  const upcoming = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "Delivered" && o.dueDate)
        .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
        .slice(0, 6),
    [orders],
  )

  const addCustomer: Ctx["addCustomer"] = useCallback((c) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const entry: Customer = {
      id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      photo: c.photo,
      measurementSets: c.measurementSets ?? [],
      createdAt: now,
    }
    setState((s) => ({ ...s, customers: [entry, ...s.customers] }))
    return id
  }, [])

  const updateCustomer: Ctx["updateCustomer"] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      customers: s.customers.map((c: Customer) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [])

  const addFabric: Ctx["addFabric"] = useCallback((f) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const entry: Fabric = { id, createdAt: now, ...f }
    setState((s) => ({ ...s, fabrics: [entry, ...s.fabrics] }))
    return id
  }, [])

  const updateFabric: Ctx["updateFabric"] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      fabrics: s.fabrics.map((x: Fabric) => (x.id === id ? { ...x, ...patch } : x)),
    }))
  }, [])

  const createOrder: Ctx["createOrder"] = useCallback(
    (o) => {
      const id = crypto.randomUUID()
      const code = `TP-${String(state.seq ?? 1).padStart(4, "0")}`
      const now = new Date().toISOString()
      const order: Order = {
        id,
        code,
        customerId: o.customerId,
        items: o.items,
        assignedTo: o.assignedTo,
        status: "Pending",
        dueDate: o.dueDate,
        createdAt: now,
        timeline: [{ at: now, status: "Pending" }],
        payment: o.payment,
      }
      // Deduct fabric stock
      const fabricUsage: Record<string, number> = {}
      for (const item of order.items) {
        if (item.fabricId && item.fabricMeters) {
          fabricUsage[item.fabricId] = (fabricUsage[item.fabricId] ?? 0) + item.fabricMeters
        }
      }
      setState((s) => ({
        ...s,
        orders: [order, ...s.orders],
        fabrics: s.fabrics.map((f: Fabric) => {
          const used = fabricUsage[f.id]
          return used ? { ...f, stockMeters: Math.max(0, f.stockMeters - used) } : f
        }),
        seq: (s.seq ?? 1) + 1,
      }))
      return id
    },
    [state.seq],
  )

  const updateOrderStatus: Ctx["updateOrderStatus"] = useCallback((id, status, note) => {
    const at = new Date().toISOString()
    setState((s) => ({
      ...s,
      orders: s.orders.map((o: Order) =>
        o.id === id ? { ...o, status, timeline: [...o.timeline, { at, status, note }] } : o,
      ),
    }))
  }, [])

  const recordPayment: Ctx["recordPayment"] = useCallback((id, amount) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o: Order) => {
        if (o.id !== id) return o
        const paid = o.payment.paidAmount + amount
        const status: PaymentStatus = paid >= o.payment.total ? "Paid" : paid > 0 ? "Partially Paid" : "Pending"
        return { ...o, payment: { ...o.payment, paidAmount: paid, status } }
      }),
    }))
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      user,
      setUser,
      signOut,
      customers,
      fabrics,
      orders,
      lowStock,
      upcoming,
      addCustomer,
      updateCustomer,
      addFabric,
      updateFabric,
      createOrder,
      updateOrderStatus,
      recordPayment,
    }),
    [
      user,
      setUser,
      signOut,
      customers,
      fabrics,
      orders,
      lowStock,
      upcoming,
      addCustomer,
      updateCustomer,
      addFabric,
      updateFabric,
      createOrder,
      updateOrderStatus,
      recordPayment,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
