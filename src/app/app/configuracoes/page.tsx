'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {browserClient} from '@/lib/supabase'
import {clearLocalData,localMode} from '@/lib/local-store'

export default function Configuracoes(){
  const router=useRouter()
  const [email,setEmail]=useState(''),[error,setError]=useState(''),[deleting,setDeleting]=useState(false)
  useEffect(()=>{if(!localMode)browserClient().auth.getUser().then(({data})=>setEmail(data.user?.email||''))},[])
  async function logout(){const {error}=await browserClient().auth.signOut();if(error)setError(error.message);else router.replace('/')}
  async function deleteAccount(){
    if(!window.confirm(localMode?'Apagar todos os anúncios salvos neste navegador?':'Excluir sua conta, anúncios e fotos permanentemente?'))return
    if(localMode){clearLocalData();router.replace('/app');return}
    setError('');setDeleting(true)
    try{const response=await fetch('/api/account',{method:'DELETE'});const data=await response.json();if(!response.ok)throw new Error(data.error);router.replace('/')}
    catch(e){setError(e instanceof Error?e.message:'Não foi possível excluir sua conta.')}
    finally{setDeleting(false)}
  }
  return <><span className="eyebrow">Sua conta</span><h1 className="page-title">Configurações e ajuda</h1><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))'}}><div className="card"><h2>{localMode?'Modo local':'Minha conta'}</h2><p>{localMode?'Seus anúncios estão salvos apenas neste navegador. Não há login neste modo.':email||'Carregando…'}</p>{!localMode&&<div style={{marginTop:20}}><button className="btn secondary" onClick={logout}>Sair da conta</button></div>}</div><div className="card"><h2>Meu plano</h2><p>{localMode?'A geração por IA exige configuração do servidor.':'Veja o uso mensal de IA e os limites da conta gratuita.'}</p><div style={{marginTop:20}}><Link className="text-link" href="/app/plano">Ver meu plano →</Link></div></div><div className="card"><h2>Privacidade</h2><p>{localMode?'Os dados deste teste ficam neste navegador.':'Seus produtos e fotos ficam vinculados à sua conta.'}</p><div style={{marginTop:20}}><Link className="text-link" href="/privacidade">Ler política de privacidade →</Link></div></div></div><section className="section" style={{maxWidth:760}}><h2>Perguntas frequentes</h2><details className="card" style={{marginBottom:12}}><summary><strong>Por que preciso finalizar no marketplace?</strong></summary><p>A Vendza prepara título, descrição e fotos. Você revisa e conclui a publicação em cada site.</p></details><details className="card" style={{marginBottom:12}}><summary><strong>Posso editar meu anúncio depois?</strong></summary><p>Sim. Abra o produto em “Meus anúncios” e altere título, descrição ou preço sem gastar uma nova geração com IA.</p></details><details className="card"><summary><strong>O que acontece com minhas fotos?</strong></summary><p>{localMode?'Neste modo, ficam somente no armazenamento deste navegador.':'As fotos são guardadas em armazenamento privado e usadas para preparar seu anúncio.'}</p></details></section><section className="card" style={{maxWidth:760}}><h2>{localMode?'Apagar dados locais':'Excluir conta'}</h2><p>{localMode?'Remove os anúncios e fotos salvos neste navegador.':'Essa ação exclui sua conta, anúncios e fotos permanentemente.'}</p><button className="btn danger" style={{marginTop:18}} disabled={deleting} onClick={deleteAccount}>{deleting?'Excluindo…':localMode?'Apagar dados deste navegador':'Excluir minha conta'}</button>{error&&<p className="error" role="alert">{error}</p>}</section></>
}
