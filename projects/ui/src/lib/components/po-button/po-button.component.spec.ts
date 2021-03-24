import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoLoadingModule } from '../po-loading';
import { PoIconModule } from './../po-icon';

import { PoButtonComponent } from './po-button.component';
import { PoButtonBaseComponent } from './po-button-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoButtonComponent: ', () => {
  let component: PoButtonComponent;
  let fixture: ComponentFixture<PoButtonComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule, PoIconModule],
      declarations: [PoButtonComponent]
    });
  });

  beforeEach(() => {
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
    expect(nativeElement.querySelector('.po-button-sm')).toBeFalsy();

    expect(nativeElement.querySelector('span.po-icon')).toBeFalsy();
  });

  it('should update `p-label`', () => {
    component.label = 'Po Button';
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-label').innerHTML).toContain('Po Button');
  });

  it('should add the class `po-button-sm` when `p-small` is `true`', () => {
    component.small = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-sm')).toBeTruthy();
  });

  it('should add the class `po-button-primary` when `p-type` is `primary` and remove `po-button-danger` and `po-button-link`', () => {
    component.type = 'primary';
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-primary')).toBeTruthy();
    expect(nativeElement.querySelector('.po-button-danger')).toBeFalsy();
    expect(nativeElement.querySelector('.po-button-link')).toBeFalsy();
  });

  it('should add the class `po-button-danger` when `p-type` is `danger` and remove `po-button-primary` and `po-button-link`', () => {
    component.type = 'danger';
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-danger')).toBeTruthy();
    expect(nativeElement.querySelector('.po-button-primary')).toBeFalsy();
    expect(nativeElement.querySelector('.po-button-link')).toBeFalsy();
  });

  it('should add the class `po-button-link` when `p-type` is `link` and remove `po-button-primary` and `po-button-danger`', () => {
    component.type = 'link';
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-button-link')).toBeTruthy();
    expect(nativeElement.querySelector('.po-button-primary')).toBeFalsy();
    expect(nativeElement.querySelector('.po-button-danger')).toBeFalsy();
  });

  it('should add i with an icon when `p-icon` is defined', () => {
    component.icon = 'po-icon-news';
    fixture.detectChanges();

    expect(nativeElement.querySelector('i.po-icon.po-icon-news')).toBeTruthy();
  });

  it('should simulate button click.', () => {
    spyOn(component.click, 'emit');

    component.onClick();

    expect(component.click.emit).toHaveBeenCalled();
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
    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

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
          component.type = type;
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
