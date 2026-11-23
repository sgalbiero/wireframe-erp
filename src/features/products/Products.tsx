import { FormEvent, useMemo, useState } from 'react'
import { EmptyState, Field, Modal, PageHeader } from '../../components/ui'
import type { AppData, Combination, Product } from '../../types'
import { formatMoney, id, normalizeSearch, parseMoney, slug } from '../../utils'

export function Products({ data, setData, notify, onAddStock }: { data: AppData; setData: (value: AppData) => void; notify: (message: string) => void; onAddStock: (productId: string) => void }) {
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState('')
  const filteredProducts = useMemo(() => {
    const term = normalizeSearch(search)
    if (!term) return data.products
    return data.products.filter((product) => normalizeSearch(`${product.name} ${product.combinations.map((item) => item.sku).join(' ')}`).includes(term))
  }, [data.products, search])

  function saveProduct(product: Product) {
    setData({ ...data, products: [...data.products, product], productSequence: data.productSequence + 1 })
    setCreating(false)
    setCreated(product)
    notify('Produto cadastrado com sucesso.')
  }

  return <>
    <PageHeader eyebrow="Produtos" title="Produtos e variações" description="Cadastre o modelo e informe uma única vez as cores e os tamanhos disponíveis." action={<button className="button primary" onClick={() => setCreating(true)}>Cadastrar produto</button>} />
    {data.products.length === 0 ? <EmptyState title="Nenhum produto cadastrado" text="Cadastre o primeiro produto para liberar estoque e vendas." action="Cadastrar produto" onClick={() => setCreating(true)} /> : <section className="panel table-panel" aria-labelledby="lista-produtos">
      <div className="section-heading catalog-heading"><div><span className="eyebrow">Catálogo</span><h2 id="lista-produtos">Produtos cadastrados</h2></div><span className="counter">{filteredProducts.length} de {data.products.length}</span></div>
      <div className="table-toolbar"><label htmlFor="product-search" className="sr-only">Buscar produtos</label><input id="product-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou SKU" /></div>
      {filteredProducts.length === 0 ? <div className="empty-inline"><strong>Nenhum produto encontrado</strong><span>Tente outro nome ou código.</span></div> : <div className="table-scroll"><table className="responsive-table"><thead><tr><th>Produto</th><th>Preço de custo</th><th>Preço de venda</th><th>Variações</th><th>Saldo total</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{filteredProducts.map((product) => {
        const expanded = expandedId === product.id
        return [<tr key={product.id}><td data-label="Produto"><strong>{product.name}</strong><small>{product.combinations[0]?.sku.split('-').slice(0, 2).join('-')}</small></td><td data-label="Preço de custo">{formatMoney(product.costPrice)}</td><td data-label="Preço de venda">{formatMoney(product.salePrice)}</td><td data-label="Variações">{product.combinations.length}</td><td data-label="Saldo total">{product.combinations.reduce((sum, item) => sum + item.stock, 0)}</td><td data-label="Ações"><button className="text-button" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? '' : product.id)}>{expanded ? 'Ocultar' : 'Ver variações'}</button></td></tr>, expanded && <tr className="expanded-row" key={`${product.id}-details`}><td colSpan={6}><div className="variation-detail-list">{product.combinations.map((item) => <div key={item.id}><span><strong>{item.color} · Tam. {item.size}</strong><small>{item.sku}</small></span><b>{item.stock} em estoque</b></div>)}</div></td></tr>]
      })}</tbody></table></div>}
    </section>}
    {creating && <ProductWizard sequence={data.productSequence} existingNames={data.products.map((item) => item.name)} onCancel={() => setCreating(false)} onSave={saveProduct} />}
    {created && <Modal title="Produto cadastrado" onClose={() => setCreated(null)}><div className="success-block"><span aria-hidden="true">✓</span><p><strong>{created.name}</strong> foi cadastrado com {created.combinations.length} variações.</p></div><p>Você pode adicionar o estoque inicial agora ou continuar na lista de produtos.</p><div className="modal-actions"><button className="button secondary" onClick={() => setCreated(null)}>Continuar em produtos</button><button className="button primary" onClick={() => { setCreated(null); onAddStock(created.id) }}>Adicionar estoque</button></div></Modal>}
  </>
}

function ProductWizard({ sequence, existingNames, onCancel, onSave }: { sequence: number; existingNames: string[]; onCancel: () => void; onSave: (product: Product) => void }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [sale, setSale] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [colors, setColors] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const costCents = parseMoney(cost)
  const saleCents = parseMoney(sale)
  const dirty = Boolean(name || cost || sale || colorInput || colors.length || sizeInput || sizes.length)
  const duplicateName = name.trim() && existingNames.some((item) => normalizeSearch(item) === normalizeSearch(name))
  const saleBelowCost = cost.trim() !== '' && sale.trim() !== '' && Number.isFinite(costCents) && Number.isFinite(saleCents) && saleCents < costCents

  function requestCancel() { if (dirty && !window.confirm('Descartar os dados deste produto?')) return; onCancel() }
  function nextFromDetails(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!name.trim()) nextErrors.name = 'Informe o nome do produto.'
    if (!Number.isFinite(costCents) || costCents < 0) nextErrors.cost = 'Informe um preço de custo válido.'
    if (!Number.isFinite(saleCents) || saleCents <= 0) nextErrors.sale = 'O preço de venda deve ser maior que zero.'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setError(''); setStep(2)
  }
  function addColor() {
    const value = colorInput.trim()
    if (!value) return setError('Digite uma cor antes de adicionar.')
    if (colors.some((color) => normalizeSearch(color) === normalizeSearch(value))) return setError('Essa cor já foi adicionada.')
    setColors([...colors, value]); setColorInput(''); setError('')
  }
  function nextFromColors() {
    if (!colors.length) return setError('Adicione pelo menos uma cor.')
    setError(''); setStep(3)
  }
  function addSize() {
    const value = sizeInput.trim()
    if (!value) return setError('Digite um tamanho antes de adicionar.')
    if (sizes.some((size) => normalizeSearch(size) === normalizeSearch(value))) return setError('Esse tamanho já foi adicionado.')
    setSizes([...sizes, value]); setSizeInput(''); setError('')
  }
  function removeSize(size: string) { setSizes(sizes.filter((item) => item !== size)) }
  function finish() {
    if (!sizes.length) return setError('Adicione pelo menos um tamanho.')
    const productNumber = String(sequence).padStart(3, '0')
    const combinations: Combination[] = colors.flatMap((color) => sizes.map((size) => ({ id: id('comb'), color, size, sku: `SKU-${productNumber}-${slug(color)}-${slug(size)}`, stock: 0 })))
    onSave({ id: id('produto'), name: name.trim(), costPrice: costCents, salePrice: saleCents, combinations, createdAt: new Date().toISOString() })
  }

  return <Modal title="Cadastrar produto" onClose={requestCancel} wide compact><ol className="steps" aria-label="Etapas do cadastro"><li className={step >= 1 ? 'active' : ''}><span>1</span>Produto</li><li className={step >= 2 ? 'active' : ''}><span>2</span>Cores</li><li className={step >= 3 ? 'active' : ''}><span>3</span>Tamanhos</li></ol>{error && <div className="alert error" role="alert">{error}</div>}
    {step === 1 && <form onSubmit={nextFromDetails} className="form-grid"><Field label="Nome do produto" id="product-name"><input id="product-name" value={name} onChange={(event) => { setName(event.target.value); setFieldErrors({ ...fieldErrors, name: '' }) }} placeholder="Ex.: Tênis Casual" autoFocus aria-invalid={Boolean(fieldErrors.name) || undefined} aria-describedby={fieldErrors.name ? 'name-error' : duplicateName ? 'name-warning' : undefined} />{fieldErrors.name && <small id="name-error" className="field-warning">{fieldErrors.name}</small>}{duplicateName && !fieldErrors.name && <small id="name-warning" className="field-warning">Já existe um produto com esse nome. Confira antes de continuar.</small>}</Field><div className="two-columns"><Field label="Preço de custo" id="cost"><div className={fieldErrors.cost ? 'money-input warning' : 'money-input'}><span>R$</span><input id="cost" inputMode="decimal" value={cost} onChange={(event) => { setCost(event.target.value); setFieldErrors({ ...fieldErrors, cost: '' }) }} placeholder="0,00" aria-invalid={Boolean(fieldErrors.cost) || undefined} /></div>{fieldErrors.cost && <small className="field-warning">{fieldErrors.cost}</small>}</Field><Field label="Preço de venda" id="sale"><div className={saleBelowCost || fieldErrors.sale ? 'money-input warning' : 'money-input'}><span>R$</span><input id="sale" inputMode="decimal" value={sale} onChange={(event) => { setSale(event.target.value); setFieldErrors({ ...fieldErrors, sale: '' }) }} placeholder="0,00" aria-invalid={saleBelowCost || Boolean(fieldErrors.sale) || undefined} /></div>{fieldErrors.sale && <small className="field-warning">{fieldErrors.sale}</small>}{saleBelowCost && !fieldErrors.sale && <small className="field-warning">O preço de venda está abaixo do custo.</small>}</Field></div><div className="modal-actions"><button type="button" className="button secondary" onClick={requestCancel}>Cancelar</button><button className="button primary">Continuar para cores</button></div></form>}
    {step === 2 && <div className="form-grid"><Field label="Adicionar cor" id="color" help="Adicione uma cor por vez."><div className="inline-input"><input id="color" value={colorInput} onChange={(event) => setColorInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addColor() } }} placeholder="Ex.: Preto" autoFocus /><button className="button secondary" onClick={addColor}>Adicionar cor</button></div></Field><div className="tag-list">{colors.map((color) => <span className="tag" key={color}>{color}<button aria-label={`Remover cor ${color}`} onClick={() => setColors(colors.filter((item) => item !== color))}>×</button></span>)}</div><div className="modal-actions"><button className="button secondary" onClick={() => setStep(1)}>Voltar</button><button className="button primary" onClick={nextFromColors}>Continuar para tamanhos</button></div></div>}
    {step === 3 && <div className="form-grid"><p className="instruction">Adicione os tamanhos uma única vez. Eles serão combinados com todas as cores e começarão com estoque zero.</p><Field label="Adicionar tamanho" id="size" help="Digite um tamanho e pressione Enter."><div className="inline-input"><input id="size" value={sizeInput} onChange={(event) => setSizeInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSize() } }} placeholder="Ex.: 38" autoFocus /><button className="button secondary" onClick={addSize}>Adicionar tamanho</button></div></Field><div className="tag-list" aria-label="Tamanhos adicionados">{sizes.map((size) => <span className="tag" key={size}>{size}<button aria-label={`Remover tamanho ${size}`} onClick={() => removeSize(size)}>×</button></span>)}</div><div className="summary-box"><strong>Resumo do produto</strong><span>{name} · {colors.length} cores · {sizes.length} tamanhos · {colors.length * sizes.length} variações</span></div><div className="modal-actions"><button className="button secondary" onClick={() => setStep(2)}>Voltar</button><button className="button primary" onClick={finish}>Salvar produto</button></div></div>}
  </Modal>
}
