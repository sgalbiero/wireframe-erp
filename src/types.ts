export type Screen = 'overview' | 'products' | 'inventory' | 'sales'

export type Combination = {
  id: string
  color: string
  size: string
  sku: string
  stock: number
}

export type Product = {
  id: string
  name: string
  costPrice: number
  salePrice: number
  combinations: Combination[]
  createdAt: string
}

export type SaleItem = {
  combinationId: string
  sku: string
  productName: string
  color: string
  size: string
  unitPrice: number
  quantity: number
}

export type Sale = {
  id: string
  createdAt: string
  items: SaleItem[]
  total: number
}

export type AppData = {
  products: Product[]
  sales: Sale[]
  productSequence: number
  saleSequence: number
}
