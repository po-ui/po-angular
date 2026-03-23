import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

interface Employee {
  id: number;
  name: string;
  age: number;
  city: string;
  department: string;
  salary: number;
  status: string;
  hireDate: string;
}

/**
 * Interceptor HTTP que simula uma API REST com suporte a OData $filter.
 *
 * Intercepta chamadas GET para `/api/employees` e aplica filtros OData localmente.
 * Em produção, este interceptor seria removido e a URL apontaria para uma API real.
 */
@Injectable()
export class MockEmployeesInterceptor implements HttpInterceptor {
  private employees: Employee[] = [
    { id: 1, name: 'Ana Silva', age: 28, city: 'São Paulo', department: 'TI', salary: 8500, status: 'Ativo', hireDate: '2023-03-15' },
    { id: 2, name: 'Bruno Costa', age: 35, city: 'Rio de Janeiro', department: 'RH', salary: 7200, status: 'Ativo', hireDate: '2022-01-10' },
    { id: 3, name: 'Carla Mendes', age: 42, city: 'São Paulo', department: 'Financeiro', salary: 12000, status: 'Ativo', hireDate: '2020-06-01' },
    { id: 4, name: 'Diego Oliveira', age: 31, city: 'Belo Horizonte', department: 'TI', salary: 9800, status: 'Inativo', hireDate: '2021-09-20' },
    { id: 5, name: 'Elena Santos', age: 26, city: 'Curitiba', department: 'Marketing', salary: 6500, status: 'Ativo', hireDate: '2024-02-01' },
    { id: 6, name: 'Fernando Lima', age: 39, city: 'São Paulo', department: 'TI', salary: 15000, status: 'Ativo', hireDate: '2019-04-15' },
    { id: 7, name: 'Gabriela Rocha', age: 33, city: 'Porto Alegre', department: 'RH', salary: 8000, status: 'Inativo', hireDate: '2022-07-01' },
    { id: 8, name: 'Hugo Pereira', age: 45, city: 'Rio de Janeiro', department: 'Financeiro', salary: 14000, status: 'Ativo', hireDate: '2018-11-10' },
    { id: 9, name: 'Isabela Alves', age: 29, city: 'São Paulo', department: 'Marketing', salary: 7800, status: 'Ativo', hireDate: '2023-08-20' },
    { id: 10, name: 'João Ferreira', age: 37, city: 'Brasília', department: 'TI', salary: 11000, status: 'Ativo', hireDate: '2021-01-05' },
    { id: 11, name: 'Karen Souza', age: 24, city: 'Curitiba', department: 'TI', salary: 6000, status: 'Ativo', hireDate: '2024-06-15' },
    { id: 12, name: 'Lucas Barbosa', age: 41, city: 'São Paulo', department: 'Financeiro', salary: 13500, status: 'Inativo', hireDate: '2019-02-28' },
    { id: 13, name: 'Marina Castro', age: 30, city: 'Rio de Janeiro', department: 'Marketing', salary: 8200, status: 'Ativo', hireDate: '2022-12-01' },
    { id: 14, name: 'Nelson Dias', age: 48, city: 'Belo Horizonte', department: 'RH', salary: 9500, status: 'Ativo', hireDate: '2017-05-10' },
    { id: 15, name: 'Olivia Ribeiro', age: 27, city: 'Porto Alegre', department: 'TI', salary: 7500, status: 'Ativo', hireDate: '2023-10-01' },
    { id: 16, name: 'Paulo Cardoso', age: 36, city: 'São Paulo', department: 'TI', salary: 10500, status: 'Inativo', hireDate: '2020-08-15' },
    { id: 17, name: 'Raquel Martins', age: 32, city: 'Brasília', department: 'Financeiro', salary: 9000, status: 'Ativo', hireDate: '2021-11-20' },
    { id: 18, name: 'Samuel Teixeira', age: 44, city: 'Rio de Janeiro', department: 'Marketing', salary: 11500, status: 'Ativo', hireDate: '2018-03-01' },
    { id: 19, name: 'Tatiana Moreira', age: 25, city: 'Curitiba', department: 'RH', salary: 5800, status: 'Ativo', hireDate: '2024-01-15' },
    { id: 20, name: 'Victor Nascimento', age: 38, city: 'São Paulo', department: 'TI', salary: 12500, status: 'Ativo', hireDate: '2020-04-01' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/employees') && req.method === 'GET') {
      const filter = req.params.get('$filter') || req.params.get('search');
      let items = [...this.employees];

      if (filter) {
        items = this.applyODataFilter(items, filter);
      }

      return of(
        new HttpResponse({
          status: 200,
          body: {
            items,
            hasNext: false
          }
        })
      ).pipe(delay(200));
    }

    return next.handle(req);
  }

  private applyODataFilter(items: Employee[], filter: string): Employee[] {
    const conditions = filter.split(/\s+and\s+/i);

    return items.filter(item => {
      return conditions.every(condition => this.evaluateCondition(item, condition.trim()));
    });
  }

  private evaluateCondition(item: any, condition: string): boolean {
    // contains(property, 'value')
    const containsMatch = condition.match(/contains\((\w+),\s*'([^']+)'\)/i);
    if (containsMatch) {
      const value = String(item[containsMatch[1]] || '').toLowerCase();
      return value.includes(containsMatch[2].toLowerCase());
    }

    // startswith(property, 'value')
    const startsWithMatch = condition.match(/startswith\((\w+),\s*'([^']+)'\)/i);
    if (startsWithMatch) {
      const value = String(item[startsWithMatch[1]] || '').toLowerCase();
      return value.startsWith(startsWithMatch[2].toLowerCase());
    }

    // property op 'string_value'
    const stringMatch = condition.match(/(\w+)\s+(eq|ne)\s+'([^']+)'/);
    if (stringMatch) {
      const value = String(item[stringMatch[1]] || '');
      const compareValue = stringMatch[3];
      if (stringMatch[2] === 'eq') {
        return value.toLowerCase() === compareValue.toLowerCase();
      }
      return value.toLowerCase() !== compareValue.toLowerCase();
    }

    // property op number_value
    const numberMatch = condition.match(/(\w+)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      const value = Number(item[numberMatch[1]]);
      const compareValue = Number(numberMatch[3]);
      switch (numberMatch[2]) {
        case 'eq': return value === compareValue;
        case 'ne': return value !== compareValue;
        case 'gt': return value > compareValue;
        case 'ge': return value >= compareValue;
        case 'lt': return value < compareValue;
        case 'le': return value <= compareValue;
      }
    }

    // property op date_value (YYYY-MM-DD)
    const dateMatch = condition.match(/(\w+)\s+(eq|ne|gt|ge|lt|le)\s+(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const value = new Date(item[dateMatch[1]]).getTime();
      const compareValue = new Date(dateMatch[3]).getTime();
      switch (dateMatch[2]) {
        case 'eq': return value === compareValue;
        case 'ne': return value !== compareValue;
        case 'gt': return value > compareValue;
        case 'ge': return value >= compareValue;
        case 'lt': return value < compareValue;
        case 'le': return value <= compareValue;
      }
    }

    return true;
  }
}
