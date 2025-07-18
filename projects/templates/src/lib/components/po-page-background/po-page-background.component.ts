import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';

import { PoLanguage, poLanguageDefault, PoLanguageService, PoSelectOption } from '@po-ui/ng-components';

import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from './../../utils/util';

@Component({
  selector: 'po-page-background',
  templateUrl: './po-page-background.component.html',
  standalone: false
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
  poLanguageService = inject(PoLanguageService);

  /** Insere uma imagem de destaque ao lado direito do container. */
  @Input('p-background') background?: string;

  /** Idioma inicial selecionado no combo */
  @Input('p-initial-language') initialSelectLanguage?: string;

  /** Designa se o logotipo deve desaparecer em resoluções menores. */
  @Input('p-hide-logo') hideLogo?: boolean;

  /** Texto de destaque sobreposto à imagem de destaque. Essa opção é utilizada em conjunto com o atributo `p-background`. */
  @Input('p-highlight-info') highlightInfo?: string;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao selecionar alguma opção no seletor de idiomas.
   * Para este evento será passado como parâmetro o valor de idioma selecionado.
   */
  @Output('p-selected-language') selectedLanguage: EventEmitter<string> = new EventEmitter<string>();

  selectedLanguageOption: string;

  private _componentsSize?: string = undefined;
  private _showSelectLanguage?: boolean = false;
  private _languagesList: Array<PoLanguage>;
  private _selectLanguageOptions: Array<PoSelectOption>;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no template:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-components-size') set componentsSize(value: string) {
    this._componentsSize = validateSizeFn(value);
  }

  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSizeFn();
  }

  /** Lista de idiomas para o combo box */
  @Input('p-languages') set languagesList(value: Array<PoLanguage>) {
    this._languagesList = value;
    this.setLanguageOptions();
  }

  get languagesList(): Array<PoLanguage> {
    if (this._languagesList?.length) {
      return this._languagesList;
    }
    return poLanguageDefault;
  }

  /** Caminho para a logomarca localizada na parte superior. */
  @Input('p-logo') logo?: string;

  /** Texto alternativo para a logomarca. */
  @Input('p-logo-alt') logoAlt?: string;

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca localizada no rodapé.
   */
  @Input('p-secondary-logo') secondaryLogo: string;

  /** Define se o seletor de idiomas deve ser exibido. */
  @Input('p-show-select-language') set showSelectLanguage(showSelectLanguage: boolean) {
    this._showSelectLanguage = convertToBoolean(showSelectLanguage);
  }
  get showSelectLanguage() {
    return this._showSelectLanguage;
  }

  ngOnInit() {
    this.selectedLanguageOption = this.initialSelectLanguage || this.poLanguageService.getShortLanguage();
  }

  onChangeLanguage() {
    this.selectedLanguage.emit(this.selectedLanguageOption);
  }

  get selectLanguageOptions(): Array<PoSelectOption> {
    return this._selectLanguageOptions;
  }

  private setLanguageOptions() {
    this._selectLanguageOptions = this.languagesList.map<PoSelectOption>(language => ({
      label: language.description,
      value: language.language
    }));
  }
}
