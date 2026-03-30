'use strict';

/**
 * Utilitários de formatação para o gerador de documentação llms.txt.
 *
 * Converte texto JSDoc bruto (que pode conter HTML, entidades e markdown) para
 * markdown limpo adequado para consumo por ferramentas de IA.
 */

/**
 * Decodifica entidades HTML comuns presentes em descrições JSDoc.
 * @param {string} text
 * @returns {string}
 */
function unescapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/&#64;/g, '@')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

/**
 * Remove tags HTML de uma string, mantendo o texto interior.
 * Substitui tags de bloco por quebras de linha e outras tags por espaços
 * para evitar que palavras fiquem grudadas.
 * @param {string} text
 * @returns {string}
 */
function stripHtml(text) {
  if (!text) return '';

  let result = text;

  // Tags de bloco que devem virar quebras de linha
  result = result.replace(/<br\s*\/?>/gi, '\n');
  result = result.replace(/<\/p>/gi, '\n\n');
  result = result.replace(/<p[^>]*>/gi, '\n');
  result = result.replace(/<\/div>/gi, '\n');
  result = result.replace(/<div[^>]*>/gi, '\n');
  result = result.replace(/<\/h[1-6]>/gi, '\n\n');
  result = result.replace(/<h[1-6][^>]*>/gi, '\n');
  result = result.replace(/<\/li>/gi, '\n');
  result = result.replace(/<li[^>]*>/gi, '\n- ');
  result = result.replace(/<\/ul>/gi, '\n');
  result = result.replace(/<ul[^>]*>/gi, '\n');
  result = result.replace(/<\/ol>/gi, '\n');
  result = result.replace(/<ol[^>]*>/gi, '\n');

  // Todas as outras tags: substitui por espaço para evitar palavras grudadas
  result = result.replace(/<[^>]+>/g, ' ');

  // Remove múltiplos espaços consecutivos
  result = result.replace(/  +/g, ' ');

  return result;
}

/**
 * Normaliza uma descrição JSDoc para markdown limpo:
 * - Preserva blocos de código (``` e `)
 * - Decodifica entidades HTML fora dos blocos de código
 * - Remove tags HTML de formatação (fora dos blocos de código)
 * - Remove indentação excessiva
 * @param {string} text
 * @returns {string}
 */
function normalizeDescription(text) {
  if (!text) return '';

  // Extrai e preserva blocos de código antes de processar
  const codeBlocks = [];
  const inlineCode = [];

  let result = text;

  // Preserva blocos de código com ```
  result = result.replace(/```[\s\S]*?```/g, match => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // Preserva código inline com `
  result = result.replace(/`[^`]+`/g, match => {
    inlineCode.push(match);
    return `___INLINE_CODE_${inlineCode.length - 1}___`;
  });

  // Agora processa o texto fora dos blocos de código
  result = unescapeHtml(result);
  result = stripHtml(result);

  // Remove asteriscos de comentário JSDoc que possam ter escapado
  result = result.replace(/^\s*\*\s?/gm, '');

  // Remove espaços múltiplos (mas preserva quebras de linha)
  result = result.replace(/ {2,}/g, ' ');

  // Remove espaços no início e fim de cada linha
  result = result
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // Normaliza múltiplas linhas em branco para no máximo duas
  result = result.replace(/\n{3,}/g, '\n\n');

  // Restaura blocos de código
  codeBlocks.forEach((block, i) => {
    // Decodifica entidades HTML DENTRO do bloco de código para mostrar o HTML real
    const decodedBlock = unescapeHtml(block);
    result = result.replace(`___CODE_BLOCK_${i}___`, decodedBlock);
  });

  // Restaura código inline
  inlineCode.forEach((code, i) => {
    const decodedCode = unescapeHtml(code);
    result = result.replace(`___INLINE_CODE_${i}___`, decodedCode);
  });

  // Remove espaços em branco no início e fim
  result = result.trim();

  return result;
}

/**
 * Retorna a primeira sentença de um texto (até o primeiro ponto final + espaço/fim).
 * Útil para criar descrições curtas nos índices.
 * @param {string} text
 * @returns {string}
 */
function getFirstSentence(text) {
  if (!text) return '';

  // Remove blocos de código antes de buscar sentença
  const withoutCodeBlocks = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, match => match);

  // Tenta capturar até o primeiro ponto seguido de espaço ou fim de linha
  const match = withoutCodeBlocks.match(/^(.+?[.!?])(?:\s|$)/);
  if (match) {
    return match[1].trim();
  }

  // Fallback: primeira linha não vazia
  const firstLine = text
    .split('\n')
    .map(l => l.trim())
    .find(l => l.length > 0);

  // Trunca se muito longa
  if (firstLine && firstLine.length > 150) {
    return firstLine.substring(0, 147) + '...';
  }

  return firstLine || '';
}

module.exports = {
  unescapeHtml,
  stripHtml,
  normalizeDescription,
  getFirstSentence,
};
