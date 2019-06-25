import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PoMultiselectOption } from './../po-multiselect-option.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que constrói cada item no dropdown, contendo o checkbox e o label.
 */
@Component({
  selector: 'po-multiselect-item',
  templateUrl: './po-multiselect-item.component.html'
})
export class PoMultiselectItemComponent {

  /** Opção que irá gerar o item, implementando a interface PoMultiselectOption. */
  @Input('p-option') option: PoMultiselectOption = null;

  /** Esta propriedade indica se o campo está selecionado ou não. */
  @Input('p-selected') selected?: boolean = false;

  /** Evento que será disparado toda vez que o usuário marcar ou desmarcar um item. */
  @Output('p-change') change = new EventEmitter();

  itemClicked() {
    this.selected = !this.selected;
    this.change.emit(this.selected);
  }
}
