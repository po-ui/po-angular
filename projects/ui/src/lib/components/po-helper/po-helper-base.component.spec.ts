import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoHelperBaseComponent } from './po-helper-base.component';
import { PoHelperOptions } from './interfaces/po-helper.interface';
import { PoHelperCustomAction } from './interfaces/po-helper-custom-action.interface';

describe('PoHelperBaseComponent:', () => {
  let component: PoHelperBaseComponent;
  let fixture: ComponentFixture<PoHelperBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoHelperBaseComponent]
    });

    fixture = TestBed.createComponent(PoHelperBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Properties:', () => {
    it('helper: should accept a string and transform to PoHelperOptions', () => {
      const text = 'Texto explicativo';
      fixture.componentRef.setInput('p-helper', text);
      expect(component.helper()).toEqual({ title: '', content: text, type: 'help' });
    });

    it('helper: should accept a PoHelperOptions object', () => {
      const options: PoHelperOptions = {
        title: 'Ajuda',
        content: 'Conteúdo',
        type: 'info',
        eventOnClick: () => {},
        footerAction: { label: 'Ação', action: () => {} }
      };
      fixture.componentRef.setInput('p-helper', options);
      expect(component.helper()).toEqual(options);
    });

    describe('p-custom-action:', () => {
      it('should have customAction input with undefined as default value', () => {
        expect(component.customAction()).toBeUndefined();
      });

      it('should accept a valid PoHelperCustomAction object', () => {
        const action: PoHelperCustomAction = {
          icon: 'ICON_REFRESH',
          ariaLabel: 'Refresh',
          action: () => {}
        };
        fixture.componentRef.setInput('p-custom-action', action);
        expect(component.customAction()).toEqual(action);
      });

      it('should accept a PoHelperCustomAction without ariaLabel', () => {
        const action: PoHelperCustomAction = {
          icon: 'ICON_REFRESH',
          action: () => {}
        };
        fixture.componentRef.setInput('p-custom-action', action);
        expect(component.customAction()).toEqual(action);
        expect(component.customAction().ariaLabel).toBeUndefined();
      });

      it('should accept undefined value', () => {
        fixture.componentRef.setInput('p-custom-action', undefined);
        expect(component.customAction()).toBeUndefined();
      });

      it('should accept null value', () => {
        fixture.componentRef.setInput('p-custom-action', null);
        expect(component.customAction()).toBeNull();
      });
    });
  });

  describe('transformHelper:', () => {
    it('should transform string to PoHelperOptions', () => {
      const result = (component as any).transformHelper('Texto');
      expect(result).toEqual({ title: '', content: 'Texto', type: 'help' });
    });

    it('should return the object if already PoHelperOptions', () => {
      const options: PoHelperOptions = { title: 'T', content: 'C', type: 'info' };
      const result = (component as any).transformHelper(options);
      expect(result).toBe(options);
    });

    it('should set type to "help" when PoHelperOptions has no type', () => {
      const options: any = { title: 'T', content: 'C' };
      const result = (component as any).transformHelper(options);

      expect(result).toBe(options);
      expect(options.type).toBe('help');
    });

    it('should set type to "help" when PoHelperOptions has an empty type', () => {
      const options: any = { title: 'T', content: 'C', type: '' };
      const result = (component as any).transformHelper(options);

      expect(result).toBe(options);
      expect(options.type).toBe('help');
    });

    it('should delete footerAction when type is "info"', () => {
      const options: any = {
        title: 'T',
        content: 'C',
        type: 'info',
        footerAction: jasmine.createSpy('footerAction')
      };

      const result = (component as any).transformHelper(options);

      expect(result).toBe(options);
      expect('footerAction' in options).toBeFalse();
      expect(options.footerAction).toBeUndefined();
    });

    it('should keep footerAction when type is not "info"', () => {
      const options: any = {
        title: 'T',
        content: 'C',
        type: 'warning',
        footerAction: jasmine.createSpy('footerAction')
      };

      const result = (component as any).transformHelper(options);

      expect(result).toBe(options);
      expect('footerAction' in options).toBeTrue();
      expect(typeof options.footerAction).toBe('function');
    });

    it('should return undefined when value is falsy', () => {
      const result = (component as any).transformHelper(undefined);
      expect(result).toBeUndefined();
    });
  });
});
