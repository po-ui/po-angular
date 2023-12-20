import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PoBreadcrumbComponent } from './po-breadcrumb.component';
import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

@Component({ template: 'Documentation' })
export class DocumentationComponent {}

@Component({ template: 'Guides' })
export class GuidesComponent {}

export const routes: Routes = [
  { path: 'guides', component: GuidesComponent },
  { path: 'documentation', component: DocumentationComponent }
];

describe('PoBreadcrumbComponent:', () => {
  let component: PoBreadcrumbComponent;
  let fixture: ComponentFixture<PoBreadcrumbComponent>;
  let nativeElement;

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

      spyOn(fakeThis, <any>'_breadcrumbItemsLenght');

      component[calcBreadcrumbItemsWidth].call(fakeThis);

      expect(fakeThis._breadcrumbItemsLenght).toBe(100 + 150 + 16);
    });

    it('enableBreadcrumbResponsive: should call when width of the items is greater than breadcrumb.', () => {
      const fakeThis = createFakeThis(300);

      spyOn(fakeThis, 'enableBreadcrumbResponsive');
      component[calcBreadcrumb].call(fakeThis);

      expect(fakeThis.enableBreadcrumbResponsive).toHaveBeenCalled();
    });

    it('enableBreadcrumbResponsive: shouldn`t call when width of the breadcrumb is greater than items.', () => {
      const fakeThis = createFakeThis(400);

      spyOn(fakeThis, 'enableBreadcrumbResponsive');
      component[calcBreadcrumb].call(fakeThis);

      expect(fakeThis.enableBreadcrumbResponsive).not.toHaveBeenCalled();
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

      spyOn(fakeThis, 'getBreadcrumbTooltipWidth').and.returnValue(500);

      component[calcBreadcrumb].call(fakeThis);

      expect(fakeThis.hiddenLiteralFavorite).toBeTruthy();
    });

    it('emitAction: should emit item action.', () => {
      const item = { label: 'teste', action: () => {}, link: '/test' };
      spyOn(item, 'action');
      component.emitAction(item);

      expect(item.action).toHaveBeenCalled();
    });

    it('openPopup: should open popup if event is "Enter"', () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Enter' };
      spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(fakeThis.popupContainer.open).toHaveBeenCalled();
    });

    it('openPopup: should open popup if event is "Space"', () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Space' };
      spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(fakeThis.popupContainer.open).toHaveBeenCalled();
    });

    it(`openPopup: shouldn't open popup if event is not "Space" or "Enter"`, () => {
      const fakeThis = { popupContainer: { open: () => {} } };
      const fakeEvent = { code: 'Tab' };
      spyOn(fakeThis.popupContainer, 'open');
      component.openPopup.call(fakeThis, fakeEvent);
      expect(fakeThis.popupContainer.open).not.toHaveBeenCalled();
    });

    it(`closePopUp: should focus in Svg More`, () => {
      const fakeThis = { svgTarget: { nativeElement: { focus: () => {} } } };
      spyOn(fakeThis.svgTarget.nativeElement, 'focus');
      component.closePopUp.call(fakeThis);
      expect(fakeThis.svgTarget.nativeElement.focus).toHaveBeenCalled();
    });

    describe('debounceResize:', () => {
      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is false and breadcrumb width is equal 0.`, fakeAsync(() => {
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        component['debounceResize']();
        tick(70);

        expect(component['hiddenWithoutResize']).toBeTruthy();
      }));

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is false, hiddenWithoutResize is false and breadcrumb width is equal 0.`, fakeAsync(() => {
        component['calculatedElement'] = false;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        spyOn(component, <any>'calcBreadcrumb');
        component['debounceResize']();

        tick(70);

        expect(component['calcBreadcrumb']).toHaveBeenCalled();
      }));

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is true and breadcrumb width is equal 0.`, fakeAsync(() => {
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = true;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        spyOn(component, <any>'calcBreadcrumb');
        component['debounceResize']();

        tick(70);

        expect(component['calcBreadcrumb']).toHaveBeenCalled();
      }));

      it(`should call 'clearTimeout' and set 'hiddenWithoutResize' to true
        when calculatedElement is true, hiddenWithoutResize is false and breadcrumb width is diff 0.`, fakeAsync(() => {
        component['calculatedElement'] = true;
        component['hiddenWithoutResize'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 1
        });

        spyOn(component, <any>'calcBreadcrumb');

        component['debounceResize']();

        tick(70);

        expect(component['calcBreadcrumb']).toHaveBeenCalled();
      }));

      it('should called when window resize.', () => {
        spyOn(component, <any>'debounceResize');
        component['initializeResizeListener']();
        window.dispatchEvent(eventResize);

        expect(component[debounceResize]).toHaveBeenCalled();
      });
    });

    it('getBreadcrumbWidth: should return 0 when don`t have breadcrumb.', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector) {
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
            querySelector: function (selector) {
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
            querySelector: function (selector) {
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
            querySelector: function (selector) {
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
            querySelector: function (selector) {
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

        spyOn(component, <any>'initBreadcrumbSize');

        component.ngDoCheck();

        expect(component['initBreadcrumbSize']).toHaveBeenCalled();
      });

      it('ngDoCheck: shouldn`t call `initBreadcrumbSize` when breadcrumb is already calculated', () => {
        component['calculatedElement'] = true;

        spyOn(component, <any>'initBreadcrumbSize');

        component.ngDoCheck();

        expect(component['initBreadcrumbSize']).not.toHaveBeenCalled();
      });

      it('ngDoCheck: shouldn`t call `initBreadcrumbSize` when breadcrumb has width 0', () => {
        component['calculatedElement'] = false;
        Object.defineProperty(component.breadcrumbElement.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        spyOn(component, <any>'initBreadcrumbSize');

        component.ngDoCheck();

        expect(component['initBreadcrumbSize']).not.toHaveBeenCalled();
      });

      it('ngDoCheck: should call `debounceResize` and set `hiddenWithoutResize` as `false` if `hiddenWithoutResize` is true', () => {
        component['hiddenWithoutResize'] = true;

        spyOn(component, <any>'debounceResize');

        component.ngDoCheck();

        expect(component['debounceResize']).toHaveBeenCalled();
        expect(component['hiddenWithoutResize']).toBe(false);
      });

      it('ngDoCheck: shouldn`t call `debounceResize` if `hiddenWithoutResize` is false', () => {
        component['hiddenWithoutResize'] = false;

        spyOn(component, <any>'debounceResize');

        component.ngDoCheck();

        expect(component['debounceResize']).not.toHaveBeenCalled();
      });

      it('ngDoCheck: should call `checkChangeOnItems`', () => {
        spyOn(component, <any>'checkChangeOnItems');

        component.ngDoCheck();

        expect(component['checkChangeOnItems']).toHaveBeenCalled();
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

      spyOn(fakeThis, <any>'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(fakeThis['calcBreadcrumbItemsWidth']).toHaveBeenCalled();
      expect(fakeThis.calculatedElement).toBe(false);
    });

    it('checkChangeOnItems: shouldn`t call `calcBreadcrumbItemsWidth` if doesn`t have differ', () => {
      const fakeThis = {
        differ: undefined,
        calcBreadcrumbItemsWidth: () => {}
      };

      spyOn(fakeThis, <any>'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(fakeThis['calcBreadcrumbItemsWidth']).not.toHaveBeenCalled();
    });

    it('checkChangeOnItems: shouldn`t call `calcBreadcrumbItemsWidth` if `differ` returns false', () => {
      const fakeThis = {
        differ: {
          diff: (opt: any) => false
        },
        calcBreadcrumbItemsWidth: () => {}
      };

      spyOn(fakeThis, <any>'calcBreadcrumbItemsWidth');

      component['checkChangeOnItems'].call(fakeThis);

      expect(fakeThis['calcBreadcrumbItemsWidth']).not.toHaveBeenCalled();
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

      spyOn(component, <any>'getBreadcrumbWidth').and.returnValue(300);

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
    getBreadcrumbWidth: breadcrumbFavorite => breadWidth,
    _breadcrumbItemsLenght: 300,
    favoriteService: 'http://fakeUrlPo.com',
    enableBreadcrumbResponsive: () => {},
    disableBreadcrumbResponsive: () => {},
    existsFavoritelabel: () => {},
    getBreadcrumbTooltipWidth: () => {}
  };
}
