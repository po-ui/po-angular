import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
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
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should apply eventListeners if onChangeModel is null', fakeAsync(() => {
        component.onChangeModel = null;

        spyOn(nativeElement, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(nativeElement.addEventListener).toHaveBeenCalledWith('keyup', component['listener']);
        expect(nativeElement.addEventListener).toHaveBeenCalledWith('cut', component['listener']);
        expect(nativeElement.addEventListener).toHaveBeenCalledWith('paste', component['listener']);
      }));

      it('shouldn`t apply eventListeners if onChangeModel is not null', fakeAsync(() => {
        component.onChangeModel = () => {};

        spyOn(nativeElement, 'addEventListener');

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

      spyOn(nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('keyup', component['listener']);
      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('cut', component['listener']);
      expect(nativeElement.removeEventListener).toHaveBeenCalledWith('paste', component['listener']);
    });

    it('ngOnDestroy: shouldn`t remove eventListeners if onChangeModel is not null', () => {
      component.onChangeModel = () => {};

      spyOn(nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
      expect(nativeElement.removeEventListener).not.toHaveBeenCalled();
    });

    it('should call focus on bodyElement', () => {
      component.bodyElement = jasmine.createSpyObj('PoRichTextBodyComponent', ['focus']);

      component.focus();

      expect(component.bodyElement.focus).toHaveBeenCalled();
    });

    it('onBlur: should be called when `po-rich-text-body` emit blur event', () => {
      component['onTouched'] = () => {};
      spyOn(component, <any>'onTouched');

      component.onBlur();

      expect(component['onTouched']).toHaveBeenCalled();
    });

    it('onBlur: shouldn´t throw error if onTouched is falsy', () => {
      component['onTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });

    it('updateValue: should apply values to value, invalid and call updateModel', () => {
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'controlChangeModelEmitter');

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
      spyOn(component.change, 'emit');

      component.onChangeValue('value');

      expect(component.change.emit).toHaveBeenCalledWith('value');
    });

    it('controlChangeModelEmitter: should emit changeModel and set modelLastUpdate value', () => {
      const value = 'value';
      component['modelLastUpdate'] = '1';

      spyOn(component.changeModel, 'emit');

      component['controlChangeModelEmitter'](value);

      expect(component.changeModel.emit).toHaveBeenCalledWith(value);
      expect(component['modelLastUpdate']).toBe(value);
    });

    it('controlChangeModelEmitter: shouldn`t emit changeModel if modelLastValue and value have same value', () => {
      const value = 'value';
      component['modelLastUpdate'] = 'value';

      spyOn(component.changeModel, 'emit');

      component['controlChangeModelEmitter'](value);

      expect(component.changeModel.emit).not.toHaveBeenCalled();
    });

    describe('ngOnChanges:', () => {
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

        expect(component.isAllActionsHidden()).toBeTrue();
      });

      it('should return false if not all toolbar actions are hidden', () => {
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBeFalse();
      });

      it('should prioritize `disabledTextAlign` as true and include `Align` action even if not in `hideToolbarActions`', () => {
        component.disabledTextAlign = true;
        component.hideToolbarActions = [PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBeFalse();
        expect(component.hideToolbarActions.includes(PoRichTextToolbarActions.Align)).toBeFalse();
      });

      it('should prioritize `disabledTextAlign` as false and exclude `Align` action if present in `hideToolbarActions`', () => {
        component.disabledTextAlign = false;
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBeFalse();
        expect(component.hideToolbarActions.includes(PoRichTextToolbarActions.Align)).toBeTrue();
      });

      it('should ignore `disabledTextAlign` if it is undefined', () => {
        component.disabledTextAlign = undefined;
        component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];

        expect(component.isAllActionsHidden()).toBeFalse();
      });

      it('should return true if all actions in hideToolbarActions and disabledTextAlign as true includes `Align`', () => {
        component.disabledTextAlign = true;
        component.hideToolbarActions = Object.values(PoRichTextToolbarActions).filter(
          action => action !== PoRichTextToolbarActions.Align
        );

        fixture.detectChanges();

        expect(component.isAllActionsHidden()).toBeTrue();
      });
    });
  });

  describe('Template:', () => {
    it('should display `po-rich-text-toolbar` when `isAllActionsHidden` returns false', () => {
      spyOn(component, 'isAllActionsHidden').and.returnValue(false);

      fixture.detectChanges();

      const toolbarElement = nativeElement.querySelector('po-rich-text-toolbar');
      expect(toolbarElement).not.toBeNull();
    });

    it('should not display `po-rich-text-toolbar` and display `richTextWithNoToolbar` template when `isAllActionsHidden` returns true', () => {
      spyOn(component, 'isAllActionsHidden').and.returnValue(true);
      fixture.detectChanges();

      const toolbar = nativeElement.querySelector('po-rich-text-toolbar');
      const richTextWithNoToolbar = nativeElement.querySelector('#richTextWithNoToolbar');

      expect(toolbar).toBeNull();
      expect(richTextWithNoToolbar).toBeDefined();
    });

    it('should call `isAllActionsHidden` to determine which template to display', () => {
      const spyIsAllActionsHidden = spyOn(component, 'isAllActionsHidden').and.callThrough();

      fixture.detectChanges();

      expect(spyIsAllActionsHidden).toHaveBeenCalled();
    });
  });
});
