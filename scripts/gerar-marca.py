"""Gera o contorno SVG de um texto com a DM Sans do site, encaixado num viewBox.

Uso: python3 scripts/gerar-marca.py "<texto>" <fonte.ttf> <x0> <x1> <baseline> [altura_max]
Imprime o atributo d (path) e a escala usada. Mantém o viewBox do arquivo de destino
(ADR-001: imagem com o mesmo caminho, formato e dimensões).
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

texto, ttf, x0, x1, base = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:6])
alt_max = float(sys.argv[6]) if len(sys.argv) > 6 else None
font = TTFont(ttf)
# Contornos sobrepostos (comuns em fontes variáveis) abrem buracos com fill-rule
# evenodd, usado no SVG do rodapé. Unir as sobreposições evita o artefato.
from fontTools.ttLib.removeOverlaps import removeOverlaps
removeOverlaps(font)
gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
upm = font["head"].unitsPerEm
nomes = [cmap[ord(c)] for c in texto]
largura = sum(hmtx[n][0] for n in nomes)
escala = (x1 - x0) / largura
cap = font["OS/2"].sCapHeight
if alt_max and cap * escala > alt_max:
    escala = alt_max / cap
pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
x = 0
for n in nomes:
    # y do fonte cresce para cima; no SVG, para baixo.
    gs[n].draw(TransformPen(pen, (escala, 0, 0, -escala, x0 + x * escala, base)))
    x += hmtx[n][0]
print(pen.getCommands())
print(f"escala={escala:.5f} fonte_px={escala*upm:.1f} largura={x*escala:.1f} cap_px={cap*escala:.1f}", file=sys.stderr)
