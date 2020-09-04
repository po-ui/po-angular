import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoListViewAction } from '@po-ui/ng-components';

import { Documentation } from './documentation.class';
import { DocumentationService } from '../documentation/documentation.service';

@Component({
  templateUrl: './documentation-list.component.html'
})
export class DocumentationListComponent implements OnInit {
  private _items: Array<Documentation> = [];

  private _listActions: Array<PoListViewAction> = [
    { label: 'Documentação', action: this.viewDocumentation.bind(this), icon: 'po-icon-document-double' },
    { label: 'Exemplos', action: this.viewSample.bind(this), icon: 'po-icon-light' }
  ];

  public filteredItems;

  public filter = {
    placeholder: 'Pesquise',
    action: this.filterAction.bind(this)
  };

  constructor(private docService: DocumentationService, private router: Router) {}

  ngOnInit() {
    this.docService.findDocs('api').subscribe(docs => {
      this._items = this.sortDocs(docs);
      this._items.forEach(item => (item.title = item.title.replace('Po ', '')));
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
}
