# Home: adaptação da copy "Risco Cognitivo"

Fonte: a copy bruta enviada em 2026-10-06 (telas `home`, `mapa_cognitivo`, `artigo` e `dark_mode`). O uso foi autorizado para adaptar.

Regra aplicada: [ADR-001](../adr/ADR-001-personalizacao-sem-alterar-layout.md). O valor final de cada slot está em `home-slots.json`, no campo `novo`.

## Como a copy foi encaixada

| Seção do template | Conteúdo da copy usado |
|---|---|
| Hero | Título e pergunta do hero; as 4 funções (planejar, controle inibitório, lembrar, adaptar) como itens; CTA "Abrir o mapa" |
| Logos | "O tempo escapa…" / "Você começa, interrompe, retoma e perde o ponto" |
| Features | Prévia do mapa interativo, com o aviso de que os marcadores são seletores conceituais |
| Resource Allocation | Card "Função selecionada: Planejamento": demanda, estratégia de apoio, dificuldade, relações e fontes |
| Depoimentos | **Cenas ilustrativas** (rotulada "Situação típica"), não depoimentos: a copy não traz depoimentos reais, e inventar nomes ou citações seria apresentar avaliações falsas como verdadeiras |
| Preços | "Comece.": três portas de entrada (Mapa, Artigos, Ferramenta), com "Grátis para todos" e os modos de exploração do mapa |
| FAQ | Perguntas e resposta baseadas no esclarecimento "não é diagnóstico e não substitui avaliação clínica". A mesma resposta aparece 7× no template, então as perguntas foram escritas para caberem nela |
| Rodapé e menu (globais) | Rótulos em português; CTA "Abrir o mapa"; "Dados pessoais" no lugar de Privacy Policy |
| Metadados | Título "Risco Cognitivo - Mapa Cognitivo" e descrições |

As telas `mapa_cognitivo` e `artigo` pertencem a rotas que o template não tem. Pelo ADR-001, nenhuma rota foi criada; o conteúdo delas foi usado na Home onde cabia. O artigo pode entrar na fase do Blog, como post.

## Ajuste fino de linhas

Contar caracteres não basta: palavras em português quebram em pontos diferentes do inglês. Cada texto foi medido no navegador, na altura do bloco, e reescrito até ocupar o mesmo número de linhas do original em todas as larguras. Por isso, algumas frases têm redação diferente da copy bruta, como "Veja relações entre fatores reais".

## Pendências (fora da regra de texto e imagem)

1. **Imagens:**
   - A captura do hero, os 3 cards de Features e as 4 imagens de Resource Allocation ainda mostram o produto do template, em inglês.
   - Os logos de clientes (Mercury, Ramp…) e as fotos dos depoimentos também são do template, assim como `og-image.jpg` e o favicon.
   - Elas precisam de arquivos novos nas dimensões do inventário. Os nomes de empresa nos `alt` (`logos.empresa*`) e o `alt` do hero ficaram iguais, porque descrevem as imagens atuais.
2. **Links:** os CTAs ainda apontam para destinos do template (GitHub do template, shadcnblocks.com, x.com/ausrobdev). Trocar `href` não é texto nem imagem: precisa de um ADR-002.
3. **Metadados que não cabem:**
   - `og:site_name` = "Mainline" (8 caracteres).
   - `authors`/`creator`/`publisher` = "shadcnblocks.com".
   - `template: "%s | Mainline"`.
4. **Idioma:** `<html lang="en">` deveria ser `pt-BR` (exceção do ADR-001 que depende de aprovação).
5. **Seção de preços:** foi adaptada como portas de entrada, já que o projeto não vende planos. Os números ("04 por tema/guia") preenchem os slots de preço e são a parte mais forçada da adaptação. Se preferir, a seção pode receber outra copy dentro dos mesmos limites.
