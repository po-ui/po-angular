import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from '../../../../../util-test/util-expect.spec';
import { PoTooltipModule } from '../../../../../directives/po-tooltip/po-tooltip.module';

import { PoChartGaugeSerie } from '../po-chart-gauge-series.interface';
import { PoChartGaugeTextContentComponent } from './po-chart-gauge-text-content.component';

describe('PoChartGaugeTextContentComponent:', () => {
  let component: PoChartGaugeTextContentComponent;
  let fixture: ComponentFixture<PoChartGaugeTextContentComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTooltipModule],
      declarations: [PoChartGaugeTextContentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartGaugeTextContentComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoChartGaugeTextContentComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('maxDescriptionWidth: should return the subtraction between `gaugeWidth` and gauge path width plus padding', () => {
      component['gaugeWidth'] = 200;

      expect(component.maxDescriptionWidth).toEqual({ 'max-width': `152px` });
    });

    it('serie: should set `serieValueConverted` with value serie value converted', () => {
      const serie: PoChartGaugeSerie = {
        value: 12.56,
        description: 'test'
      };

      const expectedserieValueConverted = '12,6%';

      component.serie = serie;

      expect(component.serie).toEqual(serie);
      expect(component['serieValueConverted']).toBe(expectedserieValueConverted);
    });

    it('serie: should set serie to undefined if `serie` is undefined', () => {
      const serie = undefined;

      component.serie = serie;

      expect(component.serie).toBe(undefined);
    });
  });

  describe('Methods:', () => {
    it(`hasSerieDescription: should return true if have 'serie.description'`, () => {
      component.serie = { value: 30, description: 'Thirty' };

      expect(component.hasSerieDescription).toBeTruthy();
    });

    it(`hasSerieDescription: should return false if not have 'serie.description'`, () => {
      component.serie = { value: 30, description: undefined };

      expect(component.hasSerieDescription).toBeFalsy();
    });

    it(`hasSerieDescription: should return false if not have 'serie'`, () => {
      component.serie = undefined;

      expect(component.hasSerieDescription).toBeFalsy();
    });

    it(`hasSerieValue: should return true if have 'serie.value'`, () => {
      component.serie = { value: 30 };

      expect(component.hasSerieValue).toBeTruthy();
    });

    it(`hasSerieValue: should return false if 'serie.value' is undefined`, () => {
      component.serie = { value: undefined };

      expect(component.hasSerieValue).toBeFalsy();
    });

    it(`hasSerieValue: should return false if 'serie' is undefined`, () => {
      component.serie = undefined;

      expect(component.hasSerieValue).toBeFalsy();
    });

    it(`hasSerieValue: should return false if 'serie.value' is negative value`, () => {
      component.serie = { value: -1 };

      expect(component.hasSerieValue).toBeFalsy();
    });

    it(`ngAfterViewInit: should call 'checkTextDescriptionSize'`, () => {
      const spyOncheckTextDescriptionSize = spyOn(component, <any>'checkTextDescriptionSize');
      component.ngAfterViewInit();

      expect(spyOncheckTextDescriptionSize).toHaveBeenCalled();
    });

    it(`ngAfterViewInit: shouldn´t call 'isEllipsisActive' if not have 'descriptionElement'.`, () => {
      component['descriptionElement'] = undefined;

      const spyOnIsEllipsisActive = spyOn(component, <any>'isEllipsisActive');
      component.ngAfterViewInit();

      expect(spyOnIsEllipsisActive).not.toHaveBeenCalled();
    });

    it('convertValueInPercentFormat: should return value with percent format', () => {
      expect(component['convertValueInPercentFormat'](12.56)).toBe('12,6%');
      expect(component['convertValueInPercentFormat'](12)).toBe('12%');
      expect(component['convertValueInPercentFormat'](12.6)).toBe('12,6%');
      expect(component['convertValueInPercentFormat'](0)).toBe('0%');
    });

    it(`isEllipsisActive: should return 'serie.description' if 'offsetWidth' is less than 'scrollWidth'.`, () => {
      const fakeThis = {
        descriptionElement: {
          nativeElement: {
            offsetWidth: 9,
            scrollWidth: 10
          }
        },
        serie: {
          description: 'description'
        }
      };

      expect(component['isEllipsisActive'].call(fakeThis)).toBe(fakeThis.serie.description);
    });

    it(`isEllipsisActive: should return undefined if 'offsetWidth' is equal to 'scrollWidth'.`, () => {
      const fakeThis = {
        descriptionElement: {
          nativeElement: {
            offsetWidth: 10,
            scrollWidth: 10
          }
        },
        serie: {
          description: 'description'
        }
      };

      expect(component['isEllipsisActive'].call(fakeThis)).toBeUndefined();
    });

    it(`isEllipsisActive:  should return undefined if 'offsetWidth' is bigger than 'scrollWidth'.`, () => {
      const fakeThis = {
        descriptionElement: {
          nativeElement: {
            offsetWidth: 11,
            scrollWidth: 10
          }
        },
        serie: {
          description: 'description'
        }
      };

      expect(component['isEllipsisActive'].call(fakeThis)).toBeUndefined();
    });

    it(`checkTextDescriptionSize: should set 'tooltip' and 'changeDetector.detectChanges'
    if 'descriptionElement' has value`, fakeAsync(() => {
      component.serie = { value: 30, description: 'Thirty' };
      component['descriptionElement'] = { nativeElement: { offsetWidth: 200, scrollWidth: 300 } };

      spyOn(component['changeDetection'], 'detectChanges');

      component['checkTextDescriptionSize']();

      tick();

      expect(component.tooltip).toBe('Thirty');
      expect(component['changeDetection'].detectChanges).toHaveBeenCalled();
    }));

    it(`checkTextDescriptionSize: shouldn't set 'tooltip' neither call
    'changeDetector.detectChanges' if 'descriptionElement' is undefined`, fakeAsync(() => {
      component.serie = { value: 30, description: 'Thirty' };
      component['descriptionElement'] = undefined;

      spyOn(component['changeDetection'], 'detectChanges');

      component['checkTextDescriptionSize']();

      tick();

      expect(component['changeDetection'].detectChanges).not.toHaveBeenCalled();
      expect(component.tooltip).toBeUndefined();
    }));
  });

  describe('Templates:', () => {
    it(`should contain 'po-chart-gauge-text-content' and 'po-chart-gauge-text-value' if 'hasSerieValue' is true.`, () => {
      component.serie = { value: 30, description: 'describe' };

      fixture.detectChanges();
      const gaugeTextContent = nativeElement.querySelectorAll('.po-chart-gauge-text-content');
      const gaugeTextValue = nativeElement.querySelectorAll('.po-chart-gauge-text-value');

      expect(gaugeTextContent).toBeTruthy();
      expect(gaugeTextValue).toBeTruthy();
    });

    it(`shouldn't contain 'po-chart-gauge-text-content' and 'po-chart-gauge-text-value' if 'hasSerieValue' is false.`, () => {
      component.serie = undefined;

      fixture.detectChanges();
      const gaugeTextContent = nativeElement.querySelector('.po-chart-gauge-text-content');
      const gaugeTextValue = nativeElement.querySelector('.po-chart-gauge-text-value');

      expect(gaugeTextContent).toBeNull();
      expect(gaugeTextValue).toBeNull();
    });

    it(`should contain 'po-chart-gauge-text-description' if 'hasSerieDescription' is true.`, () => {
      component.serie = { value: 30, description: 'describe' };

      fixture.detectChanges();
      const gaugeTextDescription = nativeElement.querySelectorAll('.po-chart-gauge-text-description');

      expect(gaugeTextDescription).toBeTruthy();
    });

    it(`shouldn't contain 'po-chart-gauge-text-description' if 'hasSerieDescription' is false.`, () => {
      component.serie = { value: 30, description: undefined };

      fixture.detectChanges();
      const gaugeTextDescription = nativeElement.querySelector('.po-chart-gauge-text-description');

      expect(gaugeTextDescription).toBeNull();
    });
  });
});
