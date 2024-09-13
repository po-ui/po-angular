import { Component, Input } from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isTypeof } from '../../utils/util';

const poLogoLiteralsDefault = {
  en: {
    logomarcaHome: 'Home logo'
  },
  es: {
    logomarcaHome: 'Logomarca inicio'
  },
  pt: {
    logomarcaHome: 'Logomarca início'
  },
  ru: {
    logomarcaHome: 'Дом Логомарка'
  }
};

const MAX_LENGHT: number = 125;

@Component({
  selector: 'po-logo',
  templateUrl: './po-logo.component.html'
})
export class PoLogoComponent {
  readonly literals: any;

  private _logo?: string;
  private _logoAlt: string;
  private _link: boolean | string = './';

  /**
   * Define uma classe para o elemento `img` do componente.
   *
   * > **Importante**
   * > A classe deve ser definida apenas quando houver necessidade de ajustar o componente dentro de outro componente.
   *
   */
  @Input('p-class') className: string = 'po-logo';

  /**
   * Define se o componente terá o elemento âncora para uma rota específica.
   *
   * > Caso seja definido como false, o componente apenas renderizará o elemento `img`.
   * > Caso seja definido como true, a rota será `./`.
   * > Caso seja definido como string, a rota será a string passada.
   *
   * @default `true`
   */
  @Input('p-link') set link(value: boolean | string) {
    this._link = value !== false ? value : false;
  }

  get link() {
    return this._link;
  }

  /**
   * Definie o caminho para a imagem, que será exibida como logomarca.
   *
   */
  @Input('p-logo') set logo(value: string) {
    this._logo = isTypeof(value, 'string') && value.trim() ? value : undefined;
  }

  get logo() {
    return this._logo;
  }

  /**
   * Define o texto alternativo para a logomarca.
   *
   * > **Importante**
   * > Caso esta propriedade não seja definida o texto padrão será "Logomarca início".
   */
  @Input('p-logo-alt') set logoAlt(value: string) {
    this._logoAlt = isTypeof(value, 'string') && value.trim() ? this.maxLength(value) : this.literals.logomarcaHome;
  }

  get logoAlt() {
    return this._logoAlt;
  }

  constructor(public poLanguageService: PoLanguageService) {
    this.literals = {
      ...poLogoLiteralsDefault[this.poLanguageService?.getLanguageDefault()],
      ...poLogoLiteralsDefault[this.poLanguageService?.getShortLanguage()]
    };
    this._logoAlt = this.literals.logomarcaHome;
  }

  private maxLength(value: string) {
    return value.length > MAX_LENGHT ? value.toString().substring(0, MAX_LENGHT) : value;
  }
}
