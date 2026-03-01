import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoWidgetComponent
 *
 * @description
 *
 * Interface para definição do avatar no `po-widget`.
 */
export interface PoWidgetAvatar {
  /**
   * Fonte da imagem que pode ser um caminho local (`./assets/images/logo-black-small.png`)
   * ou um servidor externo (`https://po-ui.io/assets/images/logo-black-small.png`).
   */
  src?: string;

  /**
   * @optional
   *
   * @description
   *
   * Tamanho de exibição do componente `po-avatar`.
   *
   * Valores válidos:
   *  - `xs` (24x24)
   *  - `sm` (32x32)
   *  - `md` (64x64)
   *  - `lg` (96x96)
   *  - `xl` (144x144)
   *
   * @default `md`
   */
  size?: string;

  /**
   * Permite a criação de template customizado para o avatar
   *
   * ```
   * <po-widget
   *  [p-avatar]="{ customTemplate: customAvatar }"
   * />
   *
   * <ng-template #customAvatar>
   *   ...
   * </ng-template>
   * ```
   */
  customTemplate?: TemplateRef<any>;

  /**
   * @optional
   *
   * @description
   *
   * Define a largura em porcentagem do `customTemplate`.
   *
   * O valor máximo aceito é `50%`.
   */
  widthCustomTemplate?: string;
}
