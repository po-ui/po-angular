/** Monta a mensagem (embed) enviada ao Discord. */

const { RISK } = require('./constants');
const { code, truncateList, truncateText, categoryLabels, parseTitle, attentionItems } = require('./format');

// Limites da API do Discord para embeds.
const FIELD_LIMIT = 1024;
const TITLE_LIMIT = 256;

const field = (name, value, inline = false) => ({ name, value: truncateText(value || '—', FIELD_LIMIT), inline });

function impactFields(result) {
  const { changed, directConsumers, indirectConsumers, testTargets } = result;
  if (!changed.length) {
    return [field('Lib ui', 'Nenhum arquivo da lib `ui` alterado')];
  }

  const fields = [field('Alterados', changed.map(c => `${code(c.name)} (${categoryLabels(c.categories)})`).join('\n'))];
  if (directConsumers.length) {
    fields.push(field(`Consumidores diretos (${directConsumers.length})`, truncateList(directConsumers)));
  }
  if (indirectConsumers.length) {
    fields.push(field(`Impacto indireto (${indirectConsumers.length})`, truncateList(indirectConsumers, 10)));
  }
  const attention = attentionItems(result);
  if (attention.length) {
    fields.push(field('Atenção', attention.join('\n')));
  }
  if (testTargets.length) {
    const links = testTargets.slice(0, 8).map(t => `[${t.name}](${t.url})`);
    fields.push(field('Onde testar', links.join(' · ')));
  }
  return fields;
}

function buildDiscordPayload(result, pr) {
  const risk = RISK[result.overallRisk];
  const { type, scope } = parseTitle(pr.title);
  const { files, additions, deletions } = result.stats;

  return {
    content: '🚀 **Nova Pull Request** 🚀',
    embeds: [
      {
        title: truncateText(`${pr.number ? `#${pr.number} ` : ''}${pr.title}`, TITLE_LIMIT),
        url: pr.url || undefined,
        color: risk.color,
        author: pr.author ? { name: pr.author, url: `https://github.com/${pr.author}` } : undefined,
        fields: [
          field('Tipo', [type, scope].filter(Boolean).join(' · '), true),
          field('Risco', `${risk.emoji} ${risk.label}`, true),
          field('Arquivos', `${files} (+${additions}/-${deletions})`, true),
          ...impactFields(result)
        ],
        footer: { text: 'Relatório completo nos comentários da PR' }
      }
    ]
  };
}

module.exports = { buildDiscordPayload };
