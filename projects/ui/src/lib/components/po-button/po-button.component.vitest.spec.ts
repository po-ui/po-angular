import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { PoLoadingModule } from '../po-loading';
import { PoIconModule } from './../po-icon';

import { PoButtonBaseComponent } from './po-button-base.component';
import { PoButtonComponent } from './po-button.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonType } from './enums/po-button-type.enum';

describe('PoButtonComponent (Vitest): ', () => {
  let component: PoButtonComponent;
  let fixture: ComponentFixture<PoButtonComponent>;
  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule, PoIconModule],
      declarations: [PoButtonComponent]
    });

    fixture = TestBed.createComponent(PoButtonComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoButtonBaseComponent).toBeTruthy();
    expect(component instanceof PoButtonComponent).toBeTruthy();
  });

  it('should only start with the default classes and elements, shouldn`t have variations', () => {
    expect(nativeElement.querySelector('.po-button')).toBeTruthy();
    expect(nativeElement.querySelector('.po-button-primary')).toBeFalsy();
    expect(nativeElement.querySelector('.po-button-danger')).toBeFalsy();
    expect(nativeElement.querySelector('.po-button-link')).toBeFalsy();

    expect(nativeElement.querySelector('po-icon i.an')).toBeFalsy();
  });

  it('should update `p-label`', () => {
    fixture.componentRef.setInput('p-label', 'Po Button');
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-label').innerHTML).toContain('Po Button');
  });

  it('should render an icon element when p-icon is defined', () => {
    fixture.componentRef.setInput('p-icon', 'an-newspaper');
    fixture.detectChanges();

    const icon = nativeElement.querySelector('po-icon i');
    expect(icon).toBeTruthy();
  });

  it('should simulate button blur.', () => {
    const blurSpy = vi.spyOn(component.blur, 'emit');

    component.onBlur();

    expect(blurSpy).toHaveBeenCalled();
  });

  it('should simulate button click.', () => {
    const clickSpy = vi.spyOn(component.click, 'emit');

    component.onClick();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('button type should default to `button`.', () => {
    fixture.detectChanges();
    expect(nativeElement.querySelector('button').getAttribute('type')).toBe(PoButtonType.Button);
  });

  describe('Properties: ', () => {
    it('p-loading: should attribute the propertie when set valid values.', () => {
      const booleanTrueValues = [true, 'true', 1, ''];
      expectPropertiesValues(component, 'loading', booleanTrueValues, true);
    });

    it('p-loading: shouldn´t attribute the propertie when set invalid values.', () => {
      const booleanFalseValues = [false, undefined, 0];
      expectPropertiesValues(component, 'loading', booleanFalseValues, false);
    });

    it('p-label: should add span with an label if `p-label` is defined', () => {
      fixture.componentRef.setInput('p-label', 'Po Button');
      fixture.detectChanges();

      expect(nativeElement.querySelector('span.po-button-label')).toBeTruthy();
    });
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of button', () => {
      component.buttonElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      const focusSpy = vi.spyOn(component.buttonElement.nativeElement, 'focus');

      component.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of button if `disabled`', () => {
      component.buttonElement = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      const focusSpy = vi.spyOn(component.buttonElement.nativeElement, 'focus');

      component.focus();

      expect(focusSpy).not.toHaveBeenCalled();
    });

    describe('mapSizeToIcon: ', () => {
      it('should return "xs" for "small" size', () => {
        expect(component.mapSizeToIcon('small')).toBe('xs');
      });

      it('should return "sm" for "medium" size', () => {
        expect(component.mapSizeToIcon('medium')).toBe('sm');
      });

      it('should return "sm" for "large" size', () => {
        expect(component.mapSizeToIcon('large')).toBe('sm');
      });

      it('should return "sm" for invalid size', () => {
        expect(component.mapSizeToIcon('invalid')).toBe('sm');
      });

      it('should return "sm" when size is empty', () => {
        expect(component.mapSizeToIcon('')).toBe('sm');
      });
    });
  });
});
