/**
 * @usedBy PoAiSearchComponent
 *
 * @description
 *
 * Interface que define os metadados de uma coluna/campo enviados ao endpoint de IA
 * para contextualizar a interpretação da busca em linguagem natural.
 *
 * Esses metadados ajudam o provedor de IA a mapear os termos digitados pelo usuário
 * para as propriedades reais dos dados e a gerar um filtro (por exemplo, OData) coerente.
 */
export interface PoAiSearchColumn {
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
