import { parseHelperContent } from './po-helper-content-utils';

describe('PoHelperSafeParser', () => {
  describe('parseHelperContent', () => {
    it('should return empty array for null/undefined/empty content', () => {
      expect(parseHelperContent(null)).toEqual([]);
      expect(parseHelperContent(undefined)).toEqual([]);
      expect(parseHelperContent('')).toEqual([]);
    });

    it('should return single fragment for plain text without tags', () => {
      const result = parseHelperContent('Texto simples');
      expect(result).toEqual([{ text: 'Texto simples', bold: false, italic: false, underline: false }]);
    });

    it('should parse bold tag correctly', () => {
      const result = parseHelperContent('Texto <b>negrito</b> normal');
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse italic tag correctly', () => {
      const result = parseHelperContent('Texto <i>itálico</i> normal');
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse underline tag correctly', () => {
      const result = parseHelperContent('Texto <u>sublinhado</u> normal');
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'sublinhado', bold: false, italic: false, underline: true },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse nested tags correctly', () => {
      const result = parseHelperContent('<b><i>negrito e itálico</i></b>');
      expect(result).toEqual([{ text: 'negrito e itálico', bold: true, italic: true, underline: false }]);
    });

    it('should parse multiple nested tags', () => {
      const result = parseHelperContent('<b><i><u>todos</u></i></b>');
      expect(result).toEqual([{ text: 'todos', bold: true, italic: true, underline: true }]);
    });

    it('should handle mixed formatting in sequence', () => {
      const result = parseHelperContent('<b>negrito</b> e <i>itálico</i>');
      expect(result).toEqual([
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' e ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false }
      ]);
    });

    it('should sanitize disallowed tags (script)', () => {
      const result = parseHelperContent('Texto <script>alert("xss")</script> seguro');
      expect(result).toEqual([{ text: 'Texto alert("xss") seguro', bold: false, italic: false, underline: false }]);
    });

    it('should sanitize disallowed tags (div, span, a)', () => {
      const result = parseHelperContent('<div>conteúdo</div> <span>texto</span> <a href="x">link</a>');
      expect(result).toEqual([{ text: 'conteúdo texto link', bold: false, italic: false, underline: false }]);
    });

    it('should sanitize tags with attributes', () => {
      const result = parseHelperContent('<b style="color:red">negrito</b>');
      expect(result).toEqual([{ text: 'negrito', bold: true, italic: false, underline: false }]);
    });

    it('should handle unclosed tags gracefully', () => {
      const result = parseHelperContent('<b>negrito sem fechar');
      expect(result).toEqual([{ text: 'negrito sem fechar', bold: true, italic: false, underline: false }]);
    });

    it('should handle extra closing tags gracefully', () => {
      const result = parseHelperContent('texto</b> normal');
      expect(result).toEqual([
        { text: 'texto', bold: false, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should handle case-insensitive tags', () => {
      const result = parseHelperContent('<B>negrito</B> <I>itálico</I>');
      expect(result).toEqual([
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false }
      ]);
    });

    it('should prevent XSS via event handlers in allowed tags', () => {
      const result = parseHelperContent('<b onmouseover="alert(1)">texto</b>');
      expect(result).toEqual([{ text: 'texto', bold: true, italic: false, underline: false }]);
    });

    it('should prevent XSS via img tag with onerror', () => {
      const result = parseHelperContent('<img src=x onerror="alert(1)">texto');
      expect(result).toEqual([{ text: 'texto', bold: false, italic: false, underline: false }]);
    });

    it('should handle partially overlapping tags', () => {
      const result = parseHelperContent('<b>bold <i>bold+italic</b> italic</i>');
      expect(result).toEqual([
        { text: 'bold ', bold: true, italic: false, underline: false },
        { text: 'bold+italic', bold: true, italic: true, underline: false },
        { text: ' italic', bold: false, italic: true, underline: false }
      ]);
    });

    it('should parse <strong> as bold', () => {
      const result = parseHelperContent('Texto <strong>importante</strong> normal');
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'importante', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse <em> as italic', () => {
      const result = parseHelperContent('Texto <em>enfatizado</em> normal');
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'enfatizado', bold: false, italic: true, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should handle mixed <strong>, <em>, <b>, <i>, <u> together', () => {
      const result = parseHelperContent('<strong>bold</strong> <em>italic</em> <u>underline</u>');
      expect(result).toEqual([
        { text: 'bold', bold: true, italic: false, underline: false },
        { text: ' ', bold: false, italic: false, underline: false },
        { text: 'italic', bold: false, italic: true, underline: false },
        { text: ' ', bold: false, italic: false, underline: false },
        { text: 'underline', bold: false, italic: false, underline: true }
      ]);
    });
  });
});
