import { PoHelperContentPipe } from './po-helper-content.pipe';

describe('PoHelperContentPipe', () => {
  let pipe: PoHelperContentPipe;

  beforeEach(() => {
    pipe = new PoHelperContentPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array for null content', () => {
    expect(pipe.transform(null)).toEqual([]);
  });

  it('should return empty array for undefined content', () => {
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(pipe.transform('')).toEqual([]);
  });

  it('should return single fragment for plain text', () => {
    const result = pipe.transform('Texto simples');
    expect(result).toEqual([{ text: 'Texto simples', bold: false, italic: false, underline: false }]);
  });

  it('should parse bold tag', () => {
    const result = pipe.transform('Texto <b>negrito</b>');
    expect(result[1]).toEqual({ text: 'negrito', bold: true, italic: false, underline: false });
  });

  it('should parse italic tag', () => {
    const result = pipe.transform('Texto <i>itálico</i>');
    expect(result[1]).toEqual({ text: 'itálico', bold: false, italic: true, underline: false });
  });

  it('should parse underline tag', () => {
    const result = pipe.transform('Texto <u>sublinhado</u>');
    expect(result[1]).toEqual({ text: 'sublinhado', bold: false, italic: false, underline: true });
  });

  it('should normalize strong to bold', () => {
    const result = pipe.transform('<strong>bold</strong>');
    expect(result[0]).toEqual({ text: 'bold', bold: true, italic: false, underline: false });
  });

  it('should normalize em to italic', () => {
    const result = pipe.transform('<em>italic</em>');
    expect(result[0]).toEqual({ text: 'italic', bold: false, italic: true, underline: false });
  });

  it('should sanitize script tags', () => {
    const result = pipe.transform('<script>alert("xss")</script>safe');
    const allText = result.map(f => f.text).join('');
    expect(allText).not.toContain('<script>');
    expect(allText).toContain('safe');
  });
});
