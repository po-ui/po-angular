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
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (css),
 * obs: Só é possível realizar alterações ao adicionar a classe `.po-loading`
 *
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
 * > Para customização dos tokens do componenete, verifique o guia [Customização de cores do tema padrão](https://po-ui.io/guides/colors-customization).
 *
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
