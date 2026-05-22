import { parseSafeText, PoFormattingTag } from './safe-text-parser';

describe('parseSafeText', () => {
  const allTags: Array<PoFormattingTag> = ['b', 'i', 'u', 'strong', 'em'];

  describe('with all tags allowed', () => {
    it('should return empty array for null/undefined/empty content', () => {
      expect(parseSafeText(null, allTags)).toEqual([]);
      expect(parseSafeText(undefined, allTags)).toEqual([]);
      expect(parseSafeText('', allTags)).toEqual([]);
    });

    it('should return single fragment for plain text without tags', () => {
      const result = parseSafeText('Texto simples', allTags);
      expect(result).toEqual([{ text: 'Texto simples', bold: false, italic: false, underline: false }]);
    });

    it('should parse bold tag correctly', () => {
      const result = parseSafeText('Texto <b>negrito</b> normal', allTags);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse italic tag correctly', () => {
      const result = parseSafeText('Texto <i>itálico</i> normal', allTags);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse underline tag correctly', () => {
      const result = parseSafeText('Texto <u>sublinhado</u> normal', allTags);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'sublinhado', bold: false, italic: false, underline: true },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse nested tags correctly', () => {
      const result = parseSafeText('<b><i>negrito e itálico</i></b>', allTags);
      expect(result).toEqual([{ text: 'negrito e itálico', bold: true, italic: true, underline: false }]);
    });

    it('should parse multiple nested tags', () => {
      const result = parseSafeText('<b><i><u>todos</u></i></b>', allTags);
      expect(result).toEqual([{ text: 'todos', bold: true, italic: true, underline: true }]);
    });

    it('should handle mixed formatting in sequence', () => {
      const result = parseSafeText('<b>negrito</b> e <i>itálico</i>', allTags);
      expect(result).toEqual([
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' e ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false }
      ]);
    });

    it('should sanitize disallowed tags (script)', () => {
      const result = parseSafeText('Texto <script>alert("xss")</script> seguro', allTags);
      expect(result).toEqual([{ text: 'Texto alert("xss") seguro', bold: false, italic: false, underline: false }]);
    });

    it('should sanitize disallowed tags (div, span, a)', () => {
      const result = parseSafeText('<div>conteúdo</div> <span>texto</span> <a href="x">link</a>', allTags);
      expect(result).toEqual([{ text: 'conteúdo texto link', bold: false, italic: false, underline: false }]);
    });

    it('should sanitize tags with attributes', () => {
      const result = parseSafeText('<b style="color:red">negrito</b>', allTags);
      expect(result).toEqual([{ text: 'negrito', bold: true, italic: false, underline: false }]);
    });

    it('should handle unclosed tags gracefully', () => {
      const result = parseSafeText('<b>negrito sem fechar', allTags);
      expect(result).toEqual([{ text: 'negrito sem fechar', bold: true, italic: false, underline: false }]);
    });

    it('should handle extra closing tags gracefully', () => {
      const result = parseSafeText('texto</b> normal', allTags);
      expect(result).toEqual([
        { text: 'texto', bold: false, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should handle case-insensitive tags', () => {
      const result = parseSafeText('<B>negrito</B> <I>itálico</I>', allTags);
      expect(result).toEqual([
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' ', bold: false, italic: false, underline: false },
        { text: 'itálico', bold: false, italic: true, underline: false }
      ]);
    });

    it('should prevent XSS via event handlers in allowed tags', () => {
      const result = parseSafeText('<b onmouseover="alert(1)">texto</b>', allTags);
      expect(result).toEqual([{ text: 'texto', bold: true, italic: false, underline: false }]);
    });

    it('should prevent XSS via img tag with onerror', () => {
      const result = parseSafeText('<img src=x onerror="alert(1)">texto', allTags);
      expect(result).toEqual([{ text: 'texto', bold: false, italic: false, underline: false }]);
    });

    it('should handle partially overlapping tags', () => {
      const result = parseSafeText('<b>bold <i>bold+italic</b> italic</i>', allTags);
      expect(result).toEqual([
        { text: 'bold ', bold: true, italic: false, underline: false },
        { text: 'bold+italic', bold: true, italic: true, underline: false },
        { text: ' italic', bold: false, italic: true, underline: false }
      ]);
    });

    it('should parse <strong> as bold', () => {
      const result = parseSafeText('Texto <strong>importante</strong> normal', allTags);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'importante', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should parse <em> as italic', () => {
      const result = parseSafeText('Texto <em>enfatizado</em> normal', allTags);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'enfatizado', bold: false, italic: true, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });
  });

  describe('with restricted tags (only bold)', () => {
    const boldOnly: Array<PoFormattingTag> = ['b', 'strong'];

    it('should parse bold tags', () => {
      const result = parseSafeText('Texto <b>negrito</b> normal', boldOnly);
      expect(result).toEqual([
        { text: 'Texto ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false },
        { text: ' normal', bold: false, italic: false, underline: false }
      ]);
    });

    it('should strip italic tags when not allowed', () => {
      const result = parseSafeText('Texto <i>itálico</i> e <b>negrito</b>', boldOnly);
      expect(result).toEqual([
        { text: 'Texto itálico e ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false }
      ]);
    });

    it('should strip underline tags when not allowed', () => {
      const result = parseSafeText('<u>sublinhado</u> e <strong>forte</strong>', boldOnly);
      expect(result).toEqual([
        { text: 'sublinhado e ', bold: false, italic: false, underline: false },
        { text: 'forte', bold: true, italic: false, underline: false }
      ]);
    });

    it('should strip em tags when not allowed', () => {
      const result = parseSafeText('<em>enfatizado</em> normal', boldOnly);
      expect(result).toEqual([{ text: 'enfatizado normal', bold: false, italic: false, underline: false }]);
    });
  });

  describe('with no tags allowed (empty array)', () => {
    it('should strip all formatting tags and return plain text', () => {
      const result = parseSafeText('<b>negrito</b> <i>itálico</i> <u>sublinhado</u>', []);
      expect(result).toEqual([{ text: 'negrito itálico sublinhado', bold: false, italic: false, underline: false }]);
    });
  });
});
