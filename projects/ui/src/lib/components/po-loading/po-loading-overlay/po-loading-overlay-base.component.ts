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
    loading: 'погрузка'
  }
};

/**
 *
 * @description
 *
 * Este componente mostra ao usuário uma imagem de _loading_ e bloqueia a página inteira ou o container escolhido,
 * enquanto aguarda a resposta de alguma requisição.
 */
@Directive()
export class PoLoadingOverlayBaseComponent {
  private _screenLock?: boolean = false;
  private _text?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se o *overlay* será aplicado a um *container* ou a página inteira.
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
   * > O valor padrão será traduzido acordo com o idioma configurado no [**PoI18n**](/documentation/po-i18n) ou navegador.
   *
   * @default `Carregando`
   */
  @Input('p-text') set text(value: string) {
    this._text = value || this.getTextDefault();
  }

  get text(): string {
    return this._text;
  }

  constructor(private languageService: PoLanguageService) {
    this.text = this.getTextDefault();
  }

  private getTextDefault(): string {
    const language = this.languageService.getShortLanguage();

    return poLoadingOverlayLiteralsDefault[language].loading;
  }
}
