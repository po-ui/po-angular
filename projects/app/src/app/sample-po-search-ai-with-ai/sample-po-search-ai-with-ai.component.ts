import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import {
  PoNotificationService,
  PoSearchAiColumn,
  PoSearchAiError,
  PoSearchAiResult,
  PoTableColumn
} from 'projects/ui/src/lib';

const API_BASE = 'https://po-sample-api.onrender.com/v1';

@Component({
  selector: 'app-po-search-ai-with-ai',
  templateUrl: './sample-po-search-ai-with-ai.component.html',
  standalone: false
})
export class AppPoSearchAiWithAiComponent implements OnInit {
  filteredItems: Array<any> = [];
  loading = false;

  readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade' },
    { property: 'department', label: 'Departamento' },
    { property: 'salary', label: 'Salário', type: 'currency', format: 'BRL' },
    { property: 'status', label: 'Status' },
    { property: 'hireDate', label: 'Admissão', type: 'date' }
  ];

  readonly aiColumns: Array<PoSearchAiColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'department', label: 'Departamento', type: 'string' },
    { property: 'salary', label: 'Salário', type: 'number' },
    { property: 'status', label: 'Status', type: 'string' },
    { property: 'hireDate', label: 'Data de admissão', type: 'date' }
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  onResult(result: PoSearchAiResult) {
    this.loading = true;
    this.http.get<{ items: any[] }>(`${API_BASE}/employees?$filter=${encodeURIComponent(result.filter)}`).subscribe({
      next: ({ items }) => {
        this.filteredItems = items;
        this.loading = false;
        this.poNotification.success(`Filtro aplicado: ${result.description}`);
      },
      error: () => {
        this.loading = false;
        this.poNotification.error('Erro ao buscar funcionários.');
      }
    });
  }

  onLowConfidence(result: PoSearchAiResult) {
    this.poNotification.warning(`Não tenho certeza do que você quis dizer: "${result.query}". Tente reformular.`);
  }

  onError(error: PoSearchAiError) {
    this.poNotification.error(`Erro ao consultar a IA: ${error.message}`);
  }

  onClear() {
    this.loadEmployees();
  }

  private loadEmployees() {
    this.loading = true;
    this.http.get<{ items: any[] }>(`${API_BASE}/employees`).subscribe({
      next: ({ items }) => {
        this.filteredItems = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
