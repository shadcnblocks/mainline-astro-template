# CLAUDE.md

Site em Astro 5 + shadcn/ui + Tailwind 4 (template Mainline). É 100% estático e é publicado na Cloudflare (Workers Static Assets, ver `wrangler.jsonc`).

## Regra obrigatória de personalização: ADR-001

Vale para **todas as rotas** e para os componentes globais. Detalhes em `docs/adr/ADR-001-personalizacao-sem-alterar-layout.md`.

- **Não altere** estrutura, componentes, classes, layout, lógica, rotas ou dependências. Só troque **texto** e **imagem**.
- **Texto:** o novo tem **exatamente** o mesmo número de caracteres do original, nem um a mais, nem um a menos. Espaços, pontuação e acentos contam como 1 caractere cada.
- **Imagem:** o mesmo caminho, o mesmo formato e as mesmas dimensões (para SVG, o mesmo `viewBox`). Wordmarks são gerados com `scripts/gerar-marca.py`, a partir da DM Sans do site.
- Se um texto do usuário não fechar a contagem, **não aplique**. Informe a diferença e proponha uma versão ajustada para ele aprovar.
- Exceções (strings usadas na lógica, metadados duplicados, atributos como `lang`) estão listadas no ADR-001. Qualquer outra exige um novo ADR.

## Fluxo por rota

1. Se não existir, crie o inventário `docs/personalizacao/<rota>-slots.json` no mesmo formato de `home-slots.json`: `textos[]` com `id`, `arquivo`, `secao`, `tipo`, `original`, `caracteres`, `novo: null`, e `imagens[]` com `id`, `arquivo`, `formato`, `largura`, `altura`.
2. Preencha `novo` com o conteúdo aprovado e aplique com `node scripts/apply-slots.mjs <rota>`.
3. Rode e passe, nesta ordem:
   - `npm run check:slots`
   - `npm run build`
   - `npm run cf:check`
   - Compare a página com a original em várias larguras: mesma contagem de caracteres não garante o mesmo número de linhas.
4. Atualize o status da rota em `docs/personalizacao/PLANO.md`.

Ordem das rotas e pontos de atenção: `docs/personalizacao/PLANO.md`.

## Comandos

- `npm run dev`: servidor local
- `npm run build`: gera `dist/`
- `npm run check:slots`: valida a regra do ADR-001 em todas as rotas inventariadas (`npm run check:home` valida só a Home)
- `npm run cf:check`: build + `wrangler deploy --dry-run`
- `npm run cf:preview`: build + `wrangler dev`
- `npm run deploy`: build + deploy na Cloudflare (só com autorização explícita)

## Atenção

- `src/components/blocks/navbar.tsx` e `footer.tsx` aparecem em **todas** as páginas.
- Alguns textos se repetem (depoimentos 2× no carrossel, a resposta do FAQ 7×). Um slot vale para todas as ocorrências.
