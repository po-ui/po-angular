import { Component, OnInit, ViewChild } from '@angular/core';

import {
  PoAiSearchColumn,
  PoAiSearchComponent,
  PoAiSearchError,
  PoAiSearchResult,
  PoNotificationService,
  PoTableColumn
} from '@po-ui/ng-components';

import { SamplePoAiSearchWithAiService } from './sample-po-ai-search-with-ai.service';

@Component({
  selector: 'sample-po-ai-search-with-ai',
  templateUrl: './sample-po-ai-search-with-ai.component.html',
  providers: [SamplePoAiSearchWithAiService],
  standalone: false
})
export class SamplePoAiSearchWithAiComponent implements OnInit {
  @ViewChild('aiSearch', { static: true }) aiSearch: PoAiSearchComponent;

  filteredItems: Array<any> = [];
  loading = false;

  readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade' },
    { property: 'statusDescription', label: 'Status' }
  ];

  readonly aiColumns: Array<PoAiSearchColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'status', label: 'Status', type: 'string' }
  ];

  private readonly items = [
    { name: 'Ana Souza', age: 35, city: 'São Paulo', status: 'active', statusDescription: 'Ativo' },
    { name: 'Bruno Lima', age: 28, city: 'Curitiba', status: 'inactive', statusDescription: 'Inativo' },
    { name: 'Carla Dias', age: 42, city: 'São Paulo', status: 'active', statusDescription: 'Ativo' },
    { name: 'Diego Reis', age: 31, city: 'Joinville', status: 'active', statusDescription: 'Ativo' }
  ];

  constructor(
    private readonly aiService: SamplePoAiSearchWithAiService,
    private readonly poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  // Demonstra a integração com a IA interceptando a chamada do componente.
  // Em produção, basta configurar `p-url` apontando para o proxy de IA.
  onResult(result: PoAiSearchResult) {
    this.applyFilter(result.filter);
    this.poNotification.success(`Filtro aplicado via IA: ${result.description}`);
  }

  onLowConfidence(result: PoAiSearchResult) {
    this.poNotification.warning(`Não tenho certeza do que você quis dizer: "${result.query}". Tente reformular.`);
  }

  onError(error: PoAiSearchError) {
    this.poNotification.error(`Erro ao consultar a IA: ${error.message}`);
  }

  onClear() {
    this.filteredItems = [...this.items];
  }

  private applyFilter(filter: string) {
    if (!filter) {
      this.filteredItems = [...this.items];
      return;
    }

    this.filteredItems = this.items.filter(item => this.matchesFilter(item, filter));
  }

  private matchesFilter(item: any, filter: string): boolean {
    return filter.split(' and ').every(clause => this.matchesClause(item, clause.trim()));
  }

  private matchesClause(item: any, clause: string): boolean {
    const match = clause.match(/^(\w+)\s+(eq|gt|lt)\s+'?([^']+)'?$/);

    if (!match) {
      return true;
    }

    const [, property, operator, rawValue] = match;
    const itemValue = item[property];
    const value = isNaN(Number(rawValue)) ? rawValue : Number(rawValue);

    switch (operator) {
      case 'eq':
        return String(itemValue).toLowerCase() === String(value).toLowerCase();
      case 'gt':
        return Number(itemValue) > Number(value);
      case 'lt':
        return Number(itemValue) < Number(value);
      default:
        return true;
    }
  }
}
