import { Component, ViewChild } from '@angular/core';

import {
  PoFilterChipSelectedChange,
  PoNotificationService,
  PoSearchAiError,
  PoSearchAiResult,
  PoTableColumn,
  PoTableComponent,
  PoTableSearchAiField
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-table-search-ai',
  templateUrl: './sample-po-table-search-ai.component.html',
  standalone: false
})
export class SamplePoTableSearchAiComponent {
  @ViewChild(PoTableComponent) table: PoTableComponent;

  selectedSuggestion: string;
  suggestionsLocked = false;

  readonly examples: Array<string> = [
    'salário acima de 15000',
    'funcionários de Curitiba',
    'departamento Engenharia com salário acima de 10000',
    'admitidos depois de 2020',
    'com menos de 30 anos',
    'de São Paulo com salário abaixo de 15000',
    'departamento Design',
    'salário entre 8000 e 12000'
  ];

  AI_URL = 'https://po-sample-api.onrender.com/v1/ai/filter';
  readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade' },
    { property: 'department', label: 'Departamento' },
    { property: 'salary', label: 'Salário', type: 'currency', format: 'BRL' },
    { property: 'hireDate', label: 'Admissão', type: 'date' }
  ];

  readonly items: Array<any> = [
    { name: 'Tony Stark', age: 34, city: 'São Paulo', department: 'Engenharia', salary: 12000, hireDate: '2019-03-15' },
    { name: 'Rachel Green', age: 28, city: 'Curitiba', department: 'Design', salary: 8500, hireDate: '2021-07-01' },
    { name: 'Michael Scott', age: 42, city: 'São Paulo', department: 'Gestão', salary: 18000, hireDate: '2015-11-20' },
    {
      name: 'Hermione Granger',
      age: 25,
      city: 'Recife',
      department: 'Engenharia',
      salary: 7200,
      hireDate: '2023-01-10'
    },
    {
      name: 'Walter White',
      age: 30,
      city: 'Belo Horizonte',
      department: 'Design',
      salary: 9500,
      hireDate: '2020-05-18'
    },
    {
      name: 'Monica Geller',
      age: 38,
      city: 'Rio de Janeiro',
      department: 'Gestão',
      salary: 15000,
      hireDate: '2017-09-03'
    },
    {
      name: 'Peter Parker',
      age: 27,
      city: 'São Paulo',
      department: 'Engenharia',
      salary: 10000,
      hireDate: '2022-04-12'
    },
    {
      name: 'Daenerys Targaryen',
      age: 45,
      city: 'Curitiba',
      department: 'Engenharia',
      salary: 21000,
      hireDate: '2012-06-30'
    }
  ];

  readonly searchAiField: PoTableSearchAiField = {
    url: this.AI_URL,
    placeholder: 'Ex: engenheiros de São Paulo com salário acima de 10000'
  };

  private readonly SUGGESTION_LOCK_TIME = 3000;
  private lockTimeout: ReturnType<typeof setTimeout>;

  constructor(private poNotification: PoNotificationService) {}

  applySuggestion(query: string): void {
    this.table.updateSearchAIQuery(query, true);
  }

  onSuggestionChange(query: string, event: PoFilterChipSelectedChange): void {
    if (!event.selected || this.suggestionsLocked) {
      return;
    }

    this.selectedSuggestion = query;
    this.applySuggestion(query);
    this.lockSuggestions();
  }

  onAiResult(result: PoSearchAiResult): void {
    this.poNotification.success(`Busca concluída para "${result.query}".`);
  }

  onAiLowConfidence(result: PoSearchAiResult): void {
    this.poNotification.warning(
      `Baixa confiança (${Math.round((result.confidence ?? 0) * 100)}%): verifique se o resultado reflete a busca por "${result.query}".`
    );
  }

  onAiError(error: PoSearchAiError): void {
    this.poNotification.error(`Erro ${error.statusCode}: ${error.message}`);
  }

  private lockSuggestions(): void {
    this.suggestionsLocked = true;
    clearTimeout(this.lockTimeout);
    this.lockTimeout = setTimeout(() => {
      this.suggestionsLocked = false;
    }, this.SUGGESTION_LOCK_TIME);
  }
}
