import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLoadingModule } from '../po-loading';
import { PoIconModule } from './../po-icon';

import { PoButtonBaseComponent } from './po-button-base.component';
import { PoButtonComponent } from './po-button.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonType } from './enums/po-button-type.enum';

describe('PoButtonComponent: ', () => {
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

  it('should propagate [p-tabindex] input to the inner button element', () => {
    fixture.componentRef.setInput('p-tabindex', -1);
    fixture.detectChanges();
    expect(nativeElement.querySelector('button').getAttribute('tabindex')).toBe('-1');
  });

  it('should propagate p-tabindex=0 to the inner button element', () => {
    fixture.componentRef.setInput('p-tabindex', 0);
    fixture.detectChanges();
    expect(nativeElement.querySelector('button').getAttribute('tabindex')).toBe('0');
  });

  it('should not set tabindex on inner button when p-tabindex input is null', () => {
    fixture.componentRef.setInput('p-tabindex', null);
    fixture.detectChanges();
    expect(nativeElement.querySelector('button').getAttribute('tabindex')).toBeNull();
  });

  it('should set type to `submit`.', () => {
    fixture.componentRef.setInput('p-type', PoButtonType.Submit);
    fixture.detectChanges();

    expect(nativeElement.querySelector('button').getAttribute('type')).toBe(PoButtonType.Submit);
  });

  it('should set type to `reset`.', () => {
    fixture.componentRef.setInput('p-type', PoButtonType.Reset);
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
      fixture.componentRef.setInput('p-label', 'Po Button');
      fixture.detectChanges();

      expect(nativeElement.querySelector('span.po-button-label')).toBeTruthy();
    });

    it('p-label: should not add i tag if `p-label` has not been declared', () => {
      fixture.componentRef.setInput('p-label', undefined);
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

    describe('Glow: ', () => {
      const getGlowLayers = () => nativeElement.querySelectorAll('.po-button-glow-halo, .po-button-glow-ring');

      it('shouldn`t render glow layers by default', () => {
        fixture.detectChanges();

        expect(getGlowLayers().length).toBe(0);
      });

      it('should render halo and ring layers as the last children of the button if `p-kind` is glow', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        const button = nativeElement.querySelector('button');
        const halo = nativeElement.querySelector('.po-button-glow-halo');
        const ring = nativeElement.querySelector('.po-button-glow-ring');

        expect(halo.parentElement).toBe(button);
        expect(ring.parentElement).toBe(button);
        expect(halo.nextElementSibling).toBe(ring);
        expect(button.lastElementChild).toBe(ring);
      });

      it('should hide glow layers from assistive technologies', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        getGlowLayers().forEach(layer => expect(layer.getAttribute('aria-hidden')).toBe('true'));
      });

      it('should render 22 trail dots in each glow layer', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        expect(component.glowTrail.length).toBe(22);
        getGlowLayers().forEach(layer =>
          expect(layer.querySelectorAll(':scope > i.po-button-glow-dot').length).toBe(22)
        );
      });

      it('should set `p-kind` attribute with glow on host and button', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        expect(nativeElement.getAttribute('p-kind')).toBe('glow');
        expect(nativeElement.querySelector('button').getAttribute('p-kind')).toBe('glow');
      });

      it('should remove glow layers if `p-kind` changes from glow to another kind', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();
        expect(getGlowLayers().length).toBe(2);

        fixture.componentRef.setInput('p-kind', 'primary');
        fixture.detectChanges();
        expect(getGlowLayers().length).toBe(0);
      });

      it('should set `p-danger` attribute with false on host and button if `p-kind` is glow', () => {
        fixture.componentRef.setInput('p-danger', true);
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        expect(nativeElement.getAttribute('p-danger')).toBe('false');
        expect(nativeElement.querySelector('button').getAttribute('p-danger')).toBe('false');
      });

      it('should keep glow layers and disable the button if `p-loading` is true', () => {
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.componentRef.setInput('p-loading', true);
        fixture.detectChanges();

        expect(nativeElement.querySelector('button').disabled).toBeTrue();
        expect(nativeElement.querySelector('.po-button-loading-icon')).toBeTruthy();
        expect(getGlowLayers().length).toBe(2);
      });

      it('should emit `p-click` when the glow button is clicked', () => {
        spyOn(component.click, 'emit');
        fixture.componentRef.setInput('p-kind', 'glow');
        fixture.detectChanges();

        nativeElement.querySelector('button').click();

        expect(component.click.emit).toHaveBeenCalled();
      });
    });
  });
});
