import { PoSearchAiColumn, PoSearchAiColumnInput } from './interfaces/po-search-ai-column.interface';

/**
 * @docsPrivate
 *
 * Extrai e normaliza os metadados das colunas para envio à IA,
 * descartando colunas sem `property`, invisíveis ou marcadas com `searchAiIgnore`.
 *
 * Função utilitária pura, reutilizada pelo `PoSearchAiService` e pelo `PoTableComponent`.
 *
 * @param columns Lista de colunas no formato bruto do componente consumidor.
 */
export function extractSearchAiColumns(columns: Array<PoSearchAiColumnInput>): Array<PoSearchAiColumn> {
  if (!columns) {
    return [];
  }

  return columns
    .filter(col => col.property && col.visible !== false && !col.searchAiIgnore)
    .map(col => ({
      property: col.property,
      label: col.label || col.property,
      type: col.type || 'string'
    }));
}
