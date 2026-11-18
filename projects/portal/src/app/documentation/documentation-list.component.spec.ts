import { ChangeDetectorRef } from '@angular/core';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Documentation } from './documentation.class';
import { DocumentationListComponent } from './documentation-list.component';
import { DocumentationService } from './documentation.service';

const SHORTCUT_TABLES = {
  section: 'components',
  sectionLabel: 'Componentes',
  category: 'tables-lists',
  categoryLabel: 'Tabelas e listas'
};

const doc = (
  name: string,
  title: string,
  category: string | undefined,
  extra: Partial<Documentation> = {}
): Documentation => {
  const meta: Record<string, Partial<Documentation>> = {
    'form': { section: 'components', sectionLabel: 'Componentes', sectionOrder: 0, categoryOrder: 1 },
    'tables-lists': { section: 'components', sectionLabel: 'Componentes', sectionOrder: 0, categoryOrder: 5 },
    'directives': { section: 'utilities', sectionLabel: 'Utilitários', sectionOrder: 3, categoryOrder: 0 }
  };
  const labels: Record<string, string> = {
    'form': 'Formulário',
    'tables-lists': 'Tabelas e listas',
    'directives': 'Diretivas'
  };

  return {
    name,
    title: `Po ${title}`,
    type: 'components',
    ...(category ? { ...meta[category], category, categoryLabel: labels[category] } : {}),
    ...extra
  };
};

const DOCS: Array<Documentation> = [
  doc('po-input', 'Input', 'form'),
  doc('po-email', 'Email', 'form'),
  doc('po-table', 'Table', 'tables-lists', { children: ['po-table-cell-template'] }),
  doc('po-table-cell-template', 'Table Cell Template', undefined, { parent: 'po-table' }),
  doc('po-drag', 'Drag', 'directives', { shortcuts: [SHORTCUT_TABLES] })
];

describe('DocumentationListComponent', () => {
  let component: DocumentationListComponent;

  const summary = () =>
    component.sections.map(section => ({
      section: section.label,
      count: section.count,
      categories: section.categories.map(category => ({
        label: category.label,
        items: category.items.map(item => item.name)
      }))
    }));

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
        { provide: DocumentationService, useValue: { findDocs: () => of(DOCS.map(item => ({ ...item }))) } },
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    });
    component = TestBed.runInInjectionContext(
      () => new DocumentationListComponent(TestBed.inject(DocumentationService), TestBed.inject(Router))
    );
    component.ngOnInit();
    flush();
  }));

  it('agrupa como o menu, sem subcomponentes e sem atalhos', () => {
    expect(summary()).toEqual([
      {
        section: 'Componentes',
        count: 3,
        categories: [
          { label: 'Formulário', items: ['po-email', 'po-input'] },
          { label: 'Tabelas e listas', items: ['po-table'] }
        ]
      },
      {
        section: 'Utilitários',
        count: 1,
        categories: [{ label: 'Diretivas', items: ['po-drag'] }]
      }
    ]);
  });

  it('filtro esconde grupos vazios', () => {
    component.filterAction('Email');

    expect(summary()).toEqual([
      { section: 'Componentes', count: 1, categories: [{ label: 'Formulário', items: ['po-email'] }] }
    ]);
  });

  it('filtro não acha subcomponentes', () => {
    component.filterAction('cell template');

    expect(summary()).toEqual([]);
  });

  it('atalho não aparece na categoria do atalho, só na própria', () => {
    component.filterAction('drag');

    expect(summary()).toEqual([
      { section: 'Utilitários', count: 1, categories: [{ label: 'Diretivas', items: ['po-drag'] }] }
    ]);
  });
});
