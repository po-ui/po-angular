/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Interface que define os metadados de uma coluna/campo enviados ao endpoint de IA
 * para contextualizar a interpretação da busca em linguagem natural.
 *
 * Esses metadados ajudam o provedor de IA a mapear os termos digitados pelo usuário
 * para as propriedades reais dos dados e a gerar um filtro (por exemplo, OData) coerente.
 */
export interface PoSearchAiColumn {
  /** Nome da propriedade do campo (ex: `name`, `age`, `city`). */
  property: string;

  /** Rótulo legível exibido ao usuário (ex: `Nome`, `Idade`, `Cidade`). */
  label: string;

  /**
   * Tipo do campo, utilizado pela IA para gerar comparações adequadas.
   *
   * Valores comuns: `string`, `number`, `date`, `currency`, `boolean`.
   *
   * @default `string`
   */
  type?: string;
}

/**
 * @docsPrivate
 *
 * Formato de entrada aceito por `extractColumnsMetadata`: superconjunto de `PoSearchAiColumn`
 * que inclui campos de controle de visibilidade usados por consumidores como o `po-table`.
 */
export interface PoSearchAiColumnInput {
  property?: string;
  label?: string;
  type?: string;
  /** Quando `true`, a coluna é excluída dos metadados enviados à IA. Padrão: `false`. */
  searchAiIgnore?: boolean;
  visible?: boolean;
}
