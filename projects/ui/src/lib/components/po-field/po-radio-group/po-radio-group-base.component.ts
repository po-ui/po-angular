import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
// import { EventEmitter, Input, Output } from '@angular/core';

// import { convertToBoolean, convertToInt, removeDuplicatedOptions } from '../../../utils/util';
import { requiredFailed } from '../validators';

// import { PoRadioGroupOption } from './po-radio-group-option.interface';
import { PoFieldGroup } from '../po-field-group';

// const poRadioGroupColumnsDefaultLength: number = 6;
// const poRadioGroupColumnsTotalLength: number = 12;

/**
 * @description
 *
 * O componente `po-radio-group` deve ser utilizado para disponibilizar múltiplas opções ao usuário, permitindo a ele que
 * selecione apenas uma delas. Seu uso é recomendado para um número pequeno de opções, caso contrário, recomenda-se o uso
 * do [**po-combo**](/documentation/po-combo) ou [**po-select**](/documentation/po-select).
 *
 * Este não é um componente de multiseleção, se for este o caso, deve-se utilizar o
 * [**po-checkbox-group**](/documentation/po-checkbox-group).
 *
 * > Ao passar um valor para o *model* que não esteja na lista de opções, o mesmo será definido como `undefined`.
 */
export abstract class PoRadioGroupBaseComponent extends PoFieldGroup<string | number> implements ControlValueAccessor, Validator {

  value: any;

  // Função que controla quando deve ser emitido onChange e atualiza o Model
  changeValue(changedValue: any) {
    this.updateModel(changedValue);

    if (this.value !== changedValue) {
      this.emitChange(changedValue);
    }

    this.value = changedValue;
  }

}
