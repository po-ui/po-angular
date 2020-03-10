import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCheckboxGroupComponent } from './po-checkbox-group.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';

describe('PoCheckboxGroupComponent:', () => {
  let changeDetector: any;
  let component: PoCheckboxGroupComponent;
  let fixture: ComponentFixture<PoCheckboxGroupComponent>;
  let nativeElement: any;

  const fakeInstance = {
    changeValue: (value: any) => {},
    checkOptionModel: (value: any) => {},
    changeDetector: {
      detectChanges: () => {}
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCheckboxGroupComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCheckboxGroupComponent);

    component = fixture.componentInstance;
    component.label = 'Label';
    component.help = 'Help';
    component.name = 'Model';
    component.options = [
      { value: '1', label: '1' },
      { value: '2', label: '2', disabled: true }
    ];

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
    changeDetector.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have label', () => {
    expect(nativeElement.querySelector('.po-field-title').innerHTML).toContain('Label');
  });

  it('should have help', () => {
    expect(nativeElement.querySelector('.po-field-help').innerHTML).toContain('Help');
  });

  it('should be required', () => {
    component.required = true;
    changeDetector.detectChanges();
    expect(nativeElement.querySelector('.po-field-optional')).toBeFalsy();
  });

  it('should create 2 checkbox options', () => {
    expect(nativeElement.querySelectorAll('.po-checkbox-group-input').length).toBe(2);
  });

  it('should disable checkbox option value 2', () => {
    expect(nativeElement.querySelector('input[type="checkbox"]:disabled+label').innerHTML).toContain('2');
  });

  it('should call setValidators on ngAfterViewChecked', () => {
    spyOn(fakeInstance.changeDetector, 'detectChanges');
    component.ngAfterViewChecked.call(fakeInstance);
    expect(fakeInstance.changeDetector.detectChanges).toHaveBeenCalled();
  });

  it('should toggle checkbox option value 1', () => {
    component.checkOption(component.options[0]);
    changeDetector.detectChanges();

    expect(nativeElement.querySelector('.po-checkbox-group-input-checked+label').innerHTML).toContain('1');
    expect(component.checkedOptions).toEqual({ 1: true });
    expect(component.checkedOptionsList).toEqual(['1']);

    component.checkOption(component.options[0]);
    changeDetector.detectChanges();

    expect(nativeElement.querySelector('.po-checkbox-group-input-checked')).toBeFalsy();
    expect(component.checkedOptions).toEqual({ 1: false });
    expect(component.checkedOptionsList).not.toContain('1');
  });

  it('should create indeterminate checkbox option value 1', () => {
    component.checkedOptions = { 1: null };
    component.indeterminate = true;

    changeDetector.detectChanges();

    expect(nativeElement.querySelector('.po-checkbox-group-input-indeterminate+label').innerHTML).toContain('1');
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, <any>'focus');

      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, <any>'focus');

      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

    describe('focus:', () => {
      it('should call `focus` of checkbox.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];

        changeDetector.detectChanges();

        spyOn(component.checkboxLabels.toArray()[0].nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels.toArray()[0].nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of checkbox if option is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2' }
        ];

        changeDetector.detectChanges();

        spyOn(component.checkboxLabels.toArray()[0].nativeElement, 'focus');
        spyOn(component.checkboxLabels.toArray()[1].nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels.toArray()[0].nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels.toArray()[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if component is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];
        component.disabled = true;

        changeDetector.detectChanges();

        spyOn(component.checkboxLabels.toArray()[0].nativeElement, 'focus');
        spyOn(component.checkboxLabels.toArray()[1].nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels.toArray()[0].nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels.toArray()[1].nativeElement.focus).not.toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if all checkboxes are `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2', disabled: true }
        ];

        changeDetector.detectChanges();

        spyOn(component.checkboxLabels.toArray()[0].nativeElement, 'focus');
        spyOn(component.checkboxLabels.toArray()[1].nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels.toArray()[0].nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels.toArray()[1].nativeElement.focus).not.toHaveBeenCalled();
      });
    });

    it('trackByFn: should return index', () => {
      const index = 1;
      expect(component.trackByFn(index)).toBe(index);
    });

    describe('onKeyDown:', () => {
      let option;
      let fakeEvent: any;

      beforeEach(() => {
        option = {
          label: 'teste',
          value: 'teste'
        };

        fakeEvent = {
          which: 32,
          keyCode: 32,
          preventDefault: () => {}
        };
      });

      it('should call `checkOption` and `preventDefault` when event which from spacebar', () => {
        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });

      it('shouldn`t call `checkOption` and `preventDefault` when event which and event keyCode from tab', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option);

        expect(component.checkOption).not.toHaveBeenCalled();
        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should call `checkOption` and `preventDefault` when event keyCode from spacebar key and event which undefined', () => {
        fakeEvent.which = undefined;

        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });
    });

    describe('Templates:', () => {
      it('should set tabindex to -1 when checkbox-group is disabled', () => {
        component.disabled = true;
        changeDetector.detectChanges();

        expect(nativeElement.querySelector('label.po-checkbox-group-label[tabindex="-1"]')).toBeTruthy();
      });

      it('should set tabindex to 0 when checkbox-group disabled is false', () => {
        component.disabled = false;
        changeDetector.detectChanges();

        expect(nativeElement.querySelector('label.po-checkbox-group-label[tabindex="0"]')).toBeTruthy();
      });

      it('should set tabindex to -1 when option disabled is true', () => {
        component.options = [{ label: 'teste', value: 'teste', disabled: true }];
        changeDetector.detectChanges();

        expect(nativeElement.querySelector('label.po-checkbox-group-label[tabindex="-1"]')).toBeTruthy();
      });

      it('should set tabindex to 0 when option disabled not exists', () => {
        component.options = [{ label: 'teste', value: 'teste' }];
        changeDetector.detectChanges();

        expect(nativeElement.querySelector('label.po-checkbox-group-label[tabindex="0"]')).toBeTruthy();
      });

      it('should set `po-clickable` class if `disabled` and `options.disabled` are false.', () => {
        component.options = [
          { value: '1', label: '1' },
          { value: '2', label: '2', disabled: true }
        ];
        component.disabled = false;

        changeDetector.detectChanges();

        expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[0]).toBeTruthy();
        expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[1]).toBeFalsy();
      });

      it('shouldn`t set `po-clickable` class if `disabled` is true.', () => {
        component.options = [
          { value: '1', label: '1' },
          { value: '2', label: '2' }
        ];
        component.disabled = true;

        changeDetector.detectChanges();

        expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[0]).toBeFalsy();
        expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[1]).toBeFalsy();
      });

      it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
        component.required = false;
        component.optional = true;
        component.label = 'label';

        changeDetector.detectChanges();

        expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
      });

      it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
        component.required = true;
        component.optional = true;
        component.label = 'label';

        changeDetector.detectChanges();

        expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
      });

      it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
        component.required = true;
        component.optional = false;
        component.label = 'label';

        changeDetector.detectChanges();

        expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
      });
    });
  });
});
