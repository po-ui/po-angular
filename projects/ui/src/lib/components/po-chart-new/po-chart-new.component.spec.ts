import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import { PoChartNewBaseComponent } from './po-chart-new-base.component';
import { PoChartNewComponent } from './po-chart-new.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoColorService } from '../../services/po-color/po-color.service';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartOptions } from '../po-chart/interfaces/po-chart-options.interface';
import { PoTooltipDirective } from '../../directives';
import { PoModalComponent } from '../po-modal';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

class EChartsMock {
  setOption = jasmine.createSpy('setOption');
  resize = jasmine.createSpy('resize');
  dispose = jasmine.createSpy('dispose');
  clear = jasmine.createSpy('clear');
  getDataURL = jasmine.createSpy('getDataURL').and.returnValue('data:image/png;base64,mock');
  getOption = jasmine.createSpy('getOption').and.returnValue({
    xAxis: [{ data: ['Jan', 'Fev', 'Mar'] }],
    series: [{ name: 'Serie 1', data: [1, 2, 3] }]
  });
  on = jasmine.createSpy('on');
}

describe('PoChartNewComponent', () => {
  let component: PoChartNewComponent;
  let fixture: ComponentFixture<PoChartNewComponent>;
  let colorService: PoColorService;
  let languageService: PoLanguageService;

  const mockSeries: Array<PoChartSerie> = [{ label: 'Serie 1', data: [1, 2, 3], type: PoChartType.Column }];
  const mockCategories = ['Jan', 'Fev', 'Mar'];
  const mockOptions: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 100,
      gridLines: 5
    },
    legend: true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoChartNewComponent, PoTooltipDirective, PoModalComponent],
      providers: [
        CurrencyPipe,
        DecimalPipe,
        PoColorService,
        PoLanguageService,
        { provide: PoChartNewBaseComponent, useValue: {} }
      ]
    }).compileComponents();

    // Mock global do echarts
    window['echarts'] = {
      init: () => new EChartsMock()
    };
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartNewComponent);
    component = fixture.componentInstance;
    colorService = TestBed.inject(PoColorService);
    languageService = TestBed.inject(PoLanguageService);

    component.series = mockSeries;
    component.categories = mockCategories;
    component.options = mockOptions;
    component.height = 400;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
