import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';

import { compareDocs, groupDocs, parentsOf } from './docs-groups';
import { Documentation } from './documentation.class';
import { MenuComponentsService } from './menu-components.service';

const doc = (name: string, title: string, category: string, extra: Partial<Documentation> = {}): Documentation => {
  const sections: Record<string, [string, string, number, number, boolean?]> = {
    'form': ['components', 'Componentes', 0, 1],
    'tables-lists': ['components', 'Componentes', 0, 5],
    'others': ['components', 'Componentes', 0, 12],
    'dynamic': ['dynamic', 'Componentes dinâmicos', 2, 0, true],
    'directives': ['utilities', 'Utilitários', 3, 0]
  };
  const labels: Record<string, string> = {
    'form': 'Formulário',
    'tables-lists': 'Tabelas e listas',
    'others': 'Outros',
    'dynamic': 'Componentes dinâmicos',
    'directives': 'Diretivas'
  };
  const [section, sectionLabel, sectionOrder, categoryOrder, flat] = sections[category] ?? [];

  return {
    name,
    title: `Po ${title}`,
    type: 'components',
    ...(category
      ? { section, sectionLabel, sectionOrder, category, categoryLabel: labels[category], categoryOrder, flat }
      : {}),
    ...extra
  };
};

const DOCS: Array<Documentation> = [
  doc('po-url', 'Url', 'form'),
  doc('po-email', 'Email', 'form'),
  doc('po-input', 'Input', 'form'),
  doc('po-table', 'Table', 'tables-lists', { children: ['po-table-cell-template'] }),
  doc('po-table-cell-template', 'Table Cell Template', undefined, { parent: 'po-table' }),
  doc('po-dynamic-form', 'Dynamic Form', 'dynamic'),
  doc('po-drag', 'Drag', 'directives', {
    shortcuts: [
      {
        section: 'components',
        sectionLabel: 'Componentes',
        category: 'tables-lists',
        categoryLabel: 'Tabelas e listas'
      }
    ]
  }),
  doc('po-novo', 'Novo', 'others')
];

describe('docs-groups', () => {
  it('agrupa em Seção › Categoria na ordem do vocabulário, sem subcomponentes', () => {
    const groups = groupDocs(DOCS);

    expect(groups.map(g => g.label)).toEqual(['Componentes', 'Componentes dinâmicos', 'Utilitários']);
    expect(groups[0].categories.map(c => c.label)).toEqual(['Formulário', 'Tabelas e listas', 'Outros']);
    expect(groups.flatMap(g => g.categories.flatMap(c => c.entries.map(e => e.doc.name)))).not.toContain(
      'po-table-cell-template'
    );
  });

  it('ordena alfabético pelo título e põe o atalho na categoria do atalho, marcado', () => {
    const [components] = groupDocs(DOCS);
    const tables = components.categories.find(c => c.key === 'tables-lists');

    expect(components.categories[0].entries.map(e => e.doc.name)).toEqual(['po-email', 'po-input', 'po-url']);
    expect(tables.entries.map(e => [e.doc.name, e.shortcut])).toEqual([
      ['po-drag', true],
      ['po-table', false]
    ]);
  });

  it('@docsOrder vem antes da ordem alfabética', () => {
    const list = [doc('po-b', 'Beta', 'form'), doc('po-a', 'Alfa', 'form'), doc('po-z', 'Zeta', 'form', { order: 1 })];

    expect(list.sort(compareDocs).map(d => d.name)).toEqual(['po-z', 'po-a', 'po-b']);
  });

  it('parentsOf: sub -> pai', () => {
    expect([...parentsOf(DOCS)]).toEqual([['po-table-cell-template', 'po-table']]);
  });
});

describe('MenuComponentsService', () => {
  let menus: Array<PoMenuItem>;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    navigate = jasmine.createSpy('navigateByUrl');
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { navigateByUrl: navigate } }] });
    menus = TestBed.inject(MenuComponentsService).getMenus(DOCS);
  });

  const find = (items: Array<PoMenuItem>, label: string): PoMenuItem =>
    items.reduce<PoMenuItem>(
      (found, item) => found ?? (item.label === label ? item : find(item.subItems ?? [], label)),
      undefined
    );

  it('Seção › Categoria › Item; seção flat sem subnível; IA no fim', () => {
    expect(menus.map(m => m.label)).toEqual([
      'Componentes',
      'Componentes dinâmicos',
      'Utilitários',
      'Ferramentas para IA'
    ]);
    expect(find(menus, 'Formulário').subItems.map(i => i.label)).toEqual(['Email', 'Input', 'Url']);
    expect(find(menus, 'Componentes dinâmicos').subItems).toEqual([
      { label: 'Dynamic Form', link: '/documentation/po-dynamic-form' }
    ]);
    expect(find(menus, 'Outros').subItems.map(i => i.label)).toEqual(['Novo']);
  });

  it('atalho: sem link, com action e rótulo "atalho para <seção> › <categoria>"', () => {
    const shortcut = find(menus, 'Tabelas e listas').subItems[0];

    expect(shortcut.label).toBe('Drag (atalho para Utilitários › Diretivas)');
    expect(shortcut.link).toBeUndefined();
    shortcut.action();
    expect(navigate).toHaveBeenCalledWith('/documentation/po-drag');
    expect(find(menus, 'Drag').link).toBe('/documentation/po-drag');
  });

  it('subcomponente fora do menu', () => {
    expect(find(menus, 'Table Cell Template')).toBeUndefined();
  });
});
