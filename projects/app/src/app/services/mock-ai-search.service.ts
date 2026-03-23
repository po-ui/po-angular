import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

/**
 * Interceptor HTTP que simula o endpoint de IA para AI Search.
 *
 * Intercepta chamadas POST para `/api/ai/filter` e retorna filtros OData
 * gerados a partir de regex (mock da LLM).
 *
 * Em produção, este interceptor seria removido e a URL apontaria para
 * um endpoint real (ex: Gemini, Azure OpenAI, etc).
 */
@Injectable()
export class MockAiSearchInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' && req.url.includes('/api/ai/filter')) {
      const { query, columns } = req.body;
      const result = this.processQuery(query, columns);

      return of(
        new HttpResponse({
          status: 200,
          body: result
        })
      ).pipe(delay(600));
    }

    return next.handle(req);
  }

  private processQuery(
    query: string,
    columns: Array<{ property: string; label: string; type: string }>
  ): { filter: string; description: string; confidence: number } {
    const normalizedQuery = query.toLowerCase().trim();
    const filters: string[] = [];
    const descriptions: string[] = [];

    // Divide a query em partes usando conectores
    const parts = normalizedQuery.split(/\s+(?:e|com|,)\s+/);

    for (const part of parts) {
      const partFilters = this.extractFilters(part.trim(), columns);
      filters.push(...partFilters.filters);
      descriptions.push(...partFilters.descriptions);
    }

    if (filters.length === 0) {
      // Fallback: busca textual em colunas string
      const stringCols = columns.filter(c => c.type === 'string');
      if (stringCols.length > 0) {
        const textFilters = stringCols.map(c => `contains(${c.property}, '${normalizedQuery}')`);
        return {
          filter: textFilters.join(' or '),
          description: `Busca textual por "${query}" em todas as colunas de texto`,
          confidence: 0.4
        };
      }

      return {
        filter: '',
        description: `Nao foi possivel interpretar a busca: "${query}"`,
        confidence: 0.1
      };
    }

    return {
      filter: filters.join(' and '),
      description: descriptions.join('; '),
      confidence: Math.min(0.95, 0.7 + filters.length * 0.05)
    };
  }

  private extractFilters(
    part: string,
    columns: Array<{ property: string; label: string; type: string }>
  ): { filters: string[]; descriptions: string[] } {
    const filters: string[] = [];
    const descriptions: string[] = [];

    // Status ativo/inativo
    const statusMatch = part.match(/\b(ativos?|inativos?)\b/i);
    if (statusMatch) {
      const statusCol = columns.find(c => c.property === 'status');
      if (statusCol) {
        const value = statusMatch[1].toLowerCase().startsWith('ativo') ? 'Ativo' : 'Inativo';
        filters.push(`status eq '${value}'`);
        descriptions.push(`Status = ${value}`);
      }
    }

    // Idade entre X e Y
    const ageBetweenMatch = part.match(/idade\s+entre\s+(\d+)\s+e\s+(\d+)/i);
    if (ageBetweenMatch) {
      const ageCol = columns.find(c => c.property === 'age');
      if (ageCol) {
        filters.push(`age ge ${ageBetweenMatch[1]} and age le ${ageBetweenMatch[2]}`);
        descriptions.push(`Idade entre ${ageBetweenMatch[1]} e ${ageBetweenMatch[2]}`);
        return { filters, descriptions };
      }
    }

    // Idade comparacao
    const ageMatch = part.match(/idade\s+(maior|menor|acima|abaixo|igual)\s*(?:que|de|a)?\s*(\d+)/i);
    if (ageMatch) {
      const ageCol = columns.find(c => c.property === 'age');
      if (ageCol) {
        const op = this.getOperator(ageMatch[1]);
        filters.push(`age ${op} ${ageMatch[2]}`);
        descriptions.push(`Idade ${ageMatch[1]} que ${ageMatch[2]}`);
      }
    }

    // Salario comparacao
    const salaryMatch = part.match(
      /sal[aá]rio\s+(maior|menor|acima|abaixo|igual)\s*(?:que|de|a)?\s*(\d+)/i
    );
    if (salaryMatch) {
      const salaryCol = columns.find(c => c.property === 'salary');
      if (salaryCol) {
        const op = this.getOperator(salaryMatch[1]);
        filters.push(`salary ${op} ${salaryMatch[2]}`);
        descriptions.push(`Salario ${salaryMatch[1]} que ${salaryMatch[2]}`);
      }
    }

    // Cidade
    const cityMatch = part.match(
      /(?:de|em|cidade)\s+([\wà-ú]+(?:\s+[\wà-ú]+)*?)(?:\s+(?:e|com|que|$))/i
    );
    if (cityMatch && !cityMatch[1].match(/^(maior|menor|acima|abaixo|idade|salario|ativos?|inativos?)$/i)) {
      const cityCol = columns.find(c => c.property === 'city');
      if (cityCol) {
        const city = cityMatch[1].trim();
        filters.push(`city eq '${city}'`);
        descriptions.push(`Cidade = ${city}`);
      }
    }

    // Departamento
    const deptMatch = part.match(/departamento\s+([\wà-ú]+)/i);
    if (deptMatch) {
      const deptCol = columns.find(c => c.property === 'department');
      if (deptCol) {
        filters.push(`department eq '${deptMatch[1]}'`);
        descriptions.push(`Departamento = ${deptMatch[1]}`);
      }
    }

    // Nome contém
    const nameMatch = part.match(/nome\s+(?:cont[ée]m|com)\s+([\wà-ú]+)/i);
    if (nameMatch) {
      const nameCol = columns.find(c => c.property === 'name');
      if (nameCol) {
        filters.push(`contains(name, '${nameMatch[1].toLowerCase()}')`);
        descriptions.push(`Nome contem "${nameMatch[1]}"`);
      }
    }

    // Admitidos em (ano)
    const hireDateMatch = part.match(/admitidos?\s+em\s+(\d{4})/i);
    if (hireDateMatch) {
      const hireDateCol = columns.find(c => c.property === 'hireDate');
      if (hireDateCol) {
        const year = hireDateMatch[1];
        filters.push(`hireDate ge ${year}-01-01 and hireDate le ${year}-12-31`);
        descriptions.push(`Admitidos em ${year}`);
      }
    }

    return { filters, descriptions };
  }

  private getOperator(term: string): string {
    switch (term.toLowerCase()) {
      case 'maior':
      case 'acima':
        return 'gt';
      case 'menor':
      case 'abaixo':
        return 'lt';
      case 'igual':
        return 'eq';
      default:
        return 'eq';
    }
  }
}
