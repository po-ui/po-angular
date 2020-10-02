import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PoSelectOption, PoLanguageService, PoLanguage, poLanguageDefault } from '@po-ui/ng-components';

import { convertToBoolean, isTypeof } from './../../utils/util';

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
  private _languagesList: Array<PoLanguage>;
  private _selectLanguageOptions: Array<PoSelectOption>;

  selectedLanguageOption: string;

  /** Insere uma imagem de destaque ao lado direito do container. */
  @Input('p-background') background?: string;

  /** Lista de idiomas para o combo box */
  @Input('p-languages') set languagesList(value: Array<PoLanguage>) {
    this._languagesList = value;
  }

  get languagesList(): Array<PoLanguage> {
    if (this._languagesList?.length) {
      return this._languagesList;
    }
    return poLanguageDefault;
  }

  /** Idioma inicial selecionado no combo */
  @Input('p-initial-language') initialSelectLanguage?: string;

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
   * @optional
   *
   * @description
   *
   * Evento disparado ao selecionar alguma opção no seletor de idiomas.
   * Para este evento será passado como parâmetro o valor de idioma selecionado.
   */
  @Output('p-selected-language') selectedLanguage: EventEmitter<string> = new EventEmitter<string>();

  constructor(public poLanguageService: PoLanguageService) {}

  ngOnInit() {
    this.selectedLanguageOption = this.initialSelectLanguage || this.poLanguageService.getShortLanguage();
    this._selectLanguageOptions = this.languagesList.map<PoSelectOption>(language => ({
      label: language.description,
      value: language.language
    }));
  }

  onChangeLanguage() {
    this.selectedLanguage.emit(this.selectedLanguageOption);
  }

  get selectLanguageOptions(): Array<PoSelectOption> {
    return this._selectLanguageOptions;
  }
}
