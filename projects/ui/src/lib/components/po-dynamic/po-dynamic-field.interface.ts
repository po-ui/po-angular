import { PoDynamicFieldType } from './po-dynamic-field-type.enum';

export interface PoDynamicField {
  /** Identificador */
  key?: boolean;

  /** Nome de referência do campo. */
  property: string;

  /**
   * Rótulo do campo exibido.
   *
   * Caso não seja informado, será utilizado como `label` o valor da propriedade `property` com a primeira letra em maiúsculo.
   */
  label?: string;

  /**
   * Tamanho de exibição do campo em telas.
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 12 colunas).
   *
   * > Esta propriedade é generica, aplica o valor em todos os tamanhos de telas.
   */
  gridColumns?: number;

  /**
   * Tamanho de exibição do campo em telas menores (sm).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 12 colunas).
   *
   * > Esta propriedade sobrescreve o valor definido para o tamanho dela na `gridColumns`.
   *
   * @default `12`
   */
  gridSmColumns?: number;

  /**
   * Tamanho de exibição do campo em telas médias (md).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 12 colunas).
   *
   * > Esta propriedade sobrescreve o valor definido para o tamanho dela na `gridColumns`.
   *
   * @default `6`
   */
  gridMdColumns?: number;

  /**
   * Tamanho de exibição do campo em telas grandes (lg).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 12 colunas).
   *
   * > Esta propriedade sobrescreve o valor definido para o tamanho dela na `gridColumns`.
   *
   * @default `4`
   */
  gridLgColumns?: number;

  /**
   * Tamanho de exibição do campo em telas extra grandes (xl).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 12 colunas).
   *
   * > Esta propriedade sobrescreve o valor definido para o tamanho dela na `gridColumns`.
   *
   * @default `3`
   */
  gridXlColumns?: number;

  /**
   * Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas menores (sm).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 11 colunas).
   *
   * > Esta propriedade não funciona com a propriedade `gridColumns`. Deve-se especificar o tamanho da tela.
   *
   * @default `0`
   */
  gridSmPull?: number;

  /**
   * Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas médias (md).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 11 colunas).
   *
   * > Esta propriedade não funciona com a propriedade `gridColumns`. Deve-se especificar o tamanho da tela.
   *
   * @default `0`
   */
  gridMdPull?: number;

  /**
   * Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas grandes (lg).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 11 colunas).
   *
   * > Esta propriedade não funciona com a propriedade `gridColumns`. Deve-se especificar o tamanho da tela.
   *
   * @default `0`
   */
  gridLgPull?: number;

  /**
   * Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas extra grandes (xl).
   *
   * Deve ser usado o sistema de **grid** do PO (1 ... 11 colunas).
   *
   * > Esta propriedade não funciona com a propriedade `gridColumns`. Deve-se especificar o tamanho da tela.
   *
   * @default `0`
   */
  gridXlPull?: number;

  /**
   * Indica se o campo será visível.
   *
   * @default `true`
   */
  visible?: boolean;

  /** Exibirá um divisor acima, utilizando o seu conteudo como título. */
  divider?: string;

  /**
   * Tipo do valor campo.
   *
   * Valores válidos:
   *
   * - `boolean`: Valores *booleanos*.
   * - `currency`: Valores monetários.
   * - `date`: Valores de datas.
   *  + Aceita os tipos **string** e **Date** padrão do Javascript,
   *  por exemplo: `'2017-11-28'` ou `new Date(2017, 10, 28)`.
   * - `dateTime`: Valor de data com horário.
   *  + Aceita o tipo _string_ no formato **ISO-8601** extendido **'yyyy-mm-ddThh:mm:ss+|-hh:mm'**
   * e o tipo **Date** padrão do Javascript, por exemplo: `'2017-11-28T00:00:00-02:00'` ou `new Date(2017, 10, 28)`.
   * - `number`: Valores numéricos.
   * - `string`: Textos.
   * - `time`: Valor do horário.
   *  + Aceita o tipo **string** nos formatos **'HH:mm:ss'** ou **'HH:mm:ss.ffffff'**, por exemplo: `'23:12:45'`.
   *
   * @default `string`
   */
  type?: string | PoDynamicFieldType;
}
