import { Component } from '@angular/core';

import { PoAiSearchColumn, PoAiSearchResult } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-ai-search-basic',
  templateUrl: './sample-po-ai-search-basic.component.html',
  standalone: false
})
export class SamplePoAiSearchBasicComponent {
  lastFilter: string;

  readonly columns: Array<PoAiSearchColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' }
  ];

  onResult(result: PoAiSearchResult) {
    this.lastFilter = result.filter;
  }

  onClear() {
    this.lastFilter = undefined;
  }
}
