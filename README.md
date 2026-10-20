# Vendza

MVP web para criar um anúncio a partir de fotos e preparar a publicação manual no Facebook Marketplace, OLX e Mercado Livre. As ações em marketplaces são assistidas: o usuário copia, baixa e finaliza em cada site.

## Executar

Para olhar e testar o fluxo manual, basta:

1. `npm install`
2. `npm run dev`
3. Abra `http://localhost:3000` e clique em **Criar meu anúncio**.

Sem `.env.local`, o aplicativo entra em **modo local**: anúncios e fotos são salvos somente no armazenamento deste navegador. Você pode criar, editar, copiar, baixar e marcar como publicado. Não há login nem geração por IA nesse modo. Os dados locais não migram automaticamente para uma conta online.

Para usar o backend:

1. Copie `.env.example` para `.env.local` e preencha URL e publishable key do Supabase.
2. Execute `supabase/migrations/20261020000000_initial.sql` no banco do projeto Supabase.
3. Configure autenticação por e-mail no Supabase. Para geração com IA, defina `OPENAI_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` no servidor. Nunca exponha a service role no cliente.
4. Reinicie `npm run dev`.

Não há dados fictícios nem simulação de geração.

## Funcionalidades atuais

- Cadastro e login por e-mail; produtos isolados por RLS.
- Até quatro fotos privadas por produto, comprimidas antes do envio.
- Criação e edição de título, descrição, condição e preço.
- Geração com IA usando fotos e dados informados, quota mensal atômica de 5 gerações.
- Cópia de textos, download de fotos, abertura dos três canais e confirmação manual de publicação.
- Marcar produto como vendido e excluir anúncio e fotos.

## Próximas integrações

Checkout e Passe Pro, telemetria de erros e eventual publicação via API oficial. Nenhuma delas é anunciada como funcional no aplicativo. A política de privacidade e os termos atuais são textos iniciais e precisam de revisão antes de um beta público.
