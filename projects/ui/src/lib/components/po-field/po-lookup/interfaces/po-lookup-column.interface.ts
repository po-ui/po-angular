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
   * - Formato para data (date): aceita apenas os caracteres de dia(dd), mês(MM ou mm) e ano (yyyy ou yy),
   * valor padrão é 'dd/MM/yyyy'. Exemplos: 'dd/MM/yyyy', 'dd-MM-yy', 'mm/dd/yyyy'.
   */
  format?: string;

  /**
   * Texto para título da coluna.
   *
   * Caso não seja informado, será utilizado como *label* o valor da propriedade *property* com a primeira letra em maiúsculo.
   */
  label?: string;

  /** Nome identificador da coluna. */
  property?: string;

  /**
   * Tipo da coluna:
   * - string (padrão): textos
   * - number: valores numéricos
   * - date: data
   * - currency: valores monetários
   */
  type?: string;

  /** A largura da coluna pode ser informada em pixels ou porcentagem. Exemplo: '100px' ou '20%' */
  width?: string;
}
