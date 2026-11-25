import { PageHeader } from '../../components/ui'
import type { Screen } from '../../types'

export function Overview({ products, stock, sales, lowStock, outOfStock, onNavigate }: { products: number; stock: number; sales: number; lowStock: number; outOfStock: number; onNavigate: (screen: Screen) => void }) {
  return (
    <>
      <PageHeader eyebrow="Visão geral" title="Rotina da loja em um só lugar" description="Acompanhe os dados da demonstração e acesse rapidamente os principais processos." />
      <section className="metrics" aria-label="Resumo da demonstração">
        <Metric label="Produtos cadastrados" value={products} helper="modelos disponíveis" />
        <Metric label="Unidades em estoque" value={stock} helper="todas as variações" />
        <Metric label="Vendas concluídas" value={sales} helper="neste navegador" />
        <button className="metric metric-action" onClick={() => onNavigate('inventory')}><span>Atenção no estoque</span><strong>{lowStock + outOfStock}</strong><small>{outOfStock} sem estoque · {lowStock} com até 5 unidades</small></button>
      </section>
      <section className="panel">
        <div className="section-heading">
          <div><span className="eyebrow">Ações rápidas</span><h2>O que você deseja fazer?</h2></div>
        </div>
        <div className="quick-actions">
          <QuickAction title="Cadastrar produto" text="Crie o produto e informe as cores e os tamanhos disponíveis." onClick={() => onNavigate('products')} />
          <QuickAction title="Movimentar estoque" text="Registre entrada ou saída de uma combinação existente." onClick={() => onNavigate('inventory')} />
          <QuickAction title="Iniciar venda" text="Escolha produto, cor e tamanho, ou use o código da etiqueta, e conclua a venda." onClick={() => onNavigate('sales')} />
        </div>
      </section>
    </>
  )
}

function Metric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{helper}</small></article>
}

function QuickAction({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><strong>{title}</strong><span>{text}</span><b>Começar</b></button>
}
