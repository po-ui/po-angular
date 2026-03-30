import { parseLlmsTxt } from './llms-parser';

describe('parseLlmsTxt', () => {
  it('deve retornar array vazio para texto vazio', () => {
    expect(parseLlmsTxt('')).toEqual([]);
  });

  it('deve retornar array vazio quando nao ha entradas validas', () => {
    const text = '# Titulo\n\nTexto sem entradas de lista.';
    expect(parseLlmsTxt(text)).toEqual([]);
  });

  it('deve parsear entrada com descricao', () => {
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

  it('deve parsear entrada sem descricao', () => {
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

  it('deve mapear todas as secoes conhecidas', () => {
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

    // "Servicos" sem acento nao esta no SECTION_MAP, entao fica como "servicos"
    const result = parseLlmsTxt(text);
    expect(result).toHaveLength(5);
    expect(result[0].section).toBe('components');
    expect(result[1].section).toBe('servicos');
    expect(result[2].section).toBe('interfaces');
    expect(result[3].section).toBe('enums');
    expect(result[4].section).toBe('guides');
  });

  it('deve mapear secao "Servicos" com acento corretamente', () => {
    const text = '## Servi\u00e7os\n- [Srv](https://x.io/llms-generated/srv.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].section).toBe('services');
  });

  it('deve usar "unknown" como secao padrao quando nao ha header', () => {
    const text = '- [Orphan](https://x.io/llms-generated/orphan.md): sem secao';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0].section).toBe('unknown');
  });

  it('deve remover extensao .md do slug', () => {
    const text = '## Componentes e Diretivas\n- [X](https://x.io/llms-generated/po-table.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].slug).toBe('po-table');
  });

  it('deve manter slug sem .md intacto', () => {
    const text = '## Guias\n- [X](https://x.io/guides/getting-started): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].slug).toBe('getting-started');
  });

  it('deve parsear multiplas entradas na mesma secao', () => {
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

  it('deve ignorar linhas que nao sao entradas nem headers', () => {
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

  it('deve fazer trim na descricao', () => {
    const text = '## Componentes e Diretivas\n- [X](https://x.io/llms-generated/x.md):   descricao com espacos   ';
    const result = parseLlmsTxt(text);

    expect(result[0].description).toBe('descricao com espacos');
  });

  it('deve lidar com secoes case-insensitive', () => {
    const text = '## COMPONENTES E DIRETIVAS\n- [X](https://x.io/llms-generated/x.md): desc';
    const result = parseLlmsTxt(text);

    expect(result[0].section).toBe('components');
  });

  it('deve lidar com linhas com espacos extras (trim)', () => {
    const text = '## Componentes e Diretivas\n   - [X](https://x.io/llms-generated/x.md): desc   ';
    const result = parseLlmsTxt(text);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('X');
  });
});
