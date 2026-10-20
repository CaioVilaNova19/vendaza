import { Listing, Product } from './product'

const PRODUCTS_KEY = 'vendza:local:products:v1'
const LISTINGS_KEY = 'vendza:local:listings:v1'

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[] }
  catch { return [] }
}
function write<T>(key: string, values: T[]) {
  try { localStorage.setItem(key, JSON.stringify(values)) }
  catch { throw new Error('O armazenamento deste navegador está cheio. Remova uma foto ou um anúncio e tente novamente.') }
}
export const localMode = !Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
export function localProducts(): Product[] { return read<Product>(PRODUCTS_KEY).sort((a,b)=>b.updated_at.localeCompare(a.updated_at)) }
export function localProduct(id: string): Product | null { return localProducts().find(p=>p.id===id)||null }
export function saveLocalProduct(product: Product) { write(PRODUCTS_KEY,[product,...localProducts().filter(p=>p.id!==product.id)]) }
export function deleteLocalProduct(id: string) { write(PRODUCTS_KEY,localProducts().filter(p=>p.id!==id));write(LISTINGS_KEY,localListings().filter(l=>l.product_id!==id)) }
export function localListings(id?: string): Listing[] { const all=read<Listing>(LISTINGS_KEY);return id?all.filter(l=>l.product_id===id):all }
export function saveLocalListing(listing: Listing) { write(LISTINGS_KEY,[listing,...localListings().filter(l=>!(l.product_id===listing.product_id&&l.channel===listing.channel))]) }
export function clearLocalData() { localStorage.removeItem(PRODUCTS_KEY);localStorage.removeItem(LISTINGS_KEY) }

export async function fileToLocalPhoto(file: File): Promise<string> {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Envie imagens JPEG, PNG ou WebP.')
  if(file.size>20*1024*1024)throw new Error('Cada foto deve ter até 20 MB antes da compressão.')
  const bitmap=await createImageBitmap(file)
  const scale=Math.min(1,1100/Math.max(bitmap.width,bitmap.height))
  const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale)
  canvas.getContext('2d')?.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close()
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',.68))
  if(!blob)throw new Error('Não foi possível preparar esta foto.')
  return await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Não foi possível ler a foto.'));reader.readAsDataURL(blob)})
}
