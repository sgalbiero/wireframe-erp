import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { EmptyState, Field, Modal, PageHeader } from '../../components/ui'
import type { AppData, Combination, Product, Sale, SaleItem } from '../../types'
import { dateTime, formatMoney, normalizeSearch } from '../../utils'

export function Sales({ data, setData, notify, onDraftChange }: { data: AppData; setData: (value: AppData) => void; notify: (message: string) => void; onDraftChange: (active: boolean) => void }) {
  const [selling, setSelling] = useState(false)
  const [cart, setCart] = useState<SaleItem[]>([])
  const [code, setCode] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [error, setError] = useState('')
  const [lastAddedId, setLastAddedId] = useState('')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [historySearch, setHistorySearch] = useState('')
  const codeInput = useRef<HTMLInputElement>(null)
  const productSelect = useRef<HTMLSelectElement>(null)
  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const selectedProduct = data.products.find((product) => product.id === selectedProductId)
  const colors = [...new Set(selectedProduct?.combinations.map((item) => item.color) ?? [])]
  const sizeOptions = selectedProduct?.combinations.filter((item) => item.color === selectedColor) ?? []
  const filteredSales = useMemo(() => {
    const term = normalizeSearch(historySearch)
    if (!term) return data.sales
    return data.sales.filter((sale) => normalizeSearch(`${sale.id} ${dateTime.format(new Date(sale.createdAt))} ${sale.items.map((item) => `${item.productName} ${item.sku}`).join(' ')}`).includes(term))
  }, [data.sales, historySearch])

  useEffect(() => onDraftChange(cart.length > 0), [cart.length, onDraftChange])
  useEffect(() => { if (selling) window.requestAnimationFrame(() => productSelect.current?.focus()) }, [selling])

  function findCombination(sku: string) {
    for (const product of data.products) {
      const combination = product.combinations.find((item) => item.sku.toLocaleUpperCase() === sku.trim().toLocaleUpperCase())
      if (combination) return { product, combination }
    }
  }

  function addItem(product: Product, combination: Combination) {
    const current = cart.find((item) => item.combinationId === combination.id)?.quantity ?? 0
    if (current + 1 > combination.stock) { setError(`Sem saldo disponível para ${product.name}, ${combination.color}, tamanho ${combination.size}.`); return false }
    const existing = cart.find((item) => item.combinationId === combination.id)
    setCart(existing ? cart.map((item) => item.combinationId === existing.combinationId ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { combinationId: combination.id, sku: combination.sku, productName: product.name, color: combination.color, size: combination.size, unitPrice: product.salePrice, quantity: 1 }])
    setLastAddedId(combination.id); setError('')
    window.setTimeout(() => setLastAddedId(''), 900)
    return true
  }

  function addCode(event: FormEvent) {
    event.preventDefault()
    if (!code.trim()) { setError('Digite ou leia o código da etiqueta.'); codeInput.current?.focus(); return }
    const found = findCombination(code)
    if (!found) { setError('Código não encontrado. Confira a etiqueta e tente novamente.'); codeInput.current?.select(); return }
    if (addItem(found.product, found.combination)) setCode('')
    window.requestAnimationFrame(() => codeInput.current?.focus())
  }

  function updateQuantity(item: SaleItem, next: number) {
    const found = findCombination(item.sku)
    if (!found || next > found.combination.stock) return setError(`Saldo máximo para este item: ${found?.combination.stock ?? 0}.`)
    if (next <= 0) setCart(cart.filter((cartItem) => cartItem.combinationId !== item.combinationId))
    else setCart(cart.map((cartItem) => cartItem.combinationId === item.combinationId ? { ...cartItem, quantity: next } : cartItem))
    setError('')
  }

  function finishSale() {
    if (!cart.length) { setError('Adicione pelo menos um item antes de concluir.'); productSelect.current?.focus(); return }
    for (const item of cart) {
      const found = findCombination(item.sku)
      if (!found || item.quantity > found.combination.stock) return setError(`O saldo de ${item.productName} foi alterado. Revise a quantidade.`)
    }
    const sale: Sale = { id: `VENDA-${String(data.saleSequence).padStart(3, '0')}`, createdAt: new Date().toISOString(), items: cart, total }
    const updatedProducts = data.products.map((product) => ({ ...product, combinations: product.combinations.map((combination) => { const sold = cart.find((item) => item.combinationId === combination.id); return sold ? { ...combination, stock: combination.stock - sold.quantity } : combination }) }))
    setData({ ...data, products: updatedProducts, sales: [sale, ...data.sales], saleSequence: data.saleSequence + 1 })
    setCart([]); setCode(''); setSelectedProductId(''); setSelectedColor(''); setSelling(false); setError(''); setSelectedSale(sale); notify('Venda concluída com sucesso.')
  }

  function cancelSale() {
    if (cart.length && !window.confirm('Cancelar a venda atual e remover os itens do carrinho?')) return
    setCart([]); setCode(''); setSelectedProductId(''); setSelectedColor(''); setSelling(false); setError('')
  }
  function startSale() { setSelectedSale(null); setSelling(true); setError('') }

  return <>
    <PageHeader eyebrow="Vendas" title={selling ? 'Nova venda' : 'Vendas realizadas'} description={selling ? 'Selecione o produto e a cor; os tamanhos disponíveis aparecem logo abaixo.' : 'Consulte as vendas concluídas ou inicie um novo atendimento.'} action={!selling ? <button className="button primary" onClick={startSale}>Nova venda</button> : undefined} />
    {selling ? <div className="sale-layout"><section className="panel sale-main">
      <div className="sale-selection"><Field label="Produto" id="sale-product"><select ref={productSelect} id="sale-product" value={selectedProductId} onChange={(event) => { setSelectedProductId(event.target.value); setSelectedColor(''); setError('') }}><option value="">Selecione pelo nome</option>{[...data.products].sort((a, b) => Number(b.combinations.some((item) => item.stock > 0)) - Number(a.combinations.some((item) => item.stock > 0))).map((product) => <option key={product.id} value={product.id}>{product.name}{product.combinations.some((item) => item.stock > 0) ? '' : ' — sem estoque'}</option>)}</select></Field><Field label="Cor" id="sale-color"><select id="sale-color" value={selectedColor} onChange={(event) => { setSelectedColor(event.target.value); setError('') }} disabled={!selectedProduct}><option value="">Selecione a cor</option>{colors.map((color) => <option key={color}>{color}</option>)}</select></Field></div>
      {selectedProduct && selectedColor && <section className="variation-picker" aria-labelledby="variation-picker-title"><div className="section-heading"><div><span className="eyebrow">{selectedProduct.name} · {selectedColor}</span><h2 id="variation-picker-title">Escolha o tamanho</h2></div></div><div className="variation-options">{sizeOptions.map((combination) => <button type="button" key={combination.id} disabled={combination.stock === 0} onClick={() => addItem(selectedProduct, combination)}><strong>Tam. {combination.size}</strong><span>{combination.stock > 0 ? `${combination.stock} em estoque` : 'Sem estoque'}</span><b>{combination.stock > 0 ? 'Adicionar' : 'Indisponível'}</b></button>)}</div></section>}
      <details className="sku-entry"><summary>Adicionar pelo código da etiqueta</summary><form onSubmit={addCode}><div className="inline-input"><input ref={codeInput} id="sale-code" value={code} onChange={(event) => { setCode(event.target.value); setError('') }} autoComplete="off" placeholder="Leia ou digite o SKU" aria-label="Código da etiqueta" /><button className="button secondary">Adicionar item</button></div></form></details>
      {error && <div className="alert error sale-error" role="alert">{error}</div>}
      <div className="section-heading compact"><h2>Itens da venda</h2><span className="counter">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span></div>
      {cart.length === 0 ? <div className="empty-cart"><strong>Carrinho vazio</strong><p>Selecione produto, cor e tamanho ou use o código da etiqueta.</p></div> : <div className="cart-list" aria-live="polite">{cart.map((item) => <article className={lastAddedId === item.combinationId ? 'cart-item just-added' : 'cart-item'} key={item.combinationId}><div><strong>{item.productName}</strong><span>{item.color} · Tam. {item.size}</span><small>{item.sku}</small></div><div className="quantity-control"><button aria-label={`Diminuir ${item.productName}`} onClick={() => updateQuantity(item, item.quantity - 1)}>−</button><span>{item.quantity}</span><button aria-label={`Aumentar ${item.productName}`} onClick={() => updateQuantity(item, item.quantity + 1)}>+</button></div><strong>{formatMoney(item.unitPrice * item.quantity)}</strong><button className="text-button danger" onClick={() => updateQuantity(item, 0)}>Remover</button></article>)}</div>}
    </section><aside className="panel sale-summary"><span className="eyebrow">Resumo</span><h2>Total da venda</h2><div className="total"><span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span><strong>{formatMoney(total)}</strong></div><button className="button primary full" onClick={finishSale}>Concluir venda</button><button className="button secondary full" onClick={cancelSale}>Cancelar venda</button><p>{cart.length ? 'O estoque será atualizado somente após a conclusão.' : 'Adicione um item para concluir a venda.'}</p></aside></div>
    : data.sales.length === 0 ? <EmptyState title="Nenhuma venda realizada" text="Inicie uma venda e adicione produtos pelo código da etiqueta ou pelo nome." action="Nova venda" onClick={startSale} /> : <section className="panel table-panel"><div className="section-heading catalog-heading"><div><span className="eyebrow">Histórico</span><h2>Vendas concluídas</h2></div><span className="counter">{filteredSales.length} de {data.sales.length}</span></div><div className="table-toolbar"><label className="sr-only" htmlFor="sales-search">Buscar vendas</label><input id="sales-search" type="search" value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder="Buscar por venda, produto, data ou SKU" /></div>{filteredSales.length === 0 ? <div className="empty-inline"><strong>Nenhuma venda encontrada</strong><span>Tente outro termo de busca.</span></div> : <div className="table-scroll"><table className="responsive-table"><thead><tr><th>Venda</th><th>Data e hora</th><th>Itens</th><th>Total</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{filteredSales.map((sale) => <tr key={sale.id}><td data-label="Venda"><strong>{sale.id}</strong></td><td data-label="Data e hora">{dateTime.format(new Date(sale.createdAt))}</td><td data-label="Itens">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td data-label="Total"><strong>{formatMoney(sale.total)}</strong></td><td data-label="Ações"><button className="text-button" onClick={() => setSelectedSale(sale)}>Ver detalhes</button></td></tr>)}</tbody></table></div>}</section>}
    {selectedSale && <SaleDetail sale={selectedSale} onClose={() => setSelectedSale(null)} onNewSale={startSale} />}
  </>
}

function SaleDetail({ sale, onClose, onNewSale }: { sale: Sale; onClose: () => void; onNewSale: () => void }) {
  return <Modal title={`${sale.id} concluída`} onClose={onClose} wide><div className="success-block"><span aria-hidden="true">✓</span><p>Venda concluída e estoque atualizado.</p></div><div className="detail-meta"><span>Concluída em {dateTime.format(new Date(sale.createdAt))}</span><strong>{formatMoney(sale.total)}</strong></div><div className="detail-list">{sale.items.map((item) => <div key={item.combinationId}><div><strong>{item.productName}</strong><span>{item.color} · Tam. {item.size} · {item.sku}</span></div><span>{item.quantity} × {formatMoney(item.unitPrice)}</span><strong>{formatMoney(item.quantity * item.unitPrice)}</strong></div>)}</div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Voltar ao histórico</button><button className="button primary" onClick={onNewSale}>Iniciar próxima venda</button></div></Modal>
}
