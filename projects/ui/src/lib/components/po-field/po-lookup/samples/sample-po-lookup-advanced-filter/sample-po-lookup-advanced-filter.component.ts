import { Component, inject } from '@angular/core';

import { ForceOptionComponentEnum, PoLookupAdvancedFilter, PoLookupColumn } from '@po-ui/ng-components';

import { SamplePoLookupService } from '../sample-po-lookup.service';

@Component({
  selector: 'sample-po-lookup-advanced-filter',
  templateUrl: './sample-po-lookup-advanced-filter.component.html',
  providers: [SamplePoLookupService],
  standalone: false
})
export class SamplePoLookupAdvancedFilterComponent {
  service = inject(SamplePoLookupService);

  hero: string;

  public readonly columns: Array<PoLookupColumn> = [
    { property: 'nickname', label: 'Hero' },
    { property: 'name', label: 'Name' },
    { property: 'email', label: 'E-mail' }
  ];

  /**
   * A propriedade `initValue` define o valor inicial de cada campo ao abrir a busca avançada.
   * Neste exemplo a busca avançada já é aberta filtrando o herói `Hulk`.
   */
  public readonly advancedFilters: Array<PoLookupAdvancedFilter> = [
    { property: 'name', label: 'Name', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 },
    {
      property: 'nickname',
      label: 'Hero',
      gridColumns: 6,
      initValue: 'Hulk',
      forceOptionsComponentType: ForceOptionComponentEnum.radioGroup,
      options: [
        { label: 'Batman', value: 'Batman' },
        { label: 'Superman', value: 'Superman' },
        { label: 'Hulk', value: 'Hulk' },
        { label: 'Thor', value: 'Thor' }
      ]
    }
  ];
}
