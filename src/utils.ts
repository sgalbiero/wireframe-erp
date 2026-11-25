const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function formatMoney(cents: number) {
  return money.format(cents / 100)
}

export function parseMoney(value: string) {
  const text = value.replace(/\s/g, '')
  if (!text) return NaN
  let normalized: string
  if (text.includes(',')) normalized = text.replace(/\./g, '').replace(',', '.')   // 1.234,56
  else if (/^\d+\.\d{1,2}$/.test(text)) normalized = text                          // 89.90
  else normalized = text.replace(/\./g, '')                                         // 1.234
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : NaN
}

export function slug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase()
}

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim()
}

export function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}
