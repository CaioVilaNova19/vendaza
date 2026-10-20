'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {browserClient} from '@/lib/supabase'
import {localMode} from '@/lib/local-store'
export default function Plano(){
  const [usage,setUsage]=useState<number|null>(null)
  useEffect(()=>{if(localMode)return;const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit'}).formatToParts(new Date());const month=`${parts.find(p=>p.type==='year')?.value}-${parts.find(p=>p.type==='month')?.value}`;browserClient().from('ai_usage').select('id',{count:'exact',head:true}).eq('month_key',month).eq('status','completed').then(({count})=>setUsage(count))},[])
  return <><span className="eyebrow">Sua conta</span><h1 className="page-title">Seu plano</h1><p className="lead">{localMode?'O modo local é livre para explorar o fluxo manual.':'Acompanhe suas gerações com IA neste mês.'}</p><div className="card" style={{maxWidth:620}}><span className="badge">{localMode?'Modo local':'Grátis'}</span><h2>{localMode?'Sem cobrança e sem IA':usage===null?'Carregando…':`${usage} de 5 gerações usadas`}</h2><p>{localMode?'Crie, edite e exporte anúncios neste navegador. Para usar IA e sincronizar dados, configure o backend.':'Você pode editar, copiar e baixar anúncios salvos sem consumir uma nova geração.'}</p><div className="notice">O Passe Pro de 30 dias está planejado, mas o pagamento ainda não está disponível. Nenhuma cobrança é feita nesta versão.</div><Link className="btn" href="/app/novo">Criar anúncio</Link></div></>
}
