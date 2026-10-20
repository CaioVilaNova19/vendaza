import Link from 'next/link'
export function Header({ app = false }: { app?: boolean }) {
  return <header className="topbar"><div className="container"><Link href="/" className="brand"><span className="brand-mark">v</span>vendza</Link><nav className="nav" aria-label="Navegação principal">{app ? <><Link href="/app" className="desktop-link">Meus anúncios</Link><Link href="/app/plano" className="desktop-link">Plano</Link><Link href="/app/configuracoes" className="desktop-link">Conta</Link><Link className="btn small" href="/app/novo">+ Novo anúncio</Link></> : <><Link href="/#como-funciona" className="desktop-link">Como funciona</Link><Link href="/entrar" className="btn small secondary">Entrar</Link></>}</nav></div></header>
}
