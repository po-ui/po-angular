import { buildExcerpt, highlight, normalizeText, queryTerms, tokenize } from './search-text';

describe('search-text', () => {
  it('normalizeText remove acento e caixa mantendo o tamanho', () => {
    const text = 'Ação Útil çÇ ß';

    expect(normalizeText(text)).toBe('acao util cc ß');
    expect(normalizeText(text).length).toBe(text.length);
  });

  it('tokenize separa nomes de código mantendo o nome inteiro', () => {
    expect(tokenize('po-button')).toEqual(['po-button', 'po', 'button']);
    expect(tokenize('PoButtonKind')).toEqual(['pobuttonkind', 'po', 'button', 'kind']);
    expect(tokenize('po-button › p-kind')).toEqual(['po-button', 'po', 'button', 'p-kind', 'p', 'kind']);
    expect(tokenize('Botão')).toEqual(['botao']);
  });

  it('queryTerms usa o nome inteiro e descarta pedaços e termos de 1 caractere', () => {
    expect(queryTerms('po-button')).toEqual(['po-button']);
    expect(queryTerms('p-kind')).toEqual(['p-kind']);
    expect(queryTerms('botao cor')).toEqual(['botao', 'cor']);
  });

  it('highlight marca só começo de palavra, sem acento e sem usar HTML', () => {
    const parts = highlight('Possível po-button <b>x</b>', ['po-button', 'pos']);

    expect(parts.filter(p => p.mark).map(p => p.text)).toEqual(['Pos', 'po-button']);
    expect(parts.map(p => p.text).join('')).toBe('Possível po-button <b>x</b>');
    expect(highlight('metapo', ['po']).some(p => p.mark)).toBe(false);
  });

  describe('buildExcerpt', () => {
    const long = `${'palavra '.repeat(30)}alvo no meio ${'texto '.repeat(30)}fim`;

    it('devolve o texto inteiro quando é curto', () => {
      expect(buildExcerpt('um botão simples', ['botao'])).toEqual([
        { text: 'um ', mark: false },
        { text: 'botão', mark: true },
        { text: ' simples', mark: false }
      ]);
    });

    it('corta em volta do termo com reticências nos dois lados', () => {
      const parts = buildExcerpt(long, ['alvo']);
      const text = parts.map(p => p.text).join('');

      expect(parts[0].text).toBe('…');
      expect(parts[parts.length - 1].text).toBe('…');
      expect(text.length).toBeLessThan(long.length);
      expect(parts.find(p => p.mark).text).toBe('alvo');
    });

    it('termo no começo: sem reticências à esquerda; no fim: sem à direita', () => {
      expect(buildExcerpt(`inicio ${long}`, ['inicio'])[0]).toEqual({ text: 'inicio', mark: true });
      expect(buildExcerpt(`${long} final`, ['final']).pop()).toEqual({ text: 'final', mark: true });
    });

    it('sem ocorrência mostra o começo; repetido marca todos', () => {
      expect(
        buildExcerpt(long, ['inexistente'])
          .map(p => p.text)
          .join('')
          .endsWith('…')
      ).toBe(true);
      expect(buildExcerpt('cor e cor', ['cor']).filter(p => p.mark).length).toBe(2);
    });

    it('não quebra com caracteres especiais de regex', () => {
      expect(
        buildExcerpt('a (b) [c] .* d', ['(b)', '.*'])
          .filter(p => p.mark)
          .map(p => p.text)
      ).toEqual(['(b)', '.*']);
      expect(buildExcerpt('x', [])).toEqual([{ text: 'x', mark: false }]);
    });
  });
});
