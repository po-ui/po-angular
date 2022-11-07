import { Input, Directive } from '@angular/core';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoLoadingLiterals } from './interfaces/po-loading-literals.interface';
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
 */
@Directive()
export class PoLoadingBaseComponent {
  private _text?: string;

  /**
   * Texto a ser exibido no componente.
   */
  @Input('p-text') set text(value: string) {
    this._text = value || (value === '' ? '' : this.getTextDefault());
  }

  get text(): string {
    return this._text;
  }
  constructor(private languageService: PoLanguageService) {
    this.text = this.getTextDefault();
  }

  private getTextDefault(): string {
    const language = this.languageService.getShortLanguage();

    return poLoadingLiteralsDefault[language].loading;
  }
}
