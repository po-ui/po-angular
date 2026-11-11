'use strict';

const { normalizeDescription, unescapeHtml } = require('../helpers/llms-formatting');

/**
 * Markdown/HTML do JSDoc -> texto puro de uma linha (base do trecho exibido na busca).
 * Com `keepCode: false` blocos ``` são descartados (ruído em descrições de API);
 * nos guias o código fica, porque as pessoas buscam por comandos.
 */
function plainText(text, { keepCode = false } = {}) {
  let result = normalizeDescription(String(text || ''));

  result = result.replace(/```[^\n]*\n?([\s\S]*?)```/g, keepCode ? ' $1 ' : ' ');
  result = result
    .replace(/\{@link\s+([^}\s]+)(?:\s+([^}]*))?\}/g, (_, target, label) => label || target)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[`*~]|\b_+|_+\b/g, '')
    .replace(/\|/g, ' ');

  return unescapeHtml(result).replace(/\s+/g, ' ').trim();
}

/** Corta em limite de palavra, com reticências. */
function truncate(text, max) {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');

  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

module.exports = { plainText, truncate };
