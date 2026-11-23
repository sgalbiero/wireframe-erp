import { ReactNode, useEffect, useRef } from 'react'

export function NavButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return <button className={active ? 'nav-link active' : 'nav-link'} aria-current={active ? 'page' : undefined} onClick={onClick}>{children}</button>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

export function Field({ label, id, help, children }: { label: string; id: string; help?: string; children: ReactNode }) {
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{help && <small>{help}</small>}</div>
}

export function EmptyState({ title, text, action, onClick }: { title: string; text: string; action?: string; onClick?: () => void }) {
  return <section className="empty-state"><div className="empty-icon" aria-hidden="true">□</div><h2>{title}</h2><p>{text}</p>{action && onClick && <button className="button primary" onClick={onClick}>{action}</button>}</section>
}

export function Modal({ title, onClose, children, wide = false, compact = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean; compact?: boolean }) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const modal = useRef<HTMLElement>(null)
  const closeAction = useRef(onClose)
  closeAction.current = onClose
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const preferredFocus = modal.current?.querySelector<HTMLElement>('[autofocus]')
      ?? modal.current?.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled])')
      ?? closeButton.current
    preferredFocus?.focus()
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeAction.current()
      if (event.key !== 'Tab' || !modal.current) return
      const focusable = [...modal.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); previousFocus?.focus() }
  }, [])
  const modalClass = ['modal', wide && 'wide', compact && 'compact'].filter(Boolean).join(' ')
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section ref={modal} className={modalClass} role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><h2 id="modal-title">{title}</h2><button ref={closeButton} className="close-button" aria-label="Fechar janela" onClick={onClose}>×</button></header><div className="modal-body">{children}</div></section></div>
}
