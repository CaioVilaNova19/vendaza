'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { browserClient, configured } from '@/lib/supabase'

export default function Entrar() {
  const router = useRouter()
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setMessage(''); setBusy(true)
    try {
      const supabase = browserClient()
      const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password })
      if (result.error) throw result.error
      if (result.data.session) router.replace('/app')
      else setMessage('Confira seu e-mail para confirmar sua conta.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível entrar.') }
    finally { setBusy(false) }
  }
  return <><Header/><main className="container" style={{maxWidth:480,padding:'64px 0'}}><span className="eyebrow">Sua conta</span><h1 className="page-title">{!configured()?'Explore a Vendza':mode==='login'?'Entre para continuar':'Crie sua conta'}</h1><p className="lead">{!configured()?'Teste o fluxo no seu navegador, sem cadastro.':'Seus produtos e fotos ficam salvos na sua conta.'}</p>{!configured() ? <div className="card"><p>Este ambiente está no modo local. Os anúncios criados aqui ficam apenas neste navegador.</p><Link className="btn" href="/app/novo" style={{marginTop:20}}>Criar anúncio de teste →</Link></div> : <form className="card" onSubmit={submit}><div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="field"><label htmlFor="password">Senha</label><input id="password" type="password" minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} required/></div>{error&&<p className="error" role="alert">{error}</p>}{message&&<p className="notice" role="status">{message}</p>}<button className="btn" style={{width:'100%'}} disabled={busy}>{busy?'Aguarde…':mode==='login'?'Entrar':'Criar conta'}</button><button type="button" className="text-link" style={{border:0,background:'none',marginTop:18}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}}>{mode==='login'?'Ainda não tenho conta':'Já tenho conta'}</button></form>}<p className="subtle" style={{marginTop:22}}>Ao usar a Vendza, você aceita os <Link className="text-link" href="/termos">termos</Link> e a <Link className="text-link" href="/privacidade">política de privacidade</Link>.</p></main></>
}
