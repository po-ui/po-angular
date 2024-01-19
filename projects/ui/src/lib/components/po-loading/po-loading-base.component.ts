import { Input, Directive } from '@angular/core';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoLoadingLiterals } from './interfaces/po-loading-literals.interface';
import { PoLoadingIconSize } from './po-loading-icon/po-loading-icon-size-enum';
export const poLoadingLiteralsDefault = {
  en: <PoLoadingLiterals>{
    loading: 'Loading'
  },
  es: <PoLoadingLiterals>{
    loading: 'Cargando'
  },
  pt: <PoLoadingLiterals>{
    loading: 'Carregando'
  },
  ru: <PoLoadingLiterals>{
    loading: 'Загрузка'
  }
};

/**
 * @docsPrivate
 *
 * @description
 *
 * Este componente tem o objetivo de mostrar visualmente aos usuários que a aplicação está processando
 * ou aguardando a resposta de alguma requisição.
 *
 * #### Propriedades customizáveis
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | --font-family                          | Família tipográfica usada                             | var(--font-family-theme)                        |
 * | --font-weight                          | Peso da fonte                                         | var(--font-weight-normal)                       |
 * | --text-color                           | Cor do texto                                          | var(--color-neutral-dark-70)                    |
 * | --border-radius                        | Arredondamento da borda &nbsp;                        | var(--border-radius-md)                         |
 * | --border-width                         | Espessura do border                                   | var(--border-width-sm)                          |
 * | --border-color                         | Cor da borda                                          | var(--color-neutral-light-20)                   |
 * | --background                           | Cor de background                                     | var(--color-neutral-light-00)                   |
 * | --shadow                               | Sombra                                                | var(--shadow-md)                                |
 * | ---                                    | ---                                                   | ---                                             |
 * | **po-loading-icon**                    |                                                       |                                                 |
 * | --color                                | Cor do spinner                                        | var(--color-action-default)                     |
 */
@Directive()
export class PoLoadingBaseComponent {
  private _text?: string;
  private _size?: PoLoadingIconSize;

  /**
   * Texto a ser exibido no componente.
   */
  @Input('p-text') set text(value: string) {
    this._text = value || (value === '' ? '' : this.getTextDefault());
  }

  get text(): string {
    return this._text;
  }

  /**
   * Define o tamanho do ícone.
   *
   * @default `lg`
   *
   * Valores válidos:
   *  - `xs`: tamanho `extra small`
   *  - `sm`: tamanho `small`
   *  - `md`: tamanho `medium`
   *  - `lg`: tamanho `large`
   */
  @Input('p-size') set size(value: string) {
    this._size = PoLoadingIconSize[value] ? PoLoadingIconSize[value] : PoLoadingIconSize.lg;
  }

  get size(): string {
    return this._size;
  }

  constructor(private languageService: PoLanguageService) {
    this.text = this.getTextDefault();
  }

  private getTextDefault(): string {
    const language = this.languageService.getShortLanguage();

    return poLoadingLiteralsDefault[language].loading;
  }
}
