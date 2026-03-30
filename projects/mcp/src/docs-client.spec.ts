import * as https from 'node:https';
import * as http from 'node:http';
import { fetchLlmsTxt, fetchLlmsFullTxt, fetchComponentDoc, fetchGuide } from './docs-client';

// Mock dos modulos http/https
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

beforeEach(() => {
  jest.clearAllMocks();
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
        // Prevent data/end events from firing for redirect
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
      // Simula timeout: nao chama o callback, e dispara o evento timeout
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
