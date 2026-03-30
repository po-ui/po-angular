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

    this.phase$.next('initializing');

    return from(this.executePromptWithStreaming(sanitizedQuery, columns)).pipe(
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

  private async getSession(): Promise<any> {
    const LanguageModel = (window as any).LanguageModel;
    if (!LanguageModel) {
      throw new Error('Built-in AI is not available in this browser');
    }

    this.destroySession();
    this.session = await LanguageModel.create({
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

  private buildFullPrompt(query: string, columns: Array<PoTableAiSearchColumn>): string {
    const columnsDescription = columns
      .map(col => `${col.property}(${col.type})`)
      .join(', ');
    const currentYear = new Date().getFullYear();

    return [
      'Convert the natural language query below into an OData v4 $filter expression.',
      'Reply with ONLY the OData $filter expression. Nothing else. No explanation. No JSON. No markdown. Just the raw filter.',
      '',
      `Available columns: ${columnsDescription}`,
      `Current year: ${currentYear}`,
      'Operators: eq ne gt ge lt le and or not in',
      'Functions: contains tolower toupper startswith endswith year month day now concat length trim substring floor ceiling round',
      '',
      'RULES:',
      '- Output ONLY the filter expression, one single line',
      '- Strings in single quotes',
      '- For text search use: contains(tolower(column),\'value\')',
      `- "this year"/"este ano" means: year(column) eq ${currentYear}`,
      '- Multiple values: column in (\'val1\',\'val2\')',
      '- If you cannot convert, reply with exactly: EMPTY',
      '',
      'Examples:',
      'Q: age greater than 30',
      'A: age gt 30',
      'Q: name contains Silva',
      'A: contains(tolower(name),\'silva\')',
      `Q: hired this year`,
      `A: year(hireDate) eq ${currentYear}`,
      'Q: department TI or Marketing',
      'A: department in (\'TI\',\'Marketing\')',
      'Q: sdkfjhskdjfh',
      'A: EMPTY',
      '',
      `Q: ${query}`,
      'A:'
    ].join('\n');
  }

  private async executePromptWithStreaming(query: string, columns: Array<PoTableAiSearchColumn>): Promise<string> {
    const session = await this.getSession();
    const message = this.buildFullPrompt(query, columns);

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
    const filter = this.extractODataFilter(responseText);
    const confidence = this.calculateConfidence(filter, responseText);

    return {
      filter,
      description: filter ? '' : `Não foi possível interpretar: "${originalQuery}"`,
      confidence
    };
  }

  private extractODataFilter(responseText: string): string {
    const cleaned = responseText
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    if (/^EMPTY$/i.test(cleaned)) {
      return '';
    }

    const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (typeof parsed.filter === 'string') {
          return parsed.filter;
        }
        for (const key of Object.keys(parsed)) {
          if (typeof parsed[key] === 'string' && this.looksLikeODataFilter(parsed[key])) {
            return parsed[key];
          }
        }
      } catch {}
    }

    const filterParamMatch = cleaned.match(/\$filter=([^\s&]+)/);
    if (filterParamMatch) {
      return decodeURIComponent(filterParamMatch[1]);
    }

    const lines = cleaned.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    for (const line of lines) {
      const cleanLine = line.replace(/^[*\-•]\s*/, '').replace(/^[Aa]:\s*/, '').trim();
      if (this.looksLikeODataFilter(cleanLine) && cleanLine.length < 500) {
        return cleanLine;
      }
    }

    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^[Aa]:\s*/, '').trim();
      if (firstLine.length < 200 && !firstLine.includes(' ') === false) {
        const hasColumn = /[a-zA-Z_]\w*/.test(firstLine);
        if (hasColumn && !firstLine.startsWith('The ') && !firstLine.startsWith('Here ') && !firstLine.startsWith('I ')) {
          return firstLine;
        }
      }
    }

    return '';
  }

  private calculateConfidence(filter: string, responseText: string): number {
    if (!filter) {
      return 0.0;
    }

    let confidence = 0.5;

    const odataOps = (filter.match(/\b(eq|ne|gt|ge|lt|le|and|or|not|in)\b/g) || []).length;
    const odataFns = (filter.match(/\b(contains|tolower|toupper|startswith|endswith|year|month|day)\s*\(/g) || []).length;

    if (odataOps > 0) {
      confidence += 0.2;
    }
    if (odataFns > 0) {
      confidence += 0.15;
    }
    if (/^[a-zA-Z_]/.test(filter)) {
      confidence += 0.1;
    }

    const hasExtraText = responseText.length > filter.length * 3;
    if (hasExtraText) {
      confidence -= 0.15;
    }

    return Math.max(0, Math.min(1, parseFloat(confidence.toFixed(2))));
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
