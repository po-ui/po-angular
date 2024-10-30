import { Observable } from 'rxjs';

/**
 * @usedBy PoInputComponent, PoDecimalComponent, PoNumberComponent, PoEmailComponent, PoLoginComponent, PoPasswordComponent, PoUrlComponent, PoDynamicFormComponent
 *
 * @description
 *
 * Interface para realizar uma validação assíncrona no componente.
 */
export interface ErrorAsyncProperties {
  /**
   * @description
   *
   * Função obrigatória executada para realizar a validação assíncrona personalizada.
   * Executada ao disparar o output `change` ou `change-model`, dependendo do valor da propriedade `triggerMode`.
   *
   * @param value Valor atual preenchido no campo.
   *
   * @returns Retorna `Observable com o valor true` para sinalizar o erro `false` para indicar que não há erro.
   */
  errorAsync: (value) => Observable<boolean>;

  /**
   * @optional
   *
   * @description
   *
   * Controla se o método será executado no disparo do output `change` ou `change-model`.
   *
   * @default `change`
   */
  triggerMode?: 'change' | 'changeModel';
}
