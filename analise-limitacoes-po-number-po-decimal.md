# Análise Consolidada: Limitações de po-number e po-decimal para Formatação ABL

## Contexto da Demanda

O padrão ABL (Progress 4GL) usa format strings como `999.9`, `>9,99,99,99`, `>>>,>>>,>>9.99` onde:
- `9` = dígito obrigatório (preenche com zero à esquerda)
- `>` = dígito opcional (espaço se não usado)
- `<` = dígito opcional à direita (trailing)
- `.` e `,` = separadores posicionais customizáveis

**Comportamento esperado:** valor `1` com máscara `999.9` → saída formatada `000.1`

---

## 1. po-number — Incompatível por design

| Aspecto | Situação |
|---|---|
| Tipo de input | `<input type="number">` nativo do browser |
| Zeros à esquerda | **Impossível** — o browser remove automaticamente |
| p-mask | **Explicitamente desabilitado** (`override mask = ''`) |
| Model | Sempre `Number` (nunca string formatada) |
| Formatação visual | Nenhuma — exibe o valor bruto do number |

**Conclusão:** po-number NÃO pode atender essa demanda sem ser refatorado para `type="text"`, o que descaracterizaria o componente.

---

## 2. po-decimal — Parcialmente capaz, mas com gaps grandes

| Aspecto | Situação |
|---|---|
| Tipo de input | `<input type="text">` ✅ (permite formatação visual livre) |
| Formatação atual | Separador de milhar automático + casas decimais fixas (`p-decimals-length`) |
| Zeros à esquerda (parte inteira) | **NÃO suportado** — a lógica usa `Number().toFixed()` que elimina zeros à esquerda |
| Largura fixa da parte inteira | **NÃO existe** propriedade para definir |
| Separadores posicionais customizáveis | **NÃO** — separador de milhar é a cada 3 dígitos, sempre |
| Format string ABL | **NÃO interpretada** — não existe parser de format patterns |
| Model value | `parseFloat()` → número real (nunca string formatada) |

**Onde "quase" funciona:** po-decimal já consegue fixar casas decimais (`p-decimals-length`) e inserir separador de milhar. O `formatToViewValue` já faz padding de zeros à **direita** (na parte decimal). Falta o padding à **esquerda**.

**Lógica-chave (`formatToViewValue`):**
```typescript
const numberValue = Number(value).toFixed(this.decimalsLength);  // ← Aqui perde zeros à esquerda
```

---

## 3. po-input + PoMask — Mais próximo, mas insuficiente

| Aspecto | Situação |
|---|---|
| Máscara posicional | ✅ `999.9` = 4 dígitos com ponto fixo na posição 4 |
| Preenchimento automático (pad-left) | **NÃO** — exige que o usuário digite todos os 4 dígitos |
| Direção de preenchimento | Esquerda → Direita (normal). Deveria ser Direita → Esquerda para ABL |
| Formatação no blur | Mantém o que foi digitado, sem completar |
| Model | String (com ou sem formatação, conforme `p-mask-format-model`) |
| Caracteres opcionais (`9?`) | Existe, mas remove posições, não preenche com zero |

---

## Gaps Técnicos para Implementar a Demanda

1. **Parser de format string ABL** — Nenhum componente interpreta `>`, `<`, `Z`, `9` no sentido ABL
2. **Pad-left com zeros** — Nenhuma lógica de preenchimento automático à esquerda existe
3. **Direção de preenchimento RTL** — PoMask preenche LTR; formato numérico ABL alinha à direita
4. **Separadores posicionais arbitrários** — po-decimal só suporta milhar a cada 3 dígitos; ABL permite `99,999,9,99.9999`
5. **Largura fixa da parte inteira** — po-decimal não tem propriedade para isso
6. **Model numérico com view formatada** — po-decimal faz isso para decimais, mas não para inteiros com zero-fill

---

## Caminhos Possíveis para Solução

| Abordagem | Complexidade | Componente afetado |
|---|---|---|
| **A)** Nova propriedade `p-integer-length` no po-decimal que faz pad-left com zeros | Média | po-decimal |
| **B)** Nova propriedade `p-format` no po-decimal que aceita format string ABL completa | Alta | po-decimal + novo parser |
| **C)** Evolução do PoMask com modo "right-to-left fill" + auto-pad | Média-Alta | po-input / PoMask |
| **D)** Novo componente `po-numeric-format` dedicado | Alta | Novo componente |

A **abordagem A** é a mais pragmática para o caso `999.9` → `000.1`: adicionar `p-integer-length` ao po-decimal que, no `formatToViewValue` e no `onBlur`, faz `padStart(integerLength, '0')` na parte inteira. Isso resolve o caso imediato sem precisar de um parser ABL completo.

---

## Exemplos Interativos

Os exemplos estão em `projects/app/src/app/app.component.html` — rode `ng serve` para visualizar cada limitação descrita acima.
