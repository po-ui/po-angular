import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoListViewAction } from '@po-ui/ng-components';

import { Documentation } from './documentation.class';
import { DocumentationService } from '../documentation/documentation.service';

@Component({
  templateUrl: './documentation-list.component.html',
  standalone: false
})
export class DocumentationListComponent implements OnInit {
  public filteredItems;

  public filter = {
    placeholder: 'Pesquise',
    action: this.filterAction.bind(this)
  };

  private _items: Array<Documentation> = [];

  private _listActions: Array<PoListViewAction> = [
    { label: 'Exemplos', action: this.viewSample.bind(this), icon: 'ICON_LIGHT' },
    { label: 'Documentação', action: this.viewDocumentation.bind(this), icon: 'ICON_DOCUMENT_DOUBLE' }
  ];

  constructor(
    private docService: DocumentationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.docService.findDocs('api').subscribe(docs => {
      this._items = this.sortDocs(docs).map(item => ({
        ...item,
        title: item.title.replace('Po ', ''),
        description: item.module ? `Módulo: ${item.module}` : '',
        tagLabel: this.getTypeLabel(item.type),
        tagType: this.getTypeColor(item.type)
      }));
      this.filteredItems = this._items;
    });

    this.filterAction();
  }

  get items() {
    return this._items;
  }

  get listActions() {
    return this._listActions;
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
