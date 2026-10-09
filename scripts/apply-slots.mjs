// Aplica os textos `novo` de um inventário (ADR-001) nos arquivos de origem.
// - string entre aspas ("original"): troca todas as ocorrências, inclusive
//   comparações na lógica, que mudam junto com o texto (exceção do ADR-001)
// - texto JSX entre tags: troca só entre `>` e `<`/`{`, tolerando quebras de linha
// Uso: node scripts/apply-slots.mjs <rota>
import { readFileSync, writeFileSync } from "node:fs";

const rota = process.argv[2];
if (!rota) {
  console.error("Uso: node scripts/apply-slots.mjs <rota>");
  process.exit(1);
}
const { textos } = JSON.parse(
  readFileSync(`docs/personalizacao/${rota}-slots.json`, "utf8"),
);

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const arquivos = new Map();
const ler = (f) => arquivos.get(f) ?? readFileSync(f, "utf8");

// Mais longos primeiro, para um texto curto não acertar dentro de um longo.
// O sort é estável: slots com o mesmo original ficam na ordem do inventário.
const pendentes = textos
  .filter((s) => s.novo != null && s.novo !== s.original)
  .sort((a, b) => b.original.length - a.original.length);

// Slots diferentes com o mesmo original no mesmo arquivo (ex.: dois
// "Lorem ipsum" idênticos) recebem as ocorrências em ordem de aparição.
const grupos = new Map();
for (const slot of pendentes) {
  const chave = `${slot.arquivo}\u0000${slot.original}`;
  grupos.set(chave, [...(grupos.get(chave) ?? []), slot]);
}

let falhas = 0;
let jaAplicados = 0;
for (const grupo of grupos.values()) {
  const { arquivo, original } = grupo[0];
  const novos = [...new Set(grupo.map((s) => s.novo))];
  let fonte = ler(arquivo);
  const aspas = new RegExp(`(["'\`])${escape(original)}\\1`, "g");
  const jsx = new RegExp(
    `(>\\s*)${escape(original).replace(/ /g, "\\s+")}(\\s*[<{])`,
    "g",
  );
  const padrao = aspas.test(fonte) ? aspas : jsx;
  padrao.lastIndex = 0;
  const total = (fonte.match(padrao) ?? []).length;
  let i = 0;
  const antes = fonte;
  fonte = fonte.replace(padrao, (...m) => {
    // Um só texto novo: todas as ocorrências. Vários: um por ocorrência.
    const novo = novos.length === 1 ? novos[0] : grupo[i]?.novo;
    i++;
    if (novo == null) return m[0];
    return padrao === aspas ? `${m[1]}${novo}${m[1]}` : `${m[1]}${novo}${m[2]}`;
  });
  // Idempotente: original ausente e textos novos presentes = já aplicado.
  if (total === 0 && novos.every((n) => antes.includes(n))) {
    jaAplicados += grupo.length;
    continue;
  }
  if (fonte === antes || (novos.length > 1 && total !== grupo.length)) {
    console.error(
      `✗ ${grupo.map((s) => s.id).join(", ")}: ${total} ocorrência(s) em ${arquivo}`,
    );
    falhas += grupo.length;
    continue;
  }
  arquivos.set(arquivo, fonte);
}

for (const [f, conteudo] of arquivos) writeFileSync(f, conteudo);
console.log(
  `${pendentes.length - falhas - jaAplicados} slots aplicados em ${arquivos.size} arquivos; ${jaAplicados} já estavam aplicados.`,
);
process.exit(falhas ? 1 : 0);
