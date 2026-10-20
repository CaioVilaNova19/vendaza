# Guia de frontend — Anúncios Multicanal Brasil

> **Versão:** 1.0 — direção visual e implementação do MVP  
> **Data:** 19/10/2026  
> **Stack:** Next.js + TypeScript + Tailwind CSS (PWA)  
> **Referência:** [SellRaze — site oficial](https://www.sellraze.com/)  
> **Escopo:** implementação das telas P0. Não representa uma cópia de interface ou marca do SellRaze.  
> **Plano de negócio/técnico:** [`plano-desenvolvimento-marketplace-brasil.md`](./plano-desenvolvimento-marketplace-brasil.md)

## 1. Brief criativo

**Produto:** ferramenta brasileira para transformar fotos de itens usados em anúncios utilizáveis na OLX, Facebook Marketplace e Mercado Livre.

**Sensação desejada:** rápido, inteligente, confiável, jovem, acessível e nativo de celular. Não parecer um ERP, um aplicativo bancário nem um painel corporativo cheio de métricas.

**Ação principal da interface:** **Novo anúncio**. Toda tela do produto deve tornar fácil voltar a essa ação.

**Promessa de UX:** “Tire a foto. A gente prepara o anúncio. Você escolhe onde vender.”

### O que absorvemos do SellRaze

Observado em seu material público (outubro de 2026):

- Grandes headlines escuras sobre fundos muito claros; personalidade nas chamadas e tipografia pesada.
- Layout limpo com alta proporção de espaço vazio e CTAs muito visíveis.
- Cards arredondados para itens e passos; imagem do produto como estrela.
- Uso contido de azul elétrico para ações, estados e ícones.
- Fluxo **imagem → identificação → revisão → seleção de canais**.
- Seleção de marketplaces com controle visual claro (toggle/cartão), sem texto excessivo.
- Comunicação de produto centrada em rapidez, não em termos técnicos de integração.

**Não copiar:** logo, ícone, composição pixel a pixel, screenshots, texto comercial, fotografias, ilustrações, identidade/wordmark e assets proprietários do SellRaze. Criar linguagem e assets próprios.

### Nossa diferenciação visual

Mais brasileiro, acolhedor e direto: PT-BR, preço com `R$`, foco em desapego e revenda local, mensagens que expliquem com transparência quando o usuário precisa finalizar a publicação no marketplace.

Direção recomendada: **“editorial clean + produto social leve”**. Evitar dark/gamer, dashboards de gráficos, excesso de gradientes, glassmorphism e cartões chamativos para tudo.

---

## 2. Design system

### Paleta inicial (proposta, não copiada do SellRaze)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#FAFAF8` | Fundo principal levemente quente |
| `--surface` | `#FFFFFF` | Cards, formulário, navegação |
| `--ink` | `#12151A` | Títulos, texto principal |
| `--muted` | `#616974` | Descrições, metadados |
| `--stroke` | `#E6E9ED` | Divisórias e bordas |
| `--primary` | `#246BFD` | CTA, links e foco |
| `--primary-hover` | `#1256DD` | Hover do CTA |
| `--primary-soft` | `#EBF2FF` | Ícones e blocos em destaque |
| `--success` | `#147D57` | Ação concluída/confirmada |
| `--success-soft` | `#E9F8F0` | Status concluído |
| `--warning` | `#A36500` | Ação pendente/manual |
| `--warning-soft` | `#FFF6DF` | Publicação requer usuário |
| `--danger` | `#B93C45` | Erros e exclusão |

**Uso de cor:** 75% neutros, 20% superfícies e 5% primário/estados. Evitar usar o azul em cada card, ícone e texto ao mesmo tempo.

### Tipografia

- **Primária:** `Plus Jakarta Sans`, `Inter` como fallback, sans-serif; escolher **uma** fonte externa quando for montar o projeto.
- Headline landing desktop: 56–68 px, peso 750–800, line-height 1.02–1.08, tracking negativo sutil.
- Headline landing mobile: 38–44 px, peso 750–800.
- Títulos internos: 26–32 px no mobile, 32–38 px no desktop.
- Texto: 15–16 px, line-height 1.45–1.6; secundário mínimo 13–14 px.
- Preços em `R$`, valores tabulares; texto funcional sempre legível.

### Espaçamento e formas

- Escala: `4, 8, 12, 16, 20, 24, 32, 48, 64` px.
- Border-radius: `12px` inputs, `16px` botões, `20px` cards, `28px` blocos hero.
- Botão principal: altura 52px, largura total no mobile, rótulo com verbo e resultado.
- Inputs: 48–52px; fotos em cantos arredondados; seletor de canais com altura mínima 72px.
- Sombras discretas ou nenhuma: `0 6px 24px rgba(18,21,26,.045)` nos cards destacados.
- Dividers 1px, `--stroke`; nunca depender só de cor para estado.

### Tokens CSS (ponto de partida)

```css
:root {
  --bg: #FAFAF8;
  --surface: #FFFFFF;
  --ink: #12151A;
  --muted: #616974;
  --stroke: #E6E9ED;
  --primary: #246BFD;
  --primary-hover: #1256DD;
  --primary-soft: #EBF2FF;
  --success: #147D57;
  --warning: #A36500;
  --danger: #B93C45;
  --radius-card: 20px;
}
```

**Dark mode:** não necessário no MVP. Deixar tokens preparados sem implementar toggle; prioritário é estabilidade e boa hierarquia no tema claro.

---

## 3. Layout e navegação

### Mobile-first (prioridade)

- Largura de teste mínima: **360px**; testar também 390px e 430px.
- Header fixo discreto: símbolo/nome à esquerda; avatar/menu à direita.
- Navegação inferior simples no app: `Início`, botão central `+` **Novo**, `Minha conta`.
- CTA fixo na base apenas em etapas longas, respeitando `safe-area-inset-bottom`.
- Áreas clicáveis de pelo menos 44×44px; formulário em coluna única.
- Mensagens curtas e ação óbvia por tela; não esconder modo assistido nas notas de rodapé.

### Desktop

- Limite de conteúdo: `1120–1200px`, padding 24–32px.
- Dashboard com grid de cards 3 colunas; fluxo criar anúncio em 2 colunas (fotos/dados à esquerda, resumo à direita).
- Header horizontal com `Meus anúncios`, `Novo anúncio`, `Plano`, avatar.
- Landing usa hero de 2 colunas (texto + mockup original), nunca imagens de concorrentes.
- Responsividade: `<640px` uma coluna; `640–1023px` duas onde fizer sentido; `>=1024px` desktop.

### Site map

```text
/                          Landing
/entrar                    Entrar/cadastrar
/app                       Meus produtos
/app/novo                  Criar anúncio
/app/produtos/[id]         Revisar e escolher marketplaces
/app/plano                 Grátis vs Passe Pro
/app/configuracoes         Preferências, privacidade e ajuda
/privacidade               Política de privacidade
/termos                    Termos de uso
```

---

## 4. Telas com copy e wireframes

### TELA A — Landing pública (`/`)

**Objetivo:** explicar benefício em 5 segundos, mostrar produto real, captar primeiro uso.

```text
┌──────────────────────────────────────────────────┐
│ [LOGO]                        Como funciona  Entrar│
├──────────────────────────────────────────────────┤
│                                                  │
│   Vender suas coisas                             │
│   não devia dar                                  │
│   tanto trabalho.               [MOCKUP PRÓPRIO]  │
│                                                  │
│   Uma foto vira um anúncio pronto para           │
│   Facebook, OLX e Mercado Livre.                 │
│                                                  │
│   [ Criar meu anúncio  → ]                       │
│   Grátis para começar.                           │
│                                                  │
├──────────────────────────────────────────────────┤
│   1 Fotografe  →  2 Revise  →  3 Escolha onde vender│
├──────────────────────────────────────────────────┤
│  [Fotos]      [Descrição pronta]   [3 canais]     │
├──────────────────────────────────────────────────┤
│   Gratuito para testar · Pro sem publicidade       │
│   FAQ · Privacidade · Termos · Contato            │
└──────────────────────────────────────────────────┘
```

**Headline prioritária:** “Vender suas coisas não devia dar tanto trabalho.”

**Subheadline:** “Tire uma foto, gere o anúncio e prepare a publicação no Facebook Marketplace, OLX e Mercado Livre.”

**CTA:** `Criar meu anúncio` (não “Publicar automaticamente”).

**Seções essenciais:** hero, três passos, imagem da interface, canais/modalidades, FAQ curta. Deixar landing com conteúdo genuinamente útil sobre a ferramenta; não fabricar páginas para publicidade.

**Mockup:** criar uma composição original com foto genérica de produto, textarea preenchida, três canais e um botão azul. Não capturar tela/asset de SellRaze.

### TELA B — Dashboard (`/app`)

**Objetivo:** retomar rapidamente anúncio ou começar outro; sem analytics de loja.

```text
┌─────────────────────────────┐
│ Logo                    ☻  │
│                             │
│ Meus anúncios               │
│ Seus produtos em um lugar.  │
│                             │
│ [ + Criar anúncio         ] │
│                             │
│ [ Foto ] iPhone 12          │
│          R$ 1.350           │
│          Pronto p/ publicar │
│          [Continuar →]      │
│                             │
│ [ Foto ] Cadeira de escritório│
│          R$ 250             │
│          Publicação manual  │
│                             │
│ Início       [+]       Conta│
└─────────────────────────────┘
```

**Elementos:** título `Meus anúncios`, CTA principal acima da dobra, cards simples, uma ação por card, indicador de uso `3 de 5 gerações` discreto, estado vazio amigável.

**Não mostrar:** valor total do estoque, gráficos de vendas, notificações falsas ou “você vendeu X” sem dados reais.

### TELA C — Criar anúncio (`/app/novo`)

**Objetivo:** upload e entrada mínima com progressão evidente.

```text
┌─────────────────────────────┐
│ ← Voltar        Novo anúncio│
│ Etapa 1 de 3                │
│                             │
│ [  +  Tirar foto / Enviar ] │
│ [ foto ][ foto ][  +  ]     │
│                             │
│ O que você está vendendo?  │
│ [ Ex.: iPhone 12 128GB   ] │
│                             │
│ Estado                      │
│ [Usado - bom estado      ▾] │
│                             │
│ Preço (R$)                  │
│ [ 1.350,00                ] │
│                             │
│ [ ✨ Criar anúncio com IA ] │
└─────────────────────────────┘
```

**Regras:** fotos são opcionais apenas se o usuário puder digitar uma descrição manual; avisar quando poucos dados prejudicam o resultado. Compressão local antes de upload, limites claros, preview e exclusão individual. Rótulos visíveis; nunca depender só de placeholder.

**Durante IA:** estado “Preparando seu anúncio…” com skeleton e progresso indeterminado, sem estimar segundos falsos. Erro possui botão `Tentar novamente` e `Preencher manualmente`.

### TELA D — Revisar resultado (`/app/produtos/[id]`, seção 2/3)

**Objetivo:** mostrar ganho da IA com controle do usuário.

```text
┌─────────────────────────────┐
│ ← Voltar        Seu anúncio │
│ Etapa 2 de 3                │
│                             │
│ [       FOTO HERO         ] │
│ [foto] [foto] [foto]        │
│                             │
│ Título                  ✏️  │
│ [iPhone 12 128GB - ótimo...]│
│                             │
│ Descrição               ✏️  │
│ [Aparelho usado...]         │
│ [Bateria: confirmar...]     │
│                             │
│ Preço                       │
│ [R$ 1.350,00]               │
│                             │
│ [ Continuar → ]             │
└─────────────────────────────┘
```

**UX:** campos sempre editáveis; alerta “Confirme as características antes de publicar”. Se a IA inferir atributo incerto, marcar `Confirmar` e evitar preenchê-lo como fato. Uma geração bem-sucedida entra na quota; editar não exige nova geração.

### TELA E — Escolher marketplaces (seção 3/3)

**Objetivo:** comunicar capacidades REAIS sem burocracia.

```text
┌─────────────────────────────┐
│ ← Voltar       Onde vender? │
│ Etapa 3 de 3                │
│                             │
│ ☑ Facebook Marketplace      │
│   Preparar e abrir          │
│                             │
│ ☑ OLX                       │
│   Preparar e abrir          │
│                             │
│ ☑ Mercado Livre             │
│   Publicação via API*       │
│                             │
│ *Somente contas conectadas  │
│   e categorias elegíveis    │
│                             │
│ [ Preparar para 3 canais →] │
└─────────────────────────────┘
```

**Importante:** rótulo `Publicação via API` só é exibido quando a operação **realmente está habilitada e autorizada para aquela conta/categoria**; caso contrário mostrar `Preparar e abrir`.

**Resultado por canal:** cartão com título pronto + botões `Copiar título`, `Copiar descrição`, `Baixar fotos`, `Abrir [Canal]`. Disponibilizar `Marcar como publicado` e campo opcional de URL após ação do usuário; nunca assumir publicação automaticamente.

### TELA F — Passe Pro (`/app/plano`)

**Objetivo:** vender passe de forma simples e confiável, sem parecer assinatura enganosa.

```text
┌─────────────────────────────┐
│ Seu plano                   │
│                             │
│ GRÁTIS                      │
│ 3 de 5 anúncios com IA      │
│                             │
│ ┌─────────────────────────┐ │
│ │ Passe Pro · 30 dias     │ │
│ │ R$ 14,90                │ │
│ │                         │ │
│ │ ✓ Sem publicidade       │ │
│ │ ✓ Até 30 gerações IA    │ │
│ │ ✓ Mesmos 3 canais       │ │
│ │                         │ │
│ │ [ Ativar Passe Pro ]    │ │
│ └─────────────────────────┘ │
│                             │
│ Pagamento único.            │
│ Sem renovação automática.   │
└─────────────────────────────┘
```

**Regras:** distinguir `sem publicidade no nosso app` de `sem anúncios nas plataformas`. Mostrar validade e status do passe; para pendências de Pix apresentar `Aguardando pagamento`, nunca acesso antecipado. Manter local para histórico/comprovante.

### TELA G — Conta e ajuda (`/app/configuracoes`)

- Minha conta e logout.
- Meu passe / validade / quota.
- Ajuda: “Como publicar no Facebook/OLX/Mercado Livre”, “Por que preciso finalizar no marketplace?”, “Como solicitar reembolso?”.
- Privacidade e exclusão de conta.
- Contato por e-mail (sem live chat).

---

## 5. Componentes para implementar (P0)

| Componente | Propriedades e comportamento |
|---|---|
| `AppShell` | header/nav desktop e mobile, safe areas |
| `PrimaryButton` | `loading`, `disabled`, ícone opcional, altura touch |
| `ProductCard` | foto, nome, preço BRL, status, ação continuar |
| `PhotoUploader` | câmera/galeria, compressão, preview, remoção, limite de fotos |
| `ProductForm` | validação Zod, erros acessíveis, máscara BRL |
| `AIDraftEditor` | texto editável, sugestões incertas, skeleton e retry |
| `MarketplaceCard` | ícone/label canal, `publishMode`, `enabled`, texto de ajuda |
| `ChannelExportPanel` | copiar/baixar/compartilhar/abrir e marcar publicado |
| `UsageCounter` | uso mensal e upgrade discreto |
| `PlanCard` | gratuito vs passe 30 dias, sem auto-renew |
| `PaymentStatus` | aguardando/aprovado/falhou/estornado |
| `EmptyState` | ilustração simples original/ícone + CTA útil |
| `AdSlot` | **não renderiza** por padrão, somente site elegível/aprovado; Pro sem SDK |
| `Toast` | confirmação discreta, sem substituir mensagens de erro no form |
| `ErrorBoundary` | recuperação e fallback, sem stack traces ao usuário |

**Biblioteca:** usar `shadcn/ui` + Radix somente para componentes necessários, Tailwind para tokens e Lucide para ícones. Não instalar bibliotecas de gráficos ou animação pesadas.

---

## 6. Regras de anúncios publicitários na UI

**Não adicionar publicidade só porque há um espaço vazio.** Separar três conceitos: **anúncio do vendedor** (item à venda), **publicidade de terceiros** (rede de ads) e **passe sem publicidade**.

- `AdSlot` começa com `ADS_ENABLED=false` no servidor.
- Só considerar espaços de ads **em páginas web elegíveis com conteúdo próprio** e com aprovação e exigências da rede atendidas. Não supor que painel autenticado de criação de anúncios pode veicular AdSense.
- Não renderizar em `/entrar`, `/app/novo`, editor, seleção de canais, upload, resultado de IA, checkout, extensão ou superfícies com pouca informação.
- Não misturar criativos pagos e cards de produtos do usuário.
- Label visível `Publicidade` caso sejam exibidos.
- Não adicionar popups, intersticiais, publicidade de “reward para geração” ou bloqueios que induzam clique.
- Respeitar consentimento aplicável; no Passe Pro o SDK não deve carregar.
- Se a rede não aprovar a aplicação, **não forçar monetização publicitária**: continuar com passe e foco no produto.

**Referência:** https://support.google.com/adsense/answer/1346295 e https://support.google.com/adsense/answer/48182

---

## 7. Microcopy — português brasileiro

| Momento | Boa mensagem | Evitar |
|---|---|---|
| CTA inicial | `Criar meu anúncio` | `Publicar em todos automaticamente` |
| Upload | `Adicione fotos do seu produto` | `Scan your product` |
| IA | `Preparando seu anúncio…` | `Identificação garantida` |
| Resultado | `Pronto para revisar` | `Seu anúncio foi publicado` |
| Facebook assistido | `Preparar e abrir Facebook` | `Postar via API Facebook` |
| Canal concluído | `Você marcou este anúncio como publicado` | `Sincronizado`, se não está |
| Limite IA | `Você usou suas 5 gerações deste mês` | `Limite secreto atingido` |
| Upgrade | `Mais anúncios com IA, sem publicidade aqui` | `Remove todos os anúncios` |
| Checkout | `Pagamento único — sem renovação automática` | `Assinatura mensal` |
| Erro | `Não conseguimos gerar agora. Tente novamente ou preencha manualmente.` | `Erro 500` |
| Desconhecido | `Confira este detalhe antes de publicar` | Inventar atributo na descrição |

**Tom:** simples, brasileiro, objetivo; uma dose leve de personalidade, sem gírias excessivas em mensagens críticas. Usar `anúncio` (produto cadastrado) e `publicidade` (ads) quando houver risco de ambiguidade.

---

## 8. Estados e UX resiliente

Todo componente com carregamento deve ter pelo menos:

- `empty`: ação clara para criar o primeiro item.
- `loading`: skeleton proporcional e sem salto de layout.
- `success`: toast discreto e confirmação específica.
- `error`: mensagem útil com recuperação; manter o que usuário já digitou.
- `disabled`: explicar por que indisponível; não usar controles mortos.
- `offline`: exibir que IA e API exigem internet; preservar dados preenchidos enquanto possível.

### Estados dos marketplaces

```ts
type ChannelUiStatus =
  | 'ready_to_prepare'   // gerar payload e exportar
  | 'requires_connection'// falta OAuth ou autorização
  | 'needs_user_action'  // usuário deve terminar na plataforma
  | 'confirmed_by_user'  // confirmação humana
  | 'published_by_api'   // confirmação do canal oficial
  | 'temporarily_unavailable';
```

Não exibir `published_by_api` se só recebemos um clique em “Abrir marketplace”. Sinalizar no histórico “Confirmado por você” vs “Confirmado pelo Mercado Livre”.

---

## 9. Acessibilidade, performance e responsividade

- Contraste WCAG AA nos textos e controles; não usar cinza claro demais.
- Labels associados a inputs; erros vinculados por `aria-describedby`; status `aria-live` quando necessário.
- Navegação por teclado e foco visível (`focus-visible`) em desktop.
- Alvos touch >=44px, sem ações escondidas apenas em hover.
- Alt text descritivo para produtos; imagens puramente decorativas com alt vazio.
- Suporte de redução de movimento (`prefers-reduced-motion`); animações opcionais <250ms.
- Upload comprimido e carregamento incremental; usar `next/image` quando adequado.
- Prefetch moderado e lazy load de recursos secundários; evitar depender da extensão para UX mobile.
- Form não perde dados durante geração, fallback e navegação.
- Testar 360/390/430/768/1024/1440px e Firefox/Chrome/Safari mobile.

### Core Web Vitals (orientação)

Buscar LCP <=2,5 s, INP <=200 ms e CLS <=0,1 nas páginas principais, medidos em dispositivos reais. Não perseguir micro-otimizações antes de ter a jornada funcional.

---

## 10. Implementação sugerida no Next.js

```text
apps/web/src/
├── app/
│   ├── (marketing)/page.tsx
│   ├── entrar/page.tsx
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   ├── produtos/[id]/page.tsx
│   │   ├── plano/page.tsx
│   │   └── configuracoes/page.tsx
│   ├── api/...                    # domínio descrito no plano
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # buttons, inputs, badge, dialog
│   ├── products/                 # cards, uploader, editor
│   ├── marketplaces/             # select, export, badge
│   ├── billing/                  # plan card, quota, payment state
│   └── layout/                   # header, bottom nav, app shell
├── lib/
│   ├── format-brl.ts
│   ├── channel-capabilities.ts
│   └── validators.ts
└── styles/
    └── tokens.css
```

### Exemplo de capability-driven UI

```tsx
const channels = [
  { id: 'facebook', label: 'Facebook Marketplace', mode: 'manual_assisted' },
  { id: 'olx', label: 'OLX', mode: 'manual_assisted' },
  { id: 'mercado_livre', label: 'Mercado Livre', mode: 'manual_assisted' },
] as const;

// Essa configuração inicial é deliberadamente conservadora.
// O backend altera modo para official_api apenas se autorizações e
// requisitos reais daquela conta/categoria estiverem disponíveis.
// UI não deve afirmar publicação automática só por ter um conector.
```

### Formatação BRL

```ts
export const formatBRL = (cents: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(cents / 100);
```

**Não implementar ad network durante a construção visual.** Criar apenas interface `AdSlot` condicional que retorna `null` até existir viabilidade/legalidade confirmada.

---

## 11. Critérios de aceite por tela

| Tela | Aceite |
|---|---|
| Landing | Benefício entendido em 5 segundos; CTA acima da dobra no mobile |
| Login | Entrar, sair e recuperar sessão com UX adequada |
| Dashboard | Criar/editar produtos, estados vazios e sem scroll horizontal |
| Novo anúncio | Foto/câmera, preço em R$, validação, erro e retry |
| Revisão | IA editável, aviso para detalhes incertos, salvar sem nova geração |
| Canais | Três destinos, distinção de modo, export/copy, retorno útil sem API |
| Passe | Quota visível, R$ 14,90/30 dias teste, sem renovação; status verificado |
| Conta | Acesso a ajuda, privacidade e remoção de conta |
| Publicidade | Pro não carrega anúncios; grátis só em espaços aprovados e elegíveis |

### Teste de uso real (antes de divulgar)

Dar a cinco pessoas diferentes um produto físico e pedir: “Faça o anúncio e coloque-o em duas plataformas, sem eu explicar o caminho”. Observar cliques, dúvidas, erros e tempo. Simplificar antes de lançar tráfego pago.

---

## 12. Ordem de construção do frontend (uma semana de foco)

1. **Dia 1:** tokens, fonte, header, botões, container responsivo, landing.
2. **Dia 2:** dashboard, `ProductCard`, empty state, navegação mobile.
3. **Dia 3:** `PhotoUploader`, `ProductForm` e validações.
4. **Dia 4:** editor de IA, estados de carregamento e erros.
5. **Dia 5:** seletor de canais e exportação/manual, primeiro teste end-to-end.
6. **Depois:** Passe Pro, configurações e refinamentos visuais enquanto a API/pagamentos são implementados.

Priorizar **clareza funcional acima de pixel-perfect**. Fotos reais de produtos e botões operacionais impressionam mais que uma landing com animações complexas.

---

## 13. Checklist final de design

- [ ] Site parece produto próprio, não clone do SellRaze.
- [ ] Tela principal é `Novo anúncio`, não painel de gestão.
- [ ] PT-BR natural e BRL em todas as telas.
- [ ] Mobile utilizável com uma mão e sem excesso de texto.
- [ ] Modo de publicação explicado por canal, sem enganar.
- [ ] Estados `loading/error/empty/offline` implementados.
- [ ] Limite IA e validade do passe claros.
- [ ] Publicidade separada e desativada por padrão.
- [ ] Fluxo de publicação funciona sem extensão.
- [ ] No máximo um CTA primário por seção.
- [ ] Funciona em largura 360px e com zoom 200%.
- [ ] Acessibilidade básica e performance verificadas.

## 14. Referências visuais e técnicas

- Referência principal: https://www.sellraze.com/
- App e descrição pública: https://apps.apple.com/br/app/sellraze-list-sell-earn/id6455042085
- Imagens oficiais de onboarding/identificação/seleção na homepage da SellRaze; **somente inspiração, não uso comercial**.
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/primitives
- shadcn/ui: https://ui.shadcn.com/
- Web accessibility: https://www.w3.org/WAI/WCAG22/quickref/
- AdSense ad placement: https://support.google.com/adsense/answer/1346295

**Fim — guia de frontend v1.0.**
