import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PoButtonGroupItem, PoListViewAction, PoListViewFieldProperties } from '@po-ui/ng-components';

import { Documentation } from './documentation.class';
import { DocumentationService } from '../documentation/documentation.service';
import { PREVIEW_SAMPLE_NAMES } from './documentation-preview/preview-sample-names';

type DocViewMode = 'grid' | 'list';

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

  public readonly columnsPerRow = 3;

  // Placeholders do skeleton (quantidade fixa enquanto carrega).
  public readonly skeletonRows = Array.from({ length: 1 }, () => Array.from({ length: this.columnsPerRow }));
  public readonly skeletonListItems = Array.from({ length: 3 });

  private _items: Array<Documentation> = [];
  private _filteredItems: Array<Documentation> = [];

  private readonly _listActions: Array<PoListViewAction> = [
    { label: 'Exemplos', action: this.viewSample.bind(this), icon: 'ICON_LIGHT' },
    { label: 'Documentação', action: this.viewDocumentation.bind(this), icon: 'ICON_DOCUMENT_DOUBLE' }
  ];

  set filteredItems(items: Array<Documentation>) {
    this._filteredItems = items ?? [];
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
        previewText: this.getFirstSentence(item.preview),
        tagLabel: this.getTypeLabel(item.type),
        tagType: this.getTypeColor(item.type)
      }));
      this.renderWithLoading(() => (this.filteredItems = this._items));
    });

    this.filterAction();
  }

  // Extrai apenas a primeira frase do preview (texto markdown), ignorando
  // blocos de código e múltiplas linhas, para manter os cards com altura fixa.
  private getFirstSentence(preview?: string): string {
    if (!preview) {
      return '';
    }

    const firstParagraph = preview.split('\n').find(line => line.trim().length > 0) ?? '';
    const match = firstParagraph.match(/.*?[.!?](\s|$)/);

    return (match ? match[0] : firstParagraph).trim();
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

  public filterAction(searchTextTerm = '') {
    const searchText = searchTextTerm.toLocaleLowerCase();

    if (searchText) {
      this.filteredItems = [
        ...this._items.filter(
          item =>
            item.name.toLocaleLowerCase().includes(searchText) || item.title.toLocaleLowerCase().includes(searchText)
        )
      ];
    } else {
      this.filteredItems = [...this._items];
    }
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
