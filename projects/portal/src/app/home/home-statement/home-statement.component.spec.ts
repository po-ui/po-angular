import { CurrencyPipe } from '@angular/common';
import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HomeStatementComponent } from './home-statement.component';

describe('HomeStatementComponent', () => {
  let fixture: ComponentFixture<HomeStatementComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeStatementComponent],
      providers: [{ provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeStatementComponent);
    fixture.detectChanges();
  });

  it('should highlight PO-UI in the statement', () => {
    expect(fixture.nativeElement.querySelector('.home-statement-highlight').textContent).toBe('PO-UI');
  });

  it('should not render illustration slots anymore', () => {
    expect(fixture.nativeElement.querySelectorAll('app-home-illustration-slot').length).toBe(0);
  });

  it('should render a compact po-table of recent orders, with label and subtitle columns and no search or columns manager', () => {
    const table: HTMLElement = fixture.nativeElement.querySelector('.home-statement-requests po-table');
    expect(table).toBeTruthy();
    expect(table.getAttribute('p-hide-columns-manager')).toBe('true');
    expect(table.getAttribute('p-hide-table-search')).toBe('true');
    expect(table.hasAttribute('p-actions')).toBeFalse();

    const columns = fixture.componentInstance.requestColumns;
    expect(columns.map(column => column.property)).toEqual(['customer', 'amount', 'status', 'priority']);
    expect(columns.find(column => column.property === 'amount')).toEqual(
      jasmine.objectContaining({ type: 'currency', format: 'BRL' })
    );
    expect(columns.find(column => column.property === 'status').labels.map(label => label.label)).toEqual([
      'Pago',
      'Pendente',
      'Cancelado'
    ]);
    expect(columns.find(column => column.property === 'priority').subtitles.map(subtitle => subtitle.content)).toEqual([
      'A',
      'M',
      'B'
    ]);
  });

  it('should have an order for each status and a known priority in every row', () => {
    const { requests, requestColumns } = fixture.componentInstance;
    const statuses = requestColumns.find(column => column.property === 'status').labels.map(label => label.value);
    const priorities = requestColumns
      .find(column => column.property === 'priority')
      .subtitles.map(subtitle => subtitle.value);
    expect(requests.map(request => request.status)).toEqual(jasmine.arrayWithExactContents(statuses));
    requests.forEach(request => expect(priorities).toContain(request.priority));
  });

  it('should not render the old approval card (avatar, info and tag)', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.home-statement-approval, po-avatar, po-info')).toBeNull();
  });

  it('should render a horizontal order stepper at the second step (first one done), without navigation', () => {
    const stepper: HTMLElement = fixture.nativeElement.querySelector('.home-statement-order po-stepper');
    expect(stepper.getAttribute('p-orientation')).toBe('horizontal');
    const steps = Array.from(stepper.querySelectorAll('po-step'));
    expect(steps.map(step => step.getAttribute('p-label'))).toEqual([
      'Carrinho',
      'Entrega',
      'Pagamento',
      'Confirmação'
    ]);
    expect(steps.map(step => step.getAttribute('p-status'))).toEqual(['done', 'active', null, null]);
    expect(steps.map(step => step.getAttribute('p-icon-default'))).toEqual([
      'an an-shopping-cart',
      'an an-truck',
      'an an-credit-card',
      'an an-check'
    ]);
  });

  it('should not render the old team and checkbox group examples', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.home-statement-team, .home-statement-checkbox, po-checkbox-group')).toBeNull();
    expect((fixture.componentInstance as any).favorites).toBeUndefined();
  });

  it('should render the delivery status donut chart with three series', () => {
    const chart: HTMLElement = fixture.nativeElement.querySelector('.home-statement-chart po-chart');
    expect(chart.getAttribute('p-type')).toBe('donut');
    expect(chart.getAttribute('p-title')).toBe('Status das entregas');
    expect(fixture.componentInstance.chartSeries.map(serie => serie.label)).toEqual([
      'Entregues',
      'Em trânsito',
      'Atrasadas'
    ]);
  });

  it('should render the po-widget with the orders of the day: tag, title, action, number and goal', () => {
    const widget: HTMLElement = fixture.nativeElement.querySelector('po-widget.home-statement-widget');
    expect(widget.getAttribute('p-tag')).toBe('+8%');
    expect(widget.getAttribute('p-tag-type')).toBe('success');
    expect(widget.getAttribute('p-title')).toBe('Pedidos de hoje');
    expect(widget.getAttribute('p-primary-label')).toBe('Ver exemplos');
    expect(widget.querySelector('.home-statement-widget-number').textContent.trim()).toBe('128');
    expect(widget.querySelector('po-progress').getAttribute('p-text')).toBe('Meta 72%');
  });

  it('should point the widget help to the po-widget samples with a full URL', () => {
    expect(fixture.componentInstance.widgetSamplesUrl).toBe(
      new URL('documentation/po-widget?view=web', document.baseURI).href
    );
  });

  it('openWidgetSamples: should navigate to the po-widget samples', () => {
    fixture.componentInstance.openWidgetSamples();
    expect(router.navigate).toHaveBeenCalledWith(['/documentation/po-widget'], { queryParams: { view: 'web' } });
  });

  it('should format the table values in the Brazilian format (R$ 1.280,00)', () => {
    expect(fixture.debugElement.injector.get(LOCALE_ID)).toBe('pt');
    expect(
      new CurrencyPipe(fixture.debugElement.injector.get(LOCALE_ID)).transform(1280, 'BRL', 'symbol', '1.2-2')
    ).toBe('R$\u00a01.280,00');
  });
});
