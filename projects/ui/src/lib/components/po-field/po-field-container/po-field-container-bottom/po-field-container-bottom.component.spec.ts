import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoFieldContainerBottomComponent } from './po-field-container-bottom.component';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('PoFieldContainerBottomComponent', () => {
  let component: PoFieldContainerBottomComponent;
  let fixture: ComponentFixture<PoFieldContainerBottomComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFieldContainerBottomComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show error pattern if no error pattern', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-icon-error')).toBeNull();
  });

  describe('Methods:', () => {
    let changes: SimpleChanges;

    beforeEach(() => {
      changes = {
        showHelperComponent: new SimpleChange(false, true, false)
      };

      (component as any).helperEl = {
        openHelperPopover: vi.fn(),
        closeHelperPopover: vi.fn()
      } as any;

      vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
      vi.spyOn(component as any, 'showHelperComponent').mockReturnValue(false);
    });

    describe('ngOnChanges', () => {
      it('should call `eventOnClick` when `showHelperComponent()` is true and `eventOnClick` is a function', () => {
        const eventOnClickSpy = vi.fn();
        (component as any).poHelperComponent.mockReturnValue({ eventOnClick: eventOnClickSpy });
        (component as any).showHelperComponent.mockReturnValue(true);
        component.ngOnChanges(changes);

        expect(eventOnClickSpy).toHaveBeenCalled();
        expect((component as any).helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect((component as any).helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });

      it('should open the popover when `showHelperComponent()` is true and `eventOnClick` is not a function', () => {
        (component as any).poHelperComponent.mockReturnValue({ eventOnClick: undefined });
        (component as any).showHelperComponent.mockReturnValue(true);
        component.ngOnChanges(changes);

        expect((component as any).helperEl.openHelperPopover).toHaveBeenCalled();
        expect((component as any).helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });

      it('should open the popover when `showHelperComponent()` is true and `poHelperComponent()` returns null/undefined', () => {
        (component as any).poHelperComponent.mockReturnValue(undefined);
        (component as any).showHelperComponent.mockReturnValue(true);
        component.ngOnChanges(changes);

        expect((component as any).helperEl.openHelperPopover).toHaveBeenCalled();
        expect((component as any).helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });

      it('should close the popover when `showHelperComponent()` is false', () => {
        (component as any).showHelperComponent.mockReturnValue(false);
        component.ngOnChanges(changes);

        expect((component as any).helperEl.closeHelperPopover).toHaveBeenCalled();
        expect((component as any).helperEl.openHelperPopover).not.toHaveBeenCalled();
      });

      it('should do nothing when `changes` does not contain `showHelperComponent`', () => {
        const otherChanges: SimpleChanges = {
          someOtherInput: new SimpleChange(undefined, 'x', false)
        };
        component.ngOnChanges(otherChanges);

        expect((component as any).helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect((component as any).helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });

      it('should not open/close the popover when `eventOnClick` is a function (since it returns after calling the function)', () => {
        const eventOnClickSpy = vi.fn();
        (component as any).poHelperComponent.mockReturnValue({ eventOnClick: eventOnClickSpy });
        (component as any).showHelperComponent.mockReturnValue(true);
        component.ngOnChanges(changes);

        expect(eventOnClickSpy).toHaveBeenCalled();
        expect((component as any).helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect((component as any).helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });
    });
  });
});
