import {NextResponse} from 'next/server'
import {createClient} from '@supabase/supabase-js'
import {serverClient} from '@/lib/supabase-server'

export async function DELETE(request:Request){
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Origem inválida'},{status:403})
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!url||!key)return NextResponse.json({error:'Exclusão de conta indisponível até configurar a service role no servidor.'},{status:503})
  const db=await serverClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'Entre na sua conta.'},{status:401})
  const admin=createClient(url,key)
  const {data:products,error:productsError}=await admin.from('products').select('photo_paths').eq('user_id',user.id)
  if(productsError)return NextResponse.json({error:'Não foi possível localizar seus dados.'},{status:500})
  const paths=(products||[]).flatMap(product=>product.photo_paths as string[])
  if(paths.length){const {error:photoError}=await admin.storage.from('product-photos').remove(paths);if(photoError)return NextResponse.json({error:'Não foi possível excluir as fotos. Tente novamente.'},{status:500})}
  const {error}=await admin.auth.admin.deleteUser(user.id)
  if(error)return NextResponse.json({error:'Não foi possível excluir a conta. Tente novamente.'},{status:500})
  await db.auth.signOut()
  return NextResponse.json({deleted:true},{headers:{'Cache-Control':'private, no-store'}})
}
