import { Input, Directive } from '@angular/core';

import { convertToBoolean } from './../../../utils/util';

import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoLoadingOverlayLiterals } from './interfaces/po-loading-overlay-literals.interface';

export const poLoadingOverlayLiteralsDefault = {
  en: <PoLoadingOverlayLiterals>{
    loading: 'Loading'
  },
  es: <PoLoadingOverlayLiterals>{
    loading: 'Cargando'
  },
  pt: <PoLoadingOverlayLiterals>{
    loading: 'Carregando'
  },
  ru: <PoLoadingOverlayLiterals>{
    loading: 'Загрузка'
  }
};

/**
 *
 * @description
 *
 * Este componente mostra ao usuário uma imagem de _loading_ e bloqueia a página inteira ou o container escolhido,
 * enquanto aguarda a resposta de alguma requisição.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS): <br>
 * Obs: Só é possível realizar alterações ao adicionar a classe `.po-loading`
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                      |
 * |----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                   |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-normal)`                       |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-70)`                    |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
 * | `--border-width`                       | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-sm)`                          |
 * | `--border-color`                       | Cor da borda                                          | `var(--color-neutral-light-20)`                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-00)`                   |
 * | `--shadow`                             | Contém o valor da sombra do elemento                  | `var(--shadow-md)`                                |
 * | **po-loading-icon**                    |                                                       |                                                   |
 * | `--color`                              | Cor principal do spinner                              | `var(--color-action-default)`                     |
 *
 */
@Directive()
export class PoLoadingOverlayBaseComponent {
  private _screenLock?: boolean = false;
  private _text?: string;
  private _size?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se o *overlay* será aplicado a um *container* ou à página inteira.
   *
   * Para utilizar o componente como um *container*, o elemento pai deverá receber uma posição relativa, por exemplo:
   *
   * ```
   * <div style="position: relative">
   *
   *  <po-chart [p-series]="[{ value: 10, category: 'Example' }]">
   *  </po-chart>
   *
   *  <po-loading-overlay>
   *  </po-loading-overlay>
   * </div>
   * ```
   *
   * @default `false`
   */
  @Input('p-screen-lock') set screenLock(screenLock: boolean) {
    this._screenLock = convertToBoolean(screenLock);
  }

  get screenLock() {
    return this._screenLock;
  }

  /**
   * @optional
   *
   * @description
   *
   * Texto a ser exibido no componente.
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [**PoI18n**](/documentation/po-i18n) ou navegador.
   *
   * @default `Carregando`
   */
  @Input('p-text') set text(value: string) {
    this._text = value || this.getTextDefault();
  }

  get text(): string {
    return this._text;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente com base no tamanho do ícone de *loading*.
   *
   * Tamanhos disponíveis para o *loading*:
   * - `xs`: 16px
   * - `sm`: 24px
   * - `md`: 48px
   * - `lg`: 80px (valor padrão)
   *
   * @default `lg`
   */
  @Input('p-size') set size(value: string | null) {
    this._size = value === '' || !value ? 'lg' : value;
  }

  get size(): string {
    return this._size;
  }

  constructor(private languageService: PoLanguageService) {
    this.text = this.getTextDefault();
  }

  private getTextDefault(): string {
    const language = this.languageService.getShortLanguage();

    return poLoadingOverlayLiteralsDefault[language].loading;
  }
}
