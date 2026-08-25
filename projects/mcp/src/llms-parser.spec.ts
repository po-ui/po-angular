import { parseLlmsTxt } from './llms-parser';

describe('parseLlmsTxt', () => {
  it('should return an empty array for an empty text', () => {
    expect(parseLlmsTxt('')).toEqual([]);
  });

  it('should return an empty array when there is no valid entry', () => {
    const text = '# Titulo\n\nTexto sem entradas de lista.';
    expect(parseLlmsTxt(text)).toEqual([]);
  });

  it('should parse an entry with a description', () => {
    const text =
      '## Componentes e Diretivas\n- [PoButton](https://po-ui.io/llms-generated/po-button.md): Componente de botao';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'PoButton',
      slug: 'po-button',
      url: 'https://po-ui.io/llms-generated/po-button.md',
      description: 'Componente de botao',
      section: 'components'
    });
  });

  it('should parse an entry without a description', () => {
    const text = '## Guias\n- [Getting Started](https://po-ui.io/guides/getting-started)';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Getting Started',
      slug: 'getting-started',
      url: 'https://po-ui.io/guides/getting-started',
      description: '',
      section: 'guides'
    });
  });

  it('should map every known section', () => {
    const text = [
      '## Componentes e Diretivas',
      '- [A](https://x.io/llms-generated/a.md): desc',
      '## Servicos',
      '- [B](https://x.io/llms-generated/b.md): desc',
      '## Interfaces e Modelos',
      '- [C](https://x.io/llms-generated/c.md): desc',
      '## Enums',
      '- [D](https://x.io/llms-generated/d.md): desc',
      '## Guias',
      '- [E](https://x.io/guides/e): desc'
    ].join('\n');

    // "Servicos" without the cedilla is not in SECTION_MAP, so it stays as "servicos"
    const result = parseLlmsTxt(text);
    expect(result).toHaveLength(5);
    expect(result[0].section).toBe('components');
    expect(result[1].section).toBe('servicos');
    expect(result[2].section).toBe('interfaces');
    expect(result[3].section).toBe('enums');
    expect(result[4].section).toBe('guides');
  });

  it('should map the "Serviços" section when the cedilla is present', () => {
    const text = '## Servi\u00e7os\n- [Srv](https://x.io/llms-generated/srv.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].section).toBe('services');
  });

  it('should use "unknown" as the default section when there is no header', () => {
    const text = '- [Orphan](https://x.io/llms-generated/orphan.md): sem secao';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0].section).toBe('unknown');
  });

  it('should strip the .md extension from the slug', () => {
    const text = '## Componentes e Diretivas\n- [X](https://x.io/llms-generated/po-table.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].slug).toBe('po-table');
  });

  it('should keep a slug without .md untouched', () => {
    const text = '## Guias\n- [X](https://x.io/guides/getting-started): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].slug).toBe('getting-started');
  });

  it('should parse multiple entries within the same section', () => {
    const text = [
      '## Componentes e Diretivas',
      '- [PoButton](https://x.io/llms-generated/po-button.md): botao',
      '- [PoTable](https://x.io/llms-generated/po-table.md): tabela',
      '- [PoModal](https://x.io/llms-generated/po-modal.md): modal'
    ].join('\n');

    const result = parseLlmsTxt(text);
    expect(result).toHaveLength(3);
    expect(result.map(e => e.slug)).toEqual(['po-button', 'po-table', 'po-modal']);
  });

  it('should ignore lines that are neither entries nor headers', () => {
    const text = [
      '# Titulo Principal',
      '',
      'Descricao geral do documento.',
      '',
      '## Componentes e Diretivas',
      '',
      'Texto descritivo da secao.',
      '- [PoButton](https://x.io/llms-generated/po-button.md): botao',
      '',
      'Mais texto.'
    ].join('\n');

    const result = parseLlmsTxt(text);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('PoButton');
  });

  it('should trim the description', () => {
    const text = '## Componentes e Diretivas\n- [X](https://x.io/llms-generated/x.md):   descricao com espacos   ';
    const result = parseLlmsTxt(text);

    expect(result[0].description).toBe('descricao com espacos');
  });

  it('should match section headers case-insensitively', () => {
    const text = '## COMPONENTES E DIRETIVAS\n- [X](https://x.io/llms-generated/x.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].section).toBe('components');
  });

  it('should handle lines with extra surrounding whitespace', () => {
    const text = '## Componentes e Diretivas\n   - [X](https://x.io/llms-generated/x.md): desc   ';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('X');
  });
});
