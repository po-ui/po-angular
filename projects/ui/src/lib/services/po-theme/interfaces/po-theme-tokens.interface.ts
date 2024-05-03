import { PoThemeColor } from './po-theme-color.interface';

/**
 * @usedBy PoThemeService
 * @docsExtends PoThemeToken, Partial<DynamicProperties>
 * @description
 * Interface para o tema da aplicação.
 */
export interface PoThemeTokens extends PoThemeToken, Partial<DynamicProperties> {}

/**
 * @usedBy PoThemeService
 * @description
 * Interface para os tokens do Tema.
 */
export interface PoThemeToken {
  /** Tokens do tipo 'color' */
  'color'?: PoThemeColor;

  /**
   * Tokens do tipo 'perComponent'
   *
   * Exemplo de uso:
   *
   * ```typescript
   * perComponent: {
   *   'po-badge': {
   *     '--color': 'var(--color-neutral-dark-95)',
   *   },
   *   'po-container': {
   *     '--background': '#121212',
   *   },
   * },
   * ```
   * @Optional
   */
  'perComponent'?: DynamicProperties;

  /**
   * Tokens do tipo 'onRoot'
   * Esta propriedade adicionará todos os tokens passados e adicionado direto no `:root`
   *
   * Exemplo de uso:
   *
   * ```typescript
   * onRoot: {
   *   '--color-page-background-color-page': '#121212',
   *   '--color-toolbar-color-badge-text': 'var(--color-neutral-dark-95)',
   * },
   * ```
   * @Optional
   */
  'onRoot'?: DynamicProperties;
}

/**
 * @docsPrivate
 * @description
 * Interface para as variantes da cor de Brand.
 * Tipo com index signature para aceitar propriedades dinâmicas
 */
interface DynamicProperties {
  [key: string]: any;
}
