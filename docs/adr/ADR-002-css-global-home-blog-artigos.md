# ADR-002: CSS global e camada editorial para Home, Blog e Artigos

- **Status:** Aceito
- **Data:** 2026-10-06
- **Repositório:** `hubexecutar-lgtm/mainline-astro-template`
- **Stack:** Astro 5 + React 19 + Tailwind CSS 4 + shadcn/ui + MD/MDX + Cloudflare Workers Static Assets
- **Escopo:** Home (`/`), índice do Blog (`/blog/`) e páginas de Artigo (`/blog/[slug]/`)
- **Relacionados:** ADR-001, `openai-brand-styling.md`, `handoff-spec-artigo-blog.md`

## 1. Contexto

O projeto usa o template Mainline e já possui um sistema global em `src/styles/global.css`, carregado por `src/components/BaseHead.astro` em todas as páginas.

O CSS atual contém:

- fontes DM Sans locais (400, 500, 600, 700);
- Inter e DM Mono carregadas no `BaseHead`;
- tokens semânticos em OKLCH para fundo, foreground, cards, muted, border, accent e estados;
- tema claro e escuro;
- escalas de radius, shadow e breakpoints;
- utilitário `.container`;
- Tailwind Typography disponível por `@plugin "@tailwindcss/typography"`;
- tipografia de artigo hoje renderizada com `.prose mx-auto max-w-3xl`.

O ADR-001 definiu preservação estrita do template: texto e imagem podem mudar, mas estrutura, classes, layout e CSS não. O novo objetivo exige uma exceção governada: estabelecer uma identidade visual coerente para Home, Blog e Artigos sem permitir refatoração indiscriminada do template.

Os dois documentos de referência fornecidos têm valores visuais classificados como FACT, INFERÊNCIA ou GAP. As cores, métricas tipográficas e espaçamentos exatos da referência externa ainda estão em GAP. Portanto, este ADR não autoriza inventar valores para preencher esses campos.

## 2. Problema

Sem uma decisão arquitetural única, existem quatro riscos:

1. Home, Blog e Artigos evoluírem com CSS divergente.
2. Valores visuais serem repetidos diretamente em componentes React/Astro.
3. O conteúdo MD/MDX depender de classes locais e perder consistência editorial.
4. A referência visual externa ser tratada como especificação exata mesmo quando seus tokens ainda não foram medidos.

## 3. Decisão

Adotar uma arquitetura CSS de três camadas:

```text
GLOBAL FOUNDATION
src/styles/global.css
        │
        ├── SURFACE: HOME
        │   /
        │
        ├── SURFACE: BLOG INDEX
        │   /blog/
        │
        └── SURFACE: ARTICLE
            /blog/[slug]/
                 │
                 └── EDITORIAL PROSE
                     Markdown / MDX
```

### 3.1 Camada 1 — Global Foundation

`src/styles/global.css` permanece como fonte canônica para:

- cores semânticas;
- tipografia;
- spacing;
- radius;
- borders;
- shadows;
- breakpoints;
- focus;
- motion;
- estados claro/escuro;
- largura dos containers;
- regras editoriais compartilhadas.

Nenhum componente pode introduzir um novo hex, HSL, OKLCH, font-family, radius ou shadow diretamente se existir token semântico correspondente.

### 3.2 Camada 2 — Surface Scope

Cada superfície deve possuir um escopo semântico estável, sem alterar a hierarquia do DOM:

```html
<body data-surface="home">
<body data-surface="blog-index">
<body data-surface="article">
```

A implementação recomendada é adicionar ao `DefaultLayout.astro` uma prop `surface` que apenas escreve `data-surface` no `body`.

Isso é uma exceção explícita ao ADR-001: **é permitido adicionar o atributo de escopo**, mas não reorganizar elementos, trocar a ordem dos blocos ou reescrever componentes por causa do CSS.

### 3.3 Camada 3 — Editorial Prose

Artigos devem continuar sendo conteúdo Markdown/MDX e renderizados dentro da camada tipográfica editorial.

A classe existente `.prose` permanece como ponto de integração com Tailwind Typography. A personalização deve ser feita no CSS global usando o escopo:

```css
[data-surface="article"] .prose { ... }
[data-surface="article"] .prose h2 { ... }
[data-surface="article"] .prose h3 { ... }
[data-surface="article"] .prose p { ... }
[data-surface="article"] .prose a { ... }
[data-surface="article"] .prose blockquote { ... }
[data-surface="article"] .prose table { ... }
[data-surface="article"] .prose code { ... }
```

Não é permitido colocar CSS inline dentro dos arquivos `.md` ou `.mdx`.

## 4. Design tokens canônicos

Os tokens existentes continuam ativos. O ADR adiciona aliases semânticos para reduzir acoplamento com nomes de implementação.

### 4.1 Tokens globais

```css
:root {
  --surface-page: var(--background);
  --surface-card: var(--card);
  --text-primary: var(--foreground);
  --text-secondary: var(--muted-foreground);
  --line-default: var(--border);
  --action-primary: var(--primary);
  --action-primary-text: var(--primary-foreground);

  --font-display-brand: var(--font-dm-sans);
  --font-body-brand: var(--font-inter);
  --font-code-brand: var(--font-mono);

  --content-shell-max: 1220px;
  --content-reading-max: 48rem;
  --content-wide-max: 64rem;

  --space-page-x: 1.5rem;
  --radius-ui: var(--radius);
}
```

Os aliases podem ser implementados sem alterar os valores visuais existentes.

### 4.2 Tokens editoriais

```css
:root {
  --editorial-text: var(--foreground);
  --editorial-muted: var(--muted-foreground);
  --editorial-link: var(--foreground);
  --editorial-border: var(--border);
  --editorial-code-bg: var(--muted);
  --editorial-quote-border: var(--border);
}
```

Valores exatos que dependam da referência OpenAI permanecem **GAP** até medição objetiva.

## 5. Regras por superfície

### 5.1 Home

A Home mantém:

- componentes atuais;
- ordem atual dos blocos;
- backgrounds existentes;
- container e breakpoints atuais;
- comportamento responsivo atual.

O CSS global pode ajustar somente propriedades de sistema: tipografia, cores semânticas, border, radius, shadow, focus e ritmo vertical por token.

Não pode transformar a Home em uma estrutura editorial de artigo.

### 5.2 Blog Index

O índice do Blog mantém o componente `BlogPosts` e sua grade responsiva atual.

A camada global deve padronizar:

- título e descrição da página;
- card;
- imagem 16:9;
- border;
- hover/focus;
- metadados;
- truncamento de descrição;
- espaçamento entre cards.

A grade existente continua sendo:

- mobile: 1 coluna;
- `md`: 2 colunas;
- `lg`: 3 colunas.

### 5.3 Artigo

O artigo deve priorizar leitura longa.

Arquitetura atual preservada:

```text
Navbar
  ↓
Article Hero
  ↓
Conteúdo .prose
  ↓
Footer
```

Regras obrigatórias:

- um único `h1`;
- `h2` e `h3` sem saltos;
- largura de leitura controlada;
- parágrafos sem largura total de viewport;
- links distinguíveis sem depender apenas de cor quando necessário;
- tabelas responsivas;
- blockquotes visualmente separadas;
- `code` e `pre` com fonte mono;
- imagens preservando proporção;
- `prefers-reduced-motion` respeitado;
- foco visível em links e controles.

## 6. Relação com a referência OpenAI

A página de referência é usada como **referência editorial e de hierarquia**, não como licença para inventar tokens.

### FACT aproveitado

- artigo longo em coluna de leitura;
- `h1 → h2 → h3`;
- TOC/âncoras em conteúdo extenso;
- tabelas e figuras com legenda e fonte;
- links externos identificáveis;
- imagem social 16:9;
- seção de conteúdo relacionado;
- prioridade para clareza e baixa carga visual.

### GAP que permanece bloqueado

Até medição objetiva, não fixar como “OpenAI”:

- hex/OKLCH de marca;
- família tipográfica exata;
- tamanhos de fonte;
- line-height;
- letter-spacing;
- largura exata da coluna;
- gutter;
- radius;
- shadow;
- spacing vertical.

Enquanto esses campos forem GAP, a implementação usa os tokens Mainline já existentes.

## 7. Política de CSS

### Permitido

- editar `src/styles/global.css`;
- adicionar tokens e aliases semânticos;
- adicionar regras escopadas por `data-surface`;
- customizar `.prose` dentro de `[data-surface="article"]`;
- adicionar `data-surface` ao `body`;
- usar media queries já alinhadas aos breakpoints globais;
- adicionar regras de acessibilidade, focus e reduced motion.

### Proibido

- CSS inline em páginas, componentes ou MDX;
- valores visuais soltos quando existe token;
- seletores globais frágeis baseados em posição como `:nth-child()`;
- `!important` como estratégia normal;
- alterar DOM apenas para resolver aparência;
- copiar CSS proprietário da referência;
- inventar valores dos campos marcados GAP;
- criar um segundo arquivo de tokens concorrente com `global.css`.

## 8. Organização do arquivo global.css

A ordem canônica passa a ser:

```text
01 imports/plugins
02 font-face
03 core tokens :root
04 dark tokens
05 semantic aliases
06 @theme
07 base/reset
08 layout/container
09 typography global
10 surface.home
11 surface.blog-index
12 surface.article
13 article.prose
14 accessibility
15 reduced-motion
```

## 9. Contrato do Article CSS

O conteúdo de artigo deve funcionar sem classes adicionais dentro do Markdown.

Seletores suportados:

- `h1`, `h2`, `h3`, `h4`;
- `p`;
- `strong`, `em`;
- `a`;
- `ul`, `ol`, `li`;
- `blockquote`;
- `hr`;
- `code`, `pre`;
- `table`, `thead`, `tbody`, `th`, `td`;
- `img`, `figure`, `figcaption`.

Componentes MDX especiais são permitidos apenas quando o HTML semântico nativo não resolve o requisito.

## 10. Compatibilidade com o template MDX do handoff

O handoff propõe campos e componentes adicionais. Eles não entram automaticamente neste ADR.

O schema atual do repositório aceita:

- `title`;
- `description`;
- `pubDate`;
- `updatedDate?`;
- `image?`;
- `authorImage?`;
- `authorName?`.

Campos como `slug`, `locale`, `canonical`, `category`, `tags`, `draft`, `ogImage`, `hero`, `toc` e `related` exigem uma alteração separada do schema e não devem ser tratados como disponíveis antes disso.

## 11. Acessibilidade

Requisitos mínimos:

- contraste WCAG AA;
- foco visível;
- conteúdo legível com zoom de 200%;
- nenhuma informação transmitida exclusivamente por cor;
- alvos interativos adequados em mobile;
- `prefers-reduced-motion: reduce`;
- tabelas com overflow horizontal sem cortar conteúdo;
- headings com âncoras utilizáveis por teclado quando TOC for implementado;
- imagens informativas com `alt`;
- imagens decorativas com `alt=""`.

## 12. Responsividade

Breakpoints canônicos continuam os atuais:

| Token | Valor |
|---|---:|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1400px |

Não criar breakpoints paralelos sem novo ADR.

## 13. Migração

Implementação em três passos, WIP=1:

1. **Foundation:** aliases e organização interna de `global.css`, sem mudança visual intencional.
2. **Surface scopes:** `data-surface` em Home, Blog e Artigo.
3. **Editorial:** regras `[data-surface="article"] .prose` e ajustes do índice do Blog.

Cada passo deve ter commit separado ou evidência explícita no mesmo PR.

## 14. Validação

Antes de deploy:

```bash
npm run check:slots
npm run build
npm run cf:check
```

Validação manual obrigatória:

- Home em mobile, tablet e desktop;
- Blog em 1, 2 e 3 colunas;
- artigo curto e artigo longo;
- heading longo;
- tabela larga;
- bloco de código;
- blockquote;
- link externo;
- imagem ausente;
- dark mode;
- reduced motion.

## 15. Critérios de aceite

O ADR é considerado implementado quando:

- `global.css` é a única fonte de tokens globais;
- Home, Blog e Artigo têm escopo de superfície explícito;
- nenhum conteúdo MD/MDX contém CSS inline;
- artigo usa uma camada editorial única;
- não existem novos valores de marca inventados para campos GAP;
- `npm run build` passa;
- `npm run cf:check` passa;
- as três superfícies mantêm responsividade e foco acessível;
- nenhuma mudança estrutural não autorizada pelo ADR foi introduzida.

## 16. Consequências

### Positivas

- identidade visual única entre Home, Blog e Artigos;
- menor divergência entre componentes;
- Markdown/MDX mais limpo;
- tokens centralizados;
- referência externa usada com rastreabilidade;
- mudanças futuras de marca podem ser feitas sem reescrever conteúdo.

### Negativas

- o CSS global passa a ter maior responsabilidade;
- escopos precisam ser respeitados para evitar vazamento de estilos;
- a fidelidade exata à referência externa continuará limitada enquanto os GAPs não forem medidos.

## 17. Relação com ADR-001

Este ADR **não revoga** o ADR-001.

Ele cria apenas as seguintes exceções:

1. `src/styles/global.css` pode evoluir dentro das regras acima.
2. Pode ser adicionado `data-surface` ao `body`.
3. Tokens e estilos editoriais globais podem ser ajustados sem alterar a arquitetura dos componentes.

Todo o restante do ADR-001 continua válido.
