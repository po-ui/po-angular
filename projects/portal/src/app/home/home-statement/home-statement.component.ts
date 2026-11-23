import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoChartSerie, PoCheckboxGroupOption } from '@po-ui/ng-components';

const WIDGET_SAMPLES_ROUTE = 'documentation/po-widget';

@Component({
  selector: 'app-home-statement',
  templateUrl: './home-statement.component.html',
  styleUrls: ['./home-statement.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeStatementComponent {
  // po-widget opens p-help in a new tab, so it needs a full URL that respects the <base href>
  readonly widgetSamplesUrl = new URL(`${WIDGET_SAMPLES_ROUTE}?view=web`, document.baseURI).href;

  readonly avatars = [1, 2, 3];

  readonly favoriteOptions: Array<PoCheckboxGroupOption> = [
    { label: 'po-table', value: 'po-table' },
    { label: 'po-widget', value: 'po-widget' },
    { label: 'po-chart', value: 'po-chart' }
  ];

  favorites: Array<string> = ['po-widget'];

  readonly chartSeries: Array<PoChartSerie> = [
    { label: 'Formulários', data: 40 },
    { label: 'Listas', data: 25 },
    { label: 'Navegação', data: 20 },
    { label: 'Gráficos', data: 15 }
  ];

  constructor(private readonly router: Router) {}

  openWidgetSamples(): void {
    this.router.navigate([`/${WIDGET_SAMPLES_ROUTE}`], { queryParams: { view: 'web' } });
  }
}
