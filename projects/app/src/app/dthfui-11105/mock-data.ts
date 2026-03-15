import { PoTableColumn } from 'projects/ui/src/lib';

export function generateMockItems(count: number): Array<any> {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    email: `item${i + 1}@test.com`,
    city: ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte', 'Porto Alegre'][i % 5],
    status: ['Ativo', 'Inativo', 'Pendente'][i % 3],
    value: Math.round(((i * 7 + 13) % 10000)) / 100,
    date: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    category: `Categoria ${(i % 10) + 1}`,
    description: `Descrição do item ${i + 1} com texto variável`,
    code: `COD-${String(i + 1).padStart(5, '0')}`
  }));
}

export const COLUMNS_WITH_WIDTH: Array<PoTableColumn> = [
  { property: 'id', label: 'ID', width: '80px', fixed: true },
  { property: 'name', label: 'Nome', width: '200px' },
  { property: 'email', label: 'Email', width: '250px' },
  { property: 'city', label: 'Cidade', width: '150px' },
  { property: 'status', label: 'Status', width: '120px' },
  { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' },
  { property: 'date', label: 'Data', width: '150px', type: 'date' },
  { property: 'category', label: 'Categoria', width: '150px' },
  { property: 'description', label: 'Descrição', width: '300px' },
  { property: 'code', label: 'Código', width: '150px' }
];

export const COLUMNS_WITHOUT_WIDTH: Array<PoTableColumn> = [
  { property: 'id', label: 'ID' },
  { property: 'name', label: 'Nome' },
  { property: 'email', label: 'Email' },
  { property: 'city', label: 'Cidade' },
  { property: 'status', label: 'Status' },
  { property: 'value', label: 'Valor', type: 'currency', format: 'BRL' }
];

export const COLUMNS_MANY: Array<PoTableColumn> = [
  { property: 'id', label: 'ID', width: '80px' },
  { property: 'name', label: 'Nome', width: '200px' },
  { property: 'email', label: 'Email', width: '250px' },
  { property: 'city', label: 'Cidade', width: '150px' },
  { property: 'status', label: 'Status', width: '120px' },
  { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' },
  { property: 'date', label: 'Data', width: '150px', type: 'date' },
  { property: 'category', label: 'Categoria', width: '150px' },
  { property: 'description', label: 'Descrição', width: '300px' },
  { property: 'code', label: 'Código', width: '150px' }
];

export const COLUMNS_FROZEN: Array<PoTableColumn> = [
  { property: 'id', label: 'ID', width: '80px', fixed: true },
  { property: 'name', label: 'Nome', width: '200px', fixed: true },
  { property: 'email', label: 'Email', width: '250px' },
  { property: 'city', label: 'Cidade', width: '150px' },
  { property: 'status', label: 'Status', width: '120px' },
  { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' },
  { property: 'date', label: 'Data', width: '150px', type: 'date' },
  { property: 'category', label: 'Categoria', width: '150px' },
  { property: 'description', label: 'Descrição', width: '300px' },
  { property: 'code', label: 'Código', width: '150px' }
];
