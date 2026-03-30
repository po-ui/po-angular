import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, from, throwError } from 'rxjs';
import { catchError, map, timeout, finalize } from 'rxjs/operators';

import {
  PoTableAiSearchAvailability,
  PoTableAiSearchColumn,
  PoTableAiSearchConfigStep,
  PoTableAiSearchDownloadProgress
} from '../interfaces/po-table-ai-search.interface';

interface BuiltInAiResponse {
  filter: string;
  description: string;
  confidence: number;
}

export type PoTableAiSearchPhase = 'idle' | 'initializing' | 'downloading' | 'generating' | 'analyzing' | 'done' | 'error';

@Injectable()
export class PoTableBuiltInAiSearchService {
  private session: any = null;
  private downloadProgress$ = new Subject<PoTableAiSearchDownloadProgress>();
  private phase$ = new Subject<PoTableAiSearchPhase>();
  private streamChunk$ = new Subject<string>();

  constructor(private ngZone: NgZone) {}

  /**
   * Observable que emite o progresso de download do modelo de IA.
   */
  get onDownloadProgress(): Observable<PoTableAiSearchDownloadProgress> {
    return this.downloadProgress$.asObservable();
  }

  /**
   * Observable que emite a fase atual do processamento da IA.
   */
  get onPhaseChange(): Observable<PoTableAiSearchPhase> {
    return this.phase$.asObservable();
  }

  /**
   * Observable que emite chunks de texto conforme a IA gera a resposta em tempo real.
   */
  get onStreamChunk(): Observable<string> {
    return this.streamChunk$.asObservable();
  }

  /**
   * Verifica se o Built-in AI está disponível no navegador.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const availability = await this.checkAvailability();
      return availability === 'readily' || availability === 'after-download';
    } catch {
      return false;
    }
  }

  /**
   * Verifica o estado detalhado de disponibilidade do Built-in AI.
   *
   * Suporta ambas as versões da API:
   * - Nova API: `LanguageModel.availability()` retorna string diretamente (`'available'`, `'downloadable'`, `'downloading'`, etc.)
   * - API legada: `LanguageModel.capabilities()` retorna objeto `{ available: 'readily' | 'after-download' | 'no' }`
   *
   * Retorna:
   * - `readily`: modelo pronto para uso imediato.
   * - `after-download`: modelo precisa ser baixado na primeira utilização.
   * - `unavailable`: API existe no navegador mas está desabilitada (requer configuração de flags).
   * - `unsupported`: navegador não possui a API LanguageModel.
   */
  async checkAvailability(): Promise<PoTableAiSearchAvailability> {
    try {
      const LanguageModel = (window as any).LanguageModel;
      if (!LanguageModel) {
        return 'unsupported';
      }
      return await this.resolveAvailability(LanguageModel);
    } catch {
      return 'unsupported';
    }
  }

  private async resolveAvailability(languageModel: any): Promise<PoTableAiSearchAvailability> {
    if (typeof languageModel.availability === 'function') {
      const status = await languageModel.availability();
      return this.mapAvailabilityStatus(status);
    }

    if (typeof languageModel.capabilities === 'function') {
      const capabilities = await languageModel.capabilities();
      return this.mapCapabilitiesStatus(capabilities?.available);
    }

    return 'unavailable';
  }

  private mapAvailabilityStatus(status: string): PoTableAiSearchAvailability {
    switch (status) {
      case 'available':
      case 'readily':
        return 'readily';
      case 'downloadable':
      case 'after-download':
        return 'after-download';
      case 'downloading':
        return 'after-download';
      default:
        return 'unavailable';
    }
  }

  private mapCapabilitiesStatus(available: string): PoTableAiSearchAvailability {
    switch (available) {
      case 'readily':
        return 'readily';
      case 'after-download':
        return 'after-download';
      default:
        return 'unavailable';
    }
  }

  /**
   * Retorna as etapas de configuração para habilitar o Built-in AI no navegador.
   */
  getConfigurationSteps(): Array<PoTableAiSearchConfigStep> {
    return [
      {
        step: 1,
        title: 'Verificar versão do Chrome',
        description: 'Utilize o Google Chrome versão 128 ou superior. Recomenda-se o Chrome Canary ou Chrome Dev para acesso antecipado.',
        url: 'https://www.google.com/intl/pt-BR/chrome/canary/'
      },
      {
        step: 2,
        title: 'Habilitar Optimization Guide On Device Model',
        description: 'Acesse chrome://flags/#optimization-guide-on-device-model e selecione "Enabled BypassPerfRequirement".',
        url: 'chrome://flags/#optimization-guide-on-device-model'
      },
      {
        step: 3,
        title: 'Habilitar Prompt API for Gemini Nano',
        description: 'Acesse chrome://flags/#prompt-api-for-gemini-nano e selecione "Enabled".',
        url: 'chrome://flags/#prompt-api-for-gemini-nano'
      },
      {
        step: 4,
        title: 'Reiniciar o navegador',
        description: 'Feche e reabra o Chrome completamente para que as flags tenham efeito.'
      },
      {
        step: 5,
        title: 'Verificar download do modelo',
        description: 'Acesse chrome://components e localize "Optimization Guide On Device Model". Clique em "Check for update" se o status não for "Up-to-date".',
        url: 'chrome://components'
      }
    ];
  }

  /**
   * Envia uma query em linguagem natural ao Built-in AI e retorna o filtro OData correspondente.
   * Utiliza streaming quando disponível para exibir a resposta em tempo real.
   *
   * @param query Texto em linguagem natural digitado pelo usuário.
   * @param columns Metadados das colunas visíveis da tabela.
   * @param timeoutMs Timeout em milissegundos para a chamada (padrão: 120s para suportar execução em CPU).
   */
  sendQuery(
    query: string,
    columns: Array<PoTableAiSearchColumn>,
    timeoutMs: number = 120000
  ): Observable<BuiltInAiResponse> {
    const sanitizedQuery = this.sanitizeInput(query);
    const prompt = this.buildPrompt(sanitizedQuery, columns);

    this.phase$.next('initializing');

    return from(this.executePromptWithStreaming(prompt)).pipe(
      timeout(timeoutMs),
      map(responseText => {
        this.phase$.next('analyzing');
        const result = this.parseResponse(responseText, sanitizedQuery);
        this.phase$.next('done');
        return result;
      }),
      catchError(error => {
        this.phase$.next('error');
        if (error.name === 'TimeoutError') {
          return throwError(() => ({
            statusCode: 408,
            message: 'Built-in AI request timed out'
          }));
        }
        return throwError(() => ({
          statusCode: 500,
          message: error.message || 'Built-in AI request failed'
        }));
      })
    );
  }

  /**
   * Extrai os metadados das colunas visíveis para contextualizar o prompt.
   */
  extractColumnsMetadata(
    columns: Array<{ property?: string; label?: string; type?: string; aiSearchIgnore?: boolean; visible?: boolean }>
  ): Array<PoTableAiSearchColumn> {
    return columns
      .filter(col => col.property && col.visible !== false && !col.aiSearchIgnore)
      .map(col => ({
        property: col.property,
        label: col.label || col.property,
        type: col.type || 'string'
      }));
  }

  /**
   * Destrói a sessão do Built-in AI.
   */
  destroySession(): void {
    if (this.session) {
      try {
        this.session.destroy();
      } catch {}
      this.session = null;
    }
  }

  private async getSession(columns: Array<PoTableAiSearchColumn>): Promise<any> {
    const LanguageModel = (window as any).LanguageModel;
    if (!LanguageModel) {
      throw new Error('Built-in AI is not available in this browser');
    }

    const systemPrompt = this.buildSystemPrompt(columns);

    this.destroySession();
    this.session = await LanguageModel.create({
      systemPrompt,
      monitor: (monitor: any) => {
        monitor.addEventListener('downloadprogress', (event: any) => {
          this.ngZone.run(() => {
            const loaded = event.loaded || 0;
            const total = event.total || 0;
            const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
            this.downloadProgress$.next({ loaded, total, percent });
          });
        });
      }
    });

    return this.session;
  }

  private buildSystemPrompt(columns: Array<PoTableAiSearchColumn>): string {
    const columnsDescription = columns
      .map(col => `  - "${col.property}" (label: "${col.label}", type: ${col.type})`)
      .join('\n');
    const currentYear = new Date().getFullYear();

    return `You are an OData v4 $filter expression generator. Convert natural language queries into valid OData v4 $filter expressions using ONLY the columns listed below.

Current year: ${currentYear}

Available columns:
${columnsDescription}

--- OData v4 Filter Protocol Reference ---

COMPARISON OPERATORS:
  eq    Equal                    → Property eq 'Value' | Property eq 10
  ne    Not equal                → Property ne 'Value'
  gt    Greater than             → Property gt 20
  ge    Greater than or equal    → Property ge 10
  lt    Less than                → Property lt 20
  le    Less than or equal       → Property le 100
  has   Has flags                → Property has Namespace.EnumType'Value'
  in    Is a member of           → Property in ('Value1', 'Value2')

LOGICAL OPERATORS:
  and   Logical and              → Price le 200 and Price gt 3.5
  or    Logical or               → Price le 3.5 or Price gt 200
  not   Logical negation         → not endswith(Description,'milk')

ARITHMETIC OPERATORS:
  add   Addition                 → Price add 5 gt 10
  sub   Subtraction              → Price sub 5 gt 10
  mul   Multiplication           → Price mul 2 gt 2000
  div   Division                 → Price div 2 gt 4
  divby Decimal Division         → Price divby 2 gt 3.5
  mod   Modulo                   → Price mod 2 eq 0

GROUPING:
  ( )   Precedence grouping      → (Price sub 5) gt 10

STRING AND COLLECTION FUNCTIONS:
  concat(s1, s2)                 → concat(concat(City,', '), Country) eq 'Berlin, Germany'
  contains(s, sub)               → contains(CompanyName,'freds')
  endswith(s, sub)               → endswith(CompanyName,'Futterkiste')
  indexof(s, sub)                → indexof(CompanyName,'lfreds') eq 1
  length(s)                      → length(CompanyName) eq 19
  startswith(s, sub)             → startswith(CompanyName,'Alfr')
  substring(s, pos)              → substring(CompanyName,1) eq 'lfreds Futterkiste'

STRING FUNCTIONS:
  matchesPattern(s, pattern)     → matchesPattern(CompanyName,'%5EA.*e$')
  tolower(s)                     → tolower(CompanyName) eq 'alfreds futterkiste'
  toupper(s)                     → toupper(CompanyName) eq 'ALFREDS FUTTERKISTE'
  trim(s)                        → trim(CompanyName) eq 'Alfreds Futterkiste'

DATE AND TIME FUNCTIONS:
  year(d)                        → year(BirthDate) eq 2024
  month(d)                       → month(BirthDate) eq 12
  day(d)                         → day(StartTime) eq 8
  hour(d)                        → hour(StartTime) eq 1
  minute(d)                      → minute(StartTime) eq 0
  second(d)                      → second(StartTime) eq 0
  fractionalseconds(d)           → fractionalseconds(StartTime) lt 0.01
  date(d)                        → date(StartTime) ne date(EndTime)
  time(d)                        → time(StartTime) le StartOfDay
  totaloffsetminutes(d)          → totaloffsetminutes(StartTime) eq 60
  totalseconds(d)                → totalseconds(duration'PT1M') eq 60
  now()                          → StartTime ge now()
  maxdatetime()                  → EndTime eq maxdatetime()
  mindatetime()                  → StartTime eq mindatetime()

ARITHMETIC FUNCTIONS:
  ceiling(n)                     → ceiling(Freight) eq 33
  floor(n)                       → floor(Freight) eq 32
  round(n)                       → round(Freight) eq 32

TYPE FUNCTIONS:
  cast(expr, type)               → cast(ShipCountry,Edm.String)
  isof(expr, type)               → isof(ShipCountry,Edm.String)

CONDITIONAL FUNCTIONS:
  case(expr:val, ..., true:def)  → case(X gt 0:1,X lt 0:-1,true:0)

--- Rules ---
1. Use ONLY the column properties listed above.
2. String values must be enclosed in single quotes: 'value'.
3. Use lower case operator and function names for compatibility with OData 4.0.
4. Combine conditions with "and", "or", and parentheses for grouping.
5. For case-insensitive string matching prefer: contains(tolower(property), 'lowercasevalue').
6. For date columns use date functions (year, month, day) or direct comparison with YYYY-MM-DD format.
7. Use "in" operator for multiple value matching: Property in ('A', 'B', 'C').
8. Use "not" for negation: not contains(Property, 'value').

--- Response Format ---
You MUST respond ONLY with a valid JSON object (no markdown, no extra text):
{"filter": "<OData v4 $filter expression>", "description": "<human-readable description in the same language as the query>", "confidence": <number between 0 and 1>}

--- Examples ---
- "age greater than 30" → {"filter": "age gt 30", "description": "Age greater than 30", "confidence": 0.95}
- "name contains Silva" → {"filter": "contains(tolower(name), 'silva')", "description": "Name contains Silva", "confidence": 0.9}
- "active employees from São Paulo" → {"filter": "status eq 'Ativo' and city eq 'São Paulo'", "description": "Active employees from São Paulo", "confidence": 0.85}
- "salary between 5000 and 10000" → {"filter": "salary ge 5000 and salary le 10000", "description": "Salary between 5000 and 10000", "confidence": 0.9}
- "hired in 2023" → {"filter": "year(hireDate) eq 2023", "description": "Hired in 2023", "confidence": 0.9}
- "department is TI or Marketing" → {"filter": "department in ('TI', 'Marketing')", "description": "Department is TI or Marketing", "confidence": 0.95}
- "name starts with A and age not equal 30" → {"filter": "startswith(name, 'A') and age ne 30", "description": "Name starts with A and age is not 30", "confidence": 0.9}
- "salary above average (mod 1000 equals 0)" → {"filter": "salary gt 8000 and salary mod 1000 eq 0", "description": "Salary above 8000 and multiple of 1000", "confidence": 0.7}
- "hired this year" → {"filter": "year(hireDate) eq ${currentYear}", "description": "Hired in ${currentYear}", "confidence": 0.95}
- "employees hired before this year" → {"filter": "year(hireDate) lt ${currentYear}", "description": "Employees hired before ${currentYear}", "confidence": 0.9}

IMPORTANT: When the user references "this year", "current year", "este ano", or "ano atual", use year(column) eq ${currentYear} with the current year value ${currentYear}. For relative date expressions like "today" or "now", use the now() function.

If you cannot interpret the query, return: {"filter": "", "description": "Could not interpret the query", "confidence": 0.0}`;
  }

  private buildPrompt(query: string, columns: Array<PoTableAiSearchColumn>): { query: string; columns: Array<PoTableAiSearchColumn> } {
    return { query, columns };
  }

  private async executePromptWithStreaming(prompt: { query: string; columns: Array<PoTableAiSearchColumn> }): Promise<string> {
    const session = await this.getSession(prompt.columns);
    const message = `Convert this to an OData v4 filter: "${prompt.query}"`;

    this.ngZone.run(() => this.phase$.next('generating'));

    if (typeof session.promptStreaming === 'function') {
      return this.handleStreaming(session, message);
    }

    return session.prompt(message);
  }

  private async handleStreaming(session: any, message: string): Promise<string> {
    const stream = session.promptStreaming(message);
    const reader = stream.getReader();
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        fullText = typeof value === 'string' ? value : fullText + value;
        this.ngZone.run(() => this.streamChunk$.next(fullText));
      }
    } finally {
      reader.releaseLock();
    }

    return fullText;
  }

  private parseResponse(responseText: string, originalQuery: string): BuiltInAiResponse {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          filter: '',
          description: `Could not interpret the query: "${originalQuery}"`,
          confidence: 0.1
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        filter: typeof parsed.filter === 'string' ? parsed.filter : '',
        description: typeof parsed.description === 'string' ? parsed.description : '',
        confidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.5
      };
    } catch {
      return {
        filter: '',
        description: `Could not parse AI response for: "${originalQuery}"`,
        confidence: 0.1
      };
    }
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }
}
