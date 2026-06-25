import { Component, OnInit, ViewChild } from '@angular/core';


import { AppPoSearchAiWithAiService } from './sample-po-search-ai-with-ai.service';
import { PoNotificationService, PoSearchAiColumn, PoSearchAiComponent, PoSearchAiError, PoSearchAiResult, PoTableColumn } from 'projects/ui/src/lib';
import { SamplePoSearchAiWithAiService } from 'projects/ui/src/lib/components/po-field/po-search-ai/samples/sample-po-search-ai-with-ai/sample-po-search-ai-with-ai.service';

@Component({
  selector: 'app-po-search-ai-with-ai',
  templateUrl: './sample-po-search-ai-with-ai.component.html',
  providers: [AppPoSearchAiWithAiService],
  standalone: false
})
export class AppPoSearchAiWithAiComponent implements OnInit {
  @ViewChild('searchAi', { static: true }) searchAi: PoSearchAiComponent;

  filteredItems: Array<any> = [];
  loading = false;

  readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade' },
    { property: 'statusDescription', label: 'Status' }
  ];

  readonly aiColumns: Array<PoSearchAiColumn> = [
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
    private readonly aiService: SamplePoSearchAiWithAiService,
    private readonly poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  // Demonstra a integração com a IA interceptando a chamada do componente.
  // Em produção, basta configurar `p-url` apontando para o proxy de IA.
  onResult(result: PoSearchAiResult) {
    this.applyFilter(result.filter);
    // this.poNotification.success(`Filtro aplicado via IA: ${result.description}`);
  }

  onLowConfidence(result: PoSearchAiResult) {
    // this.poNotification.warning(`Não tenho certeza do que você quis dizer: "${result.query}". Tente reformular.`);
  }

  onError(error: PoSearchAiError) {
    // this.poNotification.error(`Erro ao consultar a IA: ${error.message}`);
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
