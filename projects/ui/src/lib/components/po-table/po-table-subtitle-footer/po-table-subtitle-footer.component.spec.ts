import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';

import { poTableLiteralsDefault } from '../po-table-base.component';
import { PoTableModule } from '../po-table.module';
import { PoTableSubtitleFooterComponent } from './po-table-subtitle-footer.component';

describe('PoTableSubtitleFooterComponent:', () => {
  let component: PoTableSubtitleFooterComponent;
  let fixture: ComponentFixture<PoTableSubtitleFooterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTableModule],
      providers: [PoColorPaletteService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableSubtitleFooterComponent);

    component = fixture.componentInstance;
    component.subtitles = [
      { value: 'Value11', label: 'Label11', color: 'color-11', content: 'Success Content' },
      { value: 'Value08', label: 'Label08', color: 'color-08', content: 'Warning Content' },
      { value: 'Value07', label: 'Label07', color: 'color-07', content: 'Danger Content' }
    ];

    component.literals = poTableLiteralsDefault.pt;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoTableSubtitleFooterComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    const eventResize = document.createEvent('Event');
    eventResize.initEvent('resize', false, true);

    it('ngAfterViewInit: should call `initializeResizeListener` and `debounceResize`', () => {
      spyOn(component, <any>'initializeResizeListener');
      spyOn(component, <any>'debounceResize');

      component.ngAfterViewInit();

      expect(component['initializeResizeListener']).toHaveBeenCalled();
      expect(component['debounceResize']).toHaveBeenCalled();
    });

    it('ngOnDestroy: should call `removeResizeListener`', () => {
      spyOn(component, <any>'removeResizeListener');

      component.ngOnDestroy();

      expect(component['removeResizeListener']).toHaveBeenCalled();
    });

    describe('ngDoCheck', () => {
      it(`should call 'toggleShowCompleteSubtitle' and set 'isVisible' to 'true' if 'getContainerSize' returns a value greater than 0
      and 'isVisible' is 'false'`, () => {
        component['isVisible'] = false;

        spyOn(component, <any>'getContainerSize').and.returnValue(100);
        spyOn(component, <any>'toggleShowCompleteSubtitle');

        component.ngDoCheck();

        expect(component['toggleShowCompleteSubtitle']).toHaveBeenCalled();
        expect(component['isVisible']).toBe(true);
      });

      it('shouldn`t call `toggleShowCompleteSubtitle` if `isVisible` is `true`', () => {
        component['isVisible'] = true;

        spyOn(component, <any>'toggleShowCompleteSubtitle');

        component.ngDoCheck();

        expect(component['toggleShowCompleteSubtitle']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `toggleShowCompleteSubtitle` if `getContainerSize` returns 0', () => {
        component['isVisible'] = false;

        spyOn(component, <any>'getContainerSize').and.returnValue(0);
        spyOn(component, <any>'toggleShowCompleteSubtitle');

        component.ngDoCheck();

        expect(component['toggleShowCompleteSubtitle']).not.toHaveBeenCalled();
      });
    });

    it('debounceResize: should call `toggleShowCompleteSubtitle`', fakeAsync(() => {
      spyOn(component, <any>'toggleShowCompleteSubtitle');

      component['debounceResize']();

      tick();

      expect(component['toggleShowCompleteSubtitle']).toHaveBeenCalled();
    }));

    it('getContainerSize: should return footer container offsetWidth', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelector: function (selector) {
              return { offsetWidth: 100 };
            }
          }
        }
      };
      expect(component['getContainerSize'].call(fakeThis)).toBe(100);
    });

    it('getItemsSize: should return footer container offsetWidth', () => {
      const fakeThis = {
        element: {
          nativeElement: {
            querySelectorAll: (x: any) => [{ offsetWidth: 100 }, { offsetWidth: 150 }]
          }
        }
      };

      expect(component['getItemsSize'].call(fakeThis)).toBe(100 + 150 + 16);
    });

    it('initializeResizeListener: should call `debounceResize` if window resize.', () => {
      spyOn(component, <any>'debounceResize');

      component['initializeResizeListener']();
      window.dispatchEvent(eventResize);

      expect(component['debounceResize']).toHaveBeenCalled();
    });

    it('removeResizeListener: should call `resizeListener`', () => {
      spyOn(component, <any>'resizeListener');

      component['removeResizeListener']();

      expect(component['resizeListener']).toHaveBeenCalled();
    });

    it('toggleShowCompleteSubtitle: should set `showSubtitle` to `true` if `getItemsSize` is greater than `getContainerSize`.', () => {
      spyOn(component, <any>'getContainerSize').and.returnValue(10);
      spyOn(component, <any>'getItemsSize').and.returnValue(20);

      component['toggleShowCompleteSubtitle']();

      expect(component['showSubtitle']).toBe(true);
    });

    it('toggleShowCompleteSubtitle: should set `showSubtitle` to `false` if `getItemsSize` is less than `getContainerSize`.', () => {
      spyOn(component, <any>'getContainerSize').and.returnValue(10);
      spyOn(component, <any>'getItemsSize').and.returnValue(8);

      component['toggleShowCompleteSubtitle']();

      expect(component['showSubtitle']).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should have three `po-table-subtitle-footer` if have three subtitles ', () => {
      const subtitles = fixture.debugElement.nativeElement.querySelectorAll('.po-table-subtitle-footer');

      expect(subtitles.length).toBe(3);
    });

    it('should show `po-table-show-subtitle` if `showSubtitle` is `true`', () => {
      component['showSubtitle'] = true;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-table-footer-show-subtitle')).toBeTruthy();
    });

    it('shouldn`t show `po-table-show-subtitle` if `showSubtitle` is `false`', () => {
      component['showSubtitle'] = false;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-table-footer-show-subtitle')).toBeNull();
    });
  });
});
