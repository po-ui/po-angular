import { TestBed } from '@angular/core/testing';

import { PoPageHeaderBaseComponent } from './po-page-header-base.component';

describe('PoPageHeaderBaseComponent', () => {
  let component: PoPageHeaderBaseComponent;

  beforeEach(() => {
    component = TestBed.runInInjectionContext(() => new PoPageHeaderBaseComponent());
  });

  it('should be created', () => {
    expect(component instanceof PoPageHeaderBaseComponent).toBeTruthy();
  });

  describe('helper property:', () => {
    it('should have helper input with undefined as default value', () => {
      expect(component.helper()).toBeUndefined();
    });
  });

  describe('subtitle property:', () => {
    it('should store the raw subtitle value', () => {
      component.subtitle = 'Texto simples';
      expect(component.subtitle).toBe('Texto simples');
    });

    it('should parse plain text into a single fragment without formatting', () => {
      component.subtitle = 'Texto simples';
      expect(component.subtitleFragments).toEqual([
        { text: 'Texto simples', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse <b> tag into bold fragment', () => {
      component.subtitle = 'Texto <b>negrito</b> normal';
      expect(component.subtitleFragments).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse <strong> as bold', () => {
      component.subtitle = '<strong>importante</strong>';
      expect(component.subtitleFragments).toEqual([
        { text: 'importante', bold: true, italic: false, underline: false }
      ]);
    });

    it('should parse <i> tag into italic fragment', () => {
      component.subtitle = '<i>itálico</i>';
      expect(component.subtitleFragments).toEqual([{ text: 'itálico', bold: false, italic: true, underline: false }]);
    });

    it('should parse <em> as italic', () => {
      component.subtitle = '<em>enfatizado</em>';
      expect(component.subtitleFragments).toEqual([
        { text: 'enfatizado', bold: false, italic: true, underline: false }
      ]);
    });

    it('should parse <u> tag into underline fragment', () => {
      component.subtitle = '<u>sublinhado</u>';
      expect(component.subtitleFragments).toEqual([
        { text: 'sublinhado', bold: false, italic: false, underline: true }
      ]);
    });

    it('should handle nested tags', () => {
      component.subtitle = '<b><i>negrito e itálico</i></b>';
      expect(component.subtitleFragments).toEqual([
        { text: 'negrito e itálico', bold: true, italic: true, underline: false }
      ]);
    });

    it('should sanitize disallowed tags', () => {
      component.subtitle = '<script>alert("xss")</script> seguro';
      expect(component.subtitleFragments).toEqual([
        { text: 'alert("xss") seguro', bold: false, italic: false, underline: false }
      ]);
    });

    it('should return empty array for undefined subtitle', () => {
      component.subtitle = undefined;
      expect(component.subtitleFragments).toEqual([]);
    });

    it('should return empty array for empty string subtitle', () => {
      component.subtitle = '';
      expect(component.subtitleFragments).toEqual([]);
    });
  });
});
