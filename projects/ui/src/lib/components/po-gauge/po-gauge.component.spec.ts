import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGaugeModule } from './po-gauge.module';
import { PoGaugeBaseComponent } from './po-gauge-base.component';
import { PoGaugeComponent } from './po-gauge.component';

describe('PoGaugeComponent', () => {
  let component: PoGaugeComponent;
  let fixture: ComponentFixture<PoGaugeComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoGaugeModule],
      declarations: [PoGaugeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugeComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof PoGaugeComponent).toBeTruthy();
    expect(component instanceof PoGaugeBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngDoCheck: should call `svgContainerSize` and set `isLoaded` if hasElementRef is true', () => {
      const spySvgContainerSize = spyOn(component, <any>'svgContainerSize');
      spyOnProperty(component, <any>'hasElementRef', 'get').and.returnValue(true);
      component['isLoaded'] = false;

      component.ngDoCheck();

      expect(component['isLoaded']).toBeTruthy();
      expect(spySvgContainerSize).toHaveBeenCalled();
    });

    it('ngDoCheck: shouldn`t call `svgContainerSize` neither set `isLoaded` if isLoaded is true', () => {
      const spySvgContainerSizes = spyOn(component, <any>'svgContainerSize');
      spyOnProperty(component, <any>'hasElementRef', 'get').and.returnValue(true);
      component['isLoaded'] = true;

      component.ngDoCheck();

      expect(spySvgContainerSizes).not.toHaveBeenCalled();
    });

    it('ngDoCheck: shouldn`t call `svgContainerSize` neither set `isLoaded` if hasElementRef is false', () => {
      const spySvgContainerSize = spyOn(component, <any>'svgContainerSize');
      spyOnProperty(component, <any>'hasElementRef', 'get').and.returnValue(false);
      component['isLoaded'] = false;

      component.ngDoCheck();

      expect(component['isLoaded']).toBeFalsy();
      expect(spySvgContainerSize).not.toHaveBeenCalled();
    });
  });

  describe('properties:', () => {
    it('hasRanges: should return true if ranges has length', () => {
      component.ranges = [{ from: 0, to: 100, label: 'Aprovado', color: 'green' }];

      expect(component.hasRanges).toBeTruthy();
    });

    it('hasRanges: should return false if ranges does not have length', () => {
      component.ranges = [];

      expect(component.hasRanges).toBeFalsy();
    });

    it('svgContainerSize: should apply value to svgContainer', () => {
      component.svgEl = { nativeElement: { offsetWidth: 200 } };
      component.titleEl = { nativeElement: { offsetHeight: 20 } };
      component.legendEl = { nativeElement: { offsetHeight: 20 } };
      component.descriptionEl = { nativeElement: { offsetHeight: 20 } };
      component.height = 200;

      component['svgContainerSize']();

      expect(component.svgContainer).toEqual({ width: 200, height: 192 });
    });

    it('svgContainerSize: should apply zero to elementRefs without nativeElement', () => {
      component.svgEl = { nativeElement: { offsetWidth: 200 } };
      component.titleEl = { nativeElement: undefined };
      component.legendEl = { nativeElement: undefined };
      component.descriptionEl = { nativeElement: undefined };
      component.height = 300;

      component['svgContainerSize']();

      expect(component.svgContainer).toEqual({ width: 200, height: 252 });
    });

    it('svgContainerSize: shouldn`t apply value to svgContainer if offsetWidth is undefined', () => {
      component.svgEl = { nativeElement: { offsetWidth: undefined } };
      component.height = 200;

      component['svgContainerSize']();

      expect(component.svgContainer).toBeUndefined();
    });

    it('svgContainerSize: shouldn`t apply value to svgContainer if svgEl is undefined', () => {
      component.svgEl = undefined;
      component.height = 200;

      component['svgContainerSize']();

      expect(component.svgContainer).toBeUndefined();
    });
  });

  describe('Template:', () => {
    it('should contain `po-gauge-title` class', () => {
      component.title = 'Title';
      component.value = 50;

      fixture.detectChanges();

      const title = nativeElement.querySelectorAll('.po-gauge-title');

      expect(title).toBeTruthy();
      expect(title.length).toBe(1);
    });

    it('shouldn`t contain `po-gauge-title` class', () => {
      component.value = 50;

      fixture.detectChanges();

      const title = nativeElement.querySelectorAll('.po-gauge-title');

      expect(title).toBeTruthy();
      expect(title.length).toBe(0);
    });
  });
});
