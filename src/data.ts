import type { AppData } from './types'

const now = new Date().toISOString()

export const demoData: AppData = {
  productSequence: 4,
  saleSequence: 2,
  products: [
    {
      id: 'produto-001',
      name: 'Tênis Urbano',
      costPrice: 8990,
      salePrice: 15990,
      createdAt: now,
      combinations: [
        { id: 'comb-001', color: 'Preto', size: '38', sku: 'SKU-001-PRETO-38', stock: 8 },
        { id: 'comb-002', color: 'Preto', size: '40', sku: 'SKU-001-PRETO-40', stock: 5 },
        { id: 'comb-003', color: 'Branco', size: '37', sku: 'SKU-001-BRANCO-37', stock: 3 },
      ],
    },
    {
      id: 'produto-002',
      name: 'Sandália Conforto',
      costPrice: 5590,
      salePrice: 9990,
      createdAt: now,
      combinations: [
        { id: 'comb-004', color: 'Caramelo', size: '35', sku: 'SKU-002-CARAMELO-35', stock: 6 },
        { id: 'comb-005', color: 'Caramelo', size: '37', sku: 'SKU-002-CARAMELO-37', stock: 4 },
      ],
    },
    {
      id: 'produto-003',
      name: 'Sapato Social',
      costPrice: 11000,
      salePrice: 21990,
      createdAt: now,
      combinations: [
        { id: 'comb-006', color: 'Marrom', size: '40', sku: 'SKU-003-MARROM-40', stock: 2 },
        { id: 'comb-007', color: 'Preto', size: '42', sku: 'SKU-003-PRETO-42', stock: 1 },
      ],
    },
  ],
  sales: [
    {
      id: 'VENDA-001',
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      total: 15990,
      items: [
        {
          combinationId: 'comb-001',
          sku: 'SKU-001-PRETO-38',
          productName: 'Tênis Urbano',
          color: 'Preto',
          size: '38',
          unitPrice: 15990,
          quantity: 1,
        },
      ],
    },
  ],
}

export function freshDemoData(): AppData {
  return JSON.parse(JSON.stringify(demoData)) as AppData
}
