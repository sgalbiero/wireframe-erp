import { useEffect, useRef, useState } from 'react'
import { NavButton } from './components/ui'
import { Inventory } from './features/inventory/Inventory'
import { Overview } from './features/overview/Overview'
import { Products } from './features/products/Products'
import { Sales } from './features/sales/Sales'
import { resetData, loadData, saveData } from './storage'
import type { AppData, Screen } from './types'

function App() {
  const [data, setData] = useState<AppData>(loadData)
  const [screen, setScreen] = useState<Screen>(() => {
    const fromHash = window.location.hash.replace('#/', '') as Screen
    if (['overview', 'products', 'inventory', 'sales'].includes(fromHash)) return fromHash
    let saved: Screen | null = null
    try { saved = window.localStorage.getItem('luizera-last-screen') as Screen | null } catch { /* ignora */ }
    return saved && ['overview', 'products', 'inventory', 'sales'].includes(saved) ? saved : 'overview'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [inventoryProductId, setInventoryProductId] = useState('')
  const [saleDraftActive, setSaleDraftActive] = useState(false)
  const noticeTimer = useRef<number | null>(null)

  useEffect(() => saveData(data), [data])
  useEffect(() => {
    try { window.localStorage.setItem('luizera-last-screen', screen) } catch { /* ignora */ }
    const expectedHash = `#/${screen}`
    if (window.location.hash !== expectedHash) window.history.replaceState({ screen }, '', expectedHash)
  }, [screen])
  useEffect(() => {
    function handleHistory() {
      const next = window.location.hash.replace('#/', '') as Screen
      if (['overview', 'products', 'inventory', 'sales'].includes(next)) setScreen(next)
    }
    window.addEventListener('popstate', handleHistory)
    return () => window.removeEventListener('popstate', handleHistory)
  }, [])

  function navigate(next: Screen) {
    if (screen === 'sales' && next !== 'sales' && saleDraftActive && !window.confirm('Sair da venda atual? Os itens adicionados serão descartados.')) return
    setScreen(next)
    setMenuOpen(false)
    if (window.location.hash !== `#/${next}`) window.history.pushState({ screen: next }, '', `#/${next}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function notify(message: string) {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 4500)
  }

  function restoreDemo() {
    if (!window.confirm('Restaurar os dados iniciais? Os dados criados neste navegador serão substituídos.')) return
    setData(resetData())
    setInventoryProductId('')
    navigate('overview')
    notify('Dados de demonstração restaurados.')
  }

  const stockTotal = data.products.reduce(
    (sum, product) => sum + product.combinations.reduce((subtotal, combination) => subtotal + combination.stock, 0),
    0,
  )
  const lowStock = data.products.reduce((sum, product) => sum + product.combinations.filter((item) => item.stock > 0 && item.stock <= 5).length, 0)
  const outOfStock = data.products.reduce((sum, product) => sum + product.combinations.filter((item) => item.stock === 0).length, 0)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">L</div>
          <div>
            <strong>LUIZERA</strong>
            <span>Protótipo de gestão</span>
          </div>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="navegacao">
          Menu
        </button>
        <nav id="navegacao" className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
          <NavButton active={screen === 'overview'} onClick={() => navigate('overview')}>Visão geral</NavButton>
          <NavButton active={screen === 'products'} onClick={() => navigate('products')}>Produtos</NavButton>
          <NavButton active={screen === 'inventory'} onClick={() => navigate('inventory')}>Estoque</NavButton>
          <NavButton active={screen === 'sales'} onClick={() => navigate('sales')}>Vendas</NavButton>
        </nav>
      </header>

      <main id="conteudo" className="content" tabIndex={-1}>
        {screen === 'overview' && (
          <Overview
            products={data.products.length}
            stock={stockTotal}
            sales={data.sales.length}
            lowStock={lowStock}
            outOfStock={outOfStock}
            onNavigate={navigate}
          />
        )}
        {screen === 'products' && (
          <Products
            data={data}
            setData={setData}
            notify={notify}
            onAddStock={(productId) => { setInventoryProductId(productId); navigate('inventory') }}
          />
        )}
        {screen === 'inventory' && <Inventory data={data} setData={setData} notify={notify} initialProductId={inventoryProductId} />}
        {screen === 'sales' && <Sales data={data} setData={setData} notify={notify} onDraftChange={setSaleDraftActive} />}
      </main>

      <details className="prototype-note"><summary>Sobre este protótipo</summary><span>Wireframe de baixa fidelidade · dados salvos neste navegador.</span><button className="text-button danger" onClick={restoreDemo}>Restaurar dados de demonstração</button></details>
      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}

export default App
