# ADR-001: Personalização apenas por texto e imagem, nos limites exatos da página

- **Status:** Aceito
- **Data:** 2026-10-06
- **Escopo:** todas as rotas do site (Home, About, Pricing, FAQ, Contact, Blog, Login/Signup, Privacy, 404) e os componentes globais (menu e rodapé)

## Contexto

O site parte do template Mainline (Astro 5 + shadcn/ui + Tailwind 4). O layout, o espaçamento, as quebras de linha e a hierarquia visual já estão resolvidos no template. O objetivo é colocar a nossa marca e o nosso conteúdo sem degradar esse design e sem abrir retrabalho de layout em cada rota.

Trocar textos por outros de tamanho diferente muda quebras de linha, alturas de cards e alinhamentos. Trocar imagens por outras de proporção diferente muda recortes e caixas. Mexer em componentes, classes ou estrutura cria divergência do template e risco de regressão.

## Decisão

1. **Nada muda além de texto e imagem.** Estrutura, componentes, classes CSS, layout, lógica, rotas e dependências ficam como estão.
2. **Texto com a mesma contagem de caracteres.** Cada texto novo tem **exatamente** o mesmo número de caracteres do original. Espaços, pontuação e acentos contam, e cada caractere acentuado vale 1.
3. **Imagem com o mesmo caminho, formato e dimensões.** Para SVG, vale o mesmo `viewBox`. A proporção e o tamanho renderizado não mudam.
4. **Inventário antes de editar.** Antes de qualquer troca, a rota ganha um inventário em `docs/personalizacao/<rota>-slots.json`. Ele lista cada slot de texto (com o original e a contagem) e cada slot de imagem (com as dimensões).
5. **Verificação obrigatória.** `npm run check:slots` (ou `node scripts/check-slots.mjs <rota>`) precisa passar sem erros antes de qualquer commit de personalização.
6. **Uma rota por vez**, na ordem de `docs/personalizacao/PLANO.md`. Menu e rodapé são globais e entram uma única vez.

### Exceções permitidas

São mudanças de valor, nunca de estrutura:

- **Strings usadas na lógica.** Exemplo: os nomes de plano `Free` e `Startup` em `pricing.tsx`. Elas mudam junto com a comparação no mesmo arquivo, para preservar o comportamento.
- **Metadados duplicados.** `SITE_METADATA` repete `SITE_TITLE`/`SITE_DESCRIPTION`; eles são alinhados ao slot correspondente.
- **Atributos não visíveis**, como `lang`, `site` no Astro ou domínio. Exigem aprovação explícita do responsável e um registro em ADR próprio.

Qualquer outra exceção exige um novo ADR.

## Consequências

- **Positivas:** o layout fica idêntico ao validado no template. Revisão e validação são automáticas, e o risco de regressão visual é mínimo.
- **Negativas:** a redação fica restrita a contagens fixas, e textos podem precisar de ajuste fino (sinônimos, pontuação) para fechar a conta. Conteúdo que não cabe nos slots existentes exige um novo ADR.
- **Operacionais:** todo PR de personalização inclui o `-slots.json` da rota com `novo` preenchido e passa em `check:slots`, `build` e `cf:check`.
