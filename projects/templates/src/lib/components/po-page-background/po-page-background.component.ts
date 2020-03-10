import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { browserLanguage, convertToBoolean, isTypeof } from './../../utils/util';
import { PoSelectOption } from '@portinari/portinari-ui';

@Component({
  selector: 'po-page-background',
  templateUrl: './po-page-background.component.html'
})

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para definição de cor de fundo e dos logotipos primário e secundário para os templates
 * de `po-page-login` e demais templates de login.
 */
export class PoPageBackgroundComponent implements OnInit {
  private _logo?: string;
  private _secondaryLogo?: string;
  private _showSelectLanguage?: boolean = false;

  selectedLanguageOption: string;

  selectLanguageOptions: Array<PoSelectOption> = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Português', value: 'pt' },
    { label: 'Pусский', value: 'ru' }
  ];

  /** Insere uma imagem de destaque ao lado direito do container. */
  @Input('p-background') background?: string;

  /** Designa se o logotipo deve desaparecer em resoluções menores. */
  @Input('p-hide-logo') hideLogo?: boolean;

  /** Texto de destaque sobreposto à imagem de destaque. Essa opção é utilizada em conjunto com o atributo `p-background`. */
  @Input('p-highlight-info') highlightInfo?: string;

  /** Caminho para a logomarca localizada na parte superior. */
  @Input('p-logo') set logo(value: any) {
    this._logo = isTypeof(value, 'string') && value.trim() ? value : undefined;
  }

  get logo() {
    return this._logo;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca localizada no rodapé.
   */
  @Input('p-secondary-logo') set secondaryLogo(value: any) {
    this._secondaryLogo = isTypeof(value, 'string') && value.trim() ? value : undefined;
  }

  get secondaryLogo() {
    return this._secondaryLogo;
  }

  /** Define se o seletor de idiomas deve ser exibido. */
  @Input('p-show-select-language') set showSelectLanguage(showSelectLanguage: boolean) {
    this._showSelectLanguage = convertToBoolean(showSelectLanguage);
  }
  get showSelectLanguage() {
    return this._showSelectLanguage;
  }

  /**
   * Evento disparado ao selecionar alguma opção no seletor de idiomas.
   * Para este evento será passado como parâmetro o valor de idioma selecionado.
   */
  @Output('p-selected-language') selectedLanguage?: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.selectedLanguageOption = browserLanguage();
  }

  onChangeLanguage() {
    this.selectedLanguage.emit(this.selectedLanguageOption);
  }
}
