import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoBreadcrumbComponent } from './po-breadcrumb.component';
import { PoBreadcrumbDropdownComponent } from './po-breadcrumb-dropdown/po-breadcrumb-dropdown.component';
import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';
import { PoBreadcrumbItemComponent } from './po-breadcrumb-item/po-breadcrumb-item.component';

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
  const enableBreadcrumbResponsive = 'enableBreadcrumbResponsive';
  const wasClickedonDropdown = 'wasClickedonDropdown';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        PoBreadcrumbComponent,
        PoBreadcrumbDropdownComponent,
        PoBreadcrumbFavoriteComponent,
        PoBreadcrumbItemComponent,
        DocumentationComponent,
        GuidesComponent
      ],
      providers: [HttpClient, HttpHandler]
    });
  });

  beforeEach(() => {
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

    it('toggleDropdown: should set `showDropdown` to `false` when called.', () => {
      component.showDropdown = true;
      component.toggleDropdown();
      expect(component.showDropdown).toBeFalsy(false);
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

    it('getBreadcrumbWidth: should return value breadcrumb legth', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector) {
              return { offsetWidth: 200 };
            }
          }
        }
      };

      expect(component['getBreadcrumbWidth'].call(fakeThis, 50)).toBe(150);
    });

    it('initializeClickoutListener: should call `renderer.listen` with params', () => {
      spyOn(component.renderer, <any>'listen');

      component['initializeClickoutListener']();

      expect(component.renderer.listen).toHaveBeenCalledWith('document', 'click', component[wasClickedonDropdown]);
    });

    it('wasClickedonDropdown: should call `removeClickoutListener` if `checkClickOutElement` returned true', () => {
      component.showDropdown = true;
      const event: any = {
        target: ''
      };

      spyOn(component, <any>'removeClickoutListener');
      spyOn(component, <any>'checkClickOutElement').and.returnValue(true);

      component[wasClickedonDropdown](event);

      expect(component.showDropdown).toBe(false);
      expect(component['checkClickOutElement']).toHaveBeenCalled();
      expect(component['removeClickoutListener']).toHaveBeenCalled();
    });

    it('wasClickedonDropdown: should not call `removeClickoutListener` if `checkClickOutElement` returned false', () => {
      component.showDropdown = true;
      const event: any = {
        target: ''
      };

      spyOn(component, <any>'removeClickoutListener');
      spyOn(component, <any>'checkClickOutElement').and.returnValue(false);

      component[wasClickedonDropdown](event);

      expect(component.showDropdown).toBe(true);
      expect(component['removeClickoutListener']).not.toHaveBeenCalled();
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

  describe('Properties:', () => {
    it('showDropdown: should set to `false` when click in breadcrumb item.', () => {
      const breadcrumbitem = nativeElement.querySelector('po-breadcrumb-item');
      component[enableBreadcrumbResponsive]();
      component.showDropdown = true;
      fixture.detectChanges();

      breadcrumbitem.dispatchEvent(eventClick);

      fixture.detectChanges();
      component[wasClickedonDropdown](eventClick);

      expect(component.showDropdown).toBeFalsy();
    });

    it('showDropdown: should set to `false` when click in dropdown.', () => {
      spyOn(component, <any>'getBreadcrumbWidth').and.returnValue(300);

      component['calcBreadcrumb']();

      component.toggleDropdown();

      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('po-breadcrumb-dropdown');
      dropdown.click();

      expect(component.showDropdown).toBe(false);
      expect(component['getBreadcrumbWidth']).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should enable breadcrumb responsive', () => {
      const itemsView = [
        { label: 'Teste nível 3', link: '/test/nivel/3' },
        { label: 'Teste nível 4', link: '/test/nivel/4' }
      ];

      const dropdownItems = [
        { label: 'Teste nível 2', link: '/test/nivel/2' },
        { label: 'Teste nível 1', link: '/test/nivel/1' }
      ];

      spyOn(component, <any>'getBreadcrumbWidth').and.returnValue(300);

      component['calcBreadcrumb']();

      fixture.detectChanges();

      expect(component.itemsView).toEqual(itemsView);
      expect(component.dropdownItems).toEqual(dropdownItems);
      expect(component.showDropdownToggle).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-icon-more')).toBeTruthy();
      expect(component['getBreadcrumbWidth']).toHaveBeenCalled();
    });

    it('should disable breadcrumb responsive', () => {
      component['calculatedElement'] = true;
      component[disableBreadcrumbResponsive]();

      expect(component.showDropdown).toBeFalsy();
      expect(component.showDropdownToggle).toBeFalsy();
      expect(nativeElement.querySelector('po-breadcrumb-dropdown')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-icon-more')).toBeFalsy();
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
    disableBreadcrumbResponsive: () => {}
  };
}
