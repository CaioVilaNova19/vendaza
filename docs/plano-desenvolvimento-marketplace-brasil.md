# Plano de desenvolvimento — Anúncios Multicanal Brasil

> **Versão:** 0.3 — micro-SaaS freemium de baixa manutenção  
> **Atualizado em:** 19/10/2026  
> **Status:** pronto para iniciar o Sprint 0 (validação de integrações)  
> **Codinome:** `marketplace-br` (nome comercial a definir)  
> **Documento complementar:** [`guia-frontend-marketplace-brasil.md`](./guia-frontend-marketplace-brasil.md)

## 0. Resumo executivo

Construir uma **ferramenta brasileira simples para criar um anúncio a partir de fotos e prepará-lo para vários marketplaces**. O usuário cadastra o item uma única vez, revisa o texto gerado por IA e escolhe os canais onde quer anunciar. O produto **não é um marketplace próprio nem um ERP**.

**Objetivo do projeto:** lançar rapidamente um produto lateral com potencial de renda extra, mantendo o trabalho de operação e manutenção baixo. Não sacrificar essa meta para implementar uma funcionalidade complexa.

**Proposta de valor:** “Tirou a foto. O anúncio está pronto para vender em mais lugares.”

**Canais de lançamento:** Facebook Marketplace, OLX e Mercado Livre, com transparência sobre o modo de publicação disponível em cada um. Caso alguma integração demore ou seja inviável, oferecer preparação/exportação e publicação assistida; considerar Enjoei (usados) ou Shopee (vendedores elegíveis) apenas depois da validação.

**Estratégia de receita:** acesso gratuito com limite de uso, espaços de publicidade **somente em áreas elegíveis e após aprovação da rede** e um **Passe Pro de 30 dias, sem renovação automática**, que remove a publicidade do nosso site e amplia as gerações por IA. Começar a cobrança do passe antes de depender de receita publicitária. Preço e limites são hipóteses de teste, não fatos de mercado.

**Meta operacional:** após estabilização, procurar manter **2–4 horas de manutenção por semana**, sem SLAs de atendimento em tempo real. Se uma integração exigir manutenção constante, desabilitar o fluxo frágil e manter o assistido.

### Princípios inegociáveis

1. **Simplicidade acima de completude.** O anúncio pronto e exportável vale mais que chat, estoque, pedidos e dashboards.
2. **Sem automação não autorizada.** Uma sessão aberta no navegador não é permissão para usar endpoints privados, interceptar cookies, contornar medidas anti-bot ou automatizar ações proibidas.
3. **Sem promessas falsas.** “Preparar” e “publicar automaticamente” são funções diferentes. Cada canal exibe sua capacidade real.
4. **Custos limitados.** Toda geração de IA deve ter quota, limite de imagem e medição de custo.
5. **Fallback universal.** Mesmo que uma API/extension falhe, o usuário pode copiar os textos, baixar as fotos e abrir a plataforma correspondente.

---

## 1. Público e produto mínimo

**Público inicial:** pessoas que vendem produtos usados na OLX/Facebook e pequenos revendedores de eletrônicos, acessórios e itens domésticos. **Não** construir inicialmente para lojas com gestão de estoque de grande escala.

### Jornada de sucesso (único fluxo fundamental)

1. Abrir a PWA e entrar (pode explorar a landing sem conta).
2. Tirar/enviar até 4 fotos do item, informar categoria, condição e preço em BRL.
3. Acionar “Criar anúncio com IA”. A IA sugere título e descrição e destaca dados não confirmados.
4. Corrigir informações, revisar e salvar.
5. Selecionar Facebook, OLX e/ou Mercado Livre.
6. Para cada canal, seguir a melhor ação **disponível**: publicação API autorizada, auxílio local via extensão aprovada, ou exportar/copiar e finalizar na plataforma.
7. Opcional: colar o link do anúncio e marcar o item como vendido.

**Critério de produto:** o vendedor deve conseguir chegar a uma descrição utilizável e ao fluxo de publicação em **menos de 3 minutos em um caso típico**, sem prometer um tempo fixo para os sites externos.

### Está **dentro** do MVP

- Landing curta, autenticação e mini-dashboard dos produtos.
- Cadastro do produto com fotos, título, condição, preço BRL e descrição editável.
- Geração com IA: um rascunho canônico; pequenas adaptações de texto por canal quando necessário.
- Seletor com **três marketplaces** e modo explicitamente indicado.
- Exportação: copiar título/descrição; baixar fotos; abrir site; compartilhar em mobile quando suportado.
- Mercado Livre via API **se** OAuth/autorizações/categoria estiverem disponíveis no prazo; fallback assistido caso contrário.
- PoC da extensão para Facebook no desktop **apenas após validar regras aplicáveis**, com confirmação final feita pelo usuário. O MVP funciona mesmo sem extensão.
- Link do anúncio, status manual (“rascunho”, “publicado por mim”, “vendido”) e confirmação opcional.
- Gratuito com limites, compra de passe por Pix/cartão se ofertados pelo provedor, webhook de pagamento, remoção de anúncios do nosso produto para pagantes.
- Instrumentação enxuta de funil/erros, controles de privacidade e limite de custos.

### Explicitamente **fora** do MVP

- Inbox unificada, chats, negociação automática, auto-resposta.
- Sincronização contínua de status, auto-delist, importação massiva de inventário.
- Estoque, pedidos, frete, logística, precificação dinâmica e inteligência de mercado.
- Aplicativos nativos, extensão mobile, automação de rede de múltiplas contas.
- SEO/content farm para perseguir receitas de anúncios; comunidade/social; programa de afiliados complexo.
- Assinatura recorrente, múltiplos tiers, consumo ilimitado de IA e painéis administrativos elaborados.

### P1 somente se houver uso real e baixo custo de manutenção

- Melhor suporte a API de publicação Mercado Livre e OLX elegível; melhoria da extensão assistida somente se permitida e estável.
- Quarto canal (Enjoei assistido ou Shopee via API para vendedores elegíveis).
- Reaproveitar anúncio já salvo, templates simples, exportação em lote limitada.
- Plano recorrente ou créditos avulsos **somente** se os dados justificarem.

---

## 2. Matriz de canais — comportamento honesto

| Canal | Fluxo garantido por nós | Automação possível, condicionada | Mensagens/status no MVP |
|---|---|---|---|
| **Facebook Marketplace** | Preparar, copiar/exportar, abrir Marketplace e finalizar manualmente | PoC de assistência local via extensão WXT no desktop, somente se tecnicamente estável e permitido | **Não** integrar chats pessoais; status confirmado pelo usuário |
| **OLX** | Preparar, exportar e publicar manualmente | API `autoupload`/chat apenas com conta, categoria e autorização elegíveis | **Não** implementar chat; status manual |
| **Mercado Livre** | Preparar e exportar; fluxo assistido de contingência | OAuth + API oficial para publicar e consultar itens quando autorizado; atributos por categoria | Sem inbox; status API opcional se implementado |
| **Enjoei (reserva)** | Assistido | API pública geral não confirmada | Fora do MVP |
| **Shopee (reserva)** | Não incluir no beta casual | Open Platform para operações/lojas autorizadas | Fora do MVP |

### O que NÃO é “usar cookies pelo navegador”

O aplicativo **não lê, armazena, exporta, transfere ou reproduz** cookies de Facebook/OLX/Mercado Livre. A extensão pode receber **somente os dados do anúncio do nosso SaaS** e atuar na aba **em que o usuário está legitimamente autenticado**, com permissões mínimas e confirmação explícita. Não usar `chrome.cookies`, `document.cookie` para sessão, `webRequest` interceptando credenciais, endpoints internos ou navegadores remotos autenticados pela conta do cliente.

Isso **não confere autorização** para automação. Revisar políticas de terceiros antes de habilitar qualquer preenchimento automatizado de interface. Se houver conflito, limitar a extensão à cópia/contextualização e abertura de links. Nunca apresentar uma extensão como API oficial.

### Critérios de aceitação por canal

- Produto, título e fotos chegam ao destino, sem perda de informação por nós.
- Interface separa **“Preparar e abrir”**, **“Preencher com auxílio”** (se validado) e **“Publicar via API”** (se disponível).
- Sem indicação de “publicado” sem confirmação oficial ou confirmação manual explícita.
- Falhas de integração têm uma saída funcional: `Copiar anúncio` e `Abrir marketplace`.
- Respeitar requisitos do marketplace: campos obrigatórios, condição, categoria, imagens, preços e políticas de uso.

---

## 3. Modelo freemium e monetização

> **Hipóteses para o beta: ajustar após observar utilização, custo de IA e intenção de compra.**

| Recurso | Gratuito | Passe Pro |
|---|---|---|
| Preço | R$ 0 | **R$ 14,90 por 30 dias** (teste) |
| Renovação | Não se aplica | **Não automática** |
| Anúncios no nosso site | Quando aprovados e elegíveis | **Sem publicidade do nosso produto** |
| Gerações novas com IA | **5/mês** | **30 durante o período ativo** (hipótese) |
| Publicar/exportar | 3 canais, modos disponíveis | Mesmos canais, mesmos modos disponíveis |
| Editar/copiar anúncios salvos | Sim | Sim |
| Limite de uploads | 4 fotos por item, otimização automática | Mesmo limite inicialmente |

**Nota de produto:** “sem anúncios” significa **sem publicidade dentro da nossa PWA**. Não remove anúncios dos sites do Facebook, da OLX ou do Mercado Livre e não paga destaque de listagem nesses serviços.

### Experiência de monetização

- Exibir um upgrade discreto em `Configurações` e quando a quota gratuita terminar.
- Não bloquear exportação manual de anúncios já gerados por meio de paywall tardio.
- Mostrar saldo: “Você usou 3 de 5 anúncios com IA neste mês”. Não contabilizar edição manual ou falha do provedor como geração bem-sucedida.
- Passe pago com prazo exato, termos antes do pagamento e comprovante disponível; sem renovação automática.
- Compra somente com confirmação via **webhook servidor a servidor** validado e idempotente; nunca confiar só na tela de retorno do checkout.
- Se necessário, testar créditos avulsos depois, em vez de criar cinco planos no começo.

### Publicidade: risco comercial e de política

**Não tratar como receita garantida.** O AdSense não pode ser colocado em extensão do navegador; sua política também restringe páginas sem conteúdo e páginas inacessíveis a análise. Um painel transacional autenticado pode não ser elegível. Portanto:

1. Implementar **`AdSlot` desativado por feature flag** no início; não carregar SDK até haver aprovação aplicável.
2. Verificar se existem páginas web públicas, úteis e com conteúdo original elegíveis para veiculação; **não** produzir conteúdo artificial só para anúncios.
3. Mesmo em páginas elegíveis, não exibir anúncios na câmera, formulário, upload, checkout, modais, resultados críticos ou dentro da extensão.
4. Separar visualmente “Publicidade” de anúncios do usuário; não simular anúncios nativos de marketplace nem incentivar cliques.
5. Ajustar consentimento, privacidade, cookies e requisitos da rede antes de ativar.
6. Se o modelo AdSense não for viável, o produto deve se sustentar nos passes — **não redesenhar o app inteiro para forçar impressões**.

### Indicadores financeiros para acompanhar

- Receita bruta de passes, receita publicitária realizada (se houver), processamento, tributos reais, IA, armazenamento e outros serviços.
- Margem de contribuição por passe = preço − taxas − impostos aplicáveis − custo incremental do uso.
- `CAC` por campanha/microcriador = gasto / quantidade de **compradores**, não cadastros.
- Não presumir RPM, conversão ou retenção: medir com o beta antes de escalar anúncios pagos.
- **Orçamento de experimento**: campanhas pequenas e escalonadas com microcriadores só após comprovar que usuário real termina o anúncio.

---

## 4. Stack e arquitetura mínima

| Componente | Escolha | Justificativa |
|---|---|---|
| Web | Next.js App Router + TypeScript + Tailwind | Entrega mobile-first, páginas públicas e endpoints no mesmo projeto |
| PWA | Manifest + instalação opcional | Não manter apps iOS/Android separados |
| Auth + dados + imagens | Supabase (Auth/PostgreSQL/Storage) | Serviço gerenciado; poucas tabelas e operação simples |
| Banco/ORM | PostgreSQL + Drizzle (opcional: SQL/migrations simples) | Acompanhamento de produtos, quotas, pagamentos e OAuth |
| IA | Uma API de visão/geração, server-side | Rascunho do produto a partir das fotos |
| Pagamentos | Mercado Pago ou outro gateway elegível para Pix/cartão | Checkout hospedado + webhook validado |
| Extensão opcional | WXT + TypeScript + Manifest V3 | Auxílio local em Chrome/Edge desktop |
| Erros | Sentry (ou equivalente) | Alertas de problemas sem operação manual constante |
| Analytics | PostHog ou eventos próprios mínimos | Acompanhar o funil real |
| Deploy | Hospedagem gerenciada compatível com Next.js + Supabase | Não manter VPS/Redis/containers por padrão |

**Não construir:** workers permanentes, BullMQ, Redis, Kafka, Kubernetes, microserviços, painel admin customizado ou sincronizações periódicas antes de existir necessidade.

### Estrutura de repositório

```text
marketplace-br/
├── apps/
│   ├── web/                       # Next.js + API + PWA
│   └── extension/                 # WXT/MV3 - somente se a PoC passar
├── packages/
│   ├── shared/                    # schemas Zod, tipos e constantes
│   └── channels/                  # capacidades por canal, lógica essencial
├── docs/
│   ├── plano-desenvolvimento-marketplace-brasil.md
│   ├── guia-frontend-marketplace-brasil.md
│   └── integration-decisions.md
├── .env.example
└── README.md
```

**Ainda mais simples é aceitável:** começar com **somente `apps/web`**, sem packages/extension, e extrair pastas quando a implementação justificar. Não criar estrutura vazia por formalidade.

### Dados mínimos que precisam ser persistidos

| Entidade | Campos centrais | Observação |
|---|---|---|
| `auth.users` | gerenciado pelo Supabase | Usuários do nosso app, não credenciais de marketplace |
| `products` | `id`, `user_id`, nome, descrição, preço_cents, condição, caminhos de fotos, timestamps | Um produto = uma fonte de dados |
| `channel_listings` | `product_id`, canal, modo, external_id/URL opcional, status, confirmação/data | Evitar afirmar status externo sem evidência |
| `channel_connections` | `user_id`, canal, OAuth tokens cifrados, expiry, escopos | Criar **somente quando** houver integração OAuth oficial |
| `payments` | `user_id`, provider, checkout/payment_id, valor, status, idempotency_key, timestamps | Confirmar via webhook |
| `entitlements` | `user_id`, acesso Pro até, origem/compra | Pode começar como campo derivado de compra confirmada |
| `ai_usage` | `user_id`, mês BR, operação_id, status, custo estimado | Quota atômica sem dupla cobrança |

Usar RLS ou autorização server-side testada para isolamento de usuários. Salvar imagens em bucket privado com URL assinada quando necessário. Não gravar tokens ou fotos em logs. Não armazenar conversas dos marketplaces.

### API própria (contratos enxutos)

```text
POST   /api/products                  # cadastrar produto
GET    /api/products                  # listar meus produtos
PATCH  /api/products/:id              # editar/atualizar
POST   /api/products/:id/generate     # quota + IA + schema validado
POST   /api/products/:id/export       # preparar payload de um canal
PATCH  /api/products/:id/status       # usuário confirma publicação/venda
POST   /api/payments/checkout         # gerar checkout hospedado
POST   /api/webhooks/payments         # verificar assinatura e liberar Pro
GET    /api/me/usage                  # quota, passe e capacidades
```

Criar endpoints OAuth Mercado Livre **apenas quando a integração oficial entrar na versão**.

### Contrato de capacidade por canal

```ts
type ChannelId = 'facebook' | 'olx' | 'mercado_livre';
type PublishMode = 'official_api' | 'browser_assisted' | 'manual_assisted' | 'unavailable';

type ChannelCapability = {
  id: ChannelId;
  publishMode: PublishMode;
  isEnabled: boolean;
  requiresDesktop?: boolean;
  userFacingLabel: string; // ex.: "Preparar e abrir Facebook"
};
```

**Regra:** funcionalidades não autorizadas não ficam escondidas atrás de um botão genérico “Publicar”. A operação e o modo devem ser explícitos.

---

## 5. Extensão browser (risco controlado)

### Sequência de validação

1. **Manual primeiro:** gerar texto e fotos no PWA, abrir o formulário e concluir com o usuário. Medir a experiência real.
2. Ler políticas aplicáveis das plataformas e regras da Chrome Web Store. Documentar o que é permitido.
3. **PoC opcional** WXT: ação iniciada pelo usuário, na guia atual; tratar apenas dados do nosso anúncio; não acessar autenticação/cookies do marketplace.
4. Testar 10 publicações de demonstração com supervisão. Se fragilidade/manutenção forem elevadas, **não lançar a automação**.
5. Manter saída alternativa manual sempre que browser/versão/conta/categoria não forem compatíveis.

### Segurança mínima da extensão

- Manifest V3, `activeTab` e permissões granulares, evitando `<all_urls>`.
- Não solicitar permissão `cookies`; não coletar credenciais/sessão, nem rodar fluxo em servidor com navegador autenticado.
- Não capturar mensagens pessoais, DMs, histórico, perfil ou dados desnecessários dos compradores.
- Comunicação web/extensão com autorização explícita, nonce/expiração e payload mínimo; sem tokens privilegiados em URLs.
- Sem AdSense, publicidade injetada nos sites de terceiros ou manipulação de conteúdos de terceiros para monetização.
- Ter kill switch para desabilitar funcionalidade instável remotamente no nosso produto.

---

## 6. IA — pequena, previsível e barata

**Entrada:** até 4 fotos com compressão/redimensionamento, categoria, condição, informações informadas pelo usuário, preço desejado.

**Saída estruturada:** título, descrição curta, descrição detalhada, atributos sugeridos, informações não confirmadas e sugestões opcionais de melhorias.

**Guardrails:**

- Não inventar capacidade de armazenamento, marca, modelo, originalidade, estado de conservação, defeitos, garantia ou nota fiscal.
- Não sugerir preço “de mercado” como se fosse calculado com dados de anúncios reais sem integração verificada para isso.
- Validar JSON com Zod; mostrar erros recuperáveis; exigir revisão humana.
- Limite de fotos, tamanho, requests por usuário/IP e quota mensal no servidor; contadores consistentes em concorrência.
- Medir custo por geração e taxa de falhas; permitir desligar/desgraduar recursos caros.
- Usuário pode editar manualmente sem chamar IA novamente.

---

## 7. Experiência do frontend

O detalhamento visual está em **[`guia-frontend-marketplace-brasil.md`](./guia-frontend-marketplace-brasil.md)**.

### Telas P0

1. `/` — landing/CTA e explicação em três passos.
2. `/entrar` — login (Google/e-mail, escolha simples).
3. `/app` — lista enxuta de produtos + CTA “Novo anúncio”.
4. `/app/novo` — upload, dados do produto e geração por IA.
5. `/app/produtos/[id]` — revisar anúncio e distribuir por canal.
6. `/app/plano` — status gratuito/Pro, quota, preço e checkout.
7. `/app/configuracoes` — perfil, privacidade, suporte e apagar conta.

### Regra de publicidade na interface

- Um componente `AdSlot` **oculto até autorização** e habilitado exclusivamente em páginas elegíveis.
- Nenhum slot dentro do wizard, upload, editor, checkout ou extensão.
- No Passe Pro, nenhum slot é renderizado/carregado.
- Não usar pop-ups, intersticiais ou elementos que confundam publicidade com resultados de anúncio.

---

## 8. Plano de entrega — até 5 semanas (meta agressiva)

> Os prazos abaixo assumem desenvolvimento individual com blocos de tempo dedicados, integrações condicionadas e escopo mínimo. Uma API externa pode atrasar; nunca transformar aprovação em bloqueio de toda a entrega.

### Sprint 0 — 2 a 3 dias: reduzir incertezas

- [ ] Criar conta dev Mercado Livre e verificar OAuth/atributos para categorias usadas no beta.
- [ ] Verificar OLX: categorias, plano, credenciamento, documentos e resposta do integrador.
- [ ] Validar políticas de assistência no Facebook/Chrome e registrar decisão `manual`/`extension`.
- [ ] Completar **uma publicação manual assistida** em cada um dos três canais.
- [ ] Levantar custo aproximado por geração IA em amostras reais.
- [ ] Validar possibilidade de anúncios web; assumir *zero receita publicitária* no orçamento inicial.

**Saída do Sprint 0:** matriz de canais atualizada e decisão de continuar/fallback.

### Semana 1 — produto base

- [ ] Next.js/PWA, Tailwind, Supabase Auth e Storage privado.
- [ ] CRUD de produtos e fotos comprimidas.
- [ ] Layout inicial (landing, painel, novo anúncio) conforme guia frontend.
- [ ] Schema/migrations e autorização por usuário.

**Aceite:** cadastrar um produto, atualizar, reabrir e excluir sem bugs ou acesso entre usuários.

### Semana 2 — IA + canais assistidos

- [ ] Endpoint IA com quota atômica e resposta Zod.
- [ ] Form de revisão/editável; copiar texto e baixar fotos.
- [ ] Cartões Facebook/OLX/Mercado Livre com modos reais.
- [ ] Fluxo assistido funciona em desktop e mobile.
- [ ] Primeiros eventos: cadastro, geração bem-sucedida, exportação, anúncio confirmado.

**Aceite:** anunciar manualmente o mesmo produto nos três destinos partindo de uma única ficha.

### Semana 3 — pagamentos + integrações opcionais

- [ ] Checkout hospedado e webhook verificado/idempotente; passe de 30 dias.
- [ ] Quota gratuita/Pro; estado do passe e datas exibidas corretamente.
- [ ] API Mercado Livre para publicação **se** aprovada e implementável com segurança; senão manter assistido.
- [ ] Prova de conceito WXT **se** permitida; não travar o release por ela.
- [ ] Espaço AdSlot atrás de flag, **sem SDK publicitário habilitado por padrão**.

**Aceite:** pagamento de teste confirma benefício uma única vez; falhas não ativam Pro.

### Semana 4 — testes de uso e confiabilidade

- [ ] 10–20 testers; medir onde abandonam e tempo até exportação.
- [ ] Testes de quota/concorrência, RLS, upload, preço, webhook e links externos.
- [ ] Corrigir top 5 erros; página de ajuda curta, FAQ, contato por e-mail.
- [ ] Termos/privacidade, exclusão de conta/dados e configuração de alertas.

**Aceite:** pelo menos 8 usuários concluem fluxo real de anúncio; registrar dificuldade por canal.

### Semana 5 — beta público e aquisição pequena

- [ ] Preparar vídeos demonstrando resultado real e diferenças entre integração e assistência.
- [ ] Contratar 2–3 microcriadores em rodadas escalonadas; UTMs/códigos distintos.
- [ ] Medir compradores, não só visualizações/cadastros; desligar campanha que não converte.
- [ ] Monitorar bugs e custos; não lançar mais funcionalidades durante a rodada inicial.

**Aceite:** app utilizável sem suporte síncrono e sem promessas excessivas de automação.

---

## 9. Backlog mínimo — ordem de execução

| ID | Prioridade | Tarefa | Definição de pronto |
|---|---|---|---|
| DEV-01 | P0 | Criar repositório e app Next.js TS | `dev`, `lint`, `build` funcionando |
| DEV-02 | P0 | Design tokens + shell | Mobile 360px e desktop 1280px sem overflow |
| DEV-03 | P0 | Supabase Auth + RBAC próprio | Login/logout e isolamento por usuário |
| DEV-04 | P0 | Produto CRUD + imagens | Criar, editar e excluir com fotos privadas |
| DEV-05 | P0 | Serviço IA + validação | Rascunho editável, sem inventar características |
| DEV-06 | P0 | Quotas free/Pro | Limite server-side e concorrência protegida |
| DEV-07 | P0 | Seleção de canais | Modo explícito de cada plataforma |
| DEV-08 | P0 | Export/copy/share | Útil sem nenhuma API integrada |
| DEV-09 | P0 | Checkout + webhook | Concessão idempotente de passe válido |
| DEV-10 | P0 | Segurança e políticas | RLS, inputs, privacidade, logs saneados |
| DEV-11 | P0 | Métricas e alertas | Funil e erro crítico observáveis |
| DEV-12 | P0 | Beta real + FAQ | Feedback registrado, bugs críticos fechados |
| DEV-13 | P1 | Mercado Livre API | Publicação real autorizada, fallback |
| DEV-14 | P1 | Extensão WXT | PoC permitida, funcional e removível |
| DEV-15 | P1 | AdSlot/ads | Habilitar **só após** aprovação e elegibilidade |
| DEV-16 | P2 | Enjoei ou Shopee | Apenas se demanda justificar |

---

## 10. Qualidade, segurança e manutenção

### Testes essenciais

- [ ] Um usuário não visualiza/edita/exclui produto de outro (RLS + testes).
- [ ] Pagamento duplicado/reenviado não duplica entitlement.
- [ ] Cancelamento/recusa/estorno não concede acesso indevido.
- [ ] Quota IA não é ultrapassada com requests paralelos; falha não consome geração.
- [ ] Fotos possuem limite de tipo/tamanho, sem URL pública permanente.
- [ ] Produto com campos não verificados pela IA pede confirmação.
- [ ] Fluxo assistido segue funcionando quando não há extensão/API.
- [ ] Com Passe Pro, publicidade do nosso produto não é exibida.
- [ ] Console/logs não contêm cookies, OAuth tokens ou imagens privadas.
- [ ] Mobile: câmera, teclado, navegação e foco sem quebra.

### Rotina de operação (objetivo: 2–4 h/semana)

- **Alertas automáticos:** erros críticos de login, IA, checkout e queda da aplicação; quota de custos.
- **Uma revisão semanal:** 30–60 min para dashboards de uso, pagamentos, IA e erros.
- **Suporte assíncrono:** FAQ e e-mail; respostas em janela comercial definida, sem chat humano em tempo real.
- **Atualização quinzenal ou mensal:** correções agrupadas, salvo falha grave.
- **Kill switches:** desabilitar API/extension/IA sob problema de custo, política ou estabilidade.
- **Sem scraping/crawler crônico:** não agendar sondagem de marketplaces para vigiar estado de anúncios.
- **Conter custos:** limites de fotos, quotas, limites server-side de requests e alertas de cobrança.

### LGPD e dados pessoais

- Política de privacidade clara: finalidades, retenção, exclusão e terceiros de processamento.
- Coletar somente dados essenciais ao serviço; não coletar dados de compradores/chat no MVP.
- Imagens privadas e expiração/deleção conforme política; rotina de exclusão de conta.
- Revisar requisitos de consentimento/cookies e publicidade personalizada antes de monetizar.

---

## 11. Métricas e gates de decisão

Acompanhar somente o que permite decidir se vale continuar:

| Métrica | Definição | Objetivo do teste (hipótese) |
|---|---|---|
| Ativação | Usuário gera e exporta o primeiro anúncio | >= 50% dos que iniciam o fluxo |
| Tempo até saída útil | Da foto até anúncio pronto para copiar/publicar | <= 3 minutos em caso típico |
| Conclusão por canal | Fluxo finalizado e confirmado pelo usuário | Detectar onde ocorrem travamentos |
| Custo IA | Custo médio das gerações bem-sucedidas | Compatível com limite gratuito e preço do passe |
| Conversão paga | Compras / usuários ativos mensais | Medir; **não supor** 2% |
| CAC pago | Gasto em criadores / passes comprados atribuídos | Menor que contribuição esperada no horizonte razoável |
| Manutenção | Horas reais de suporte/correção por semana | Meta 2–4 h após estabilização |

**Regras para não transformar em um segundo emprego:**

- Se a extensão quebra a cada atualização do Facebook, voltar para o assistido.
- Se o tráfego publicitário é baixo, não inventar telas só para aumentar impressões.
- Se o CAC do passe fica acima da margem que clientes trazem, não escalar campanha.
- Se o usuário não termina os anúncios, priorizar UX e não novas APIs.
- Se 5 semanas não bastarem, **cortar funcionalidade** antes de estender escopo indefinidamente.

---

## 12. Primeiras 48 horas (executável)

### Dia 1

- [ ] Nome/codinome, repositório e `.env.example` sem segredos.
- [ ] Next.js TypeScript + Tailwind; instalar dependências mínimas.
- [ ] Criar `docs/` com **estes dois arquivos**.
- [ ] Implementar shell + dashboard vazio + tela “Novo anúncio”.
- [ ] Criar projeto Supabase dev e primeira migration.

### Dia 2

- [ ] Form de produto e upload de fotos.
- [ ] Template real de resultado de IA (mock primeiro).
- [ ] Três cards de canais com “Preparar e abrir”.
- [ ] Uma publicação manual completa de ponta a ponta como prova de UX.
- [ ] Verificar APIs/políticas e abrir lista curta de bloqueios externos.

### Exemplo de bootstrap

```bash
mkdir marketplace-br && cd marketplace-br
corepack enable
pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias '@/*'
# Depois: adicionar Supabase, Zod e componentes conforme necessidade real.
```

> Se o assistente de bootstrap não suportar o destino aninhado na versão instalada, criar o Next.js na raiz e migrar para `apps/web` depois. Não perder tempo com monorepo prematuro.

---

## 13. Decisões pendentes (não bloqueantes)

1. Nome comercial, domínio e logo próprios.
2. Provedor de IA e teto de gasto mensal efetivo.
3. Gateway de pagamento com Pix e cartão; taxa real e impostos.
4. Elegibilidade real de anúncios no site/PWA; não pressupor aprovação.
5. Homologação/limites de Mercado Livre e OLX para as categorias escolhidas.
6. Aprovação jurídica/política de qualquer assistência de extensão no Facebook.
7. Limites de IA (5/30) e preço do Passe (R$ 14,90) após beta.

---

## 14. Fontes primárias e referência visual

Revalidar páginas antes da implementação, porque regras e integrações mudam:

- SellRaze — referência de experiência e estética (não copiar): https://www.sellraze.com/
- Mercado Livre Developers — https://developers.mercadolivre.com.br/
- OLX Developers — https://developers.olx.com.br/
- Meta Terms — https://www.facebook.com/terms/
- Meta Automated Data Collection Terms — https://www.facebook.com/legal/automated_data_collection_terms
- Chrome Extensions (Manifest V3) — https://developer.chrome.com/docs/extensions/
- WXT — https://wxt.dev/
- Google AdSense: políticas gerais — https://support.google.com/adsense/answer/48182
- Google AdSense: políticas de posicionamento — https://support.google.com/adsense/answer/1346295
- Google AdSense: conteúdo insuficiente — https://blog.google/products/adsense/how-to-address-insufficient-content/

**Fim — v0.3. Próximo passo: Sprint 0 + wireframes descritos no guia de frontend.**
