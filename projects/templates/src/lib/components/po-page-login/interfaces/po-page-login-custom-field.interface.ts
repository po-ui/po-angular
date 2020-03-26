import { PoSelectOption } from '@po-ui/ng-components';

/**
 * @usedBy PoPageLoginComponent
 *
 * @description
 *
 * Interface com a definição do Custom Field, podendo ser utilizado para informar um campo customizado no componente `po-page-login`.
 */
export interface PoPageLoginCustomField {
  /** Nome da propriedade que será utilizado no campo customizado. */
  property: string;

  /**
   * @optional
   *
   * @description
   *
   * Valor do campo customizado.
   */
  value?: string | number;

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que será exibida enquanto o campo customizado não estiver preenchido.
   */
  placeholder?: string;

  /**
   * @optional
   *
   * @description
   *
   * Expressão regular para validar o campo customizado, caso a expressão não seja atendida a literal informada na
   * propriedade `errorPattern` será exibida.
   */
  pattern?: string;

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que será exibida quando a expressão regular informada na propriedade `pattern` não for válida.
   */
  errorPattern?: string;

  /**
   * @optional
   *
   * @description
   *
   * Lista de opções de um `po-select`.
   */
  options?: Array<PoSelectOption>;

  /**
   * @optional
   *
   * @description
   *
   * Nesta propriedade deve ser informada a URL do serviço em que será realizado o filtro para carregamento da
   * lista de itens do componente `po-combo`.
   */
  url?: string;

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na
   * lista do componente `po-combo`, esta propriedade será responsável pelo valor de cada item da lista.
   *
   */
  fieldValue?: string;
}
