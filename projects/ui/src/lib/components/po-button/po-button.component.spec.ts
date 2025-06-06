import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLoadingModule } from '../po-loading';
import { PoIconModule } from './../po-icon';

import { PoButtonBaseComponent } from './po-button-base.component';
import { PoButtonComponent } from './po-button.component';

import { PoThemeService } from '../../services/po-theme/po-theme.service';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonType } from './enums/po-button-type.enum';

describe('PoButtonComponent: ', () => {
  let component: PoButtonComponent;
  let fixture: ComponentFixture<PoButtonComponent>;
  let nativeElement: any;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    TestBed.configureTestingModule({
      imports: [PoLoadingModule, PoIconModule],
      declarations: [PoButtonComponent],
      providers: [{ provide: PoThemeService, useValue: poThemeServiceMock }]
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

    expect(nativeElement.querySelector('span.po-icon')).toBeFalsy();
  });

  it('should update `p-label`', () => {
    component.label = 'Po Button';
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-label').innerHTML).toContain('Po Button');
  });

  it('should add i with an icon when `p-icon` is defined', () => {
    component.icon = 'po-icon-news';
    fixture.detectChanges();

    expect(nativeElement.querySelector('i.po-icon.po-icon-news')).toBeTruthy();
  });

  it('should simulate button blur.', () => {
    spyOn(component.blur, 'emit');

    component.onBlur();

    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should simulate button click.', () => {
    spyOn(component.click, 'emit');

    component.onClick();

    expect(component.click.emit).toHaveBeenCalled();
  });

  it('button type should default to `button`.', () => {
    fixture.detectChanges();
    expect(nativeElement.querySelector('button').getAttribute('type')).toBe(PoButtonType.Button);
  });

  it('should set type to `submit`.', () => {
    component.type = PoButtonType.Submit;
    fixture.detectChanges();

    expect(nativeElement.querySelector('button').getAttribute('type')).toBe(PoButtonType.Submit);
  });

  it('should set type to `reset`.', () => {
    component.type = PoButtonType.Reset;
    fixture.detectChanges();

    expect(nativeElement.querySelector('button').getAttribute('type')).toBe(PoButtonType.Reset);
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
      component.label = 'Po Button';
      fixture.detectChanges();

      expect(nativeElement.querySelector('span.po-button-label')).toBeTruthy();
    });

    it('p-label: should not add i tag if `p-label` has not been declared', () => {
      component.label = undefined;
      fixture.detectChanges();

      expect(nativeElement.querySelector('i.po-button-label')).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of button', () => {
      component.buttonElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.buttonElement.nativeElement, 'focus');

      component.focus();

      expect(component.buttonElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of button if `disabled`', () => {
      component.buttonElement = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.buttonElement.nativeElement, 'focus');

      component.focus();

      expect(component.buttonElement.nativeElement.focus).not.toHaveBeenCalled();
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

  describe('Templates: ', () => {
    describe('Loading: ', () => {
      let button;

      beforeEach(() => {
        component.loading = true;
        button = fixture.debugElement.nativeElement.querySelector('button');
        fixture.detectChanges();
      });

      it('should disabled button when propertie is setted.', () => {
        expect(button.getAttribute('disabled')).not.toBeNull();
        expect(button.getElementsByClassName('po-button-loading-icon').length).toBeTruthy();
      });

      it('should keep button disabled independently of type.', () => {
        const buttonTypes = ['default', 'danger', 'primary', 'link'];

        for (const type of buttonTypes) {
          component.kind = type;
          fixture.detectChanges();
          expect(button.getAttribute('disabled')).not.toBeNull();
          expect(button.getElementsByClassName('po-button-loading-icon').length).toBeTruthy();
        }
      });

      it('should keep disabled when `disabled` equals false.', () => {
        component.disabled = false;
        expect(button.getAttribute('disabled')).not.toBeNull();
      });
    });
  });
});
