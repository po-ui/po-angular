import {
  clearRepositoryTreeCache,
  fetchBestPractices,
  fetchComponentDoc,
  fetchComponentExamples,
  fetchGuide,
  fetchLlmsFullTxt,
  fetchLlmsTxt,
  getLanguage
} from './docs-client';

let fetchMock: jest.SpiedFunction<typeof fetch>;

function mockFetch(statusCode: number, body: string): void {
  fetchMock.mockImplementation(async () => new Response(body, { status: statusCode }));
}

function mockFetchSequence(responses: Array<{ statusCode: number; body: string }>): void {
  let callIndex = 0;

  fetchMock.mockImplementation(async () => {
    const resp = responses[callIndex] ?? responses[responses.length - 1];
    callIndex++;
    return new Response(resp.body, { status: resp.statusCode });
  });
}

function mockFetchError(error: unknown): void {
  fetchMock.mockRejectedValue(error);
}

beforeEach(() => {
  fetchMock = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('fetch não mockado'));
  clearRepositoryTreeCache();
});

afterEach(() => {
  fetchMock.mockRestore();
});

describe('fetchLlmsTxt', () => {
  it('should return the text when the response is 200', async () => {
    mockFetch(200, 'conteudo do llms.txt');

    const result = await fetchLlmsTxt();
    expect(result).toBe('conteudo do llms.txt');
  });

  it('should throw when the response is not ok', async () => {
    mockFetch(404, 'Not Found');

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP 404)');
  });

  it('should call the correct URL', async () => {
    mockFetch(200, 'ok');

    await fetchLlmsTxt();
    expect(fetchMock).toHaveBeenCalledWith('https://po-ui.io/llms.txt', expect.any(Object));
  });

  it('should report a transport failure', async () => {
    mockFetchError(new TypeError('fetch failed'));

    await expect(fetchLlmsTxt()).rejects.toThrow('HTTP desconhecido');
  });
});

describe('fetchLlmsFullTxt', () => {
  it('should return the text when the response is 200', async () => {
    mockFetch(200, 'conteudo completo');

    const result = await fetchLlmsFullTxt();
    expect(result).toBe('conteudo completo');
  });

  it('should throw when the response is not ok', async () => {
    mockFetch(500, 'Internal Error');

    await expect(fetchLlmsFullTxt()).rejects.toThrow('Falha ao buscar llms-full.txt (HTTP 500)');
  });

  it('should call the correct URL', async () => {
    mockFetch(200, 'ok');

    await fetchLlmsFullTxt();
    expect(fetchMock).toHaveBeenCalledWith('https://po-ui.io/llms-full.txt', expect.any(Object));
  });
});

describe('fetchComponentDoc', () => {
  it('should return the doc from the primary URL when available', async () => {
    mockFetch(200, '# PoButton\nDocumentacao...');

    const result = await fetchComponentDoc('po-button');
    expect(result).toBe('# PoButton\nDocumentacao...');
  });

  it('should call the correct primary URL', async () => {
    mockFetch(200, 'doc');

    await fetchComponentDoc('po-table');
    expect(fetchMock).toHaveBeenCalledWith('https://po-ui.io/llms-generated/po-table.md', expect.any(Object));
  });

  it('should fall back to GitHub raw when the primary URL fails', async () => {
    mockFetchSequence([
      { statusCode: 404, body: 'Not Found' },
      { statusCode: 200, body: '# PoButton via GitHub' }
    ]);

    const result = await fetchComponentDoc('po-button');
    expect(result).toBe('# PoButton via GitHub');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should throw when both URLs fail', async () => {
    mockFetchSequence([
      { statusCode: 404, body: 'Not Found' },
      { statusCode: 404, body: 'Not Found' }
    ]);

    await expect(fetchComponentDoc('inexistente')).rejects.toThrow(
      'Documentação não encontrada para o slug "inexistente"'
    );
  });

  it('should list the attempted URLs in the error message', async () => {
    mockFetchSequence([
      { statusCode: 404, body: '' },
      { statusCode: 404, body: '' }
    ]);

    await expect(fetchComponentDoc('xyz')).rejects.toThrow('Tentativas:');
  });
});

describe('fetchComponentExamples', () => {
  function repositoryTree(paths: string[], truncated = false): string {
    return JSON.stringify({
      tree: paths.map(path => ({ path, type: 'blob' })),
      truncated
    });
  }

  const buttonTree = repositoryTree([
    'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html',
    'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.ts',
    'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/readme.txt',
    'projects/ui/src/lib/components/po-button/samples/sample-po-button-labs/sample-po-button-labs.component.scss',
    'projects/ui/src/lib/components/po-button/samples/sample-po-button-labs/config.json'
  ]);

  it('should return official sample files with source URLs', async () => {
    mockFetchSequence([
      { statusCode: 200, body: buttonTree },
      { statusCode: 200, body: '<po-button></po-button>' },
      { statusCode: 200, body: 'export class SamplePoButtonBasicComponent {}' }
    ]);

    const result = await fetchComponentExamples('po-button', 1);

    expect(result.status).toBe('available');
    expect(result.sourceSlug).toBe('po-button');
    expect(result.examples).toHaveLength(1);
    expect(result.examples[0].name).toBe('sample-po-button-basic');
    expect(result.examples[0].files).toHaveLength(2);
    expect(result.examples[0].files[0].language).toBe('html');
    expect(result.examples[0].files[1].language).toBe('typescript');
    expect(result.examples[0].files[0].url).toContain('github.com/po-ui/po-angular/blob/master');
  });

  it('should filter samples by name', async () => {
    mockFetchSequence([
      { statusCode: 200, body: buttonTree },
      { statusCode: 200, body: '.sample {}' },
      { statusCode: 200, body: '{}' }
    ]);

    const result = await fetchComponentExamples('po-button', 3, 'labs');

    expect(result.examples).toHaveLength(1);
    expect(result.examples[0].name).toBe('sample-po-button-labs');
    expect(result.examples[0].files.map(file => file.language)).toEqual(['scss', 'json']);
  });

  it.each([
    [
      'po-checkbox',
      'projects/ui/src/lib/components/po-field/po-checkbox/samples/sample-po-checkbox-basic/sample-po-checkbox-basic.component.html'
    ],
    [
      'po-page-login',
      'projects/templates/src/lib/components/po-page-login/samples/sample-po-page-login-basic/sample-po-page-login-basic.component.html'
    ],
    [
      'po-code-editor',
      'projects/code-editor/src/lib/components/po-code-editor/samples/sample-po-code-editor-basic/sample-po-code-editor-basic.component.html'
    ]
  ])('should find %s examples in any supported package depth', async (slug, samplePath) => {
    mockFetchSequence([
      { statusCode: 200, body: repositoryTree([samplePath]) },
      { statusCode: 200, body: '<sample></sample>' }
    ]);

    const result = await fetchComponentExamples(slug, 1);

    expect(result.status).toBe('available');
    expect(result.sourceSlug).toBe(slug);
    expect(result.examples[0].url).toContain(samplePath.split('/samples/')[0]);
  });

  it('should return examples from the parent component', async () => {
    const tree = repositoryTree([
      'projects/ui/src/lib/components/po-tabs/po-tab/po-tab.component.ts',
      'projects/ui/src/lib/components/po-tabs/samples/sample-po-tabs-basic/sample-po-tabs-basic.component.html'
    ]);
    mockFetchSequence([
      { statusCode: 200, body: tree },
      { statusCode: 200, body: '<po-tabs><po-tab></po-tab></po-tabs>' }
    ]);

    const result = await fetchComponentExamples('po-tab', 1);

    expect(result.status).toBe('available');
    expect(result.sourceSlug).toBe('po-tabs');
    expect(result.examples[0].name).toBe('sample-po-tabs-basic');
  });

  it('should resolve every component with an official parent fallback', async () => {
    const parentFallbacks = [
      ['po-accordion-item', 'po-accordion', 'projects/ui/src/lib/components/po-accordion'],
      ['po-button-base', 'po-button', 'projects/ui/src/lib/components/po-button'],
      ['po-button-group-base', 'po-button-group', 'projects/ui/src/lib/components/po-button-group'],
      ['po-checkbox-base', 'po-checkbox', 'projects/ui/src/lib/components/po-field/po-checkbox'],
      ['po-helper-base', 'po-helper', 'projects/ui/src/lib/components/po-helper'],
      ['po-modal-footer', 'po-modal', 'projects/ui/src/lib/components/po-modal'],
      ['po-page-slide-footer', 'po-page-slide', 'projects/ui/src/lib/components/po-page/po-page-slide'],
      ['po-popover-base', 'po-popover', 'projects/ui/src/lib/components/po-popover'],
      ['po-step', 'po-stepper', 'projects/ui/src/lib/components/po-stepper'],
      ['po-tab', 'po-tabs', 'projects/ui/src/lib/components/po-tabs']
    ];
    const paths = parentFallbacks.map(
      ([, parentSlug, root]) => `${root}/samples/sample-${parentSlug}-basic/sample-${parentSlug}-basic.component.html`
    );
    mockFetch(200, repositoryTree(paths));

    for (const [slug, parentSlug] of parentFallbacks) {
      const result = await fetchComponentExamples(slug, 1, 'filter-without-match');
      expect(result.sourceSlug).toBe(parentSlug);
      expect(result.status).toBe('no_match');
    }
  });

  it('should return an empty list when no sample matches the filter', async () => {
    mockFetch(200, buttonTree);

    await expect(fetchComponentExamples('po-button', 3, 'inexistente')).resolves.toEqual({
      examples: [],
      sourceSlug: 'po-button',
      status: 'no_match'
    });
  });

  it('should distinguish a component without official examples from an unknown component', async () => {
    mockFetch(200, repositoryTree(['projects/ui/src/lib/components/po-navbar/po-navbar.component.ts']));

    await expect(fetchComponentExamples('po-navbar', 3)).resolves.toEqual({
      examples: [],
      sourceSlug: 'po-navbar',
      status: 'not_available'
    });
  });

  it('should throw when the component does not exist', async () => {
    mockFetch(200, repositoryTree(['projects/ui/src/lib/components/po-button/po-button.component.ts']));

    await expect(fetchComponentExamples('po-inexistente', 3)).rejects.toThrow(
      'Componente "po-inexistente" não encontrado'
    );
  });

  it('should preserve the GitHub status when the repository tree cannot be loaded', async () => {
    mockFetch(403, 'rate limit exceeded');

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('índice de exemplos (HTTP 403)');
  });

  it('should reject a truncated repository tree', async () => {
    mockFetch(200, repositoryTree([], true));

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow(
      'índice de exemplos retornado pelo GitHub está incompleto'
    );
  });

  it('should reject a repository response without a tree', async () => {
    mockFetch(200, JSON.stringify({ truncated: false }));

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('campo "tree" ausente');
  });

  it('should throw when GitHub returns invalid JSON', async () => {
    mockFetch(200, 'invalid json');

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('Resposta JSON inválida');
  });

  it('should throw when a sample file cannot be loaded', async () => {
    mockFetchSequence([
      { statusCode: 200, body: buttonTree },
      { statusCode: 500, body: 'Internal Error' },
      { statusCode: 200, body: 'export class Sample {}' }
    ]);

    await expect(fetchComponentExamples('po-button', 1)).rejects.toThrow('Falha ao buscar o arquivo de exemplo');
  });

  it('should cache the repository tree for the session', async () => {
    const tree = repositoryTree([
      'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html',
      'projects/ui/src/lib/components/po-table/samples/sample-po-table-basic/sample-po-table-basic.component.html'
    ]);
    mockFetchSequence([
      { statusCode: 200, body: tree },
      { statusCode: 200, body: '<po-button></po-button>' },
      { statusCode: 200, body: '<po-table></po-table>' }
    ]);

    await fetchComponentExamples('po-button', 1);
    await fetchComponentExamples('po-table', 1);

    const treeRequests = fetchMock.mock.calls.filter(([url]) => String(url).includes('/git/trees/master'));
    expect(treeRequests).toHaveLength(1);
  });
});

describe('fetchBestPractices', () => {
  it.each([
    ['contributing', 'CONTRIBUTING.md'],
    ['development-flow', 'docs/guides/development-flow.md'],
    ['getting-started', 'docs/guides/getting-started.md'],
    ['theme-service', 'docs/guides/theme-service.md']
  ] as const)('should fetch the %s official source', async (topic, expectedPath) => {
    mockFetch(200, '# Boas práticas');

    const result = await fetchBestPractices(topic);

    expect(result.content).toBe('# Boas práticas');
    expect(result.url).toContain(expectedPath);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(`raw.githubusercontent.com/po-ui/po-angular/master/${expectedPath}`),
      expect.any(Object)
    );
  });

  it('should throw when the official source cannot be loaded', async () => {
    mockFetch(503, 'Unavailable');

    await expect(fetchBestPractices('contributing')).rejects.toThrow('Falha ao buscar boas práticas');
  });
});

describe('fetchGuide', () => {
  it('should return the guide content when available', async () => {
    mockFetch(200, '# Getting Started\nConteudo...');

    const result = await fetchGuide('getting-started');
    expect(result).toBe('# Getting Started\nConteudo...');
  });

  it('should call the correct GitHub raw URL', async () => {
    mockFetch(200, 'ok');

    await fetchGuide('schematics');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/schematics.md',
      expect.any(Object)
    );
  });

  it('should strip the .md extension from the name before fetching', async () => {
    mockFetch(200, 'ok');

    await fetchGuide('getting-started.md');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/getting-started.md',
      expect.any(Object)
    );
  });

  it('should throw when the guide is not found', async () => {
    mockFetch(404, 'Not Found');

    await expect(fetchGuide('inexistente')).rejects.toThrow('Guia "inexistente" não encontrado');
  });

  it('should include the attempted URL in the error message', async () => {
    mockFetch(404, '');

    await expect(fetchGuide('xyz')).rejects.toThrow('URL tentada:');
  });
});

describe('fetchUrl (internal behaviour)', () => {
  it('should pass a timeout signal to fetch', async () => {
    mockFetch(200, 'ok');

    await fetchLlmsTxt();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://po-ui.io/llms.txt',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('should resolve with ok=false on timeout', async () => {
    mockFetchError(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP desconhecido)');
  });

  it('should resolve with ok=false on a request error', async () => {
    mockFetchError(new TypeError('fetch failed'));

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP desconhecido)');
  });

  it('should resolve with ok=false when the rejection is not an Error', async () => {
    mockFetchError('falha sem Error');

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP desconhecido)');
  });

  it('should resolve with ok=false when the response body cannot be read', async () => {
    const response = new Response('conteudo', { status: 200 });
    jest.spyOn(response, 'text').mockRejectedValue(new Error('response error'));
    fetchMock.mockResolvedValue(response);

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP desconhecido)');
  });
});

describe('fetchUrl - network failure without status code', () => {
  beforeEach(() => {
    mockFetchError(new TypeError('fetch failed'));
  });

  it('should include "desconhecido" in the fetchLlmsFullTxt error when the request fails', async () => {
    await expect(fetchLlmsFullTxt()).rejects.toThrow('desconhecido');
  });

  it('should include "erro" in the fetchComponentDoc error when the request fails', async () => {
    await expect(fetchComponentDoc('xyz')).rejects.toThrow('erro');
  });

  it('should include "desconhecido" in the fetchGuide error when the request fails', async () => {
    await expect(fetchGuide('xyz')).rejects.toThrow('desconhecido');
  });

  it('should include "desconhecido" when loading the examples index and the request fails', async () => {
    await expect(fetchComponentExamples('po-button', 1)).rejects.toThrow(
      'Falha ao carregar o índice de exemplos (HTTP desconhecido).'
    );
  });

  it('should include "desconhecido" in the fetchBestPractices error when the request fails', async () => {
    await expect(fetchBestPractices('contributing')).rejects.toThrow(
      'Falha ao buscar boas práticas de "contributing" (HTTP desconhecido).'
    );
  });

  it('should include "desconhecido" when downloading a sample file and the request fails', async () => {
    const tree = JSON.stringify({
      truncated: false,
      tree: [
        {
          path: 'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html',
          type: 'blob'
        }
      ]
    });
    fetchMock.mockResolvedValueOnce(new Response(tree, { status: 200 }));

    await expect(fetchComponentExamples('po-button', 1)).rejects.toThrow('(HTTP desconhecido)');
  });
});

describe('getLanguage', () => {
  it.each([
    ['sample-po-button-basic.component.css', 'css'],
    ['sample-po-button-basic.component.html', 'html'],
    ['config.json', 'json'],
    ['sample-po-button-labs.component.scss', 'scss'],
    ['sample-po-button-basic.component.ts', 'typescript']
  ])('should map %s to %s', (fileName, expected) => {
    expect(getLanguage(fileName)).toBe(expected);
  });

  it('should return "text" for an unmapped extension', () => {
    expect(getLanguage('readme.txt')).toBe('text');
  });

  it('should return "text" for a file without an extension', () => {
    expect(getLanguage('Makefile')).toBe('text');
  });
});

describe('findSamplesLocation (internal behaviour)', () => {
  it('should ignore directories and paths outside the component packages', async () => {
    const tree = JSON.stringify({
      truncated: false,
      tree: [
        { path: 'projects/ui/src/lib/components/po-button/samples', type: 'tree' },
        { path: 'docs/guides/getting-started.md', type: 'blob' },
        {
          path: 'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html',
          type: 'blob'
        }
      ]
    });
    mockFetchSequence([
      { statusCode: 200, body: tree },
      { statusCode: 200, body: '<po-button></po-button>' }
    ]);

    const result = await fetchComponentExamples('po-button', 3);

    expect(result.status).toBe('available');
    expect(result.examples).toHaveLength(1);
    expect(result.examples[0].files).toHaveLength(1);
    expect(result.examples[0].files[0].name).toBe('sample-po-button-basic.component.html');
  });

  it('should prefer the samples directory with the shortest path', async () => {
    const tree = JSON.stringify({
      truncated: false,
      tree: [
        {
          path: 'projects/templates/src/lib/components/po-page-dynamic-table/po-button/samples/sample-po-button-extra/sample-po-button-extra.component.html',
          type: 'blob'
        },
        {
          path: 'projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html',
          type: 'blob'
        }
      ]
    });
    mockFetchSequence([
      { statusCode: 200, body: tree },
      { statusCode: 200, body: '<po-button></po-button>' }
    ]);

    const result = await fetchComponentExamples('po-button', 3);

    expect(result.examples).toHaveLength(1);
    expect(result.examples[0].name).toBe('sample-po-button-basic');
    expect(result.examples[0].url).toContain('projects/ui/src/lib/components/po-button/samples');
  });
});

describe('fetchUrl - request headers', () => {
  function getRequestOptions(): any {
    return fetchMock.mock.calls[0][1];
  }

  it('should send the GitHub API Accept header only on api.github.com calls', async () => {
    mockFetch(200, JSON.stringify({ tree: [], truncated: false }));

    await fetchComponentExamples('po-navbar', 3).catch(() => undefined);

    const options = getRequestOptions();
    expect(options.headers.Accept).toBe('application/vnd.github+json');
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });

  it('should not send the GitHub API Accept header to po-ui.io', async () => {
    mockFetch(200, 'ok');

    await fetchLlmsTxt();

    const options = getRequestOptions();
    expect(options.headers.Accept).toBeUndefined();
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });

  it('should not send the GitHub API Accept header to raw.githubusercontent.com', async () => {
    mockFetch(200, '# Guia');

    await fetchGuide('getting-started');

    const options = getRequestOptions();
    expect(options.headers.Accept).toBeUndefined();
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });
});
