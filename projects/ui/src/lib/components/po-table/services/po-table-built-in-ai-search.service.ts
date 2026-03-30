import { Injectable, NgZone } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import { PoTableAiSearchColumn } from '../interfaces/po-table-ai-search.interface';

interface BuiltInAiResponse {
  filter: string;
  description: string;
  confidence: number;
}

@Injectable()
export class PoTableBuiltInAiSearchService {
  private session: any = null;

  constructor(private ngZone: NgZone) {}

  /**
   * Verifica se o Built-in AI está disponível no navegador.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const ai = (window as any).ai;
      if (!ai?.languageModel) {
        return false;
      }
      const capabilities = await ai.languageModel.capabilities();
      return capabilities?.available === 'readily' || capabilities?.available === 'after-download';
    } catch {
      return false;
    }
  }

  /**
   * Envia uma query em linguagem natural ao Built-in AI e retorna o filtro OData correspondente.
   *
   * @param query Texto em linguagem natural digitado pelo usuário.
   * @param columns Metadados das colunas visíveis da tabela.
   * @param timeoutMs Timeout em milissegundos para a chamada.
   */
  sendQuery(
    query: string,
    columns: Array<PoTableAiSearchColumn>,
    timeoutMs: number = 30000
  ): Observable<BuiltInAiResponse> {
    const sanitizedQuery = this.sanitizeInput(query);
    const prompt = this.buildPrompt(sanitizedQuery, columns);

    return from(this.executePrompt(prompt)).pipe(
      timeout(timeoutMs),
      map(responseText => this.parseResponse(responseText, sanitizedQuery)),
      catchError(error => {
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
    const ai = (window as any).ai;
    if (!ai?.languageModel) {
      throw new Error('Built-in AI is not available in this browser');
    }

    const systemPrompt = this.buildSystemPrompt(columns);

    this.destroySession();
    this.session = await ai.languageModel.create({
      systemPrompt
    });

    return this.session;
  }

  private buildSystemPrompt(columns: Array<PoTableAiSearchColumn>): string {
    const columnsDescription = columns
      .map(col => `  - "${col.property}" (label: "${col.label}", type: ${col.type})`)
      .join('\n');

    return `You are an OData v4 filter generator. Your job is to convert natural language queries into OData v4 $filter expressions.

Available columns:
${columnsDescription}

Rules:
1. Use ONLY the column properties listed above.
2. For string comparisons use: eq, ne, contains(), startswith(), endswith().
3. For numeric comparisons use: eq, ne, gt, ge, lt, le.
4. For date comparisons use: eq, ne, gt, ge, lt, le with format YYYY-MM-DD.
5. Combine conditions with "and" or "or".
6. String values must be enclosed in single quotes.
7. The contains() function is case-sensitive in OData but many servers implement it as case-insensitive.

You MUST respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{"filter": "<OData filter expression>", "description": "<human-readable description of the filter in the same language as the query>", "confidence": <number between 0 and 1>}

Examples:
- Query: "age greater than 30" → {"filter": "age gt 30", "description": "Age greater than 30", "confidence": 0.95}
- Query: "name contains Silva" → {"filter": "contains(name, 'Silva')", "description": "Name contains Silva", "confidence": 0.9}
- Query: "active employees from São Paulo" → {"filter": "status eq 'Ativo' and city eq 'São Paulo'", "description": "Active employees from São Paulo", "confidence": 0.85}
- Query: "salary above 10000 and department IT" → {"filter": "salary gt 10000 and department eq 'TI'", "description": "Salary above 10000 and IT department", "confidence": 0.9}

If you cannot interpret the query, return: {"filter": "", "description": "Could not interpret the query", "confidence": 0.0}`;
  }

  private buildPrompt(query: string, columns: Array<PoTableAiSearchColumn>): { query: string; columns: Array<PoTableAiSearchColumn> } {
    return { query, columns };
  }

  private async executePrompt(prompt: { query: string; columns: Array<PoTableAiSearchColumn> }): Promise<string> {
    const session = await this.getSession(prompt.columns);
    return session.prompt(`Convert this to an OData v4 filter: "${prompt.query}"`);
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
