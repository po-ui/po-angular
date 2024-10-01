/**
 * @usedBy PoMediaQueryService
 *
 * @description
 * Interface que define os tokens CSS utilizados em regras de media queries.
 * Cada chave representa uma variável CSS que pode ser dinamicamente modificada.
 *
 * > Os tipos de valores aceitos para cada token são: `pixels` , `em` e `rem`.
 *
 */

export interface PoMediaQueryTokens {
  /**
   * @description
   *
   * Define a regra para sm.
   *
   * `gridSystemSmMaxWidth` define a largura máxima para o grid no tamanho pequeno (`sm`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  sm: {
   *    gridSystemSmMaxWidth: '480px'
   *  }
   * };
   * ```
   */
  sm?: {
    'gridSystemSmMaxWidth': string;
  };

  /**
   * @description
   *
   * Define a regra para md.
   *
   * `gridSystemMdMinWidth` define a largura mínima para o grid no tamanho pequeno (`md`).
   *
   * `gridSystemMdMaxWidth` define a largura máxima para o grid no tamanho pequeno (`md`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  md: {
   *    gridSystemMdMinWidth: '481px',
   *    gridSystemMdMaxWidth: '960px'
   *  }
   * };
   * ```
   */
  md?: {
    'gridSystemMdMinWidth': string;
    'gridSystemMdMaxWidth': string;
  };

  /**
   * @description
   *
   * Define a regra para lg.
   *
   * `gridSystemLgMinWidth` define a largura mínima para o grid no tamanho pequeno (`lg`).
   *
   * `gridSystemLgMaxWidth` define a largura máxima para o grid no tamanho pequeno (`lg`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  lg: {
   *    gridSystemLgMinWidth: '961px',
   *    gridSystemLgMaxnWidth: '1366px'
   *  }
   * };
   * ```
   */
  lg?: {
    'gridSystemLgMinWidth': string;
    'gridSystemLgMaxWidth': string;
  };

  /**
   * @description
   *
   * Define a regra offset.
   *
   * `gridSystemOffsetMinWidth` define a largura mínima para o grid no tamanho pequeno (`offset`).
   *
   * `gridSystemOffsetMaxWidth` define a largura máxima para o grid no tamanho pequeno (`offset`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  offset: {
   *    gridSystemOffsetMinWidth: '361px',
   *    gridSystemOffsetMaxWidth: '480px'
   *  }
   * };
   * ```
   */
  offset?: {
    'gridSystemOffsetMinWidth': string;
    'gridSystemOffsetMaxWidth': string;
  };

  /**
   * @description
   *
   * Define a regra pull.
   *
   * `gridSystemPullMaxWidth` define a largura máxima para o grid no tamanho pequeno (`pull`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  offset: {
   *    gridSystemPullMaxWidth: '480px'
   *  }
   * };
   * ```
   */
  pull?: {
    'gridSystemPullMaxWidth': string;
  };

  /**
   * @description
   *
   * Define a regra xl.
   *
   * `gridSystemXlMinWidth` define a largura mínima para o grid no tamanho pequeno (`pull`).
   *
   * Exemplo de uso:
   * ```typescript
   * const tokens: PoMediaQueryTokens =  {
   *  offset: {
   *    gridSystemXlMinWidth: '1367px'
   *  }
   * };
   * ```
   */
  xl?: {
    'gridSystemXlMinWidth': string;
  };
}
