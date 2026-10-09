# Plano de implementação e personalização

> Regra oficial: [ADR-001](../adr/ADR-001-personalizacao-sem-alterar-layout.md). Vale para todas as rotas.

## Regra de ouro

A estrutura, o layout, as classes e a lógica dos componentes **não mudam**. A personalização consiste em:

- **Texto:** trocar cada texto por outro com **exatamente o mesmo número de caracteres** (espaços, pontuação e acentos contam; `á` conta como 1).
- **Imagem:** substituir o arquivo mantendo **o mesmo caminho, o mesmo formato e as mesmas dimensões** em pixels (ou o mesmo `viewBox`, no caso de SVG).

O inventário de cada rota fica em `docs/personalizacao/<rota>-slots.json`. O comando `npm run check:slots` (todas as rotas) ou `npm run check:home` verifica:

- se cada texto original ainda está no arquivo;
- se cada texto novo tem o tamanho exato e foi aplicado;
- se cada imagem tem as dimensões esperadas.

---

## Fase 0: adaptação para Cloudflare ✅ (esta PR)

O site é 100% estático (`output: "static"`). Por isso, ele é publicado como **Cloudflare Workers + Static Assets**, sem adaptador e sem mudar `astro.config.mjs`.

| Item | Situação |
|---|---|
| `wrangler.jsonc` com `assets.directory: ./dist` e `not_found_handling: 404-page` | feito |
| `wrangler` como devDependency | feito |
| Scripts `deploy`, `cf:check` (build + dry-run) e `cf:preview` (build + `wrangler dev`) | feito |
| `.wrangler/` e `.dev.vars*` no `.gitignore` | feito |
| `npm run cf:check` passando (122 arquivos, sem bindings) | verificado |

**Próximos passos (precisam de você):**

1. Conectar o repositório no painel Cloudflare: **Workers & Pages → Create → Import a repository**.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
2. Definir o domínio final. Depois disso, trocar `site: "https://example.com"` em `astro.config.mjs`, porque ele afeta o canonical, o sitemap e o RSS.
3. Decidir se removemos `@astrojs/vercel`. Ele está no `package.json`, mas não é usado.

## Fase 1: Home (`/`) ✅ copy aplicada (imagens e links pendentes)

A copy "Risco Cognitivo" foi adaptada e aplicada em 104 slots de texto, com contagem exata. O logo do menu e a marca do rodapé foram trocados por "Risco Cognitivo", com o mesmo `viewBox`. A altura de cada texto e de cada seção foi comparada com o original em 7 larguras (1440 a 360px), nos temas claro e escuro, e ficou idêntica.

O mapeamento da copy, as decisões de adaptação e as pendências estão em [`home-adaptacao.md`](home-adaptacao.md).

### Inventário original

O inventário está pronto em `docs/personalizacao/home-slots.json`: **100 slots de texto** e **29 slots de imagem**. Ele foi conferido contra o código e todos os textos originais foram encontrados.

**Como enviar o conteúdo:** para cada `id`, mande o texto novo com o número de caracteres indicado. Para as imagens, mande arquivos nas dimensões indicadas, ou arquivos na mesma proporção para eu exportar no tamanho exato.

### Textos por seção

| Seção | Slots | Arquivo |
|---|---|---|
| Metadados (aba/SEO) | 2 | `src/consts.ts` |
| Hero | 13 | `blocks/hero.tsx` |
| Logos | 11 | `blocks/logos.tsx` |
| Features | 6 | `blocks/features.tsx` |
| Resource Allocation | 11 | `blocks/resource-allocation.tsx` |
| Depoimentos | 16 | `blocks/testimonials.tsx` |
| Preços | 26 | `blocks/pricing.tsx` |
| FAQ | 10 | `blocks/faq.tsx` |
| Rodapé ⚠️ global | 2 | `blocks/footer.tsx` |
| Menu ⚠️ global | 3 | `blocks/navbar.tsx` |

A lista completa, com cada texto original e sua contagem, está no JSON. Exemplos:

| id | caracteres | original |
|---|---|---|
| `hero.h1` | 23 | Mainline Astro template |
| `hero.sub` | 86 | Mainline is an open-source website template built with shadcn/ui, Tailwind 4 & Astro 5 |
| `features.faixa` | 24 | MEASURE TWICE. CUT ONCE. |
| `ra.h2` | 47 | Mainline your resource allocation and execution |
| `depo.h2` | 27 | Trusted by product builders |
| `faq.resposta` | 114 | Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates deserunt officia temporibus dignissimos. |

### Imagens

| Slot | Arquivo | Dimensões |
|---|---|---|
| Hero | `public/hero.webp` | 2360×1446 |
| Logos de clientes (9) | `public/logos/*.svg` | o mesmo viewBox de cada um (ex.: mercury 143×26). Monocromáticos: ficam com 50% de opacidade e são invertidos no modo escuro |
| Cards de Features (3) | `public/features/*-card.svg` | 357×223, 358×249, 358×272 |
| Resource Allocation (4) | `public/resource-allocation/*.webp` | 1485×558, 981×840, 1014×334, 978×840 |
| Ícones "Simplify your stack" (7) | `public/logos/{jira,excel,…}.svg` | viewBox atual, exibidos em 48×48 |
| Fotos dos depoimentos (4) | `public/testimonials/*.webp` | 1200×1200, 1200×800, 1200×1800, 1200×1812 |
| Open Graph | `public/og-image.jpg` | 1800×945 |

### Pontos de atenção na Home

1. **Rodapé e menu são globais.** Mudá-los na Home muda todas as rotas. Se forem personalizados na Fase 1, as outras rotas já herdam a mudança.
2. **Itens duplicados.** Cada depoimento aparece 2× no carrossel (8 cards, 4 únicos); a resposta do FAQ se repete 7× e a empresa "Mercury Finance" 8×. Cada um conta como um slot, aplicado em todas as ocorrências. Se você quiser textos diferentes em cada ocorrência, o inventário ganha os slots extras com a mesma contagem.
3. **Nomes de plano.** `Free` e `Startup` também são usados na lógica do componente: o destaque do plano do meio e a ocultação de "per user/". Para trocá-los, a mesma string precisa mudar na comparação do mesmo arquivo. A troca continua sendo só de texto, sem mudança de comportamento.
4. **Metadados duplicados.** `SITE_METADATA` (title/OG/Twitter) repete textos de `SITE_TITLE`/`SITE_DESCRIPTION`. Eles serão alinhados junto com o slot correspondente.
5. **Idioma.** O layout declara `<html lang="en">`. Se o conteúdo for em português, a recomendação é passar para `pt-BR`. Isso é atributo, não texto visível, e depende da sua aprovação.

### Execução (depois do conteúdo)

1. Preencher `novo` em cada slot do JSON.
2. Aplicar as trocas nos arquivos de origem e substituir as imagens.
3. `node scripts/apply-slots.mjs <rota>` aplica os textos; `npm run check:slots` precisa passar com 0 erros.
4. `npm run build` e `npm run cf:check`.
5. Comparar capturas de tela antes e depois (desktop e mobile, claro e escuro) para confirmar que nenhuma quebra de linha ou caixa mudou.

## Fases seguintes (mesmo método, uma rota por vez)

| Fase | Rota | Componentes principais |
|---|---|---|
| 2 | `/about` | `about-hero`, `about-section`, `investors` + `public/about`, `public/investors` |
| 3 | `/pricing` | `pricing-table` (+ `pricing` já feito na Home) |
| 4 | `/faq` | `faq` (já feito na Home, conferir a variante `h1`) |
| 5 | `/contact` | `contact` |
| 6 | `/blog` + posts | `blog-posts`, `blog-post`, `src/content/blog/*` |
| 7 | `/login`, `/signup` | `login-section`, `signup-section` |
| 8 | `/privacy`, `404` | `privacy.mdx`, `404.astro` |
| 9 | Publicação | domínio, `site` no Astro, deploy de produção na Cloudflare |
