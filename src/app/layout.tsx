import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Vendza — seus anúncios, em mais lugares', description: 'Crie um anúncio a partir das suas fotos e prepare a publicação nos principais marketplaces.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>
}
