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

    it('should parse nested tags correctly', () => {
      const result = parseSafeText('<b><i>negrito e itálico</i></b>', allTags);
      expect(result).toEqual([{ text: 'negrito e itálico', bold: true, italic: true, underline: false }]);
    });

    it('should sanitize disallowed tags (script)', () => {
      const result = parseSafeText('Texto <script>alert("xss")</script> seguro', allTags);
      expect(result).toEqual([{ text: 'Texto alert("xss") seguro', bold: false, italic: false, underline: false }]);
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

    it('should strip italic tags when not allowed', () => {
      const result = parseSafeText('Texto <i>itálico</i> e <b>negrito</b>', boldOnly);
      expect(result).toEqual([
        { text: 'Texto itálico e ', bold: false, italic: false, underline: false },
        { text: 'negrito', bold: true, italic: false, underline: false }
      ]);
    });
  });

  describe('with no tags allowed (empty array)', () => {
    it('should strip all formatting tags and return plain text', () => {
      const result = parseSafeText('<b>negrito</b> <i>itálico</i> <u>sublinhado</u>', []);
      expect(result).toEqual([{ text: 'negrito itálico sublinhado', bold: false, italic: false, underline: false }]);
    });
  });
});
