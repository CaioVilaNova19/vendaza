import { z } from 'zod'

export const productSchema = z.object({
  title: z.string().trim().min(3).max(100),
  category: z.string().trim().min(2).max(60),
  condition: z.enum(['novo', 'seminovo', 'usado']),
  price_cents: z.number().int().min(100).max(100000000),
  description: z.string().max(4000),
})

export type Product = z.infer<typeof productSchema> & {
  id: string; user_id: string; photo_paths: string[]; created_at: string; updated_at: string; status: 'rascunho' | 'publicado' | 'vendido'
}
export type Listing = { id: string; product_id: string; channel: string; status: 'rascunho' | 'publicado'; external_url: string | null }
export const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
export const channels = [
  { id: 'facebook', name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace/create/item' },
  { id: 'olx', name: 'OLX', url: 'https://www.olx.com.br/novo-anuncio' },
  { id: 'mercado_livre', name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/anunciar' },
] as const
