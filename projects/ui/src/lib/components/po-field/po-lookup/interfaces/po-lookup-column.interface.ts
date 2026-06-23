/**
 * @usedBy PoLookupComponent
 *
 * @description
 *
 * Interface para configuração das colunas do po-lookup.
 */
export interface PoLookupColumn {
  /**
   * Indica que a coluna será utilizada como valor do campo e como filtro dentro da modal.
   *
   * Se houver mais de uma configuração habilitada, é exibido os valores no campo concatenados separados
   * por um traço("-"). Por exemplo: "Joinville - SC".
   *
   * Importante
   * Esta configuração se torna obsoleta caso os atributos `p-field-format` ou `p-field-label` forem configurados no componente.
   */
  fieldLabel?: boolean;

  /**
   * Formato de exibição do valor da coluna:
   * - Formato para moeda (currency). Exemplos: 'BRL', 'USD'.
   * - Formato para data (date): aceita apenas os caracteres de dia(dd), mês(MM) e ano (yyyy ou yy),
   * valor padrão é 'dd/MM/yyyy'. Exemplos: 'dd/MM/yyyy', 'dd-MM-yy', 'mm/dd/yyyy'.
   */
  format?: string;

  /**
   * Texto para título da coluna.
   *
   * Caso não seja informado, será utilizado como *label* o valor da propriedade *property* com a primeira letra em maiúsculo.
   */
  label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define uma máscara para formatação do valor exibido na coluna.
   *
   * A máscara é aplicada somente para **exibição** na tabela da modal do lookup, formatando o valor bruto
   * armazenado no model antes de apresentá-lo ao usuário.
   *
   * Caracteres válidos para a máscara:
   * - `9` : aceita um dígito numérico (0-9).
   * - `@` : aceita um caractere alfabético (a-z, A-Z).
   * - `w` : aceita um caractere alfanumérico (a-z, A-Z, 0-9).
   * - Demais caracteres são considerados fixos e inseridos automaticamente na formatação
   * (por exemplo: `.`, `-`, `/`, `(`, `)`, `+`, ` `).
   *
   * Exemplos de uso:
   * ```
   * // CPF
   * { property: 'cpf', label: 'CPF', mask: '999.999.999-99' }
   *
   * // CNPJ
   * { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99' }
   *
   * // Telefone
   * { property: 'phone', label: 'Telefone', mask: '(99) 99999-9999' }
   *
   * // CEP
   * { property: 'zipCode', label: 'CEP', mask: '99999-999' }
   * ```
   *
   * > Esta propriedade é utilizada apenas para colunas do tipo `string` (padrão).
   * Caso a coluna possua um `type` diferente de `string`, a máscara será ignorada.
   */
  mask?: string;

  /** Nome identificador da coluna. */
  property?: string;

  /**
   * Tipo da coluna:
   * - string (padrão): textos
   * - number: valores numéricos
   * - date: data
   * - currency: valores monetários
   * - dateTime: data e hora
   */
  type?: string;

  /** A largura da coluna pode ser informada em pixels ou porcentagem. Exemplo: '100px' ou '20%' */
  width?: string;
}
