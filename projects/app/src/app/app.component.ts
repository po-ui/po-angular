import { Component } from '@angular/core';
import { PoTableColumn, PoTableAiSearchResult, PoTableAiSearchError } from '../../../ui/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  serviceApi = '/api/employees';

  lastQuery = '';
  lastFilter = '';
  lastDescription = '';
  lastConfidence = 0;
  errorMessage = '';
  fullApiUrl = '';

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', type: 'number' },
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'department', label: 'Departamento', type: 'string' },
    { property: 'salary', label: 'Salário', type: 'currency', format: 'BRL' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      labels: [
        { value: 'Ativo', color: 'color-10', label: 'Ativo' },
        { value: 'Inativo', color: 'color-07', label: 'Inativo' }
      ]
    },
    { property: 'hireDate', label: 'Admissão', type: 'date' }
  ];

  examples = [
    'idade maior que 35',
    'ativos de São Paulo',
    'salário acima de 10000',
    'departamento TI ou Marketing',
    'inativos',
    'idade entre 25 e 30',
    'nome contém Silva',
    'admitidos em 2023',
    'nome começa com A e idade diferente de 30',
    'ativos de São Paulo com idade maior que 30',
    'departamento não é RH',
    'salário múltiplo de 1000',
    'admitidos no mês 6',
    'nome termina com Silva',
    'admitidos este ano',
    'salário menor ou igual a 8000 ou cidade é Curitiba'
  ];

  onAiSearchResult(result: PoTableAiSearchResult): void {
    this.lastQuery = result.query;
    this.lastFilter = result.filter;
    this.lastDescription = result.description;
    this.lastConfidence = result.confidence;
    this.errorMessage = '';
    this.buildFullApiUrl(result.filter);
  }

  onAiSearchLowConfidence(result: PoTableAiSearchResult): void {
    this.lastQuery = result.query;
    this.lastFilter = result.filter;
    this.lastDescription = result.description;
    this.lastConfidence = result.confidence;
    this.errorMessage = `Confiança baixa (${(result.confidence * 100).toFixed(0)}%) — filtro não aplicado automaticamente`;
    this.buildFullApiUrl(result.filter);
  }

  onAiSearchError(error: PoTableAiSearchError): void {
    this.lastQuery = error.query;
    this.lastFilter = '';
    this.lastDescription = '';
    this.lastConfidence = 0;
    this.errorMessage = `Erro ${error.statusCode}: ${error.message}`;
    this.fullApiUrl = '';
  }

  private buildFullApiUrl(filter: string): void {
    if (filter) {
      this.fullApiUrl = `${this.serviceApi}?$filter=${encodeURIComponent(filter)}`;
    } else {
      this.fullApiUrl = '';
    }
  }
}
