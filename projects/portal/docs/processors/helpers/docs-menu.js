'use strict';

/**
 * Resolve as tags `@docsCategory`, `@docsParent`, `@docsShortcut` e `@docsOrder` de cada item documentado
 * (grupo do Dgeni) contra o vocabulário fechado (`docs/docs-categories.js`).
 *
 * - erros: valor inválido (categoria/atalho desconhecido, pai inexistente, cadeia de pais, categoria e pai
 *   juntos, atalho igual à própria categoria, `@docsOrder` que não é inteiro >= 1). O build para.
 * - avisos: item sem categoria nem pai (vai para "Outros"), `@docsOrder` repetido na categoria,
 *   `@docsOrder` em subcomponente. O build segue.
 */

const text = value => (Array.isArray(value) ? value : value === undefined || value === null ? [] : [value])
  .map(v => String(v).trim())
  .filter(Boolean);

const first = value => text(value)[0];

/** Índice do vocabulário: chave da categoria -> { seção, rótulos, ordem }. */
function indexVocabulary(vocab) {
  const categories = new Map();

  vocab.sections.forEach((section, sectionOrder) =>
    section.categories.forEach((category, categoryOrder) =>
      categories.set(category.key, {
        category: category.key,
        categoryLabel: category.label,
        categoryOrder,
        section: section.key,
        sectionLabel: section.label,
        sectionOrder,
        flat: !!section.flat
      })
    )
  );

  return categories;
}

/**
 * @param {Array<{name: string, title?: string, file?: string, docsCategory?, docsParent?, docsShortcut?, docsOrder?}>} items
 * @param {object} vocab vocabulário (`docs-categories.js`)
 * @returns {{ entries: Array<object>, errors: Array<object>, warnings: Array<object> }}
 */
function resolveDocsMenu(items, vocab) {
  const categories = indexVocabulary(vocab);
  const names = new Set(items.map(item => item.name));
  const errors = [];
  const warnings = [];
  const where = item => item.file || item.name;
  const error = (item, code, message) => errors.push({ code, name: item.name, message: `${where(item)}: ${message}` });
  const warn = (item, code, message) => warnings.push({ code, name: item.name, message: `${where(item)}: ${message}` });

  const entries = items.map(item => {
    const category = first(item.docsCategory);
    const parent = first(item.docsParent);
    const shortcuts = text(item.docsShortcut);
    const orderText = first(item.docsOrder);
    const entry = { name: item.name, parent: undefined, shortcuts: [], children: [] };

    if (category && parent) {
      error(item, 'category-and-parent', 'use @docsCategory (item do menu) ou @docsParent (subcomponente), não os dois');
    }

    if (parent) {
      if (!names.has(parent)) {
        error(item, 'parent-not-found', `pai '${parent}' não existe`);
      } else if (parent === item.name) {
        error(item, 'parent-not-found', 'um item não pode ser pai de si mesmo');
      }
      entry.parent = parent;
    } else if (category) {
      const resolved = categories.get(category);

      if (!resolved) {
        error(item, 'unknown-category', `categoria '${category}' não existe (válidas: ${[...categories.keys()].join(', ')})`);
      } else {
        Object.assign(entry, resolved);
      }
    } else {
      warn(item, 'missing-category', `sem @docsCategory/@docsParent -> ${vocab.fallbackCategory}`);
      Object.assign(entry, categories.get(vocab.fallbackCategory));
    }

    shortcuts.forEach(key => {
      const resolved = categories.get(key);

      if (!resolved) {
        error(item, 'unknown-shortcut', `atalho para categoria '${key}' que não existe`);
      } else if (key === entry.category) {
        error(item, 'shortcut-same-category', `atalho '${key}' é a própria categoria do item`);
      } else if (!entry.shortcuts.some(s => s.category === key)) {
        entry.shortcuts.push(resolved);
      }
    });

    if (orderText !== undefined) {
      if (!/^[1-9]\d*$/.test(orderText)) {
        error(item, 'invalid-order', `@docsOrder precisa ser inteiro >= 1 (recebido '${orderText}')`);
      } else if (parent) {
        warn(item, 'order-on-sub', '@docsOrder em subcomponente é ignorado (ele não aparece no menu)');
      } else {
        entry.order = Number(orderText);
      }
    }

    return entry;
  });

  const byName = new Map(entries.map(entry => [entry.name, entry]));

  entries.forEach(entry => {
    if (!entry.parent || !byName.has(entry.parent)) return;

    const parent = byName.get(entry.parent);

    if (parent.parent) {
      const item = items.find(i => i.name === entry.name);

      error(item, 'parent-is-sub', `pai '${parent.name}' também é subcomponente (só um nível)`);
    } else {
      parent.children.push(entry.name);
    }
  });

  // @docsOrder repetido na mesma categoria: desempata pelo título, só avisa
  const seenOrder = new Map();

  entries.forEach(entry => {
    if (entry.order === undefined) return;

    const key = `${entry.category}:${entry.order}`;

    if (seenOrder.has(key)) {
      warn(items.find(i => i.name === entry.name), 'duplicate-order', `@docsOrder ${entry.order} repetido em '${entry.category}' (com ${seenOrder.get(key)})`);
    } else {
      seenOrder.set(key, entry.name);
    }
  });

  entries.forEach(entry => entry.children.sort());

  return { entries, errors, warnings };
}

/** Ordem do menu e da listagem: `@docsOrder` primeiro (menor primeiro), depois alfabética pelo título. */
function compareForMenu(a, b) {
  const order = (a.order ?? Infinity) - (b.order ?? Infinity);

  return order || String(a.title).localeCompare(String(b.title), 'pt-BR', { sensitivity: 'base' });
}

module.exports = { resolveDocsMenu, compareForMenu, indexVocabulary };
