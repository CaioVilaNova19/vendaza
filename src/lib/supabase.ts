import { createBrowserClient } from '@supabase/ssr'

export function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}

function credentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Configure o Supabase no .env.local')
  return { url, key }
}

export function browserClient() {
  const { url, key } = credentials()
  return createBrowserClient(url, key)
}
