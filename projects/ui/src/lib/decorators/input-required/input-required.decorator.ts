import { PropertyDecoratorInterface } from '../property-decorator.interface';
import { validatePropertyOnLifeCycle } from '../utils-decorators';

/**
 * @docsPrivate
 *
 * @description
 *
 * Verifica se uma entrada de um componente foi preenchida.
 *
 * Na ausência da propriedade o decorator irá disparar um warn no console
 * do navegador do usuário.
 *
 * > Esta verificação é feita apenas no ngOnInit do componente.
 *
 * Forma de utilização:
 * ```
 * @Input('p-label') @InputRequired() label: string;
 * ```
 *
 * Referência:
 * https://netbasal.com/how-to-add-angular-component-input-validation-b078a30af97f
 * https://medium.com/@abdelelmedny/angular-input-decorators-5d38089070aa
 */

export function InputRequired() {
  return function (target: any, property: string) {
    const decoratorProperties: PropertyDecoratorInterface = { target, property };
    validatePropertyOnLifeCycle(decoratorProperties, 'ngOnInit', validateProperty);
  };
}

function validateProperty(property: string, target: any) {
  if (this[property] == null) {
    console.warn(`${target.constructor.name}: ${property} is required, but was not provided`);
  }
}
