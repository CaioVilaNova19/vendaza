import {NextResponse} from 'next/server'
import {configured} from '@/lib/supabase'
import {serverClient} from '@/lib/supabase-server'
import {z} from 'zod'
import {createClient} from '@supabase/supabase-js'

const draft=z.object({title:z.string().min(3).max(100),description:z.string().min(20).max(4000),uncertain:z.array(z.string()).max(10)})
function monthKey(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit'}).formatToParts(new Date());return `${parts.find(p=>p.type==='year')?.value}-${parts.find(p=>p.type==='month')?.value}`}
export async function POST(request:Request,context:{params:Promise<{id:string}>}){
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Origem inválida'},{status:403})
  if(!configured())return NextResponse.json({error:'Backend não configurado'},{status:503})
  if(!process.env.OPENAI_API_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY)return NextResponse.json({error:'Geração com IA ainda não configurada. Você pode editar o anúncio manualmente.'},{status:503})
  const {id}=await context.params;const db=await serverClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:'Entre na sua conta.'},{status:401})
  const {data:product}=await db.from('products').select('*').eq('id',id).single();if(!product)return NextResponse.json({error:'Produto não encontrado'},{status:404})
  const {data:reservation,error:reserveError}=await db.rpc('reserve_ai_generation',{p_product_id:id,p_month_key:monthKey()});if(reserveError)return NextResponse.json({error:reserveError.message},{status:429})
  let success=false
  try{
    const content:Array<Record<string,unknown>>=[{type:'input_text',text:`Crie um anúncio em português brasileiro para um item usado. Use somente os fatos informados ou claramente visíveis. Não invente marca, modelo, capacidade, estado, defeitos, garantia ou nota fiscal. Título informado: ${product.title}. Categoria: ${product.category}. Estado informado: ${product.condition}. Preço: R$ ${(product.price_cents/100).toFixed(2)}. Detalhes informados: ${product.description||'nenhum'}. Liste em uncertain os detalhes que precisam de confirmação; não inclua esses detalhes como fatos na descrição.`}]
    for(const path of (product.photo_paths as string[]).slice(0,4)){const {data}=await db.storage.from('product-photos').createSignedUrl(path,90);if(data?.signedUrl)content.push({type:'input_image',image_url:data.signedUrl,detail:'low'})}
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',store:false,max_output_tokens:800,input:[{role:'user',content}],text:{format:{type:'json_schema',name:'listing_draft',strict:true,schema:{type:'object',additionalProperties:false,required:['title','description','uncertain'],properties:{title:{type:'string'},description:{type:'string'},uncertain:{type:'array',items:{type:'string'}}}}}}}),signal:AbortSignal.timeout(30000)})
    if(!response.ok)throw new Error('A geração falhou. Tente novamente ou preencha manualmente.')
    const body=await response.json() as {output?:Array<{content?:Array<{type:string;text?:string}>}>}
    const text=body.output?.flatMap(item=>item.content||[]).find(item=>item.type==='output_text')?.text
    const parsed=draft.parse(JSON.parse(text||''))
    const {error:saveError}=await db.from('products').update({title:parsed.title,description:parsed.description,updated_at:new Date().toISOString()}).eq('id',id)
    if(saveError)throw saveError
    success=true;return NextResponse.json(parsed,{headers:{'Cache-Control':'private, no-store'}})
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Não foi possível gerar agora.'},{status:502})}
  finally{const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!);await admin.rpc('finish_ai_generation',{p_usage_id:reservation,p_user_id:user.id,p_success:success})}
}
