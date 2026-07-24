import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoUtils as UtilsFunction } from '../../utils/util';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoDisclaimerComponent } from './po-disclaimer.component';

describe('PoDisclaimerComponent:', () => {
  let component: PoDisclaimerComponent;
  let fixture: ComponentFixture<PoDisclaimerComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent],
      imports: [PoTooltipModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have label', () => {
    component.label = 'Label';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.label').innerHTML).toContain('Label');
  });

  it('should set type default', () => {
    component.type = 'default';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer')).toBeTruthy();
    expect(nativeElement.querySelector('.po-disclaimer-danger')).toBeFalsy();
  });

  it('should set type danger', () => {
    component.type = 'danger';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-danger')).toBeTruthy();
  });

  it('should set hideClose false', () => {
    component.hideClose = false;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeTruthy();
  });

  it('should set hideClose true', () => {
    component.hideClose = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeFalsy();
  });

  it('should hide disclaimer after close', () => {
    component.close();
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer')).toBeFalsy();
  });

  describe('Methods:', () => {
    const eventEnterKey = { keyCode: 13, which: 13 };
    const eventDeleteKey = { keyCode: 46, which: 46 };

    it(`onKeyPress: should call 'close' if enter is typed.`, () => {
      const closeSpy = vi.spyOn(component, 'close');

      component.onKeyPress(eventEnterKey);

      expect(closeSpy).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'isKeyCodeEnter' and check if typed key is enter.`, () => {
      const isKeyCodeEnterSpy = vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');

      component.onKeyPress(eventEnterKey);

      expect(isKeyCodeEnterSpy).toHaveBeenCalled();
    });

    it(`onKeyPress: shouldn't call 'close' if the typed key is not enter.`, () => {
      const isKeyCodeEnterSpy = vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');
      const closeSpy = vi.spyOn(component, 'close');
      component.onKeyPress(eventDeleteKey);

      expect(closeSpy).not.toHaveBeenCalled();
      expect(isKeyCodeEnterSpy).toHaveBeenCalled();
    });

    it('getWidthDisclaimer: should return `true` when disclaimer-label offsetWidth > 201', () => {
      vi.spyOn(component.disclaimerContainer.nativeElement, 'offsetWidth', 'get').mockReturnValue(250);
      const expectedValue = component.getWidthDisclaimer();
      expect(expectedValue).toBeTruthy();
    });

    it('getWidthDisclaimer: should return `false` when disclaimer-label offsetWidth < 201', () => {
      vi.spyOn(component.disclaimerContainer.nativeElement, 'offsetWidth', 'get').mockReturnValue(50);
      const expectedValue = component.getWidthDisclaimer();
      expect(expectedValue).toBeFalsy();
    });

    it('emitLastDisclaimer: should emit last disclaimer', () => {
      const emitSpy = vi.spyOn(component.clickNumber, 'emit');

      component.emitLastDisclaimer(true);

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should set tabindex to 0 if disclaimer 'hideClose' is false.`, () => {
      component.hideClose = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeTruthy();
    });

    it(`shouldn't set tabindex if disclaimer 'hideClose' is true.`, () => {
      component.hideClose = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeNull();
    });
  });
});
