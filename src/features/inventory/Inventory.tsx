import { FormEvent, useEffect, useState } from 'react'
import { EmptyState, Field, Modal, PageHeader } from '../../components/ui'
import type { AppData, Combination, Product } from '../../types'

export function Inventory({ data, setData, notify, initialProductId = '' }: { data: AppData; setData: (value: AppData) => void; notify: (message: string) => void; initialProductId?: string }) {
  const [productId, setProductId] = useState(initialProductId)
  const [color, setColor] = useState('')
  const [combinationId, setCombinationId] = useState('')
  const [type, setType] = useState<'entry' | 'exit'>('entry')
  const [entryMode, setEntryMode] = useState<'single' | 'bulk'>('bulk')
  const [quantity, setQuantity] = useState('')
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [labels, setLabels] = useState<{ product: Product; items: { combination: Combination; quantity: number }[] } | null>(null)
  const product = data.products.find((item) => item.id === productId)
  const colors = [...new Set(product?.combinations.map((item) => item.color) ?? [])]
  const combinations = product?.combinations.filter((item) => item.color === color) ?? []
  const combination = product?.combinations.find((item) => item.id === combinationId)
  const bulkTotal = Object.values(bulkQuantities).reduce((sum, value) => sum + (Number(value) > 0 ? Number(value) : 0), 0)
  const bulkVariationCount = Object.values(bulkQuantities).filter((value) => Number(value) > 0).length

  useEffect(() => {
    if (initialProductId && data.products.some((item) => item.id === initialProductId)) setProductId(initialProductId)
  }, [initialProductId, data.products])

  function changeProduct(value: string) { setProductId(value); setColor(''); setCombinationId(''); setBulkQuantities({}); setError('') }
  function changeColor(value: string) { setColor(value); setCombinationId(''); setError('') }

  function changeType(nextType: 'entry' | 'exit') {
    setType(nextType)
    setError('')
    if (nextType === 'exit') setEntryMode('single')
  }

  function changeEntryMode(mode: 'single' | 'bulk') {
    setEntryMode(mode)
    setError('')
  }

  function adjustBulkQuantity(combinationId: string, delta: number) {
    const current = Number(bulkQuantities[combinationId] || 0)
    setBulkQuantities({ ...bulkQuantities, [combinationId]: String(Math.max(0, current + delta)) })
    setError('')
  }

  function adjustQuantity(delta: number) {
    const current = Number(quantity || 0)
    setQuantity(String(Math.max(1, current + delta)))
    setError('')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const amount = Number(quantity)
    if (!product) return setError('Selecione um produto.')

    if (type === 'entry' && entryMode === 'bulk') {
      const invalidQuantity = product.combinations.some((item) => {
        const value = bulkQuantities[item.id]?.trim()
        return value !== undefined && value !== '' && (!Number.isInteger(Number(value)) || Number(value) < 0)
      })
      if (invalidQuantity) return setError('Use somente quantidades inteiras iguais ou maiores que zero.')

      const items = product.combinations.flatMap((item) => {
        const itemQuantity = Number(bulkQuantities[item.id] || 0)
        return itemQuantity > 0 ? [{ combination: item, quantity: itemQuantity }] : []
      })
      if (!items.length) return setError('Informe a quantidade de pelo menos uma variação.')

      const quantitiesById = new Map(items.map((item) => [item.combination.id, item.quantity]))
      const updatedProduct = {
        ...product,
        combinations: product.combinations.map((item) => ({
          ...item,
          stock: item.stock + (quantitiesById.get(item.id) ?? 0),
        })),
      }
      const labelItems = items.map((item) => ({
        combination: updatedProduct.combinations.find((updated) => updated.id === item.combination.id)!,
        quantity: item.quantity,
      }))
      setData({ ...data, products: data.products.map((item) => item.id === product.id ? updatedProduct : item) })
      setBulkQuantities({}); setError('')
      setLabels({ product: updatedProduct, items: labelItems })
      notify(`Entrada em massa registrada em ${items.length} ${items.length === 1 ? 'variação' : 'variações'}.`)
      return
    }

    if (!combination) return setError('Selecione produto, cor e tamanho.')
    if (!Number.isInteger(amount) || amount <= 0) return setError('A quantidade deve ser um número inteiro maior que zero.')
    if (type === 'exit' && amount > combination.stock) return setError(`Saldo insuficiente. Há ${combination.stock} unidades disponíveis.`)
    const updatedCombination = { ...combination, stock: combination.stock + (type === 'entry' ? amount : -amount) }
    const updatedProduct = { ...product, combinations: product.combinations.map((item) => item.id === combination.id ? updatedCombination : item) }
    setData({ ...data, products: data.products.map((item) => item.id === product.id ? updatedProduct : item) })
    setQuantity(''); setError('')
    if (type === 'entry') setLabels({ product: updatedProduct, items: [{ combination: updatedCombination, quantity: amount }] })
    notify(type === 'entry' ? 'Entrada registrada com sucesso.' : 'Saída registrada com sucesso.')
  }

  return (
    <div className="inventory-screen">
      <PageHeader eyebrow="Estoque" title="Entrada e saída de produtos" description="Adicione várias variações de uma vez ou registre uma movimentação individual." />
      {data.products.length === 0 ? <EmptyState title="Cadastre um produto primeiro" text="O estoque depende das variações cadastradas em Produtos." /> : (
          <form className="panel form-grid inventory-panel" onSubmit={submit}>
            <div className="section-heading"><div><span className="eyebrow">Movimentação</span><h2>{type === 'entry' && entryMode === 'bulk' ? 'Adicione estoque em massa' : 'Identifique a variação'}</h2></div></div>
            {error && <div className="alert error" role="alert">{error}</div>}
            <div className="inventory-controls">
              <Field label="Produto" id="stock-product"><select id="stock-product" value={productId} onChange={(e) => changeProduct(e.target.value)}><option value="">Selecione</option>{data.products.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></Field>
              <fieldset><legend>Tipo de movimentação</legend><div className="segmented"><label className={type === 'entry' ? 'selected' : ''}><input type="radio" name="movement" value="entry" checked={type === 'entry'} onChange={() => changeType('entry')} /> Entrada</label><label className={type === 'exit' ? 'selected' : ''}><input type="radio" name="movement" value="exit" checked={type === 'exit'} onChange={() => changeType('exit')} /> Saída</label></div></fieldset>
              {type === 'entry' && <fieldset><legend>Forma de entrada</legend><div className="segmented"><label className={entryMode === 'bulk' ? 'selected' : ''}><input type="radio" name="entry-mode" value="bulk" checked={entryMode === 'bulk'} onChange={() => changeEntryMode('bulk')} /> Em massa</label><label className={entryMode === 'single' ? 'selected' : ''}><input type="radio" name="entry-mode" value="single" checked={entryMode === 'single'} onChange={() => changeEntryMode('single')} /> Individual</label></div></fieldset>}
            </div>
            {product && <div className="selected-product-summary"><span><small>Produto selecionado</small><strong>{product.name}</strong></span><span><small>Variações</small><strong>{product.combinations.length}</strong></span><span><small>Saldo total</small><strong>{product.combinations.reduce((sum, item) => sum + item.stock, 0)}</strong></span></div>}
            {type === 'entry' && entryMode === 'bulk' ? (
              product && <><Field label="Cor" id="bulk-stock-color" help="Escolha uma cor para visualizar apenas os tamanhos dela."><select id="bulk-stock-color" value={color} onChange={(e) => changeColor(e.target.value)}><option value="">Selecione a cor</option>{colors.map((item) => <option key={item}>{item}</option>)}</select></Field>{color ? <div className="bulk-stock">
                <div className="bulk-stock-heading"><div><strong>Quantidades para {color}</strong><small>As quantidades preenchidas em outras cores continuam salvas.</small></div><span className="counter">{combinations.length} {combinations.length === 1 ? 'tamanho' : 'tamanhos'}</span></div>
                <div className="bulk-stock-list">{combinations.map((item) => (
                  <div className="bulk-stock-row" key={item.id}>
                    <span><strong>{item.color} · Tam. {item.size}</strong><small>{item.sku} · Saldo: {item.stock}</small></span>
                    <div className="number-stepper"><button type="button" onClick={() => adjustBulkQuantity(item.id, -1)} disabled={Number(bulkQuantities[item.id] || 0) <= 0} aria-label={`Diminuir quantidade de ${item.color}, tamanho ${item.size}`}>−</button><input id={`bulk-${item.id}`} type="number" min="0" step="1" inputMode="numeric" value={bulkQuantities[item.id] ?? ''} onChange={(e) => setBulkQuantities({ ...bulkQuantities, [item.id]: e.target.value })} placeholder="0" aria-label={`Quantidade para ${item.color}, tamanho ${item.size}`} /><button type="button" onClick={() => adjustBulkQuantity(item.id, 1)} aria-label={`Aumentar quantidade de ${item.color}, tamanho ${item.size}`}>+</button></div>
                  </div>
                ))}</div>
              </div> : <div className="empty-inline stock-color-empty"><strong>Selecione uma cor</strong><span>Os tamanhos disponíveis aparecerão aqui.</span></div>}</>
            ) : <>
              <div className="two-columns"><Field label="Cor" id="stock-color"><select id="stock-color" value={color} onChange={(e) => changeColor(e.target.value)} disabled={!product}><option value="">Selecione</option>{colors.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Tamanho" id="stock-size"><select id="stock-size" value={combinationId} onChange={(e) => setCombinationId(e.target.value)} disabled={!color}><option value="">Selecione</option>{combinations.map((item) => <option value={item.id} key={item.id}>{item.size}</option>)}</select></Field></div>
              {combination && <div className="stock-info"><span>Saldo atual</span><strong>{combination.stock} unidades</strong><small>{combination.sku}</small></div>}
              <Field label="Quantidade" id="stock-quantity"><div className="number-stepper single"><button type="button" onClick={() => adjustQuantity(-1)} disabled={!quantity || Number(quantity) <= 1} aria-label="Diminuir quantidade">−</button><input id="stock-quantity" type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" /><button type="button" onClick={() => adjustQuantity(1)} aria-label="Aumentar quantidade">+</button></div></Field>
              {combination && Number(quantity) > 0 && Number.isInteger(Number(quantity)) && <div className="movement-preview"><span>Saldo após a movimentação</span><strong>{combination.stock} → {combination.stock + (type === 'entry' ? Number(quantity) : -Number(quantity))} unidades</strong></div>}
            </>}
            {type === 'entry' && entryMode === 'bulk' && bulkTotal > 0 && <div className="movement-preview"><span>Resumo desta entrada</span><strong>{bulkTotal} unidades em {bulkVariationCount} {bulkVariationCount === 1 ? 'variação' : 'variações'}</strong></div>}
            <button className="button primary full">{type === 'entry' && entryMode === 'bulk' ? bulkTotal > 0 ? `Adicionar ${bulkTotal} unidades e gerar etiquetas` : 'Adicionar estoque e gerar etiquetas' : type === 'entry' ? 'Registrar entrada' : 'Registrar saída'}</button>
          </form>
      )}
      {labels && <LabelModal {...labels} onClose={() => setLabels(null)} notify={notify} />}
    </div>
  )
}

function LabelModal({ product, items, onClose, notify }: { product: Product; items: { combination: Combination; quantity: number }[]; onClose: () => void; notify: (message: string) => void }) {
  const [printed, setPrinted] = useState(false)
  const total = items.reduce((sum, item) => sum + item.quantity, 0)
  return <Modal title="Etiquetas da entrada" onClose={onClose} wide><div className="alert info">A entrada já foi salva. Fechar esta janela não desfaz o estoque.</div><div className="label-batch-summary"><div><span>Variações</span><strong>{items.length}</strong></div><div><span>Total de etiquetas</span><strong>{total}</strong></div></div><div className="label-batch-list">{items.map(({ combination, quantity }) => <div className="label-preview" key={combination.id}><div className="fake-label"><span>LUIZERA</span><strong>{product.name}</strong><p>{combination.color} · Tam. {combination.size}</p><div className="barcode" aria-hidden="true" /><code>{combination.sku}</code></div><div className="label-quantity"><span>Quantidade</span><strong>{quantity}</strong><small>etiquetas idênticas</small></div></div>)}</div>{printed && <div className="alert success" role="status">Impressão simbólica concluída: {total} {total === 1 ? 'etiqueta' : 'etiquetas'}.</div>}<div className="modal-actions"><button className={printed ? 'button primary' : 'button secondary'} onClick={onClose}>{printed ? 'Concluir e fechar' : 'Fechar sem imprimir'}</button><button className={printed ? 'button secondary' : 'button primary'} onClick={() => { setPrinted(true); notify(`${total} ${total === 1 ? 'etiqueta impressa' : 'etiquetas impressas'} simbolicamente.`) }}>{printed ? 'Reimprimir etiquetas' : `Imprimir ${total} ${total === 1 ? 'etiqueta' : 'etiquetas'}`}</button></div></Modal>
}
