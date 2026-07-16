import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PoBreadcrumbComponent } from './po-breadcrumb.component';
import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

@Component({
  template: 'Documentation',
  standalone: false
})
export class DocumentationComponent {}

@Component({
  template: 'Guides',
  standalone: false
})
export class GuidesComponent {}

export const routes: Routes = [
  { path: 'guides', component: GuidesComponent },
  { path: 'documentation', component: DocumentationComponent }
];

describe('PoBreadcrumbComponent:', () => {
  let component: PoBreadcrumbComponent;
  let fixture: ComponentFixture<PoBreadcrumbComponent>;
  let nativeElement: any;

  const items: Array<PoBreadcrumbItem> = [
    { label: 'Teste nível 1', link: '/test/nivel/1' },
    { label: 'Teste nível 2', link: '/test/nivel/2' },
    { label: 'Teste nível 3', link: '/test/nivel/3' },
    { label: 'Teste nível 4', link: '/test/nivel/4' }
  ];

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initEvent('click', false, true);

  const calcBreadcrumb = 'calcBreadcrumb';
  const debounceResize = 'debounceResize';
  const disableBreadcrumbResponsive = 'disableBreadcrumbResponsive';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [PoBreadcrumbComponent, PoBreadcrumbFavoriteComponent, DocumentationComponent, GuidesComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(PoBreadcrumbComponent);
    component = fixture.componentInstance;
    component.items = items;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('calcBreadcrumbItemsWidth: should sum the legths of breadcrumbs items and set on `breadcrumbItemsLenght`.', () => {
      const calcBreadcrumbItemsWidth = 'calcBreadcrumbItemsWidth';
      const fakeThis = {
        element: {
          nativeElement: {
            querySelectorAll: (x: any) => [{ offsetWidth: 100 }, { offsetWidth: 150 }]
          }
        },
        _breadcrumbItemsLenght: 0
      };

      component[calcBreadcrumbItemsWidth].call(fakeThis);

      expect(fakeThis._breadcrumbItemsLenght).toBe(100 + 150 + 16);
    });

    it('enableBreadcrumbResponsive: should call when width of the items is greater than breadcrumb.', () => {
      const fakeThis = createFakeThis(300);

      const enableSpy = vi.spyOn(fakeThis, 'enableBreadcrumbResponsive');
      component[calcBreadcrumb].call(fakeThis);

      expect(enableSpy).toHaveBeenCalled();
    });

    it('enableBreadcrumbResponsive: shouldn`t call when width of the breadcrumb is greater than items.', () => {
      const fakeThis = createFakeThis(400);

      const enableSpy = vi.spyOn(fakeThis, 'enableBreadcrumbResponsive');
      component[calcBreadcrumb].call(fakeThis);

      expect(enableSpy).not.toHaveBeenCalled();
    });

    it('calcBreadcrumb: should set `hiddenLiteralFavorite` to true if tooltip is bigger than breadcrumb', () => {
      const fakeThis = {
        getBreadcrumbFavoriteWidth: () => 100,
        getBreadcrumbWidth: () => 100,
        _breadcrumbItemsLenght: 300,
        breadcrumbTooltip: 300,
        favoriteService: 'http://fakeUrlPo.com',
        enableBreadcrumbResponsive: () => {},
        disableBreadcrumbResponsive: () => {},
        existsFavoritelabel: () => {},
        getBreadcrumbTooltipWidth: () => 400,
        hiddenLiteralFavorite: false
      };

      vi.spyOn(fakeThis, 'getBreadcrumbTooltipWidth').mockReturnValue(500);

      component[calcBreadcrumb].call(fakeThis);

      expect(fakeThis.hiddenLiteralFavorite).toBeTruthy();
    });

    it('emitAction: should emit item action.', () => {
      const item = { label: 'teste', action: () => {}, link: '/test' };
      const actionSpy = vi.spyOn(item, 'action');
      component.emitAction(item);

      expect(actionSpy).toHaveBeenCalled();
    });

    it('openPopup: should open popup if event is "Enter"', () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Enter' };
      const openSpy = vi.spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(openSpy).toHaveBeenCalled();
    });

    it('openPopup: should open popup if event is "Space"', () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Space' };
      const openSpy = vi.spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(openSpy).toHaveBeenCalled();
    });

    it(`openPopup: shouldn't open popup if event is not "Space" or "Enter"`, () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Tab' };
      const openSpy = vi.spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(openSpy).not.toHaveBeenCalled();
    });

    it(`closePopUp: should focus in Svg More`, () => {
      const fakeThis = { svgTarget: { nativeElement: { focus: () => {} } } };
      const focusSpy = vi.spyOn(fakeThis.svgTarget.nativeElement, 'focus');
      component.closePopUp.call(fakeThis);
      expect(focusSpy).toHaveBeenCalled();
    });

    describe('debounceResize:', () => {
      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is false and breadcrumb width is equal 0.`, async () => {
        vi.useFakeTimers();
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        component['debounceResize']();
        vi.advanceTimersByTime(70);

        expect(component['hiddenWithoutResize']).toBeTruthy();
        vi.useRealTimers();
      });

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is false, hiddenWithoutResize is false and breadcrumb width is equal 0.`, async () => {
        vi.useFakeTimers();
        component['calculatedElement'] = false;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        const calcSpy = vi.spyOn(component as any, 'calcBreadcrumb');
        component['debounceResize']();

        vi.advanceTimersByTime(70);

        expect(calcSpy).toHaveBeenCalled();
        vi.useRealTimers();
      });

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is true and breadcrumb width is equal 0.`, async () => {
        vi.useFakeTimers();
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = true;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        const calcSpy = vi.spyOn(component as any, 'calcBreadcrumb');
        component['debounceResize']();

        vi.advanceTimersByTime(70);

        expect(calcSpy).toHaveBeenCalled();
        vi.useRealTimers();
      });

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is false and breadcrumb width is diff 0.`, async () => {
        vi.useFakeTimers();
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 1
        });

        const calcSpy = vi.spyOn(component as any, 'calcBreadcrumb');

        component['debounceResize']();

        vi.advanceTimersByTime(70);

        expect(calcSpy).toHaveBeenCalled();
        vi.useRealTimers();
      });

      it('should called when window resize.', () => {
        const debounceSpy = vi.spyOn(component as any, 'debounceResize');
        component['initializeResizeListener']();
        window.dispatchEvent(eventResize);

        expect(debounceSpy).toHaveBeenCalled();
      });
    });

    it('getBreadcrumbWidth: should return 0 when don`t have breadcrumb.', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector: any) {
              return { offsetWidth: 100 };
            }
          }
        },
        favoriteService: undefined
      };

      expect(component['getBreadcrumbFavoriteWidth'].call(fakeThis)).toBe(0);
    });

    it('getBreadcrumbTooltipWidth: should return 0 when don`t have tooltip.', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector: any) {
              return { offsetWidth: 100 };
            }
          }
        },
        favoriteService: undefined
      };

      expect(component['getBreadcrumbTooltipWidth'].call(fakeThis)).toBe(0);
    });

    it('getBreadcrumbTooltipWidth: should return widht when have tooltip.', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector: any) {
              return { offsetWidth: 100 };
            }
          }
        },
        favoriteService: true
      };

      expect(component['getBreadcrumbTooltipWidth'].call(fakeThis)).toBe(100);
    });

    it('getBreadcrumbWidth: should return a truthy value when have breadcrumb and favorite service.', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector: any) {
              return { offsetWidth: 100 };
            }
          }
        },
        favoriteService: 'http://fakeUrlPo.com'
      };

      expect(component['getBreadcrumbFavoriteWidth'].call(fakeThis)).toBe(120);
    });

    it('getBreadcrumbWidth: should return value breadcrumb lenght', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector: any) {
              return { offsetWidth: 200 };
            }
          }
        }
      };

      expect(component['getBreadcrumbWidth'].call(fakeThis, 50, true)).toBe(150);
    });

    describe('ngDoCheck:', () => {
      it('ngDoCheck: should call `initBreadcrumbSize` in first loading and if breadcrumb has width', () => {
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 500
        });

        const initSpy = vi.spyOn(component as any, 'initBreadcrumbSize');

        component.ngDoCheck();

        expect(initSpy).toHaveBeenCalled();
      });

      it('ngDoCheck: shouldn`t call `initBreadcrumbSize` when breadcrumb is already calculated', () => {
        component['calculatedElement'] = true;

        const initSpy = vi.spyOn(component as any, 'initBreadcrumbSize');

        component.ngDoCheck();

        expect(initSpy).not.toHaveBeenCalled();
      });

      it('ngDoCheck: shouldn`t call `initBreadcrumbSize` when breadcrumb has width 0', () => {
        component['calculatedElement'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        const initSpy = vi.spyOn(component as any, 'initBreadcrumbSize');

        component.ngDoCheck();

        expect(initSpy).not.toHaveBeenCalled();
      });

      it('ngDoCheck: should call `debounceResize` and set `hiddenWithoutResize` as `false` if `hiddenWithoutResize` is true', () => {
        component['hiddenWithoutResize'] = true;

        const debounceSpy = vi.spyOn(component as any, 'debounceResize');

        component.ngDoCheck();

        expect(debounceSpy).toHaveBeenCalled();
        expect(component['hiddenWithoutResize']).toBe(false);
      });

      it('ngDoCheck: shouldn`t call `debounceResize` if `hiddenWithoutResize` is false', () => {
        component['hiddenWithoutResize'] = false;

        const debounceSpy = vi.spyOn(component as any, 'debounceResize');

        component.ngDoCheck();

        expect(debounceSpy).not.toHaveBeenCalled();
      });

      it('ngDoCheck: should call `checkChangeOnItems`', () => {
        const checkSpy = vi.spyOn(component as any, 'checkChangeOnItems');

        component.ngDoCheck();

        expect(checkSpy).toHaveBeenCalled();
      });
    });

    it('checkChangeOnItems: should call `calcBreadcrumbItemsWidth` and set `calculatedElement` to true if has differ and changes', () => {
      const fakeThis = {
        differ: {
          diff: (opt: any) => true
        },
        calcBreadcrumbItemsWidth: () => {},
        calculatedElement: true
      };

      const calcSpy = vi.spyOn(fakeThis, 'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(calcSpy).toHaveBeenCalled();
      expect(fakeThis.calculatedElement).toBe(false);
    });

    it('checkChangeOnItems: shouldn`t call `calcBreadcrumbItemsWidth` if doesn`t have differ', () => {
      const fakeThis = {
        differ: undefined,
        calcBreadcrumbItemsWidth: () => {}
      };

      const calcSpy = vi.spyOn(fakeThis, 'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(calcSpy).not.toHaveBeenCalled();
    });

    it('checkChangeOnItems: shouldn`t call `calcBreadcrumbItemsWidth` if `differ` returns false', () => {
      const fakeThis = {
        differ: {
          diff: (opt: any) => false
        },
        calcBreadcrumbItemsWidth: () => {}
      };

      const calcSpy = vi.spyOn(fakeThis, 'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(calcSpy).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should enable breadcrumb responsive', () => {
      const itemsView = [
        { label: 'Teste nível 1', link: '/test/nivel/1' },
        { label: 'Teste nível 2', link: '/test/nivel/2' },
        { label: 'Teste nível 3', link: '/test/nivel/3' },
        { label: 'Teste nível 4', link: '/test/nivel/4' }
      ];

      vi.spyOn(component as any, 'getBreadcrumbWidth').mockReturnValue(300);
      vi.spyOn(component as any, 'getBreadcrumbFavoriteWidth').mockReturnValue(0);
      component['_breadcrumbItemsLenght'] = 500;

      component['calcBreadcrumb']();

      fixture.detectChanges();

      expect(component.itemsView).toEqual(itemsView);
      expect(component.showDropdownToggle).toBeTruthy();
    });

    it('should disable breadcrumb responsive', () => {
      component['calculatedElement'] = true;
      component[disableBreadcrumbResponsive]();

      expect(component.showDropdown).toBeFalsy();
      expect(component.showDropdownToggle).toBeFalsy();
    });
  });
});

function createFakeThis(breadWidth: number) {
  return {
    getBreadcrumbFavoriteWidth: () => 100,
    getBreadcrumbWidth: (breadcrumbFavorite: any) => breadWidth,
    _breadcrumbItemsLenght: 300,
    favoriteService: 'http://fakeUrlPo.com',
    enableBreadcrumbResponsive: () => {},
    disableBreadcrumbResponsive: () => {},
    existsFavoritelabel: () => {},
    getBreadcrumbTooltipWidth: () => {}
  };
}
