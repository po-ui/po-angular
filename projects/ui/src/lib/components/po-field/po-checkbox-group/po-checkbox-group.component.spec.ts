import { ChangeDetectorRef, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCheckboxComponent } from '../po-checkbox/po-checkbox.component';
import { PoCheckboxGroupComponent } from './po-checkbox-group.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCheckboxGroupComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

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
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.debugElement.injector.get(NG_VALIDATORS);

    changeDetector.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create 2 checkbox options', () => {
    expect(nativeElement.querySelectorAll('po-checkbox').length).toBe(2);
  });

  it('should call setValidators on ngAfterViewChecked', () => {
    vi.spyOn(fakeInstance.changeDetector as any, 'detectChanges');
    component.ngAfterViewChecked.call(fakeInstance);
    expect(fakeInstance.changeDetector.detectChanges).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it(`ngOnChanges: should set displayAdditionalHelp false when label changes`, () => {
      const changes: any = {
        label: 'new label'
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBe(false);
    });

    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = vi.spyOn(component as any, 'focus');

      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = vi.spyOn(component as any, 'focus');

      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

    describe('onBlur:', () => {
      let setupTest;
      let checkboxMock;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          vi.spyOn(component as any, 'showAdditionalHelp');
        };

        checkboxMock = {
          checkboxLabel: { nativeElement: document.createElement('input') }
        } as PoCheckboxComponent;
      });

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });
    });

    describe('focus:', () => {
      const checkbox1 = document.createElement('po-checkbox');
      const checkbox2 = document.createElement('po-checkbox');
      const checkboxLabel = [
        {
          checkboxLabel: {
            nativeElement: checkbox1
          }
        },
        {
          checkboxLabel: {
            nativeElement: checkbox2
          }
        }
      ] as any;

      it('should call `focus` of checkbox.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        vi.spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of checkbox if option is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2' }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        vi.spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        vi.spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if component is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];
        component.disabled = true;

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        vi.spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        vi.spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if all checkboxes are `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2', disabled: true }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        vi.spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        vi.spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
      });
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
    });

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
    });

    it('trackByFn: should return index', () => {
      const index = 1;
      expect(component.trackByFn(index)).toBe(index);
    });

    describe('onKeyDown:', () => {
      let option;
      let fakeEvent: any;
      let checkboxMock: PoCheckboxComponent;

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

        checkboxMock = {
          checkboxLabel: { nativeElement: document.createElement('input') },
          focus: vi.fn()
        } as unknown as PoCheckboxComponent;
      });

      it('should call `checkOption` and `preventDefault` when event which from spacebar', () => {
        vi.spyOn(component as any, 'checkOption');
        vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });

      it('shouldn`t call `checkOption` and `preventDefault` when event which and event keyCode from tab', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        vi.spyOn(component as any, 'checkOption');
        vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(component.checkOption).not.toHaveBeenCalled();
        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should call `checkOption` and `preventDefault` when event keyCode from spacebar key and event which undefined', () => {
        fakeEvent.which = undefined;

        vi.spyOn(component as any, 'checkOption');
        vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });

      it('should emit event when field is focused', () => {
        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(checkboxMock.checkboxLabel.nativeElement);

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
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

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
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
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
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
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
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
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
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
  });

  describe('Templates:', () => {
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
  });
});
