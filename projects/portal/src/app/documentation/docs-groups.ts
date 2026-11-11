import { Documentation } from './documentation.class';

/** Item de uma categoria: o próprio doc, ou um atalho para um doc de outra categoria. */
export interface DocsGroupEntry {
  doc: Documentation;
  /** Atalho (`@docsShortcut`): o doc mora em outra categoria (a canônica). */
  shortcut: boolean;
}

export interface DocsCategoryGroup {
  key: string;
  label: string;
  /** Itens canônicos e atalhos, já na ordem do menu. */
  entries: Array<DocsGroupEntry>;
}

export interface DocsSectionGroup {
  key: string;
  label: string;
  /** Seção de um nível só (sem subnível de categoria). */
  flat: boolean;
  categories: Array<DocsCategoryGroup>;
}

/** Rótulo exibido do item (`Po Button` -> `Button`). */
export const docLabel = (doc: Pick<Documentation, 'title'>): string => doc.title.replace(/^Po /, '');

/**
 * Ordem do menu e da listagem (decisão: `@docsOrder` primeiro, menor primeiro; depois alfabética pelo título,
 * sem diferenciar acento nem caixa). Mesma regra de `compareForMenu` no gerador (docs/processors/helpers/docs-menu.js).
 */
export function compareDocs(a: Documentation, b: Documentation): number {
  const order = (a.order ?? Infinity) - (b.order ?? Infinity);

  return order || docLabel(a).localeCompare(docLabel(b), 'pt-BR', { sensitivity: 'base' });
}

/** Sufixo do atalho no menu: só a categoria de origem, ex.: "Diretivas". */
export const shortcutTarget = (doc: Documentation): string => doc.categoryLabel;

/**
 * Agrupa os docs do `api-list.json` em Seção › Categoria › Itens, para o menu e para a listagem "API Reference".
 * Subcomponentes (`parent`) ficam de fora (aparecem no pai). Atalhos entram na categoria do atalho, na mesma
 * ordenação, marcados com `shortcut: true`. Seções e categorias seguem a ordem do vocabulário.
 */
export function groupDocs(docs: Array<Documentation>): Array<DocsSectionGroup> {
  type OrderedCategory = DocsCategoryGroup & { order: number; section: string };
  const sections = new Map<
    string,
    Omit<DocsSectionGroup, 'categories'> & { order: number; categories: Array<OrderedCategory> }
  >();
  const categories = new Map<string, OrderedCategory>();

  const ensure = (
    section: string,
    sectionLabel: string,
    sectionOrder: number,
    flat: boolean,
    key: string,
    label: string,
    order: number
  ) => {
    if (!sections.has(section)) {
      sections.set(section, { key: section, label: sectionLabel, flat, order: sectionOrder, categories: [] });
    }
    const id = `${section}:${key}`;

    if (!categories.has(id)) {
      categories.set(id, { key, label, order, section, entries: [] });
    }

    return categories.get(id);
  };

  docs
    .filter(doc => doc.category && !doc.parent)
    .forEach(doc => {
      ensure(
        doc.section,
        doc.sectionLabel,
        doc.sectionOrder,
        !!doc.flat,
        doc.category,
        doc.categoryLabel,
        doc.categoryOrder
      ).entries.push({
        doc,
        shortcut: false
      });

      (doc.shortcuts ?? []).forEach(target => {
        const canonical = docs.find(d => d.section === target.section && d.category === target.category);

        ensure(
          target.section,
          target.sectionLabel,
          canonical?.sectionOrder ?? Infinity,
          !!canonical?.flat,
          target.category,
          target.categoryLabel,
          canonical?.categoryOrder ?? Infinity
        ).entries.push({ doc, shortcut: true });
      });
    });

  categories.forEach(category => {
    category.entries.sort((a, b) => compareDocs(a.doc, b.doc));
    sections.get(category.section).categories.push(category);
  });

  const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

  return [...sections.values()].sort(byOrder).map(section => ({
    key: section.key,
    label: section.label,
    flat: section.flat,
    categories: section.categories.sort(byOrder).map(({ key, label, entries }) => ({ key, label, entries }))
  }));
}

/** Subcomponente -> pai (`@docsParent`). */
export function parentsOf(docs: Array<Documentation>): Map<string, string> {
  return new Map(docs.filter(doc => doc.parent).map(doc => [doc.name, doc.parent]));
}
