import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Vendza', short_name: 'Vendza', description: 'Crie anúncios para vender em mais lugares', start_url: '/app', display: 'standalone', background_color: '#fafaf8', theme_color: '#246bfd', icons: [{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}] }
}
