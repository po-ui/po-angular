import { DoCheck, EventEmitter, Input, IterableDiffers, Output, Directive } from '@angular/core';

import { browserLanguage, convertToBoolean, isKeyCodeEnter, poLocaleDefault, uuid } from '../../utils/util';

import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';

export const poDisclaimerGroupLiteralsDefault = {
  en: { removeAll: 'Remove all' },
  es: { removeAll: 'Eliminar todos' },
  pt: { removeAll: 'Remover todos' }
};

/**
 * @description
 *
 * O componente `po-disclaimer-group` é recomendado para manipular palavras-chave de filtros aplicados em uma pesquisa.
 *
 * À partir de dois *disclaimers* com o botão **fechar** habilitado, o componente renderiza de forma automática um novo e destacado
 * *disclaimer* que possibilita **remover todos**, mas que também pode ser desabilitado.
 *
 * Também é possível navegar entre os *disclaimers* através do teclado utilizando a tecla *tab* e, para remoção do *disclaimer* selecionado,
 * basta pressionar a tecla *enter*. Esta funcionalidade não se aplica caso a propriedade `hideClose` estiver habilitada.
 *
 * > Veja a integração destas funcionalidade no componente [po-page-list](/documentation/po-page-list).
 */
@Directive()
export class PoDisclaimerGroupBaseComponent implements DoCheck {
  private _disclaimers: Array<PoDisclaimer> = [];
  private _hideRemoveAll: boolean = false;

  private differ;
  private previousDisclaimers: Array<PoDisclaimer> = [];

  readonly literals = {
    ...poDisclaimerGroupLiteralsDefault[poLocaleDefault],
    ...poDisclaimerGroupLiteralsDefault[browserLanguage()]
  };

  /** Lista de *disclaimers*. */

  /**
   * @description
   *
   * Lista de *disclaimers*.
   *
   * Para que a lista de *disclaimers* seja atualizada dinamicamente deve-se passar uma nova referência do array de `PoDisclaimer`.
   *
   * Exemplo adicionando um *disclaimer* no array:
   *
   * ```
   * this.disclaimers = [...this.disclaimers, disclaimer];
   * ```
   *
   * ou
   *
   * ```
   * this.disclaimers = this.disclaimers.concat(disclaimer);
   * ```
   */
  @Input('p-disclaimers') set disclaimers(value: Array<PoDisclaimer>) {
    this.previousDisclaimers = [...this.disclaimers];
    this._disclaimers = this.checkDisclaimers(value);
  }

  get disclaimers() {
    return this._disclaimers;
  }

  /**
   * @optional
   *
   * @description
   *
   * Oculta o botão para remover todos os *disclaimers* do grupo.
   *
   * > Por padrão, o mesmo é exibido à partir de dois ou mais *disclaimers* com a opção `hideClose` habilitada.
   *
   * @default `false`
   */
  @Input('p-hide-remove-all')
  set hideRemoveAll(value: boolean) {
    this._hideRemoveAll = <any>value === '' ? true : convertToBoolean(value);
  }

  get hideRemoveAll() {
    return this._hideRemoveAll;
  }

  /** Título do grupo de *disclaimers*. */
  @Input('p-title') title?: string;

  /** Função que será disparada quando a lista de *disclaimers* for modificada. */
  @Output('p-change') change?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Função que será disparada quando um *disclaimer* for removido da lista de *disclaimers* pelo usuário.
   *
   * Recebe como parâmetro um objeto conforme a interface `PoDisclaimerGroupRemoveAction`.
   */
  @Output('p-remove') remove?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Função que será disparada quando todos os *disclaimers* forem removidos da lista de *disclaimers* pelo usuário,
   * utilizando o botão "remover todos".
   *
   * Recebe como parâmetro uma lista contendo todos os `disclaimers` removidos.
   */
  @Output('p-remove-all') removeAll?: EventEmitter<any> = new EventEmitter<any>();

  constructor(differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngDoCheck() {
    this.checkChanges();
  }

  onCloseAction(disclaimer) {
    this.removeDisclaimer(disclaimer);

    this.emitChangeDisclaimers();
    this.remove.emit({
      removedDisclaimer: { ...disclaimer },
      currentDisclaimers: [...this.disclaimers]
    });
  }

  isRemoveAll() {
    return !this.hideRemoveAll && this.disclaimers.filter(c => !c.hideClose).length > 1;
  }

  onKeyPress(event: any) {
    if (isKeyCodeEnter(event)) {
      this.removeAllItems();
    }
  }

  removeAllItems() {
    const removeItems = [];

    this.disclaimers.forEach(disclaimer => {
      if (!disclaimer.hideClose) {
        removeItems.push(disclaimer);
      }
    });

    removeItems.forEach(disclaimer => this.removeDisclaimer(disclaimer));

    this.emitChangeDisclaimers();
    this.removeAll.emit([...removeItems]);
  }

  private removeDisclaimer(disclaimer: any) {
    const itemIndex = this.disclaimers.findIndex(d => d['$id'] === disclaimer['$id']);
    this.disclaimers.splice(itemIndex, 1);
  }

  private checkChanges() {
    if (this.differ) {
      const changes = this.differ.diff(this.disclaimers);

      if (changes && this.disclaimersAreChanged(this.disclaimers)) {
        this.emitChangeDisclaimers();
      }
    }
  }

  private checkDisclaimers(disclaimers: Array<PoDisclaimer>) {
    if (Array.isArray(disclaimers)) {
      for (let i = 0; i < disclaimers.length; i++) {
        const disclaimer = disclaimers[i];

        if (disclaimer.value || disclaimer.value === 0 || disclaimer.value === false) {
          disclaimer['$id'] = uuid();
        } else {
          disclaimers.splice(i, 1);
          i--;
        }
      }

      return disclaimers;
    }

    return [];
  }

  private disclaimersAreChanged(disclaimers: Array<PoDisclaimer>): boolean {
    const currentValues: Array<PoDisclaimer> = disclaimers;

    if (currentValues.length !== this.previousDisclaimers.length) {
      return true;
    }

    return currentValues.some(
      (disclaimer, index) =>
        disclaimer.value !== this.previousDisclaimers[index].value ||
        disclaimer.property !== this.previousDisclaimers[index].property
    );
  }

  private emitChangeDisclaimers() {
    setTimeout(() => {
      this.change.emit(this.disclaimers);
    });
    this.previousDisclaimers = [...this._disclaimers];
  }
}
