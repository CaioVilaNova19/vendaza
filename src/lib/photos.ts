import { browserClient } from './supabase'

export async function photoUrl(path: string) {
  if(path.startsWith('data:image/')) return path
  const {data,error}=await browserClient().storage.from('product-photos').createSignedUrl(path,3600)
  if(error) throw error
  return data.signedUrl
}
export async function photoUrls(paths: string[]) { return Promise.all(paths.map(photoUrl)) }
export async function compressImage(file: File): Promise<Blob> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Envie imagens JPEG, PNG ou WebP.')
  const bitmap=await createImageBitmap(file)
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height))
  const canvas=document.createElement('canvas'); canvas.width=Math.round(bitmap.width*scale); canvas.height=Math.round(bitmap.height*scale)
  canvas.getContext('2d')?.drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close()
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',.78))
  if(!blob||blob.size>5*1024*1024) throw new Error('Não foi possível preparar esta foto.')
  return blob
}
