import { Component } from '@angular/core';
import { PoTableColumn, PoTableAiSearchResult, PoTableAiSearchError } from '../../../../ui/src/lib/components/po-table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  aiSearchUrl = '/api/ai/filter';
  serviceApi = '/api/employees';

  lastQuery = '';
  lastFilter = '';
  lastDescription = '';
  lastConfidence = 0;
  errorMessage = '';

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', type: 'number' },
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'department', label: 'Departamento', type: 'string' },
    { property: 'salary', label: 'Salário', type: 'currency', format: 'BRL' },
    { property: 'status', label: 'Status', type: 'label', labels: [
      { value: 'Ativo', color: 'color-10', label: 'Ativo' },
      { value: 'Inativo', color: 'color-07', label: 'Inativo' }
    ]},
    { property: 'hireDate', label: 'Admissão', type: 'date' }
  ];

  examples = [
    'idade maior que 35',
    'ativos de São Paulo',
    'salário acima de 10000',
    'departamento TI',
    'inativos',
    'idade entre 25 e 30',
    'nome contém Silva',
    'admitidos em 2024',
    'nome contém Silva e salário menor que 10000',
    'ativos de São Paulo com idade maior que 30',
    'departamento TI e idade entre 25 e 35',
    'inativos com salário acima de 8000'
  ];

  onAiSearchResult(result: PoTableAiSearchResult): void {
    this.lastQuery = result.query;
    this.lastFilter = result.filter;
    this.lastDescription = result.description;
    this.lastConfidence = result.confidence;
    this.errorMessage = '';
  }

  onAiSearchLowConfidence(result: PoTableAiSearchResult): void {
    this.lastQuery = result.query;
    this.lastFilter = result.filter;
    this.lastDescription = result.description;
    this.lastConfidence = result.confidence;
    this.errorMessage = `Confiança baixa (${(result.confidence * 100).toFixed(0)}%) — filtro não aplicado automaticamente`;
  }

  onAiSearchError(error: PoTableAiSearchError): void {
    this.lastQuery = error.query;
    this.lastFilter = '';
    this.lastDescription = '';
    this.lastConfidence = 0;
    this.errorMessage = `Erro ${error.statusCode}: ${error.message}`;
  }
}
