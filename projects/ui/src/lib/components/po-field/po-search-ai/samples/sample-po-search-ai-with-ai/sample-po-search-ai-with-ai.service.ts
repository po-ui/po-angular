import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { PoSearchAiResponse } from '@po-ui/ng-components';

/**
 * Serviço de mock que simula o backend (proxy) de IA para fins de demonstração.
 *
 * Em um cenário real, o `po-search-ai` faz um `POST` para `p-url` e o backend encaminha
 * a consulta para a LLM. Aqui, interpretamos algumas palavras-chave localmente para
 * gerar um filtro OData e uma descrição, sem nenhuma chamada externa.
 */
@Injectable({
  providedIn: 'root'
})
export class SamplePoSearchAiWithAiService {
  interpret(query: string): Observable<PoSearchAiResponse> {
    const normalized = (query || '').toLowerCase();
    const filters: Array<string> = [];
    const descriptions: Array<string> = [];

    const ageMatch = normalized.match(/(\d{1,3})\s*anos/);
    if (ageMatch) {
      filters.push(`age gt ${ageMatch[1]}`);
      descriptions.push(`idade acima de ${ageMatch[1]} anos`);
    }

    const cityMatch = normalized.match(/(são paulo|rio de janeiro|curitiba|joinville)/);
    if (cityMatch) {
      filters.push(`city eq '${this.capitalize(cityMatch[1])}'`);
      descriptions.push(`cidade ${this.capitalize(cityMatch[1])}`);
    }

    if (normalized.includes('ativo')) {
      filters.push(`status eq 'active'`);
      descriptions.push('status ativo');
    }

    const confidence = filters.length ? 0.9 : 0.2;

    const response: PoSearchAiResponse = {
      filter: filters.join(' and '),
      description: descriptions.length ? descriptions.join(', ') : 'Não foi possível interpretar a busca',
      confidence
    };

    // Simula a latência de rede/IA.
    return of(response).pipe(delay(800));
  }

  private capitalize(value: string): string {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
