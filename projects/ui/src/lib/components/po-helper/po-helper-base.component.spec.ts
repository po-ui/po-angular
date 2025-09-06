import { Directive } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PoHelperBaseComponent } from './po-helper-base.component';
import { PoHelperOptions } from './interfaces/po-helper.interface';

@Directive()
class PoHelperTestComponent extends PoHelperBaseComponent {}

describe('PoHelperBaseComponent:', () => {
  let component: PoHelperTestComponent;

  beforeEach(() => {
    component = TestBed.runInInjectionContext(() => new PoHelperTestComponent());
  });

  describe('Properties:', () => {
    it('helper: should accept a string and transform to PoHelperOptions', () => {
      const text = 'Texto explicativo';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      component.helper = text;
      expect(component.helper).toEqual(text);
    });

    it('helper: should accept a PoHelperOptions object', () => {
      const options: PoHelperOptions = {
        title: 'Ajuda',
        content: 'Conteúdo',
        type: 'info',
        eventOnClick: () => {},
        footerAction: { label: 'Ação', action: () => {} }
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      component.helper = options;
      expect(component.helper).toEqual(options);
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
  });
});
