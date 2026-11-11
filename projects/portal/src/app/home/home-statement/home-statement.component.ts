import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ChangeDetectionStrategy, Component, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { PoChartOptions, PoChartSerie, PoTableColumn } from '@po-ui/ng-components';

const WIDGET_SAMPLES_ROUTE = 'documentation/po-widget';

// The table values follow the Brazilian format (R$ 1.280,00) only in this section; the portal keeps its own locale
registerLocaleData(localePt);

@Component({
  selector: 'app-home-statement',
  templateUrl: './home-statement.component.html',
  styleUrls: ['./home-statement.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  standalone: false
})
export class HomeStatementComponent {
  // po-widget opens p-help in a new tab, so it needs a full URL that respects the <base href>
  readonly widgetSamplesUrl = new URL(`${WIDGET_SAMPLES_ROUTE}?view=web`, document.baseURI).href;

  // Recent orders: the four cards tell one story (orders, today's total, order progress and deliveries)
  readonly requestColumns: Array<PoTableColumn> = [
    { property: 'customer', label: 'Cliente' },
    { property: 'amount', label: 'Valor', type: 'currency', format: 'BRL', width: '120px' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      width: '120px',
      labels: [
        { value: 'paid', color: 'color-11', label: 'Pago' },
        { value: 'pending', color: 'color-08', label: 'Pendente' },
        { value: 'canceled', color: 'color-07', label: 'Cancelado' }
      ]
    },
    {
      property: 'priority',
      label: 'Prioridade',
      type: 'subtitle',
      width: '120px',
      subtitles: [
        { value: 'high', color: 'color-07', label: 'Alta', content: 'A' },
        { value: 'medium', color: 'color-08', label: 'Média', content: 'M' },
        { value: 'low', color: 'color-11', label: 'Baixa', content: 'B' }
      ]
    }
  ];

  readonly requests = [
    { customer: 'Maria Silva', amount: 1280, status: 'paid', priority: 'low' },
    { customer: 'João Souza', amount: 349.9, status: 'pending', priority: 'high' },
    { customer: 'Ana Costa', amount: 86.5, status: 'canceled', priority: 'medium' }
  ];

  readonly chartSeries: Array<PoChartSerie> = [
    { label: 'Recebidos', data: 40 },
    { label: 'Em separação', data: 32 },
    { label: 'Despachados', data: 12 },
    { label: 'Em trânsito', data: 24 },
    { label: 'Entregues', data: 68 },
    { label: 'Atrasadas', data: 8 }
  ];

  readonly chartOptions: PoChartOptions = {
    legendType: 'scroll'
  };

  constructor(private readonly router: Router) {}

  openWidgetSamples(): void {
    this.router.navigate([`/${WIDGET_SAMPLES_ROUTE}`], { queryParams: { view: 'web' } });
  }
}
