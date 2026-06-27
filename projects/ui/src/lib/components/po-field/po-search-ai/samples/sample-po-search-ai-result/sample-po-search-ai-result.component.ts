import { Component } from '@angular/core';

import { PoSearchAiColumn, PoSearchAiResult } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-search-ai-result',
  templateUrl: './sample-po-search-ai-result.component.html',
  standalone: false
})
export class SamplePoSearchAiResultComponent {
  result: PoSearchAiResult;

  readonly columns: Array<PoSearchAiColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' }
  ];

  onResult(result: PoSearchAiResult) {
    this.result = result;
  }

  onClear() {
    this.result = undefined;
  }
}
