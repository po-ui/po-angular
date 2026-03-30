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
    return items.filter(item => this.evaluateExpression(item, filter));
  }

  /**
   * Avalia uma expressão OData completa com suporte a "or", "and", "not" e agrupamento com parênteses.
   */
  private evaluateExpression(item: any, expression: string): boolean {
    const trimmed = expression.trim();

    // not operador
    if (trimmed.toLowerCase().startsWith('not ')) {
      return !this.evaluateExpression(item, trimmed.substring(4));
    }

    // Divide por "or" (respeitando parênteses)
    const orParts = this.splitByOperator(trimmed, 'or');
    if (orParts.length > 1) {
      return orParts.some(part => this.evaluateExpression(item, part.trim()));
    }

    // Divide por "and" (respeitando parênteses)
    const andParts = this.splitByOperator(trimmed, 'and');
    if (andParts.length > 1) {
      return andParts.every(part => this.evaluateExpression(item, part.trim()));
    }

    // Remove parênteses externas
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      const inner = trimmed.substring(1, trimmed.length - 1);
      if (this.isBalanced(inner)) {
        return this.evaluateExpression(item, inner);
      }
    }

    return this.evaluateCondition(item, trimmed);
  }

  /**
   * Divide a expressão por um operador lógico respeitando parênteses e funções.
   */
  private splitByOperator(expression: string, operator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    const regex = new RegExp(`\\s+${operator}\\s+`, 'gi');
    let i = 0;

    while (i < expression.length) {
      if (expression[i] === '(') {
        depth++;
        current += expression[i];
        i++;
      } else if (expression[i] === ')') {
        depth--;
        current += expression[i];
        i++;
      } else if (depth === 0) {
        const remaining = expression.substring(i);
        const match = remaining.match(regex);
        if (match && remaining.indexOf(match[0]) === 0) {
          parts.push(current);
          current = '';
          i += match[0].length;
        } else {
          current += expression[i];
          i++;
        }
      } else {
        current += expression[i];
        i++;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  private isBalanced(expression: string): boolean {
    let depth = 0;
    for (const char of expression) {
      if (char === '(') { depth++; }
      if (char === ')') { depth--; }
      if (depth < 0) { return false; }
    }
    return depth === 0;
  }

  private evaluateCondition(item: any, condition: string): boolean {
    // contains(tolower(property), 'value') ou contains(property, 'value')
    const containsTolowerMatch = condition.match(/contains\(tolower\((\w+)\),\s*'([^']+)'\)/i);
    if (containsTolowerMatch) {
      const value = String(item[containsTolowerMatch[1]] || '').toLowerCase();
      return value.includes(containsTolowerMatch[2].toLowerCase());
    }

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

    // endswith(property, 'value')
    const endsWithMatch = condition.match(/endswith\((\w+),\s*'([^']+)'\)/i);
    if (endsWithMatch) {
      const value = String(item[endsWithMatch[1]] || '').toLowerCase();
      return value.endsWith(endsWithMatch[2].toLowerCase());
    }

    // tolower(property) op 'value'
    const tolowerMatch = condition.match(/tolower\((\w+)\)\s+(eq|ne)\s+'([^']+)'/i);
    if (tolowerMatch) {
      const value = String(item[tolowerMatch[1]] || '').toLowerCase();
      const compareValue = tolowerMatch[3].toLowerCase();
      return tolowerMatch[2] === 'eq' ? value === compareValue : value !== compareValue;
    }

    // toupper(property) op 'VALUE'
    const toupperMatch = condition.match(/toupper\((\w+)\)\s+(eq|ne)\s+'([^']+)'/i);
    if (toupperMatch) {
      const value = String(item[toupperMatch[1]] || '').toUpperCase();
      const compareValue = toupperMatch[3].toUpperCase();
      return toupperMatch[2] === 'eq' ? value === compareValue : value !== compareValue;
    }

    // length(property) op number
    const lengthMatch = condition.match(/length\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+)/i);
    if (lengthMatch) {
      const value = String(item[lengthMatch[1]] || '').length;
      return this.compareNumbers(value, Number(lengthMatch[3]), lengthMatch[2]);
    }

    // indexof(property, 'value') op number
    const indexofMatch = condition.match(/indexof\((\w+),\s*'([^']+)'\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+)/i);
    if (indexofMatch) {
      const value = String(item[indexofMatch[1]] || '').indexOf(indexofMatch[2]);
      return this.compareNumbers(value, Number(indexofMatch[4]), indexofMatch[3]);
    }

    // year(property) op number
    const yearMatch = condition.match(/year\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+)/i);
    if (yearMatch) {
      const value = new Date(item[yearMatch[1]]).getFullYear();
      return this.compareNumbers(value, Number(yearMatch[3]), yearMatch[2]);
    }

    // month(property) op number
    const monthMatch = condition.match(/month\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+)/i);
    if (monthMatch) {
      const value = new Date(item[monthMatch[1]]).getMonth() + 1;
      return this.compareNumbers(value, Number(monthMatch[3]), monthMatch[2]);
    }

    // day(property) op number
    const dayMatch = condition.match(/day\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+)/i);
    if (dayMatch) {
      const value = new Date(item[dayMatch[1]]).getDate();
      return this.compareNumbers(value, Number(dayMatch[3]), dayMatch[2]);
    }

    // property in ('value1', 'value2', ...)
    const inMatch = condition.match(/(\w+)\s+in\s+\(([^)]+)\)/i);
    if (inMatch) {
      const value = String(item[inMatch[1]] || '').toLowerCase();
      const values = inMatch[2].match(/'([^']+)'/g)?.map(v => v.replace(/'/g, '').toLowerCase()) || [];
      return values.includes(value);
    }

    // property op arithmetic expression: property mod|add|sub|mul|div number op number
    const arithmeticMatch = condition.match(/(\w+)\s+(mod|add|sub|mul|div|divby)\s+(\d+(?:\.\d+)?)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/i);
    if (arithmeticMatch) {
      const propValue = Number(item[arithmeticMatch[1]]);
      const operand = Number(arithmeticMatch[3]);
      const computed = this.applyArithmetic(propValue, operand, arithmeticMatch[2].toLowerCase());
      return this.compareNumbers(computed, Number(arithmeticMatch[5]), arithmeticMatch[4]);
    }

    // ceiling(property) op number
    const ceilingMatch = condition.match(/ceiling\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/i);
    if (ceilingMatch) {
      const value = Math.ceil(Number(item[ceilingMatch[1]]));
      return this.compareNumbers(value, Number(ceilingMatch[3]), ceilingMatch[2]);
    }

    // floor(property) op number
    const floorMatch = condition.match(/floor\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/i);
    if (floorMatch) {
      const value = Math.floor(Number(item[floorMatch[1]]));
      return this.compareNumbers(value, Number(floorMatch[3]), floorMatch[2]);
    }

    // round(property) op number
    const roundMatch = condition.match(/round\((\w+)\)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/i);
    if (roundMatch) {
      const value = Math.round(Number(item[roundMatch[1]]));
      return this.compareNumbers(value, Number(roundMatch[3]), roundMatch[2]);
    }

    // property op 'string_value'
    const stringMatch = condition.match(/(\w+)\s+(eq|ne)\s+'([^']+)'/);
    if (stringMatch) {
      const value = String(item[stringMatch[1]] || '').toLowerCase();
      const compareValue = stringMatch[3].toLowerCase();
      return stringMatch[2] === 'eq' ? value === compareValue : value !== compareValue;
    }

    // property op date_value (YYYY-MM-DD) — deve vir antes de number para não capturar datas como números
    const dateMatch = condition.match(/(\w+)\s+(eq|ne|gt|ge|lt|le)\s+(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const value = new Date(item[dateMatch[1]]).getTime();
      const compareValue = new Date(dateMatch[3]).getTime();
      return this.compareNumbers(value, compareValue, dateMatch[2]);
    }

    // property op number_value
    const numberMatch = condition.match(/(\w+)\s+(eq|ne|gt|ge|lt|le)\s+(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      const value = Number(item[numberMatch[1]]);
      const compareValue = Number(numberMatch[3]);
      return this.compareNumbers(value, compareValue, numberMatch[2]);
    }

    return true;
  }

  private compareNumbers(value: number, compareValue: number, operator: string): boolean {
    switch (operator.toLowerCase()) {
      case 'eq': return value === compareValue;
      case 'ne': return value !== compareValue;
      case 'gt': return value > compareValue;
      case 'ge': return value >= compareValue;
      case 'lt': return value < compareValue;
      case 'le': return value <= compareValue;
      default: return true;
    }
  }

  private applyArithmetic(value: number, operand: number, operator: string): number {
    switch (operator) {
      case 'add': return value + operand;
      case 'sub': return value - operand;
      case 'mul': return value * operand;
      case 'div': return operand !== 0 ? Math.trunc(value / operand) : 0;
      case 'divby': return operand !== 0 ? value / operand : 0;
      case 'mod': return value % operand;
      default: return value;
    }
  }
}
