import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoRichTextBodyComponent } from './po-rich-text-body.component';

describe('PoRichTextBodyComponent:', () => {
  let component: PoRichTextBodyComponent;
  let fixture: ComponentFixture<PoRichTextBodyComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoRichTextBodyComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {

    it('onInit: should update `bodyElement`', () => {
      const expectedValue = 'on';
      component.ngOnInit();

      expect(component.bodyElement.nativeElement.designMode).toEqual(expectedValue);
    });

    it('onInit: should call `updateValueWithModelValue`', fakeAsync(() => {
      spyOn(component, <any>'updateValueWithModelValue');

      component.ngOnInit();
      tick(50);

      expect(component['updateValueWithModelValue']).toHaveBeenCalled();
    }));

    describe('executeCommand:', () => {

      it('should call `focus`', () => {
        const spyFocus = spyOn(component.bodyElement.nativeElement, <any> 'focus');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyFocus).toHaveBeenCalled();
      });

      it('should call `execCommand` with string as parameter.', () => {
        const spyExecCommand = spyOn(document, <any> 'execCommand');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue, false, null);
      });

      it('should call `execCommand` with object as parameter.', () => {
        const command = 'foreColor';
        const value = '#000000';
        const spyExecCommand = spyOn(document, <any> 'execCommand');
        const fakeValue = { command, value } ;

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue.command, false, fakeValue.value);
      });

      it('should call `updateModel`', () => {
        const fakeValue = 'p';
        spyOn(component, <any>'updateModel');

        component.executeCommand(fakeValue);

        expect(component['updateModel']).toHaveBeenCalled();
      });

      it('should call `value.emit` with `modelValue`', () => {
        component.modelValue = 'teste';
        const fakeValue = 'p';

        spyOn(component.value, 'emit');
        component.executeCommand(fakeValue);

        expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
      });

    });

    it('focus: should call `focus` of rich-text', () => {

      spyOn(component.bodyElement.nativeElement, 'focus');

      component.focus();

      expect(component.bodyElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('onClick: should call `emitSelectionCommands`', () => {
      spyOn(component, <any>'emitSelectionCommands');
      component.onClick();

      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onKeyUp: should call `updateModel`', () => {
      const element = document.createElement('div');
      element.classList.add('teste');
      component.bodyElement.nativeElement.appendChild(element);
      component.onKeyUp();
      expect(nativeElement.querySelector('.teste')).toBeFalsy();
    });

    it('onKeyUp: should call `updateModel`', () => {
      spyOn(component, <any>'updateModel');
      component.onKeyUp();

      expect(component['updateModel']).toHaveBeenCalled();
    });

    it('onKeyUp: should call `emitSelectionCommands`', () => {
      spyOn(component, <any>'emitSelectionCommands');
      component.onKeyUp();

      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('update: should call `updateModel`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');

      component.update();
      tick(50);

      expect(component['updateModel']).toHaveBeenCalled();
    }));

    it('update: should call `onKeyUp`', fakeAsync(() => {
      spyOn(component, <any>'onKeyUp');

      component.update();
      tick(50);

      expect(component['onKeyUp']).toHaveBeenCalled();
    }));

    it('emitSelectionCommands: should call `commands.emit`', () => {
      spyOn(component.commands, 'emit');
      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalled();
    });

    it('updateModel: should update `modelValue`', () => {
      component.bodyElement.nativeElement.innerHTML = 'teste';
      component['updateModel']();
      fixture.detectChanges();
      expect(component.modelValue).toContain('teste');
    });

    it('updateModel: should call `value.emit` with `modelValue`', () => {
      component.modelValue = 'teste';

      spyOn(component.value, 'emit');
      component['updateModel']();

      expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
    });

    it('updateValueWithModelValue: should call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = 'teste';

      spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).toHaveBeenCalledWith('afterbegin', component.modelValue);
    });

    it('onFocus: should set a value to `valueBeforeChange`', () => {
      component.modelValue = 'value';

      component.onFocus();

      expect(component['valueBeforeChange']).toBe('value');
    });

    it('rgbToHex: should return the hexadecimal value`', () => {
      const rbg = 'rgb(0, 128, 255)';
      const hex = '#0080ff';
      const result = component['rgbToHex'](rbg);

      expect(result).toBe(hex);
    });

    it('onBlur: should emit modelValue change', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: '1',
        change: component.change,
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.modelValue);
    }));

    it('onBlur: shouldn`t emit change value doesn`t changed', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: 'value',
        change: {
          emit: () => {}
        },
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

  });

  describe('Templates:', () => {

  it('should contain `po-rich-text-body`', () => {

    expect(nativeElement.querySelector('.po-rich-text-body')).toBeTruthy();
  });

  });

});
