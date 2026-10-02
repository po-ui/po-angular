/** Helpers de texto usados no comentário da PR e no Discord, incluindo os pontos de atenção. */

const { CATEGORY_LABELS } = require('./constants');

const code = text => `\`${text}\``;

function truncateList(items, max = 15) {
  if (items.length <= max) {
    return items.join(', ');
  }
  return `${items.slice(0, max).join(', ')} … (+${items.length - max})`;
}

const truncateText = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1)}…`);

const categoryLabels = categories => categories.map(c => CATEGORY_LABELS[c]).join(', ');

// Título no padrão de commit: "fix(calendar): corrige ..." → { type: 'fix', scope: 'calendar' }
function parseTitle(title = '') {
  const match = title.match(/^(\w+)(?:\(([^)]+)\))?!?:/);
  return match ? { type: match[1], scope: match[2] || '' } : { type: '', scope: '' };
}

function attentionItems(result) {
  const items = [];
  for (const c of result.changed) {
    if (c.removedAliases.length) {
      items.push(`⚠️ ${code(c.name)}: propriedade removida/renomeada → ${c.removedAliases.map(code).join(', ')}`);
    }
    if (c.removedFiles.length) {
      items.push(`⚠️ ${code(c.name)}: ${c.removedFiles.length} arquivo(s) removido(s)`);
    }
    if (c.addedAliases.length) {
      items.push(`🆕 ${code(c.name)}: nova(s) propriedade(s) → ${c.addedAliases.map(code).join(', ')}`);
    }
    if (c.functional && c.transitiveCount >= 25) {
      items.push(
        `🌐 ${code(c.name)} é usada por ${c.transitiveCount} unidades — considere um teste de regressão amplo`
      );
    }
  }
  if (result.changed.length && result.changed.every(c => !c.functional)) {
    items.push('✅ Apenas testes, samples ou documentação foram alterados');
  }
  return items;
}

module.exports = { code, truncateList, truncateText, categoryLabels, parseTitle, attentionItems };
