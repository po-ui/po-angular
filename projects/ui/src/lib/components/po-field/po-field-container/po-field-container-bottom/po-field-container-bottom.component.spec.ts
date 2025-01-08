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
        showAdditionalHelp: new SimpleChange(false, true, true)
      };

      component.poTooltip = { toggleTooltipVisibility: jasmine.createSpy() } as any;
      spyOn(component.additionalHelp, 'emit');
    });

    describe('ngOnChanges', () => {
      it('should emit `p-additional-help` event if `p-additional-help-tooltip` is not defined', () => {
        (component as any).isInitialChange = false;
        component.additionalHelpTooltip = null;
        component.ngOnChanges(changes);

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should toggle the visibility of `p-additional-help-tooltip` is defined', () => {
        (component as any).isInitialChange = false;
        component.additionalHelpTooltip = 'Mensagem de apoio complementar.';
        component.showAdditionalHelp = true;
        component.ngOnChanges(changes);

        expect(component.poTooltip.toggleTooltipVisibility).toHaveBeenCalledWith(true);
      });

      it('should not emit the `p-additional-help` event or display `p-additional-help-tooltip` at initialization', () => {
        (component as any).isInitialChange = true;
        component.ngOnChanges(changes);

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.poTooltip.toggleTooltipVisibility).not.toHaveBeenCalled();
      });
    });
  });
});
