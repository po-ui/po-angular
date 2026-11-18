'use strict';

/**
 * Lê os metadados de um guia (`docs/guides/*.md`) e monta o menu de Guias em Categoria › Guia › Subguia.
 *
 * Metadados:
 * - comentários `[comment]: # (@label ...)` e `(@link ...)`: título e link do menu, como sempre foi;
 * - frontmatter YAML no topo (`title`, `category`, `parent`, `order`, `shortcut`): categoria do menu.
 *   O `title` só vale se faltar o `@label` (o `@label` continua sendo o título).
 *
 * O bloco `---` sai do markdown (`body`) antes do marked e do índice da busca.
 * A validação das categorias é a mesma dos componentes (`resolveDocsMenu`), com a lista `guides-categories.js`.
 */

const yaml = require('js-yaml');

const { resolveDocsMenu, compareForMenu } = require('./docs-menu');

const FIELDS = ['title', 'category', 'parent', 'order', 'shortcut'];

// linhas em branco antes são aceitas; o bloco fecha na primeira linha `---`
const FRONTMATTER = /^\uFEFF?\s*---[ \t]*\r?\n((?:.*\r?\n)*?)---[ \t]*(?:\r?\n|$)/;
const OPENS_FRONTMATTER = /^\uFEFF?\s*---[ \t]*\r?\n/;

/** Comentários `[comment]: # (@tag valor)` do markdown. */
function commentTags(markdown) {
  const meta = {};

  (markdown.match(/\[comment\]:\s#\s\(@(.+)\)/g) || []).forEach(line => {
    const [, tag, value] = line.match(/\(@(\S+)\s*(.*)\)$/) || [];

    if (tag) meta[tag] = value;
  });

  return meta;
}

/**
 * @param {string} name nome do arquivo sem `.md` (é a rota `/guides/<name>`)
 * @param {string} markdown conteúdo do arquivo
 * @param {string} [file] caminho, só para as mensagens
 */
function readGuide(name, markdown, file = `${name}.md`) {
  const errors = [];
  const warnings = [];
  const error = (code, message) => errors.push({ code, name, message: `${file}: ${message}` });
  const match = markdown.match(FRONTMATTER);
  let front = {};
  let body = markdown;

  if (match) {
    body = markdown.slice(match[0].length);

    try {
      front = yaml.load(match[1], { schema: yaml.JSON_SCHEMA, filename: file }) ?? {};
    } catch (e) {
      error(
        'invalid-frontmatter',
        `frontmatter YAML inválido: ${e.reason || e.message} (linha ${(e.mark?.line ?? 0) + 2})`
      );
    }

    if (typeof front !== 'object' || Array.isArray(front)) {
      error('invalid-frontmatter', 'o frontmatter precisa ser uma lista de campos (chave: valor)');
      front = {};
    }

    Object.keys(front)
      .filter(key => !FIELDS.includes(key))
      .forEach(key =>
        error('unknown-field', `campo '${key}' não existe no frontmatter (válidos: ${FIELDS.join(', ')})`)
      );
  } else if (OPENS_FRONTMATTER.test(markdown)) {
    error('invalid-frontmatter', "frontmatter sem a linha '---' que fecha o bloco");
  }

  const comments = commentTags(body);
  const title = front.title === undefined || front.title === null ? undefined : String(front.title).trim();
  const label = comments.label || title;

  if (!label) {
    error('missing-title', 'sem título: use [comment]: # (@label ...) ou title no frontmatter');
  } else if (comments.label && title && title !== comments.label) {
    warnings.push({
      code: 'title-differs',
      name,
      message: `${file}: title '${title}' é diferente do @label '${comments.label}' (vale o @label)`
    });
  }

  return {
    name,
    file,
    label,
    link: comments.link,
    orderBy: comments.orderBy,
    category: front.category,
    parent: front.parent,
    order: front.order,
    shortcut: front.shortcut,
    body,
    errors,
    warnings
  };
}

// mensagens do resolveDocsMenu falam das tags do JSDoc; aqui são campos do frontmatter
const FIELD_OF_TAG = {
  '@docsCategory': 'category',
  '@docsParent': 'parent',
  '@docsShortcut': 'shortcut',
  '@docsOrder': 'order'
};
const forGuides = issue => ({
  ...issue,
  message: issue.message
    .replace(/@docs(Category|Parent|Shortcut|Order)/g, tag => FIELD_OF_TAG[tag])
    .replace(/subcomponente/g, 'subguia')
});

/**
 * Menu de Guias: categorias (ordem da lista) › guias (`order`, depois alfabética) › subguias (`parent`).
 * Atalho (`shortcut`) entra na outra categoria com `shortcut: true` e o rótulo da categoria de origem.
 *
 * @param {Array<ReturnType<typeof readGuide>>} guides
 * @param {object} vocab `guides-categories.js`
 */
function buildGuidesMenu(guides, vocab) {
  const resolved = resolveDocsMenu(
    guides.map(guide => ({
      name: guide.name,
      title: guide.label,
      file: guide.file,
      docsCategory: guide.category,
      docsParent: guide.parent,
      docsShortcut: guide.shortcut,
      docsOrder: guide.order === undefined || guide.order === null ? undefined : String(guide.order)
    })),
    vocab,
    { subsInMenu: true }
  );
  const errors = [...guides.flatMap(guide => guide.errors), ...resolved.errors.map(forGuides)];
  const warnings = [...guides.flatMap(guide => guide.warnings), ...resolved.warnings.map(forGuides)];
  const guideOf = new Map(guides.map(guide => [guide.name, guide]));
  const entryOf = new Map(resolved.entries.map(entry => [entry.name, entry]));
  const sort = list => list.sort(compareForMenu);

  const node = entry => {
    const guide = guideOf.get(entry.name);
    const children = sort(
      entry.children.map(child => ({ ...entryOf.get(child), title: guideOf.get(child).label }))
    ).map(node);

    return { name: entry.name, label: guide.label, link: guide.link, ...(children.length ? { children } : {}) };
  };

  const menu = vocab.sections.flatMap(section =>
    section.categories
      .map(category => {
        const own = resolved.entries.filter(entry => !entry.parent && entry.category === category.key);
        const shortcuts = resolved.entries.filter(entry => entry.shortcuts.some(s => s.category === category.key));
        const items = sort([
          ...own.map(entry => ({ entry, title: guideOf.get(entry.name).label, order: entry.order })),
          // atalho sem prioridade: entra na ordem alfabética
          ...shortcuts.map(entry => ({ entry, title: guideOf.get(entry.name).label, shortcut: true }))
        ]).map(({ entry, shortcut }) =>
          shortcut
            ? {
                name: entry.name,
                label: guideOf.get(entry.name).label,
                link: guideOf.get(entry.name).link,
                shortcut: true,
                origin: entry.categoryLabel
              }
            : node(entry)
        );

        return { key: category.key, label: category.label, items };
      })
      .filter(category => category.items.length)
  );

  const counts = {
    guides: guides.length,
    categories: menu.length,
    subguides: resolved.entries.filter(entry => entry.parent).length,
    shortcuts: resolved.entries.reduce((total, entry) => total + entry.shortcuts.length, 0)
  };

  return { menu, errors, warnings, counts };
}

module.exports = { readGuide, buildGuidesMenu, commentTags };
