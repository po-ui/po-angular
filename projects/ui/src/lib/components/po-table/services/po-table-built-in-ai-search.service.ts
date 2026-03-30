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
      .map(col => `${col.property}(${col.type})`)
      .join(', ');
    const currentYear = new Date().getFullYear();

    return [
      'Convert natural language queries into OData v4 $filter expressions.',
      `Available columns: ${columnsDescription}`,
      `Current year: ${currentYear}`,
      'OData operators: eq, ne, gt, ge, lt, le, and, or, not, in',
      'OData functions: contains, tolower, toupper, startswith, endswith, year, month, day, now, concat, length, trim, substring, floor, ceiling, round',
      '',
      'You must ALWAYS respond with EXACTLY one line of JSON in this format:',
      '{"filter":"ODATA_EXPRESSION","confidence":NUMBER}',
      '',
      'Do NOT include any other text, explanation, markdown, or code blocks.',
      'Do NOT use any keys other than "filter" and "confidence".',
      '',
      'Example interactions:',
      'User: age greater than 30',
      'Assistant: {"filter":"age gt 30","confidence":0.95}',
      'User: name contains Silva',
      'Assistant: {"filter":"contains(tolower(name),\'silva\')","confidence":0.9}',
      `User: hired this year`,
      `Assistant: {"filter":"year(hireDate) eq ${currentYear}","confidence":0.9}`,
      'User: department TI or Marketing',
      'Assistant: {"filter":"department in (\'TI\',\'Marketing\')","confidence":0.9}',
      'User: asdfgh',
      'Assistant: {"filter":"","confidence":0.0}'
    ].join('\n');
  }

  private buildPrompt(query: string, columns: Array<PoTableAiSearchColumn>): { query: string; columns: Array<PoTableAiSearchColumn> } {
    return { query, columns };
  }

  private async executePromptWithStreaming(prompt: { query: string; columns: Array<PoTableAiSearchColumn> }): Promise<string> {
    const session = await this.getSession(prompt.columns);

    this.ngZone.run(() => this.phase$.next('generating'));

    const response = await this.promptSession(session, prompt.query);

    if (this.isValidResponse(response)) {
      return response;
    }

    const retryMessage = `Your previous response was invalid. Respond with ONLY this JSON format, nothing else:\n{"filter":"ODATA_EXPRESSION","confidence":NUMBER}\n\nConvert: ${prompt.query}`;
    return this.promptSession(session, retryMessage);
  }

  private async promptSession(session: any, message: string): Promise<string> {
    if (typeof session.promptStreaming === 'function') {
      return this.handleStreaming(session, message);
    }
    return session.prompt(message);
  }

  private isValidResponse(response: string): boolean {
    try {
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        return false;
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return typeof parsed.filter === 'string' && typeof parsed.confidence === 'number';
    } catch {
      return false;
    }
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
        if (typeof value === 'string') {
          fullText += value;
        }
        this.ngZone.run(() => this.streamChunk$.next(fullText));
      }
    } finally {
      reader.releaseLock();
    }

    return fullText;
  }

  private parseResponse(responseText: string, originalQuery: string): BuiltInAiResponse {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        const odataFilter = this.extractODataFromText(responseText);
        return {
          filter: odataFilter,
          description: odataFilter ? '' : `Não foi possível interpretar: "${originalQuery}"`,
          confidence: odataFilter ? 0.5 : 0.0
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const filter = typeof parsed.filter === 'string'
        ? parsed.filter
        : this.extractFilterFromParsed(parsed);

      const confidence = typeof parsed.confidence === 'number'
        ? Math.max(0, Math.min(1, parsed.confidence))
        : (filter ? 0.5 : 0.0);

      return { filter, description: '', confidence };
    } catch {
      const odataFilter = this.extractODataFromText(responseText);
      return {
        filter: odataFilter,
        description: odataFilter ? '' : `Não foi possível processar resposta para: "${originalQuery}"`,
        confidence: odataFilter ? 0.5 : 0.0
      };
    }
  }

  private extractFilterFromParsed(parsed: Record<string, any>): string {
    for (const key of Object.keys(parsed)) {
      const value = parsed[key];
      if (typeof value === 'string' && this.looksLikeODataFilter(value)) {
        return value;
      }
    }
    return '';
  }

  private extractODataFromText(text: string): string {
    const odataPattern = /\$filter=([^\s`'"]+)/;
    const match = text.match(odataPattern);
    if (match) {
      return match[1];
    }

    const filterPattern = /(?:^|\n)\s*([a-zA-Z_]\w*\s+(?:eq|ne|gt|ge|lt|le)\s+.+?)\s*(?:\n|$)/;
    const filterMatch = text.match(filterPattern);
    if (filterMatch) {
      return filterMatch[1].trim();
    }

    return '';
  }

  private looksLikeODataFilter(value: string): boolean {
    const odataKeywords = /\b(eq|ne|gt|ge|lt|le|and|or|not|in)\b/;
    const odataFunctions = /\b(contains|tolower|toupper|startswith|endswith|year|month|day)\s*\(/;
    return odataKeywords.test(value) || odataFunctions.test(value);
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
