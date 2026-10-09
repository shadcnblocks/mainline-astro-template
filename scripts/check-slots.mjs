// Verifica a regra de personalização (ADR-001) por rota:
//  - texto novo com EXATAMENTE o mesmo número de caracteres do original
//  - texto novo presente no arquivo de origem (pendente: original presente)
//  - imagem com o mesmo caminho, formato e dimensões
// Uso: node scripts/check-slots.mjs <rota...>  (ex.: home about)
//      node scripts/check-slots.mjs            (todas as rotas inventariadas)
import { readdirSync, readFileSync } from "node:fs";

const DIR = "docs/personalizacao";

// JSX quebra textos longos em várias linhas; o navegador colapsa o espaço.
const normalize = (s) => s.replace(/\s+/g, " ");
const chars = (s) => [...s].length; // conta caracteres, não bytes (acentos = 1)

function dimensoes(path) {
  const buf = readFileSync(path);
  if (path.endsWith(".svg")) {
    const m = buf
      .toString("utf8")
      .match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    return m ? [Math.round(+m[1]), Math.round(+m[2])] : null;
  }
  if (path.endsWith(".webp")) {
    const tipo = buf.toString("ascii", 12, 16);
    if (tipo === "VP8X")
      return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (tipo === "VP8L") {
      const b = buf.readUInt32LE(21);
      return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
    }
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  if (path.endsWith(".png")) {
    return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  }
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
    for (let i = 2; i < buf.length; ) {
      const marker = buf[i + 1];
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker)
      ) {
        return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

function verificar(rota) {
  const { textos = [], imagens = [] } = JSON.parse(
    readFileSync(`${DIR}/${rota}-slots.json`, "utf8"),
  );
  const erros = [];
  let aplicados = 0;
  let pendentes = 0;

  for (const slot of textos) {
    if (chars(slot.original) !== slot.caracteres) {
      erros.push(`${slot.id}: contagem do inventário inconsistente`);
    }
    const fonte = normalize(readFileSync(slot.arquivo, "utf8"));
    if (slot.novo == null) {
      pendentes++;
      if (!fonte.includes(slot.original)) {
        erros.push(
          `${slot.id}: texto original não encontrado em ${slot.arquivo}`,
        );
      }
      continue;
    }
    aplicados++;
    if (chars(slot.novo) !== slot.caracteres) {
      erros.push(
        `${slot.id}: ${chars(slot.novo)} caracteres, esperado ${slot.caracteres} ` +
          `(diferença ${chars(slot.novo) - slot.caracteres})`,
      );
    }
    if (!fonte.includes(slot.novo)) {
      erros.push(`${slot.id}: texto novo não encontrado em ${slot.arquivo}`);
    }
  }

  for (const img of imagens) {
    const dim = dimensoes(img.arquivo);
    if (!dim || dim[0] !== img.largura || dim[1] !== img.altura) {
      erros.push(
        `${img.id}: ${img.arquivo} tem ${dim ? dim.join("x") : "?"}, esperado ${img.largura}x${img.altura}`,
      );
    }
  }

  console.log(
    `[${rota}] Textos: ${aplicados} aplicados, ${pendentes} pendentes de ${textos.length}. Imagens verificadas: ${imagens.length}.`,
  );
  if (erros.length) {
    console.error(erros.map((e) => `  ✗ ${e}`).join("\n"));
    return false;
  }
  console.log(`[${rota}] ✓ Todos os slots respeitam os limites da página.`);
  return true;
}

const rotas =
  process.argv.length > 2
    ? process.argv.slice(2)
    : readdirSync(DIR)
        .filter((f) => f.endsWith("-slots.json"))
        .map((f) => f.replace(/-slots\.json$/, ""));

const resultados = rotas.map(verificar);
process.exit(resultados.every(Boolean) ? 0 : 1);
