import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PoButtonGroupItem, PoListViewAction, PoListViewFieldProperties } from '@po-ui/ng-components';

import { cardSummary } from './card-summary';
import { Documentation } from './documentation.class';
import { DocsSectionGroup, groupDocs } from './docs-groups';
import { DocumentationService } from '../documentation/documentation.service';
import { PREVIEW_SAMPLE_NAMES } from './documentation-preview/preview-sample-names';

type DocViewMode = 'grid' | 'list';

/** Categoria da listagem: só os itens canônicos (atalhos ficam só no menu). */
export interface DocsListCategory {
  key: string;
  label: string;
  items: Array<Documentation>;
}

export interface DocsListSection {
  key: string;
  label: string;
  flat: boolean;
  /** Total da seção: cards das categorias + subcomponentes deles (`@docsParent`), que não têm card. */
  count: number;
  categories: Array<DocsListCategory>;
}

// Prefixo para as chaves do portal no localStorage.
const PORTAL_STORAGE_PREFIX = '@po-ui/portal/';
const VIEW_MODE_STORAGE_KEY = `${PORTAL_STORAGE_PREFIX}documentation-list-view-mode`;

@Component({
  templateUrl: './documentation-list.component.html',
  styleUrls: ['./documentation-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class DocumentationListComponent implements OnInit {
  // Modo de visualização: 'grid' (po-widget, padrão) ou 'list' (po-list-view).
  // Inicializado a partir da preferência salva no localStorage.
  public viewMode: DocViewMode = this.loadViewMode();

  // Exibe o loading enquanto a renderização pesada (cards + previews) ocorre.
  public isRendering = false;

  public readonly viewModeButtons: Array<PoButtonGroupItem> = [
    {
      label: 'Grid',
      icon: 'an an-squares-four',
      action: () => this.setViewMode('grid'),
      selected: this.viewMode === 'grid'
    },
    { label: 'Lista', icon: 'an an-list', action: () => this.setViewMode('list'), selected: this.viewMode === 'list' }
  ];

  // Configuração do po-list-view (modo lista — comportamento antigo).
  public fieldProperties: PoListViewFieldProperties = {
    title: 'title',
    subtitle: 'description',
    tag: { value: 'tagLabel', type: 'tagType' }
  };

  public filter = {
    placeholder: 'Pesquise',
    action: this.filterAction.bind(this)
  };

  // Placeholders do skeleton (quantidade fixa enquanto carrega): 3 cards = uma linha no desktop (po-lg-4).
  public readonly skeletonCards = Array.from({ length: 3 });
  public readonly skeletonListItems = Array.from({ length: 3 });

  private _items: Array<Documentation> = [];
  private _filteredItems: Array<Documentation> = [];
  /** Com filtro ativo, as contagens somem (só fazem sentido com tudo exibido). */
  public isFiltered = false;
  private _sections: Array<DocsListSection> = [];

  private readonly _listActions: Array<PoListViewAction> = [
    { label: 'Exemplos', action: this.viewSample.bind(this), icon: 'ICON_LIGHT' },
    { label: 'Documentação', action: this.viewDocumentation.bind(this), icon: 'ICON_DOCUMENT_DOUBLE' }
  ];

  set filteredItems(items: Array<Documentation>) {
    this._filteredItems = items ?? [];
    this._sections = this.buildSections(this._filteredItems);
  }

  /** Seções e categorias da listagem, com o mesmo agrupamento e ordem do menu (`groupDocs`). */
  get sections(): Array<DocsListSection> {
    return this._sections;
  }

  get filteredItems(): Array<Documentation> {
    return this._filteredItems;
  }

  get listActions(): Array<PoListViewAction> {
    return this._listActions;
  }

  private readonly cd = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  constructor(
    private docService: DocumentationService,
    private router: Router
  ) {}

  public setViewMode(mode: DocViewMode): void {
    if (mode === this.viewMode) {
      return;
    }

    this.saveViewMode(mode);

    // Mostra o loading e só então troca o modo, deixando o browser pintar o
    // overlay antes da renderização pesada (cards + previews) do próximo modo.
    this.renderWithLoading(() => (this.viewMode = mode));
  }

  // Lê a preferência de visualização do localStorage; 'grid' como padrão.
  private loadViewMode(): DocViewMode {
    try {
      const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      return stored === 'list' || stored === 'grid' ? stored : 'grid';
    } catch {
      // localStorage pode estar indisponível (modo privado/bloqueado).
      return 'grid';
    }
  }

  // Persiste a preferência de visualização no localStorage.
  private saveViewMode(mode: DocViewMode): void {
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignora falha de escrita (ex.: storage cheio/bloqueado).
    }
  }

  /**
   * Exibe o loading, aguarda o browser pintar e então executa a ação pesada,
   * escondendo o loading após a renderização.
   */
  private renderWithLoading(action: () => void): void {
    this.isRendering = true;
    this.cd.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          action();
          this.cd.detectChanges();
          // Segundo tick: após os cards montarem, esconde o loading.
          setTimeout(() =>
            this.ngZone.run(() => {
              this.isRendering = false;
              this.cd.detectChanges();
            })
          );
        });
      });
    });
  }

  ngOnInit() {
    this.docService.findDocs('api').subscribe(docs => {
      this._items = this.sortDocs(docs).map(item => ({
        ...item,
        title: item.title.replace('Po ', ''),
        description: item.module ? `Módulo: ${item.module}` : '',
        // 1ª frase do 1º parágrafo, em texto simples (até 160 caracteres): cabe no card de altura fixa
        previewText: cardSummary(item.preview),
        tagLabel: this.getTypeLabel(item.type),
        tagType: this.getTypeColor(item.type)
      }));
      this.renderWithLoading(() => (this.filteredItems = this._items));
    });

    this.filterAction();
  }

  get items() {
    return this._items;
  }

  public trackByName(_index: number, item: Documentation): string {
    return item.name;
  }

  public hasPreviewSample(item: Documentation): boolean {
    return PREVIEW_SAMPLE_NAMES.has(item.name);
  }

  public viewDocumentation(item) {
    this.router.navigate(['/documentation', item.name], { queryParams: { view: 'doc' } });
  }

  public viewSample(item) {
    this.router.navigate(['/documentation', item.name], { queryParams: { view: 'web' } });
  }

  /**
   * Filtra por `name` ou título. Subcomponentes não têm card: se o filtro achar um, mostra o card do pai
   * (com o sub destacado). Grupos que ficarem sem card somem.
   */
  public filterAction(searchTextTerm = '') {
    const searchText = searchTextTerm.toLocaleLowerCase();
    const matches = (item: Documentation) =>
      item.name.toLocaleLowerCase().includes(searchText) || item.title.toLocaleLowerCase().includes(searchText);

    // subcomponentes (`@docsParent`) não aparecem na listagem, então o filtro também não os acha
    this.isFiltered = !!searchText;
    if (searchText) {
      this.filteredItems = this._items.filter(item => !item.parent && matches(item));
    } else {
      this.filteredItems = [...this._items];
    }
  }

  private buildSections(items: Array<Documentation>): Array<DocsListSection> {
    return groupDocs(items)
      .map((section: DocsSectionGroup) => {
        const categories = section.categories
          .map(category => ({
            key: category.key,
            label: category.label,
            // atalhos só aparecem no menu
            items: category.entries.filter(entry => !entry.shortcut).map(entry => entry.doc)
          }))
          // categoria que só teria atalhos (o card está em outra) não aparece
          .filter(category => category.items.length);

        return {
          key: section.key,
          label: section.label,
          flat: section.flat,
          // cada card conta 1 + os subcomponentes dele, que não aparecem na listagem
          count: categories.reduce(
            (total, category) =>
              total + category.items.reduce((sum, item) => sum + 1 + (item.children?.length ?? 0), 0),
            0
          ),
          categories
        };
      })
      .filter(section => section.categories.length);
  }

  private sortDocs(docs) {
    return docs.sort((prev, next) => (prev.name < next.name ? -1 : 1));
  }

  private getTypeLabel(type: string): string {
    const labels = { components: 'Component', directives: 'Directive', services: 'Service', interfaces: 'Interface' };
    return labels[type] || type || '';
  }

  private getTypeColor(type: string): string {
    const colors = { components: 'success', directives: 'info', services: 'neutral', interfaces: 'warning' };
    return colors[type] || 'neutral';
  }
}
