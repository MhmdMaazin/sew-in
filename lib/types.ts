export type UserRole = "admin" | "staff"

export type User = {
  id: string
  name: string
  role: UserRole
}

export type MeasurementSet = {
  id: string
  name: string // e.g. Office Suit, Casual Shirt
  garmentType: "Shirt" | "Trouser" | "Coat" | "Tie"
  values: Record<string, number>
  notes?: string
  referenceImages?: string[] // data URLs
  createdAt: string
}

export type Customer = {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  photo?: string // data URL
  measurementSets: MeasurementSet[]
  createdAt: string
}

export type FabricCategory = "Coat" | "Trouser" | "Shirt" | "Tie"

export type Fabric = {
  id: string
  name: string
  category: FabricCategory
  type?: string
  color?: string
  pattern?: string
  supplier?: string
  pricePerMeter: number
  stockMeters: number
  texturePhoto?: string // data URL
  createdAt: string
}

export type OrderStatus = "Pending" | "Cutting" | "Sewing" | "Ready" | "Delivered"
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid"

export type OrderItem = {
  id: string
  garmentType: "Shirt" | "Trouser" | "Coat" | "Tie"
  measurementSetId?: string // can select existing
  customMeasurements?: Record<string, number>
  fabricId?: string
  fabricMeters?: number
  notes?: string
  fabricSamplePhoto?: string // data URL
}

export type Payment = {
  total: number
  fabricCost: number
  sewingCost: number
  extras?: number
  discount?: number
  paidAmount: number
  status: PaymentStatus
}

export type Order = {
  id: string
  code: string // e.g. TP-0001
  customerId: string
  assignedTo?: string // staff name
  items: OrderItem[]
  status: OrderStatus
  dueDate?: string
  createdAt: string
  timeline: { at: string; status: OrderStatus; note?: string }[]
  payment: Payment
}
