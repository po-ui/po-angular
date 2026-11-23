import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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

  it('should render the avatar group with a tag, the checkbox group and the donut chart', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.home-statement-team po-avatar').length).toBe(3);
    expect(element.querySelector('.home-statement-team po-tag').getAttribute('p-value')).toBe('Open source');
    expect(element.querySelector('.home-statement-checkbox po-checkbox-group')).toBeTruthy();
    expect(element.querySelector('.home-statement-chart po-chart').getAttribute('p-type')).toBe('donut');
  });

  it('should start with po-widget checked and a chart serie per type', () => {
    expect(fixture.componentInstance.favorites).toEqual(['po-widget']);
    expect(fixture.componentInstance.chartSeries.length).toBe(4);
  });

  it('should render a po-widget with tag, title, action, help and body', () => {
    const widget: HTMLElement = fixture.nativeElement.querySelector('po-widget.home-statement-widget');
    expect(widget.getAttribute('p-tag')).toBe('Componente');
    expect(widget.getAttribute('p-title')).toBe('po-widget');
    expect(widget.getAttribute('p-primary-label')).toBe('Ver exemplos');
    expect(widget.querySelector('.home-statement-widget-body').textContent.trim()).not.toBe('');
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
});
