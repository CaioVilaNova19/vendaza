'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from './Header'
import { browserClient, configured } from '@/lib/supabase'
export function AppGuard({ children }: { children: React.ReactNode }) {
  const router=useRouter(), path=usePathname(); const [ready,setReady]=useState(false)
  useEffect(()=>{if(!configured()){setReady(true);return} browserClient().auth.getUser().then(({data})=>{if(!data.user)router.replace('/entrar');else setReady(true)})},[router])
  return <><Header app/><main className="container app-main">{!configured()&&<div className="notice warning"><strong>Modo local de teste.</strong> Seus anúncios e fotos ficam apenas neste navegador. A geração por IA e a conta online exigem configuração.</div>}{ready?children:<p role="status">Carregando sua conta…</p>}</main><nav className="mobile-nav" aria-label="Navegação do aplicativo"><Link className={path==='/app'?'active':''} href="/app"><span>⌂</span>Início</Link><Link className={path==='/app/novo'?'active':''} href="/app/novo"><span>＋</span>Novo</Link><Link className={path==='/app/configuracoes'?'active':''} href="/app/configuracoes"><span>◯</span>Conta</Link></nav></>
}
