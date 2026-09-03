import {
  normaliseSlug,
  extractHeading,
  findMatchingLineIndexes,
  buildContextSnippet,
  searchFullText,
  createServer
} from './server';

// ── normaliseSlug ────────────────────────────────────────────────────────────

describe('normaliseSlug', () => {
  it('deve retornar slug kebab-case inalterado', () => {
    expect(normaliseSlug('po-button')).toBe('po-button');
  });

  it('deve fazer trim de espacos', () => {
    expect(normaliseSlug('  po-button  ')).toBe('po-button');
  });

  it('deve remover angle brackets', () => {
    expect(normaliseSlug('<po-button>')).toBe('po-button');
  });

  it('deve converter CamelCase para kebab-case', () => {
    expect(normaliseSlug('PoButtonComponent')).toBe('po-button');
  });

  it('deve remover sufixo -component', () => {
    expect(normaliseSlug('PoTableComponent')).toBe('po-table');
  });

  it('deve converter class name de servico', () => {
    expect(normaliseSlug('PoDialogService')).toBe('po-dialog-service');
  });

  it('deve converter siglas em CamelCase corretamente', () => {
    expect(normaliseSlug('PoHTTPInterceptor')).toBe('po-http-interceptor');
  });

  it('deve manter slug com numeros', () => {
    expect(normaliseSlug('po-chart-v2')).toBe('po-chart-v2');
  });

  it('nao deve converter quando ja e lowercase', () => {
    expect(normaliseSlug('po-dialog-service')).toBe('po-dialog-service');
  });

  it('deve lidar com string vazia', () => {
    expect(normaliseSlug('')).toBe('');
  });

  it('deve lidar com angle brackets vazios', () => {
    expect(normaliseSlug('<>')).toBe('');
  });
});

// ── extractHeading ───────────────────────────────────────────────────────────

describe('extractHeading', () => {
  it('deve extrair heading de linha com #', () => {
    expect(extractHeading(['# PoButton', '', 'Descricao'])).toBe('PoButton');
  });

  it('deve retornar "Desconhecido" quando nao ha heading', () => {
    expect(extractHeading(['Sem heading', 'Outra linha'])).toBe('Desconhecido');
  });

  it('deve retornar "Desconhecido" para array vazio', () => {
    expect(extractHeading([])).toBe('Desconhecido');
  });

  it('deve fazer trim do heading', () => {
    expect(extractHeading(['# PoButton  '])).toBe('PoButton');
  });

  it('deve pegar apenas o primeiro heading', () => {
    expect(extractHeading(['# Primeiro', '# Segundo'])).toBe('Primeiro');
  });

  it('nao deve confundir ## com #', () => {
    expect(extractHeading(['## SubHeading', 'texto'])).toBe('Desconhecido');
  });
});

// ── findMatchingLineIndexes ──────────────────────────────────────────────────

describe('findMatchingLineIndexes', () => {
  const lines = ['Linha zero', 'Linha com BUSCA aqui', 'Outra linha', 'Mais busca aqui'];

  it('deve encontrar indices das linhas que contem a query', () => {
    expect(findMatchingLineIndexes(lines, 'busca')).toEqual([1, 3]);
  });

  it('deve ser case-insensitive (query ja vem em lowercase)', () => {
    expect(findMatchingLineIndexes(lines, 'busca')).toEqual([1, 3]);
  });

  it('deve retornar array vazio quando nao encontra', () => {
    expect(findMatchingLineIndexes(lines, 'inexistente')).toEqual([]);
  });

  it('deve retornar todos os indices para match universal', () => {
    expect(findMatchingLineIndexes(lines, 'linha')).toEqual([0, 1, 2]);
  });

  it('deve lidar com array vazio', () => {
    expect(findMatchingLineIndexes([], 'busca')).toEqual([]);
  });
});

// ── buildContextSnippet ──────────────────────────────────────────────────────

describe('buildContextSnippet', () => {
  const lines = [
    'Linha 0', // 0
    'Linha 1', // 1
    'Linha 2', // 2
    'Linha 3', // 3
    'Linha 4', // 4
    'Linha 5', // 5
    'Linha 6', // 6
    'Linha 7', // 7
    'Linha 8', // 8
    'Linha 9' // 9
  ];

  it('deve incluir +-2 linhas ao redor do match', () => {
    const result = buildContextSnippet(lines, [5]);
    expect(result).toContain('Linha 3');
    expect(result).toContain('Linha 4');
    expect(result).toContain('Linha 5');
    expect(result).toContain('Linha 6');
    expect(result).toContain('Linha 7');
    expect(result).toContain('...');
  });

  it('deve respeitar limite inferior (indice 0)', () => {
    const result = buildContextSnippet(lines, [1]);
    expect(result).toContain('Linha 0');
    expect(result).toContain('Linha 1');
    expect(result).toContain('Linha 2');
    expect(result).toContain('Linha 3');
  });

  it('deve respeitar limite superior (ultimo indice)', () => {
    const result = buildContextSnippet(lines, [9]);
    expect(result).toContain('Linha 7');
    expect(result).toContain('Linha 8');
    expect(result).toContain('Linha 9');
  });

  it('deve limitar a 3 matches para contexto', () => {
    const result = buildContextSnippet(lines, [0, 3, 6, 9]);
    // Deve ter no maximo 3 separadores "..." (um por match usado)
    const ellipsisCount = (result.match(/\.\.\./g) || []).length;
    expect(ellipsisCount).toBeLessThanOrEqual(3);
  });

  it('deve nao duplicar linhas em matches proximos', () => {
    const result = buildContextSnippet(lines, [4, 5]);
    const resultLines = result.split('\n').filter(l => l !== '...' && l !== '');
    const uniqueLines = [...new Set(resultLines)];
    expect(resultLines.length).toBe(uniqueLines.length);
  });

  it('deve retornar string vazia para array de indexes vazio', () => {
    expect(buildContextSnippet(lines, [])).toBe('');
  });

  it('deve incluir separador ... apos cada bloco de contexto', () => {
    const result = buildContextSnippet(lines, [2]);
    expect(result).toContain('...');
  });
});

// ── searchFullText ───────────────────────────────────────────────────────────

describe('searchFullText', () => {
  const fullText = [
    '# PoButtonComponent',
    '',
    'Componente de botao do PO UI.',
    'Permite acoes de clique com p-loading.',
    '',
    '## Propriedades',
    '',
    '| Propriedade | Tipo |',
    '| p-label | string |',
    '| p-loading | boolean |',
    '',
    '',
    '---',
    '',
    '',
    '# PoTableComponent',
    '',
    'Componente de tabela do PO UI.',
    'Suporta lazy load de dados.',
    '',
    '## Propriedades',
    '',
    '| Propriedade | Tipo |',
    '| p-columns | Array |',
    '| p-items | Array |',
    '',
    '',
    '---',
    '',
    '',
    '# PoInputComponent',
    '',
    'Campo de entrada de texto.',
    'Suporta validacao e p-loading indicator.',
    '',
    '## Propriedades',
    '',
    '| Propriedade | Tipo |',
    '| p-label | string |',
    '| p-required | boolean |'
  ].join('\n');

  it('deve encontrar resultados em multiplas secoes', () => {
    const results = searchFullText(fullText, 'p-loading', 10);
    expect(results).toHaveLength(2);
    expect(results[0].componentName).toBe('PoButtonComponent');
    expect(results[1].componentName).toBe('PoInputComponent');
  });

  it('deve ser case-insensitive', () => {
    const results = searchFullText(fullText, 'P-LOADING', 10);
    expect(results).toHaveLength(2);
  });

  it('deve respeitar maxResults', () => {
    const results = searchFullText(fullText, 'p-loading', 1);
    expect(results).toHaveLength(1);
    expect(results[0].componentName).toBe('PoButtonComponent');
  });

  it('deve retornar array vazio quando nao encontra', () => {
    const results = searchFullText(fullText, 'xyznonexistent', 10);
    expect(results).toHaveLength(0);
  });

  it('deve retornar array vazio para texto vazio', () => {
    const results = searchFullText('', 'busca', 10);
    expect(results).toHaveLength(0);
  });

  it('deve retornar "Desconhecido" quando secao nao tem heading', () => {
    const text = 'Secao sem heading\nalgum texto com busca\noutro texto';
    const results = searchFullText(text, 'busca', 10);
    expect(results).toHaveLength(1);
    expect(results[0].componentName).toBe('Desconhecido');
  });

  it('deve incluir contexto no resultado', () => {
    const results = searchFullText(fullText, 'lazy load', 10);
    expect(results).toHaveLength(1);
    expect(results[0].context).toContain('lazy load');
    expect(results[0].context).toContain('...');
  });

  it('deve encontrar todas as secoes quando query e comum', () => {
    const results = searchFullText(fullText, 'Propriedade', 10);
    expect(results).toHaveLength(3);
  });

  it('deve ter componentName e context como strings nao-vazias', () => {
    const results = searchFullText(fullText, 'tabela', 10);
    expect(results).toHaveLength(1);
    expect(typeof results[0].componentName).toBe('string');
    expect(typeof results[0].context).toBe('string');
    expect(results[0].componentName.length).toBeGreaterThan(0);
    expect(results[0].context.length).toBeGreaterThan(0);
  });

  it('deve ignorar secao quando contem query no texto completo mas nenhuma linha individual contem', () => {
    // Query que cruza quebra de linha: presente na secao mas nao em linhas individuais
    const text = 'abc\ndef';
    const results = searchFullText(text, 'abc\ndef', 10);
    expect(results).toHaveLength(0);
  });
});

// ── createServer - tool handlers (com mock do McpServer) ────────────────────

describe('createServer - tool handlers', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const registeredTools = new Map<string, Function>();

  jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
    McpServer: jest.fn().mockImplementation(() => ({
      registerTool: jest.fn((name: string, _config: any, cb: Function) => {
        registeredTools.set(name, cb);
      })
    }))
  }));

  jest.mock('./docs-client');

  /* eslint-disable @typescript-eslint/no-var-requires */
  const docsClient = require('./docs-client') as {
    fetchBestPractices: jest.Mock;
    fetchComponentExamples: jest.Mock;
    fetchLlmsTxt: jest.Mock;
    fetchLlmsFullTxt: jest.Mock;
    fetchComponentDoc: jest.Mock;
    fetchGuide: jest.Mock;
  };

  const MOCK_LLMS_TXT = [
    '## Componentes e Diretivas',
    '- [PoButton](https://po-ui.io/llms-generated/po-button.md): Componente de botao',
    '- [PoTable](https://po-ui.io/llms-generated/po-table.md): Componente de tabela',
    '## Servi\u00e7os',
    '- [PoDialogService](https://po-ui.io/llms-generated/po-dialog-service.md): Servico de dialogo',
    '## Guias',
    '- [Getting Started](https://po-ui.io/guides/getting-started): Guia inicial'
  ].join('\n');

  const MOCK_LLMS_FULL_TXT = [
    '# PoButton',
    '',
    'Componente de botao com p-loading.',
    '',
    '',
    '---',
    '',
    '',
    '# PoTable',
    '',
    'Componente de tabela com lazy load.'
  ].join('\n');

  beforeEach(() => {
    registeredTools.clear();
    jest.clearAllMocks();

    jest.isolateModules(() => {
      const mod = require('./server');
      mod.createServer();
    });
  });

  // ── list_components ──────────────────────────────────────────────────

  describe('list_components', () => {
    it('deve listar todos os componentes com section=all', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all' });
      expect(result.content[0].text).toContain('PoButton');
      expect(result.content[0].text).toContain('PoTable');
      expect(result.content[0].text).toContain('PoDialogService');
      expect(result.structuredContent.count).toBe(4);
      expect(result.structuredContent.items[0].url).toContain('po-ui.io');
    });

    it('deve usar section=all como padrao quando nao informado', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('PoButton');
      expect(result.content[0].text).toContain('PoDialogService');
    });

    it('deve filtrar por section especifica', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'guides' });
      expect(result.content[0].text).toContain('Getting Started');
      expect(result.content[0].text).not.toContain('PoButton');
    });

    it('deve aplicar filtro de texto', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all', filter: 'tabela' });
      expect(result.content[0].text).toContain('PoTable');
      expect(result.content[0].text).not.toContain('PoDialogService');
    });

    it('deve retornar mensagem quando nenhum resultado e encontrado', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all', filter: 'xyzinexistente' });
      expect(result.content[0].text).toContain('Nenhum resultado encontrado');
      expect(result.structuredContent).toEqual({ count: 0, items: [], section: 'all' });
    });

    it('deve retornar erro quando fetchLlmsTxt falha', async () => {
      docsClient.fetchLlmsTxt.mockRejectedValue(new Error('Network error'));
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all' });
      expect(result.content[0].text).toContain('Erro ao carregar');
      expect(result.content[0].text).toContain('Network error');
      expect(result.isError).toBe(true);
    });

    it('deve agrupar resultados por secao', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all' });
      expect(result.content[0].text).toContain('Componentes e Diretivas');
    });

    it('deve usar cache de entradas na segunda chamada', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('list_components')!;
      await handler({ section: 'all' });
      await handler({ section: 'all' });
      expect(docsClient.fetchLlmsTxt).toHaveBeenCalledTimes(1);
    });

    it('deve converter erro nao-Error para string quando fetchLlmsTxt rejeita com valor nao-Error', async () => {
      docsClient.fetchLlmsTxt.mockRejectedValue('erro simples');
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all' });
      expect(result.content[0].text).toContain('Erro ao carregar');
      expect(result.content[0].text).toContain('erro simples');
    });

    it('deve usar nome da secao como fallback quando nao ha label em SECTION_LABELS', async () => {
      docsClient.fetchLlmsTxt.mockResolvedValue(
        '## Secao Desconhecida\n- [Foo](https://po-ui.io/llms-generated/foo.md): descricao'
      );
      const handler = registeredTools.get('list_components')!;
      const result = await handler({ section: 'all' });
      expect(result.content[0].text).toContain('secao desconhecida');
    });
  });

  // ── get_component_docs ───────────────────────────────────────────────

  describe('get_component_docs', () => {
    it('deve retornar documentacao do componente com sucesso', async () => {
      docsClient.fetchComponentDoc.mockResolvedValue('# PoButton\nDocumentacao completa');
      const handler = registeredTools.get('get_component_docs')!;
      const result = await handler({ slug: 'po-button' });
      expect(result.content[0].text).toContain('# PoButton');
      expect(result.content[0].text).toContain('Documentacao completa');
      expect(result.structuredContent).toEqual({
        content: '# PoButton\nDocumentacao completa',
        documentationUrl: 'https://po-ui.io/documentation/po-button',
        slug: 'po-button',
        sourceUrl: 'https://po-ui.io/llms-generated/po-button.md'
      });
    });

    it('deve normalizar slug antes de buscar', async () => {
      docsClient.fetchComponentDoc.mockResolvedValue('# PoButton\nDoc');
      const handler = registeredTools.get('get_component_docs')!;
      await handler({ slug: 'PoButtonComponent' });
      expect(docsClient.fetchComponentDoc).toHaveBeenCalledWith('po-button');
    });

    it('deve normalizar slug com angle brackets', async () => {
      docsClient.fetchComponentDoc.mockResolvedValue('# PoButton\nDoc');
      const handler = registeredTools.get('get_component_docs')!;
      await handler({ slug: '<po-button>' });
      expect(docsClient.fetchComponentDoc).toHaveBeenCalledWith('po-button');
    });

    it('deve tentar slug original quando normalizado falha', async () => {
      docsClient.fetchComponentDoc
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce('# CustomSlug\nDoc');
      const handler = registeredTools.get('get_component_docs')!;
      const result = await handler({ slug: 'CustomSlug' });
      expect(docsClient.fetchComponentDoc).toHaveBeenCalledTimes(2);
      expect(result.content[0].text).toContain('# CustomSlug');
    });

    it('deve retornar sugestoes quando componente nao encontrado', async () => {
      docsClient.fetchComponentDoc.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('get_component_docs')!;
      const result = await handler({ slug: 'po-button' });
      expect(result.content[0].text).toContain('n\u00e3o encontrado');
      expect(result.isError).toBe(true);
    });

    it('deve retornar mensagem generica quando sugestoes falham', async () => {
      docsClient.fetchComponentDoc.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockRejectedValue(new Error('Index error'));
      const handler = registeredTools.get('get_component_docs')!;
      const result = await handler({ slug: 'po-button' });
      expect(result.content[0].text).toContain('n\u00e3o encontrado');
      expect(result.content[0].text).toContain('list_components');
    });

    it('deve retornar mensagem sem sugestoes quando slug nao corresponde a nenhuma entrada', async () => {
      docsClient.fetchComponentDoc.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('get_component_docs')!;
      const result = await handler({ slug: 'xyz-totally-unrelated' });
      expect(result.content[0].text).toContain('Use list_components para ver todos os slugs dispon\u00edveis.');
      expect(result.isError).toBe(true);
    });
  });

  // ── get_component_examples ──────────────────────────────────────────

  describe('get_component_examples', () => {
    const examples = [
      {
        name: 'sample-po-button-basic',
        url: 'https://github.com/po-ui/po-angular/tree/master/sample-po-button-basic',
        files: [
          {
            content: '<po-button></po-button>',
            language: 'html',
            name: 'sample-po-button-basic.component.html',
            url: 'https://github.com/po-ui/po-angular/blob/master/sample-po-button-basic.component.html'
          }
        ]
      }
    ];

    it('should return official component examples with structured content', async () => {
      docsClient.fetchComponentExamples.mockResolvedValue({
        examples,
        sourceSlug: 'po-button',
        status: 'available'
      });
      const handler = registeredTools.get('get_component_examples')!;

      const result = await handler({ slug: 'PoButtonComponent', example: 'basic', max_examples: 1 });

      expect(docsClient.fetchComponentExamples).toHaveBeenCalledWith('po-button', 1, 'basic');
      expect(result.content[0].text).toContain('sample-po-button-basic');
      expect(result.structuredContent.slug).toBe('po-button');
      expect(result.structuredContent.examples).toEqual(examples);
      expect(result.structuredContent.sourceSlug).toBe('po-button');
      expect(result.structuredContent.status).toBe('available');
    });

    it('should use three examples as the default limit', async () => {
      docsClient.fetchComponentExamples.mockResolvedValue({
        examples,
        sourceSlug: 'po-button',
        status: 'available'
      });
      const handler = registeredTools.get('get_component_examples')!;

      await handler({ slug: 'po-button' });

      expect(docsClient.fetchComponentExamples).toHaveBeenCalledWith('po-button', 3, undefined);
    });

    it('should identify examples returned from the parent component', async () => {
      docsClient.fetchComponentExamples.mockResolvedValue({
        examples,
        sourceSlug: 'po-tabs',
        status: 'available'
      });
      const handler = registeredTools.get('get_component_examples')!;

      const result = await handler({ slug: 'po-tab' });

      expect(result.content[0].text).toContain('componente pai "po-tabs"');
      expect(result.structuredContent.sourceSlug).toBe('po-tabs');
    });

    it('should return structured empty content when no example matches', async () => {
      docsClient.fetchComponentExamples.mockResolvedValue({
        examples: [],
        sourceSlug: 'po-button',
        status: 'no_match'
      });
      const handler = registeredTools.get('get_component_examples')!;

      const result = await handler({ slug: 'po-button', example: 'inexistente' });

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain('corresponde ao filtro');
      expect(result.structuredContent.examples).toEqual([]);
      expect(result.structuredContent.status).toBe('no_match');
    });

    it('should explain when the component has no official examples', async () => {
      docsClient.fetchComponentExamples.mockResolvedValue({
        examples: [],
        sourceSlug: 'po-navbar',
        status: 'not_available'
      });
      const handler = registeredTools.get('get_component_examples')!;

      const result = await handler({ slug: 'po-navbar' });

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain('não possui exemplos oficiais próprios');
      expect(result.structuredContent.status).toBe('not_available');
    });

    it('should return a tool error when examples cannot be loaded', async () => {
      docsClient.fetchComponentExamples.mockRejectedValue(new Error('GitHub unavailable'));
      const handler = registeredTools.get('get_component_examples')!;

      const result = await handler({ slug: 'po-button' });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('GitHub unavailable');
    });
  });

  // ── get_best_practices ──────────────────────────────────────────────

  describe('get_best_practices', () => {
    it('should return the selected official source with structured content', async () => {
      docsClient.fetchBestPractices.mockResolvedValue({
        content: '# Primeiros passos',
        title: 'Primeiros passos',
        url: 'https://github.com/po-ui/po-angular/blob/master/docs/guides/getting-started.md'
      });
      const handler = registeredTools.get('get_best_practices')!;

      const result = await handler({ topic: 'getting-started' });

      expect(docsClient.fetchBestPractices).toHaveBeenCalledWith('getting-started');
      expect(result.content[0].text).toContain('Fonte oficial');
      expect(result.structuredContent).toEqual({
        content: '# Primeiros passos',
        source: {
          title: 'Primeiros passos',
          url: 'https://github.com/po-ui/po-angular/blob/master/docs/guides/getting-started.md'
        },
        topic: 'getting-started'
      });
    });

    it('should return a tool error when best practices cannot be loaded', async () => {
      docsClient.fetchBestPractices.mockRejectedValue('source unavailable');
      const handler = registeredTools.get('get_best_practices')!;

      const result = await handler({ topic: 'contributing' });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('source unavailable');
    });
  });

  // ── search_docs ──────────────────────────────────────────────────────

  describe('search_docs', () => {
    it('deve retornar resultados de busca formatados', async () => {
      docsClient.fetchLlmsFullTxt.mockResolvedValue(MOCK_LLMS_FULL_TXT);
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'p-loading' });
      expect(result.content[0].text).toContain('Encontrados');
      expect(result.content[0].text).toContain('PoButton');
      expect(result.structuredContent.results[0]).toEqual(
        expect.objectContaining({
          componentName: 'PoButton',
          slug: 'po-button',
          url: 'https://po-ui.io/documentation/po-button'
        })
      );
    });

    it('deve usar max_results padrao de 10', async () => {
      docsClient.fetchLlmsFullTxt.mockResolvedValue(MOCK_LLMS_FULL_TXT);
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'Componente' });
      expect(result.content[0].text).toContain('Encontrados');
    });

    it('deve respeitar max_results personalizado', async () => {
      docsClient.fetchLlmsFullTxt.mockResolvedValue(MOCK_LLMS_FULL_TXT);
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'Componente', max_results: 1 });
      expect(result.content[0].text).toContain('1 resultado(s)');
    });

    it('deve retornar mensagem quando nao encontra resultados', async () => {
      docsClient.fetchLlmsFullTxt.mockResolvedValue(MOCK_LLMS_FULL_TXT);
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'xyzinexistente' });
      expect(result.content[0].text).toContain('Nenhum resultado encontrado');
      expect(result.structuredContent).toEqual({ count: 0, query: 'xyzinexistente', results: [] });
    });

    it('deve retornar erro quando fetchLlmsFullTxt falha', async () => {
      docsClient.fetchLlmsFullTxt.mockRejectedValue(new Error('Timeout'));
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'botao' });
      expect(result.content[0].text).toContain('Erro ao carregar');
      expect(result.content[0].text).toContain('Timeout');
      expect(result.isError).toBe(true);
    });

    it('deve incluir contexto nos resultados', async () => {
      docsClient.fetchLlmsFullTxt.mockResolvedValue(MOCK_LLMS_FULL_TXT);
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'lazy load' });
      expect(result.content[0].text).toContain('PoTable');
    });

    it('deve converter erro nao-Error para string no search_docs', async () => {
      docsClient.fetchLlmsFullTxt.mockRejectedValue('timeout string');
      const handler = registeredTools.get('search_docs')!;
      const result = await handler({ query: 'botao' });
      expect(result.content[0].text).toContain('Erro ao carregar');
      expect(result.content[0].text).toContain('timeout string');
    });
  });

  // ── get_guide ────────────────────────────────────────────────────────

  describe('get_guide', () => {
    it('deve retornar conteudo do guia com sucesso', async () => {
      docsClient.fetchGuide.mockResolvedValue('# Getting Started\nConteudo do guia');
      const handler = registeredTools.get('get_guide')!;
      const result = await handler({ guide: 'getting-started' });
      expect(result.content[0].text).toContain('# Getting Started');
      expect(result.content[0].text).toContain('Conteudo do guia');
      expect(result.structuredContent).toEqual({
        content: '# Getting Started\nConteudo do guia',
        guide: 'getting-started',
        url: 'https://github.com/po-ui/po-angular/blob/master/docs/guides/getting-started.md'
      });
    });

    it('deve retornar erro com lista de guias disponiveis quando falha', async () => {
      docsClient.fetchGuide.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('get_guide')!;
      const result = await handler({ guide: 'guia-inexistente' });
      expect(result.content[0].text).toContain('Erro');
      expect(result.content[0].text).toContain('Guias dispon\u00edveis');
      expect(result.content[0].text).toContain('Getting Started');
      expect(result.isError).toBe(true);
    });

    it('deve retornar apenas erro quando indice tambem falha', async () => {
      docsClient.fetchGuide.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockRejectedValue(new Error('Index error'));
      const handler = registeredTools.get('get_guide')!;
      const result = await handler({ guide: 'guia-inexistente' });
      expect(result.content[0].text).toContain('Erro');
      expect(result.content[0].text).toContain('Not found');
    });

    it('deve converter erro nao-Error para string no get_guide', async () => {
      docsClient.fetchGuide.mockRejectedValue('string error');
      docsClient.fetchLlmsTxt.mockResolvedValue(MOCK_LLMS_TXT);
      const handler = registeredTools.get('get_guide')!;
      const result = await handler({ guide: 'xyz' });
      expect(result.content[0].text).toContain('Erro');
      expect(result.content[0].text).toContain('string error');
    });

    it('deve exibir "Nenhum guia no indice" quando nao ha guias no indice', async () => {
      docsClient.fetchGuide.mockRejectedValue(new Error('Not found'));
      docsClient.fetchLlmsTxt.mockResolvedValue(
        '## Componentes e Diretivas\n- [PoButton](https://po-ui.io/llms-generated/po-button.md): Componente'
      );
      const handler = registeredTools.get('get_guide')!;
      const result = await handler({ guide: 'xyz' });
      expect(result.content[0].text).toContain('Nenhum guia no \u00edndice');
    });
  });
});

// ── createServer (instancia real) ───────────────────────────────────────────

describe('createServer', () => {
  it('deve criar uma instancia do McpServer', () => {
    const server = createServer();
    expect(server).toBeDefined();
    expect(typeof server).toBe('object');
  });

  it('deve ter o nome "po-ui"', () => {
    const server = createServer();
    expect(server).toBeDefined();
  });
});
