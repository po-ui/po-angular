/**
 * @docsPrivate
 *
 * Este arquivo implementa um motor independente para interpretar filtros no formato OData v4 e aplicá-los sobre listas de objetos JavaScript.
 * Na prática, ele permite que o po-search-ai receba uma condição de filtro em texto, como “nome contém Henrique" ou “idade maior que 18”, e transforme isso em uma função capaz de filtrar os dados localmente.
 * A principal vantagem é que essa lógica não depende do Angular nem de outro framework. Com isso, o mesmo motor pode ser reutilizado por diferentes consumidores do po-search-ai, mantendo o comportamento de filtro padronizado.
 * O arquivo suporta os principais recursos necessários para filtros simples e intermediários, como comparações, operadores lógicos, funções de texto, valores booleanos, nulos, números, datas e campos aninhados.
 * Também há um cuidado para evitar que filtros inválidos quebrem a aplicação. Quando o filtro está vazio ou não pode ser interpretado, o motor apenas mantém a lista original, sem aplicar nenhuma filtragem.
 * Em resumo, este arquivo centraliza a interpretação e execução dos filtros, reduzindo dependências externas e tornando o comportamento mais previsível, reutilizável e fácil de manter.
 *
 * Operadores suportados:
 * - Comparação: eq, ne, gt, ge, lt, le
 * - Lógicos: and, or, not, parênteses
 * - Funções de string: contains, startswith, endswith
 * - Funções de transformação: tolower, toupper
 * - Literais: string ('...'), número, true, false, null, data ISO (yyyy-MM-dd)
 */

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

type TokenType =
  | 'IDENT'
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'BOOL'
  | 'NULL'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'EQ'
  | 'NE'
  | 'GT'
  | 'GE'
  | 'LT'
  | 'LE'
  | 'CONTAINS'
  | 'STARTSWITH'
  | 'ENDSWITH'
  | 'TOLOWER'
  | 'TOUPPER'
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
}

interface Cursor {
  pos: number;
}

type Predicate = (item: Record<string, unknown>) => boolean;
type ValueFn = (item: Record<string, unknown>) => unknown;
type CompOp = 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';

const KEYWORD_MAP: Record<string, TokenType> = {
  and: 'AND',
  or: 'OR',
  not: 'NOT',
  eq: 'EQ',
  ne: 'NE',
  gt: 'GT',
  ge: 'GE',
  lt: 'LT',
  le: 'LE',
  true: 'BOOL',
  false: 'BOOL',
  null: 'NULL',
  contains: 'CONTAINS',
  startswith: 'STARTSWITH',
  endswith: 'ENDSWITH',
  tolower: 'TOLOWER',
  toupper: 'TOUPPER'
};

const OPERAND_POSITION_TYPES: Set<TokenType | 'START'> = new Set([
  'EQ',
  'NE',
  'GT',
  'GE',
  'LT',
  'LE',
  'LPAREN',
  'COMMA',
  'AND',
  'OR',
  'NOT',
  'START'
]);

function tokenize(input: string): Array<Token> {
  const tokens: Array<Token> = [];
  let i = 0;

  while (i < input.length) {
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }

    if (input[i] === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (input[i] === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (input[i] === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if (input[i] === "'") {
      i++;
      let val = '';
      while (i < input.length) {
        if (input[i] === "'" && input[i + 1] === "'") {
          val += "'";
          i += 2;
        } else if (input[i] === "'") {
          i++;
          break;
        } else {
          val += input[i++];
        }
      }
      tokens.push({ type: 'STRING', value: val });
      continue;
    }

    if (input[i] === '-') {
      const prevType: TokenType | 'START' = tokens.length > 0 ? tokens.at(-1).type : 'START';
      if (OPERAND_POSITION_TYPES.has(prevType) && /\d/.test(input[i + 1] ?? '')) {
        let j = i + 1;
        while (j < input.length && /[0-9.]/.test(input[j])) {
          j++;
        }
        tokens.push({ type: 'NUMBER', value: input.slice(i, j) });
        i = j;
        continue;
      }
    }

    if (/\d/.test(input[i])) {
      let j = i;
      while (j < input.length && /\d/.test(input[j])) {
        j++;
      }

      const isDate =
        j - i === 4 &&
        input[j] === '-' &&
        /\d{2}/.test(input.slice(j + 1, j + 3)) &&
        input[j + 3] === '-' &&
        /\d{2}/.test(input.slice(j + 4, j + 6));

      if (isDate) {
        j += 6;
        tokens.push({ type: 'DATE', value: input.slice(i, j) });
      } else {
        if (input[j] === '.') {
          j++;
          while (j < input.length && /\d/.test(input[j])) {
            j++;
          }
        }
        tokens.push({ type: 'NUMBER', value: input.slice(i, j) });
      }
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(input[i])) {
      let j = i;
      while (j < input.length && /\w/.test(input[j])) {
        j++;
      }
      const word = input.slice(i, j);
      const kw = KEYWORD_MAP[word.toLowerCase()];
      tokens.push(kw !== undefined ? { type: kw, value: word } : { type: 'IDENT', value: word });
      i = j;
      continue;
    }

    if (input[i] === '/') {
      const prev = tokens.at(-1);
      if (prev?.type === 'IDENT') {
        let j = i + 1;
        while (j < input.length && /\w/.test(input[j])) {
          j++;
        }
        prev.value += '/' + input.slice(i + 1, j);
        i = j;
        continue;
      }
    }

    i++;
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

function peek(tokens: Array<Token>, cur: Cursor): TokenType {
  return tokens[cur.pos].type;
}

function consume(tokens: Array<Token>, cur: Cursor): Token {
  return tokens[cur.pos++];
}

function expect(tokens: Array<Token>, cur: Cursor, type: TokenType): Token {
  const tk = consume(tokens, cur);
  if (tk.type !== type) {
    throw new Error(`Expected ${type}, got ${tk.type} ('${tk.value}')`);
  }
  return tk;
}

function parseBoolExpr(tokens: Array<Token>, cur: Cursor): Predicate {
  let left = parseAndExpr(tokens, cur);
  while (peek(tokens, cur) === 'OR') {
    consume(tokens, cur);
    const right = parseAndExpr(tokens, cur);
    const l = left;
    const r = right;
    left = item => l(item) || r(item);
  }
  return left;
}

function parseAndExpr(tokens: Array<Token>, cur: Cursor): Predicate {
  let left = parseNotExpr(tokens, cur);
  while (peek(tokens, cur) === 'AND') {
    consume(tokens, cur);
    const right = parseNotExpr(tokens, cur);
    const l = left;
    const r = right;
    left = item => l(item) && r(item);
  }
  return left;
}

function parseNotExpr(tokens: Array<Token>, cur: Cursor): Predicate {
  if (peek(tokens, cur) === 'NOT') {
    consume(tokens, cur);
    const operand = parseNotExpr(tokens, cur);
    return item => !operand(item);
  }
  return parsePrimary(tokens, cur);
}

function parsePrimary(tokens: Array<Token>, cur: Cursor): Predicate {
  if (peek(tokens, cur) === 'LPAREN') {
    consume(tokens, cur);
    const expr = parseBoolExpr(tokens, cur);
    expect(tokens, cur, 'RPAREN');
    return expr;
  }

  const tk = peek(tokens, cur);

  if (tk === 'CONTAINS' || tk === 'STARTSWITH' || tk === 'ENDSWITH') {
    const fn = tokens[cur.pos].value.toLowerCase() as 'contains' | 'startswith' | 'endswith';
    consume(tokens, cur);
    expect(tokens, cur, 'LPAREN');
    const fieldFn = parseValueExpr(tokens, cur);
    expect(tokens, cur, 'COMMA');
    const valFn = parseValueExpr(tokens, cur);
    expect(tokens, cur, 'RPAREN');
    return item => {
      const fieldVal = String(fieldFn(item) ?? '').toLowerCase();
      const searchVal = String(valFn(item) ?? '').toLowerCase();
      if (fn === 'contains') {
        return fieldVal.includes(searchVal);
      }
      if (fn === 'startswith') {
        return fieldVal.startsWith(searchVal);
      }
      return fieldVal.endsWith(searchVal);
    };
  }

  const leftFn = parseValueExpr(tokens, cur);
  const op = parseCompOp(tokens, cur);
  const rightFn = parseValueExpr(tokens, cur);
  return item => applyCompOp(leftFn(item), op, rightFn(item));
}

function parseCompOp(tokens: Array<Token>, cur: Cursor): CompOp {
  const tk = consume(tokens, cur);
  switch (tk.type) {
    case 'EQ':
      return 'eq';
    case 'NE':
      return 'ne';
    case 'GT':
      return 'gt';
    case 'GE':
      return 'ge';
    case 'LT':
      return 'lt';
    case 'LE':
      return 'le';
    default:
      throw new Error(`Expected comparison operator, got ${tk.type} ('${tk.value}')`);
  }
}

function parseValueExpr(tokens: Array<Token>, cur: Cursor): ValueFn {
  const tk = peek(tokens, cur);

  if (tk === 'TOLOWER' || tk === 'TOUPPER') {
    const fn = tokens[cur.pos].value.toLowerCase() as 'tolower' | 'toupper';
    consume(tokens, cur);
    expect(tokens, cur, 'LPAREN');
    const fieldToken = expect(tokens, cur, 'IDENT');
    expect(tokens, cur, 'RPAREN');
    const name = fieldToken.value;
    return item => {
      const v = String(resolveField(item, name) ?? '');
      return fn === 'tolower' ? v.toLowerCase() : v.toUpperCase();
    };
  }

  if (tk === 'IDENT') {
    const name = consume(tokens, cur).value;
    return item => resolveField(item, name);
  }

  return parseLiteralFn(tokens, cur);
}

function parseLiteralFn(tokens: Array<Token>, cur: Cursor): ValueFn {
  const tk = tokens[cur.pos];
  consume(tokens, cur);
  switch (tk.type) {
    case 'STRING':
      return () => tk.value;
    case 'NUMBER':
      return () => Number(tk.value);
    case 'DATE':
      return () => new Date(tk.value);
    case 'BOOL':
      return () => tk.value.toLowerCase() === 'true';
    case 'NULL':
      return () => null;
    default:
      throw new Error(`Unexpected token in value position: ${tk.type} ('${tk.value}')`);
  }
}

function resolveField(item: Record<string, unknown>, name: string): unknown {
  const parts = name.split('/');
  let val: unknown = item;
  for (const part of parts) {
    if (val == null || typeof val !== 'object') {
      return undefined;
    }
    val = (val as Record<string, unknown>)[part];
  }
  return val;
}

function applyCompOp(left: unknown, op: CompOp, right: unknown): boolean {
  if (op === 'eq') {
    return looseEqual(left, right);
  }
  if (op === 'ne') {
    return !looseEqual(left, right);
  }
  const cmp = compareValues(left, right);
  if (cmp === null) {
    return false;
  }
  if (op === 'gt') {
    return cmp > 0;
  }
  if (op === 'ge') {
    return cmp >= 0;
  }
  if (op === 'lt') {
    return cmp < 0;
  }
  return cmp <= 0;
}

function looseEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (typeof b === 'number' && typeof a !== 'number') {
    return Number(a) === b;
  }
  if (typeof a === 'number' && typeof b !== 'number') {
    return a === Number(b);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof Date && typeof b === 'string') {
    return a.toISOString().startsWith(b);
  }
  if (b instanceof Date && typeof a === 'string') {
    return b.toISOString().startsWith(a);
  }
  return String(a) === String(b);
}

function compareValues(a: unknown, b: unknown): number | null {
  if (a == null || b == null) {
    return null;
  }
  if (a instanceof Date || b instanceof Date) {
    const da = a instanceof Date ? a : new Date(String(a));
    const db = b instanceof Date ? b : new Date(String(b));
    if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) {
      return null;
    }
    return da.getTime() - db.getTime();
  }
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) {
    return na - nb;
  }
  return String(a).localeCompare(String(b));
}

/**
 * Compila uma string de filtro OData v4 em um predicado JavaScript reutilizável.
 *
 * Operadores suportados: `eq`, `ne`, `gt`, `ge`, `lt`, `le`, `and`, `or`, `not`,
 * `contains`, `startswith`, `endswith`, `tolower`, `toupper`.
 *
 * Em caso de filtro inválido ou vazio, retorna `() => true` (sem filtragem).
 *
 * @param filter String de filtro OData (ex: `"city eq 'SP' and salary gt 5000"`).
 */
export function poSearchAiCompileFilter(filter: string): (item: Record<string, unknown>) => boolean {
  if (!filter?.trim()) {
    return () => true;
  }
  try {
    const tokens = tokenize(filter);
    const cur: Cursor = { pos: 0 };
    return parseBoolExpr(tokens, cur);
  } catch {
    return () => true;
  }
}

/**
 * Filtra um array de itens aplicando uma string de filtro OData v4.
 *
 * Utiliza `poSearchAiCompileFilter` internamente. Em caso de filtro inválido
 * ou array vazio, retorna o array original sem modificação.
 *
 * @param items Array de itens a filtrar.
 * @param filter String de filtro OData.
 */
export function poSearchAiFilterItems<T extends Record<string, unknown>>(items: Array<T>, filter: string): Array<T> {
  if (!items?.length || !filter?.trim()) {
    return items;
  }
  const predicate = poSearchAiCompileFilter(filter);
  return items.filter(predicate);
}
