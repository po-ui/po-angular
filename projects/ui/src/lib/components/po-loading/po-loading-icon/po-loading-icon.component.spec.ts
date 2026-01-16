import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoLoadingIconComponent } from './po-loading-icon.component';
import { PoLoadingModule } from '../po-loading.module';
import { LOADING_ICON_COMPONENT } from './po-loading-icon-component-injection-token';
import { LoadingIconComponent } from '../interfaces/po-loading-icon-component';

@Component({
  selector: 'po-custom-loading-icon',
  template: '<div class="custom-loading-icon custom-loading-{{ size }}">Custom Loading</div>',
  standalone: true
})
class CustomLoadingIconComponent implements LoadingIconComponent {
  size: string = 'md';
}

describe('PoLoadingIconComponent', () => {
  let component: PoLoadingIconComponent;
  let fixture: ComponentFixture<PoLoadingIconComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLoadingIconComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingIconComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('p-neutral-color: should update property with valid values', () => {
      const validValuesTrue = [true, 'true', 1, ''];
      const validValuesFalse = [false, 'false', 0];

      expectPropertiesValues(component, 'neutralColor', validValuesTrue, true);
      expectPropertiesValues(component, 'neutralColor', validValuesFalse, false);
    });

    it('p-neutral-color: should update property with false if it receives an invalid values', () => {
      const invalidValues = [null, undefined, NaN, 'teste'];

      expectPropertiesValues(component, 'neutralColor', invalidValues, false);
    });

    it('p-size: should update property with valid values and update createdRef instance size if it exists', () => {
      component.inOverlay = true;
      component['createdRef'] = {
        instance: { size: '' },
        destroy: jasmine.createSpy('destroy')
      } as any;

      component.size = 'lg';

      expect(component.size).toBe('lg');
      expect(component['createdRef'].instance.size).toBe('lg');
    });

    it('p-size: should update property without error if createdRef does not exist', () => {
      component.size = 'sm';

      expect(component.size).toBe('sm');
      expect(component['createdRef']).toBeUndefined();
    });

    it('p-in-overlay: should set inOverlay property', () => {
      component.inOverlay = true;

      expect(component.inOverlay).toBe(true);
    });
  });

  describe('Methods', () => {
    describe('ngAfterViewInit', () => {
      it('should not create custom component when loadingIconComponent is not provided', () => {
        component.inOverlay = true;

        fixture.detectChanges();

        expect(component['createdRef']).toBeUndefined();
      });

      it('should not throw error when loadingContainer is not available', () => {
        component.inOverlay = true;
        component['loadingContainer'] = undefined;

        expect(() => {
          fixture.detectChanges();
          component.ngAfterViewInit();
        }).not.toThrow();

        expect(component['createdRef']).toBeUndefined();
      });
    });

    describe('ngOnDestroy', () => {
      it('should destroy createdRef if it exists', () => {
        component['createdRef'] = {
          instance: { size: 'md' },
          destroy: jasmine.createSpy('destroy')
        } as any;

        component.ngOnDestroy();

        expect(component['createdRef'].destroy).toHaveBeenCalled();
      });

      it('should not throw error if createdRef does not exist', () => {
        expect(() => component.ngOnDestroy()).not.toThrow();
      });
    });
  });

  describe('Templates', () => {
    it('should contain `po-loading-svg-xs` size is `xs`', () => {
      component.size = 'xs';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-loading-svg-xs')).toBeTruthy();
    });

    it('should contain `po-loading-svg-sm` size is `sm`', () => {
      component.size = 'sm';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-loading-svg-sm')).toBeTruthy();
    });

    it('should contain `po-loading-svg-md` size is `md`', () => {
      component.size = 'md';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-loading-svg-md')).toBeTruthy();
    });

    it('should contain `po-loading-svg-lg` size is `lg`', () => {
      component.size = 'lg';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-loading-svg-lg')).toBeTruthy();
    });

    it('should contain `po-loading-svg-md` size is invalid value', () => {
      component.size = 'huge';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-loading-svg-md')).toBeTruthy();
    });

    it('should render default loading icon when inOverlay is false', () => {
      component.inOverlay = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-icon-container')).toBeTruthy();
      expect(nativeElement.querySelector('svg')).toBeTruthy();
    });

    it('should render default loading icon when loadingIconComponent is not provided', () => {
      component.inOverlay = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-icon-container')).toBeTruthy();
      expect(nativeElement.querySelector('svg')).toBeTruthy();
    });
  });
});

describe('PoLoadingIconComponent with custom component', () => {
  let component: PoLoadingIconComponent;
  let fixture: ComponentFixture<PoLoadingIconComponent>;
  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule],
      providers: [{ provide: LOADING_ICON_COMPONENT, useValue: CustomLoadingIconComponent }]
    });

    fixture = TestBed.createComponent(PoLoadingIconComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  describe('Methods', () => {
    describe('ngAfterViewInit', () => {
      it('should create custom component when loadingIconComponent, loadingContainer and inOverlay are true', () => {
        component.inOverlay = true;
        component.size = 'lg';

        fixture.detectChanges();

        expect(component['createdRef']).toBeDefined();
        expect(component['createdRef'].instance).toBeDefined();
        expect(component['createdRef'].instance.size).toBe('lg');
      });

      it('should not create custom component when inOverlay is false', () => {
        component.inOverlay = false;

        fixture.detectChanges();

        expect(component['createdRef']).toBeUndefined();
      });

      it('should clear loadingContainer before creating custom component', () => {
        component.inOverlay = true;

        fixture.detectChanges();

        expect(component['loadingContainer']).toBeDefined();
        expect(component['createdRef']).toBeDefined();
      });

      it('should call clear and createComponent on loadingContainer', () => {
        component.inOverlay = true;

        // Detecta mudanças primeiro para inicializar o ViewChild
        fixture.detectChanges();

        // Destroi o componente criado anteriormente
        if (component['createdRef']) {
          component['createdRef'].destroy();
          component['createdRef'] = undefined;
        }

        // Cria spies após o ViewChild estar disponível
        const clearSpy = spyOn(component['loadingContainer'], 'clear');
        const createComponentSpy = spyOn(component['loadingContainer'], 'createComponent').and.returnValue({
          instance: { size: 'md' },
          destroy: jasmine.createSpy('destroy')
        } as any);

        // Chama ngAfterViewInit novamente
        component.ngAfterViewInit();

        expect(clearSpy).toHaveBeenCalled();
        expect(createComponentSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Templates', () => {
    it('should render custom loading icon when inOverlay is true and loadingIconComponent is provided', () => {
      component.inOverlay = true;
      component.size = 'sm';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.custom-loading-icon')).toBeTruthy();
      expect(nativeElement.querySelector('.custom-loading-sm')).toBeTruthy();
      expect(nativeElement.querySelector('.po-loading-icon-container')).toBeFalsy();
    });

    it('should not render default loading icon when custom component is rendered', () => {
      component.inOverlay = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-icon-container')).toBeFalsy();
      expect(nativeElement.querySelector('.custom-loading-icon')).toBeTruthy();
    });

    it('should render default loading icon when inOverlay is false even with custom component provided', () => {
      component.inOverlay = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-icon-container')).toBeTruthy();
      expect(nativeElement.querySelector('svg')).toBeTruthy();
      expect(nativeElement.querySelector('.custom-loading-icon')).toBeFalsy();
    });
  });
});
