import type { Mock } from 'vitest';
import { EventEmitter, NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoFieldContainerBottomComponent } from '../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoRichTextToolbarActions } from './enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextBodyComponent } from './po-rich-text-body/po-rich-text-body.component';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoRichTextComponent } from './po-rich-text.component';

describe('PoRichTextComponent:', () => {
  let component: PoRichTextComponent;
  let fixture: ComponentFixture<PoRichTextComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PoFieldContainerBottomComponent,
        PoFieldContainerComponent,
        PoRichTextBodyComponent,
        PoRichTextComponent,
        PoRichTextToolbarComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [BrowserAnimationsModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoRichTextComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('errorMsg:', () => {
      it('should return errorMessage if it`s not empty and if are required plus invalid', () => {
        component.errorMessage = 'Error Message';
        component.required = true;
        component.invalid = true;
        expect(component.errorMsg).toBe(component.errorMessage);
      });

      it('should return empty string if errorMessage is empty', () => {
        component.errorMessage = '';
        component.required = true;
        component.invalid = true;
        expect(component.errorMsg).toBe('');
      });

      it('should return empty string if value is defined', () => {
        component.errorMessage = 'Elror Message';
        component.value = 'Value';
        component.required = true;
        component.invalid = true;
        expect(component.errorMsg).toBe('');
      });

      it('should return empty string if required plus invalid are false', () => {
        component.errorMessage = 'Error Message';
        component.required = false;
        component.invalid = false;
        expect(component.errorMsg).toBe('');
      });
    });
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: any;

      beforeEach(() => {
        inputFocus = vi.spyOn(component as any, 'focus');
      });

      it('should include additionalHelp when observed is true', () => {
        component.additionalHelp = new EventEmitter<any>();
        const sub = component.additionalHelp.subscribe(() => {});

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
        sub.unsubscribe();
      });

      it('should not include additionalHelp when observed is false', () => {
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });

      it('should apply eventListeners if onChangeModel is null', fakeAsync(() => {
        component.onChangeModel = null;

        vi.spyOn(nativeElement as any, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(nativeElement.addEventListener).toHaveBeenCalledWith('keyup', component['listener']);
        expect(nativeElement.addEventListener).toHaveBeenCalledWith('cut', component['listener']);
        expect(nativeElement.addEventListener).toHaveBeenCalledWith('paste', component['listener']);
      }));

      it('shouldn`t apply eventListeners if onChangeModel is not null', fakeAsync(() => {
        component.onChangeModel = () => {};

        vi.spyOn(nativeElement as any, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(nativeElement.addEventListener).not.toHaveBeenCalled();
        expect(nativeElement.addEventListener).not.toHaveBeenCalled();
        expect(nativeElement.addEventListener).not.toHaveBeenCalled();
      }));

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    it('ngOnDestroy: should remove eventListeners if onChangeModel is null', () => {
      component.onChangeModel = null;

      vi.spyOn(nativeElement as any, 'removeEventListener');

      component.ngOnDestroy();

      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('keyup', component['listener']);
      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('cut', component['listener']);
      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('paste', component['listener']);
    });

    it('ngOnDestroy: shouldn`t remove eventListeners if onChangeModel is not null', () => {
      component.onChangeModel = () => {};

      vi.spyOn(nativeElement as any, 'removeEventListener');

      component.ngOnDestroy();

      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
    });

    it('should call focus on bodyElement', () => {
      (component as any).bodyElement = {
        focus: vi.fn().mockName('PoRichTextBodyComponent.focus')
      };

      component.focus();

      expect(component.bodyElement.focus).toHaveBeenCalled();
    });
    describe('onBlur', () => {
      it('should be called when `po-rich-text-body` emit blur event', () => {
        component['onTouched'] = () => {};
        vi.spyOn(component as any, 'onTouched');

        component.onBlur();

        expect(component['onTouched']).toHaveBeenCalled();
      });

      it('shouldn´t throw error if onTouched is falsy', () => {
        component['onTouched'] = null;

        const fnError = () => component.onBlur();

        expect(fnError).not.toThrow();
      });
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: vi.fn(),
          closeHelperPopover: vi.fn(),
          helperIsVisible: vi.fn().mockReturnValue(false)
        };
      });
      it('should emit additionalHelp when isHelpEvt is true (observed)', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;

        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;

        vi.spyOn(component.additionalHelp as any, 'observed', 'get').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.displayAdditionalHelp).toBe(true);
      });
      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBe(false);
        expect(component.displayAdditionalHelp).toBe(false);
      });
    });

    it('updateValue: should apply values to value, invalid and call updateModel', () => {
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'controlChangeModelEmitter');

      component.updateValue('value');

      expect(component.value).toBe('value');
      expect(component.invalid).toBeFalsy();
      expect(component['updateModel']).toHaveBeenCalledWith(component.value);
      expect(component['controlChangeModelEmitter']).toHaveBeenCalledWith(component.value);
    });

    it('validateClassesForRequired: should add ng-invalid and dirty classes if value is null and is required', fakeAsync(() => {
      component.value = null;
      component.required = true;

      component['validateClassesForRequired']();
      tick();

      expect(nativeElement.classList).toContain('ng-invalid');
      expect(nativeElement.classList).toContain('ng-dirty');
    }));

    it('validateClassesForRequired: should remove ng-invalid if value has value', fakeAsync(() => {
      component.value = 'Value';
      component.required = true;

      component['validateClassesForRequired']();
      tick();

      expect(nativeElement.classList).not.toContain('ng-invalid');
    }));

    it('validateClassesForRequired: should remove ng-invalid if required is false', fakeAsync(() => {
      component.value = null;
      component.required = false;

      component['validateClassesForRequired']();
      tick();

      expect(nativeElement.classList).not.toContain('ng-invalid');
    }));

    it('onChangeValue: should emit change', () => {
      vi.spyOn(component.change as any, 'emit');

      component.onChangeValue('value');

      expect(component.change.emit).toHaveBeenCalledWith('value');
    });

    it('p-keydown: should emit event', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      vi.spyOn(component.keydown as any, 'emit');

      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
    });

    it('controlChangeModelEmitter: should emit changeModel and set modelLastUpdate value', () => {
      const value = 'value';
      component['modelLastUpdate'] = '1';

      vi.spyOn(component.changeModel as any, 'emit');

      component['controlChangeModelEmitter'](value);

      expect(component.changeModel.emit).toHaveBeenCalledWith(value);
      expect(component['modelLastUpdate']).toBe(value);
    });

    it('controlChangeModelEmitter: shouldn`t emit changeModel if modelLastValue and value have same value', () => {
      const value = 'value';
      component['modelLastUpdate'] = 'value';

      vi.spyOn(component.changeModel as any, 'emit');

      component['controlChangeModelEmitter'](value);

      expect(component.changeModel.emit).not.toHaveBeenCalled();
    });

    describe('ngOnChanges:', () => {
      it(`ngOnChanges: should set displayAdditionalHelp false when label changes`, () => {
        const changes: any = {
          label: 'new label'
        };

        component.ngOnChanges(changes);

        expect(component.displayAdditionalHelp).toBe(false);
      });

      it('should update `hideToolbarActions` if it changes', () => {
        component.hideToolbarActions = [PoRichTextToolbarActions.Color];
        component.disabledTextAlign = true;

        const changes: SimpleChanges = {
          hideToolbarActions: new SimpleChange(
            [PoRichTextToolbarActions.Color, PoRichTextToolbarActions.Align],
            [],
            false
          )
        };
        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['toolbarActions']).toContain(PoRichTextToolbarActions.Align);
      });

      it('should update `hideToolbarActions` if `disabledTextAlign` changes', () => {
        component.hideToolbarActions = [PoRichTextToolbarActions.Color];
        component.disabledTextAlign = false;
        fixture.detectChanges();

        component.disabledTextAlign = true;
        const changes: SimpleChanges = {
          disabledTextAlign: new SimpleChange(false, true, false)
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['toolbarActions']).toEqual([PoRichTextToolbarActions.Color, PoRichTextToolbarActions.Align]);
      });
    });

    describe('isAllActionsHidden:', () => {
      it('should return true if all toolbar actions are hidden', () => {
        component.hideToolbarActions = Object.values(PoRichTextToolbarActions);
        component.disabledTextAlign = false;

        fixture.detectChanges();

        expect(component.isAllActionsHidden()).toBe(true);
      });

      it('should return false if not all toolbar actions are hidden', () => {
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBe(false);
      });

      it('should prioritize `disabledTextAlign` as true and include `Align` action even if not in `hideToolbarActions`', () => {
        component.disabledTextAlign = true;
        component.hideToolbarActions = [PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBe(false);
        expect(component.hideToolbarActions.includes(PoRichTextToolbarActions.Align)).toBe(false);
      });

      it('should prioritize `disabledTextAlign` as false and exclude `Align` action if present in `hideToolbarActions`', () => {
        component.disabledTextAlign = false;
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBe(false);
        expect(component.hideToolbarActions.includes(PoRichTextToolbarActions.Align)).toBe(true);
      });

      it('should ignore `disabledTextAlign` if it is undefined', () => {
        component.disabledTextAlign = undefined;
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBe(false);
      });

      it('should return true if all actions in hideToolbarActions and disabledTextAlign as true includes `Align`', () => {
        component.disabledTextAlign = true;
        component.hideToolbarActions = Object.values(PoRichTextToolbarActions).filter(
          action => action !== PoRichTextToolbarActions.Align
        );

        fixture.detectChanges();

        expect(component.isAllActionsHidden()).toBe(true);
      });
    });
  });

  describe('Properties:', () => {
    describe('p-size', () => {
      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        vi.spyOn(component as any, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });
  });

  describe('Template:', () => {
    it('should display `po-rich-text-toolbar` when `isAllActionsHidden` returns false', () => {
      vi.spyOn(component as any, 'isAllActionsHidden').mockReturnValue(false);

      fixture.detectChanges();

      const toolbarElement = nativeElement.querySelector('po-rich-text-toolbar');
      expect(toolbarElement).not.toBeNull();
    });

    it('should not display `po-rich-text-toolbar` and display `richTextWithNoToolbar` template when `isAllActionsHidden` returns true', () => {
      vi.spyOn(component as any, 'isAllActionsHidden').mockReturnValue(true);
      fixture.detectChanges();

      const toolbar = nativeElement.querySelector('po-rich-text-toolbar');
      const richTextWithNoToolbar = nativeElement.querySelector('#richTextWithNoToolbar');

      expect(toolbar).toBeNull();
      expect(richTextWithNoToolbar).toBeDefined();
    });

    it('should call `isAllActionsHidden` to determine which template to display', () => {
      const spyIsAllActionsHidden = vi.spyOn(component as any, 'isAllActionsHidden');

      fixture.detectChanges();

      expect(spyIsAllActionsHidden).toHaveBeenCalled();
    });

    it('should pass `isDisabled` to `po-rich-text-toolbar` as `p-disabled`', () => {
      component.disabled = true;
      fixture.detectChanges();

      const toolbar = fixture.debugElement.query(debugEl => debugEl.name === 'po-rich-text-toolbar');

      expect(toolbar.componentInstance.disabled).toBe(true);
    });

    it('should pass `isDisabled` as true to toolbar when `loading` is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const toolbar = fixture.debugElement.query(debugEl => debugEl.name === 'po-rich-text-toolbar');

      expect(toolbar.componentInstance.disabled).toBe(true);
    });
  });
});
