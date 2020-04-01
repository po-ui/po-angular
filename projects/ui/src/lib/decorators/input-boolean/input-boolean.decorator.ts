import { convertToBoolean } from '../../utils/util';
import { changeValueByCallback } from '../utils-decorators';
import { PropertyDecoratorInterface } from '../property-decorator.interface';

/**
 * Converte o valor de um campo de entrada para booleano.
 *
 * Forma de utilização:
 *
 * ```
 * @Input('p-loading') @InputBoolean() loading: boolean;
 * ```
 */

export function InputBoolean(): any {
  return function (target: any, property: string, originalDescriptor?) {
    const decoratorProperties: PropertyDecoratorInterface = { target, property, originalDescriptor };

    return changeValueByCallback(decoratorProperties, 'InputBoolean', convertToBoolean);
  };
}
