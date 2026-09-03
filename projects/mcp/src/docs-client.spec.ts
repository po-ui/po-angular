import * as https from 'node:https';
import * as http from 'node:http';
import {
  clearRepositoryTreeCache,
  fetchBestPractices,
  fetchComponentDoc,
  fetchComponentExamples,
  fetchGuide,
  fetchLlmsFullTxt,
  fetchLlmsTxt
} from './docs-client';

jest.mock('node:https');
jest.mock('node:http');

/**
 * Helper para criar um mock de IncomingMessage (resposta HTTP).
 */
function createMockResponse(statusCode: number, body: string, headers: Record<string, string> = {}): any {
  const listeners: Record<string, Function[]> = {};
  return {
    statusCode,
    headers,
    on(event: string, cb: Function) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);

      if (event === 'data') {
        process.nextTick(() => cb(Buffer.from(body)));
      }
      if (event === 'end') {
        process.nextTick(() => cb());
      }
      return this;
    }
  };
}

/**
 * Helper para criar mock de ClientRequest.
 */
function createMockRequest(): any {
  const listeners: Record<string, Function[]> = {};
  return {
    on(event: string, cb: Function) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
      return this;
    },
    destroy: jest.fn(),
    _listeners: listeners
  };
}

/**
 * Configura o mock de https.get para retornar uma resposta.
 */
function mockHttpsGet(statusCode: number, body: string, headers: Record<string, string> = {}): void {
  const mockReq = createMockRequest();
  const mockRes = createMockResponse(statusCode, body, headers);

  (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
    process.nextTick(() => cb(mockRes));
    return mockReq;
  });
}

/**
 * Configura mock sequencial para multiplas chamadas https.get.
 */
function mockHttpsGetSequence(
  responses: Array<{ statusCode: number; body: string; headers?: Record<string, string> }>
): void {
  let callIndex = 0;

  (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
    const mockReq = createMockRequest();
    const resp = responses[callIndex] ?? responses[responses.length - 1];
    callIndex++;
    const mockRes = createMockResponse(resp.statusCode, resp.body, resp.headers ?? {});

    process.nextTick(() => cb(mockRes));
    return mockReq;
  });
}

function mockHttpsRequestError(message: string): void {
  (https.get as jest.Mock).mockImplementation(() => {
    const mockReq = createMockRequest();
    process.nextTick(() => mockReq._listeners.error[0](new Error(message)));
    return mockReq;
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  clearRepositoryTreeCache();
});

describe('fetchLlmsTxt', () => {
  it('deve retornar o texto quando a resposta for 200', async () => {
    mockHttpsGet(200, 'conteudo do llms.txt');

    const result = await fetchLlmsTxt();
    expect(result).toBe('conteudo do llms.txt');
  });

  it('deve lancar erro quando a resposta nao for ok', async () => {
    mockHttpsGet(404, 'Not Found');

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt (HTTP 404)');
  });

  it('deve chamar a URL correta', async () => {
    mockHttpsGet(200, 'ok');

    await fetchLlmsTxt();
    expect(https.get).toHaveBeenCalledWith('https://po-ui.io/llms.txt', expect.any(Object), expect.any(Function));
  });

  it('deve seguir redirecionamentos', async () => {
    mockHttpsGetSequence([
      { statusCode: 302, body: '', headers: { location: 'https://po-ui.io/llms-redirected.txt' } },
      { statusCode: 200, body: 'conteudo redirecionado' }
    ]);

    await expect(fetchLlmsTxt()).resolves.toBe('conteudo redirecionado');
  });

  it('deve reportar falha de transporte', async () => {
    mockHttpsRequestError('connection reset');

    await expect(fetchLlmsTxt()).rejects.toThrow('HTTP desconhecido');
  });
});

describe('fetchLlmsFullTxt', () => {
  it('deve retornar o texto quando a resposta for 200', async () => {
    mockHttpsGet(200, 'conteudo completo');

    const result = await fetchLlmsFullTxt();
    expect(result).toBe('conteudo completo');
  });

  it('deve lancar erro quando a resposta nao for ok', async () => {
    mockHttpsGet(500, 'Internal Error');

    await expect(fetchLlmsFullTxt()).rejects.toThrow('Falha ao buscar llms-full.txt (HTTP 500)');
  });

  it('deve chamar a URL correta', async () => {
    mockHttpsGet(200, 'ok');

    await fetchLlmsFullTxt();
    expect(https.get).toHaveBeenCalledWith('https://po-ui.io/llms-full.txt', expect.any(Object), expect.any(Function));
  });
});

describe('fetchComponentDoc', () => {
  it('deve retornar o doc da URL primaria quando disponivel', async () => {
    mockHttpsGet(200, '# PoButton\nDocumentacao...');

    const result = await fetchComponentDoc('po-button');
    expect(result).toBe('# PoButton\nDocumentacao...');
  });

  it('deve chamar a URL primaria correta', async () => {
    mockHttpsGet(200, 'doc');

    await fetchComponentDoc('po-table');
    expect(https.get).toHaveBeenCalledWith(
      'https://po-ui.io/llms-generated/po-table.md',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('deve fazer fallback para GitHub raw quando URL primaria falha', async () => {
    mockHttpsGetSequence([
      { statusCode: 404, body: 'Not Found' },
      { statusCode: 200, body: '# PoButton via GitHub' }
    ]);

    const result = await fetchComponentDoc('po-button');
    expect(result).toBe('# PoButton via GitHub');
    expect(https.get).toHaveBeenCalledTimes(2);
  });

  it('deve lancar erro quando ambas URLs falham', async () => {
    mockHttpsGetSequence([
      { statusCode: 404, body: 'Not Found' },
      { statusCode: 404, body: 'Not Found' }
    ]);

    await expect(fetchComponentDoc('inexistente')).rejects.toThrow(
      'Documentação não encontrada para o slug "inexistente"'
    );
  });

  it('deve incluir URLs tentadas na mensagem de erro', async () => {
    mockHttpsGetSequence([
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
    mockHttpsGetSequence([
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
    mockHttpsGetSequence([
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
    mockHttpsGetSequence([
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
    mockHttpsGetSequence([
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
    mockHttpsGet(200, repositoryTree(paths));

    for (const [slug, parentSlug] of parentFallbacks) {
      const result = await fetchComponentExamples(slug, 1, 'filter-without-match');
      expect(result.sourceSlug).toBe(parentSlug);
      expect(result.status).toBe('no_match');
    }
  });

  it('should return an empty list when no sample matches the filter', async () => {
    mockHttpsGet(200, buttonTree);

    await expect(fetchComponentExamples('po-button', 3, 'inexistente')).resolves.toEqual({
      examples: [],
      sourceSlug: 'po-button',
      status: 'no_match'
    });
  });

  it('should distinguish a component without official examples from an unknown component', async () => {
    mockHttpsGet(200, repositoryTree(['projects/ui/src/lib/components/po-navbar/po-navbar.component.ts']));

    await expect(fetchComponentExamples('po-navbar', 3)).resolves.toEqual({
      examples: [],
      sourceSlug: 'po-navbar',
      status: 'not_available'
    });
  });

  it('should throw when the component does not exist', async () => {
    mockHttpsGet(200, repositoryTree(['projects/ui/src/lib/components/po-button/po-button.component.ts']));

    await expect(fetchComponentExamples('po-inexistente', 3)).rejects.toThrow(
      'Componente "po-inexistente" não encontrado'
    );
  });

  it('should preserve the GitHub status when the repository tree cannot be loaded', async () => {
    mockHttpsGet(403, 'rate limit exceeded');

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('índice de exemplos (HTTP 403)');
  });

  it('should reject a truncated repository tree', async () => {
    mockHttpsGet(200, repositoryTree([], true));

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow(
      'índice de exemplos retornado pelo GitHub está incompleto'
    );
  });

  it('should reject a repository response without a tree', async () => {
    mockHttpsGet(200, JSON.stringify({ truncated: false }));

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('campo "tree" ausente');
  });

  it('should throw when GitHub returns invalid JSON', async () => {
    mockHttpsGet(200, 'invalid json');

    await expect(fetchComponentExamples('po-button', 3)).rejects.toThrow('Resposta JSON inválida');
  });

  it('should throw when a sample file cannot be loaded', async () => {
    mockHttpsGetSequence([
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
    mockHttpsGetSequence([
      { statusCode: 200, body: tree },
      { statusCode: 200, body: '<po-button></po-button>' },
      { statusCode: 200, body: '<po-table></po-table>' }
    ]);

    await fetchComponentExamples('po-button', 1);
    await fetchComponentExamples('po-table', 1);

    const treeRequests = (https.get as jest.Mock).mock.calls.filter(([url]) => url.includes('/git/trees/master'));
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
    mockHttpsGet(200, '# Boas práticas');

    const result = await fetchBestPractices(topic);

    expect(result.content).toBe('# Boas práticas');
    expect(result.url).toContain(expectedPath);
    expect(https.get).toHaveBeenCalledWith(
      expect.stringContaining(`raw.githubusercontent.com/po-ui/po-angular/master/${expectedPath}`),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should throw when the official source cannot be loaded', async () => {
    mockHttpsGet(503, 'Unavailable');

    await expect(fetchBestPractices('contributing')).rejects.toThrow('Falha ao buscar boas práticas');
  });
});

describe('fetchGuide', () => {
  it('deve retornar o conteudo do guia quando disponivel', async () => {
    mockHttpsGet(200, '# Getting Started\nConteudo...');

    const result = await fetchGuide('getting-started');
    expect(result).toBe('# Getting Started\nConteudo...');
  });

  it('deve chamar a URL correta no GitHub raw', async () => {
    mockHttpsGet(200, 'ok');

    await fetchGuide('schematics');
    expect(https.get).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/schematics.md',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('deve remover extensao .md do nome antes de buscar', async () => {
    mockHttpsGet(200, 'ok');

    await fetchGuide('getting-started.md');
    expect(https.get).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/getting-started.md',
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('deve lancar erro quando o guia nao for encontrado', async () => {
    mockHttpsGet(404, 'Not Found');

    await expect(fetchGuide('inexistente')).rejects.toThrow('Guia "inexistente" não encontrado');
  });

  it('deve incluir URL tentada na mensagem de erro', async () => {
    mockHttpsGet(404, '');

    await expect(fetchGuide('xyz')).rejects.toThrow('URL tentada:');
  });
});

describe('fetchUrl (comportamento interno)', () => {
  it('deve seguir redirects (301)', async () => {
    let callCount = 0;

    (https.get as jest.Mock).mockImplementation((url: string, _opts: any, cb: Function) => {
      const mockReq = createMockRequest();

      if (callCount === 0) {
        callCount++;
        const redirectRes = createMockResponse(301, '', { location: 'https://po-ui.io/redirected' });
        redirectRes.on = (event: string, _cb: Function) => {
          if (event === 'data' || event === 'end') return redirectRes;
          return redirectRes;
        };
        process.nextTick(() => cb(redirectRes));
      } else {
        const finalRes = createMockResponse(200, 'conteudo redirecionado');
        process.nextTick(() => cb(finalRes));
      }

      return mockReq;
    });

    const result = await fetchLlmsTxt();
    expect(result).toBe('conteudo redirecionado');
  });

  it('deve resolver com ok=false em timeout', async () => {
    (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, _cb: Function) => {
      const mockReq = createMockRequest();
      process.nextTick(() => {
        if (mockReq._listeners['timeout']) {
          mockReq._listeners['timeout'].forEach((fn: Function) => fn());
        }
      });
      return mockReq;
    });

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt');
  });

  it('deve resolver com ok=false em erro de request', async () => {
    (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, _cb: Function) => {
      const mockReq = createMockRequest();
      process.nextTick(() => {
        if (mockReq._listeners['error']) {
          mockReq._listeners['error'].forEach((fn: Function) => fn(new Error('ECONNREFUSED')));
        }
      });
      return mockReq;
    });

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt');
  });

  it('deve seguir redirect para URL http e usar client http', async () => {
    (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
      const mockReq = createMockRequest();
      const redirectRes = {
        statusCode: 302,
        headers: { location: 'http://po-ui.io/llms.txt' },
        on: (_event: string, _cb: Function) => redirectRes
      };
      process.nextTick(() => cb(redirectRes));
      return mockReq;
    });

    (http.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
      const mockReq = createMockRequest();
      const mockRes = createMockResponse(200, 'conteudo via http');
      process.nextTick(() => cb(mockRes));
      return mockReq;
    });

    const result = await fetchLlmsTxt();
    expect(result).toBe('conteudo via http');
    expect(http.get).toHaveBeenCalled();
  });

  it('deve resolver com ok=false em erro de response', async () => {
    (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
      const mockReq = createMockRequest();
      const mockRes = {
        statusCode: 200,
        headers: {},
        on(event: string, handler: Function) {
          if (event === 'error') {
            process.nextTick(() => handler(new Error('response error')));
          }
          return this;
        }
      };
      process.nextTick(() => cb(mockRes));
      return mockReq;
    });

    await expect(fetchLlmsTxt()).rejects.toThrow('Falha ao buscar llms.txt');
  });
});

describe('fetchUrl - statusCode undefined', () => {
  function mockUndefinedStatusCode(): void {
    (https.get as jest.Mock).mockImplementation((_url: string, _opts: any, cb: Function) => {
      const mockReq = createMockRequest();
      const mockRes = {
        statusCode: undefined,
        headers: {},
        on(event: string, handler: Function) {
          if (event === 'data') process.nextTick(() => handler(Buffer.from('')));
          if (event === 'end') process.nextTick(() => handler());
          return this;
        }
      };
      process.nextTick(() => cb(mockRes));
      return mockReq;
    });
  }

  it('deve incluir "desconhecido" no erro de fetchLlmsFullTxt quando statusCode e undefined', async () => {
    mockUndefinedStatusCode();
    await expect(fetchLlmsFullTxt()).rejects.toThrow('desconhecido');
  });

  it('deve incluir "erro" no erro de fetchComponentDoc quando statusCode e undefined', async () => {
    mockUndefinedStatusCode();
    await expect(fetchComponentDoc('xyz')).rejects.toThrow('erro');
  });

  it('deve incluir "desconhecido" no erro de fetchGuide quando statusCode e undefined', async () => {
    mockUndefinedStatusCode();
    await expect(fetchGuide('xyz')).rejects.toThrow('desconhecido');
  });
});

describe('fetchUrl - request headers', () => {
  function getRequestOptions(): any {
    const call = (https.get as jest.Mock).mock.calls[0];
    return call[1];
  }

  it('deve enviar o header Accept da GitHub API apenas nas chamadas a api.github.com', async () => {
    mockHttpsGet(200, JSON.stringify({ tree: [], truncated: false }));

    await fetchComponentExamples('po-navbar', 3).catch(() => undefined);

    const options = getRequestOptions();
    expect(options.headers.Accept).toBe('application/vnd.github+json');
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });

  it('nao deve enviar o header Accept da GitHub API para po-ui.io', async () => {
    mockHttpsGet(200, 'ok');

    await fetchLlmsTxt();

    const options = getRequestOptions();
    expect(options.headers.Accept).toBeUndefined();
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });

  it('nao deve enviar o header Accept da GitHub API para raw.githubusercontent.com', async () => {
    mockHttpsGet(200, '# Guia');

    await fetchGuide('getting-started');

    const options = getRequestOptions();
    expect(options.headers.Accept).toBeUndefined();
    expect(options.headers['User-Agent']).toBe('po-ui-mcp');
  });
});
