import { PropertyDecoratorInterface } from './property-decorator.interface';

/**
 * Função utilizada pela fábrica de decoradores para validar uma propriedade de uma classe durante
 * o ciclo de vida do Angular.
 *
 * @param decoratorProperties propriedades da interface PoPropertyDecoratorInterface.
 * @param lifecycleName clico de vida que se deseja executar com a validação.
 * @param callback função que será executada para validadar a propriedade.
 */
export function validatePropertyOnLifeCycle(
  decoratorProperties: PropertyDecoratorInterface,
  lifecycleName: string,
  callback: Function
) {
  const { target, property } = decoratorProperties;
  const emptyFunction = () => {};
  const lifecycleFunctionClone: Function | null = target[lifecycleName] || emptyFunction;

  Object.defineProperty(target, lifecycleName, {
    value: function () {
      callback.call(this, property, target);
      lifecycleFunctionClone.call(this);
    }
  });
}

/**
 * Função utilizada pela fábrica de decoradores para alterar/manipular o valor de uma propriedade.
 *
 * > Este decorator irá criar os métodos get e set internamente. Portanto,
 * é importante **não** criar nomes privados para as propriedades utilizando
 * `$$__nomeDaPropriedade` ao utilizar este decorator, pois ela será sobrescrita pela propriedade privada
 * criada pelo decorator.
 *
 * @param decoratorProperties propriedades da interface PoPropertyDecoratorInterface.
 * @param decoratorName nome do decorator
 * @param callback função que será executada para alterar o valor da propriedade
 */
export function changeValueByCallback(
  decoratorProperties: PropertyDecoratorInterface,
  decoratorName: string,
  callback: Function
) {
  const { target, property, originalDescriptor } = decoratorProperties;
  const privatePropertyName = createPrivateProperty(target, property, decoratorName);

  return {
    get: getter(originalDescriptor, privatePropertyName),
    set: setter(originalDescriptor, callback, privatePropertyName)
  };
}
function setter(originalDescriptor, callback: Function, privatePropertyName: string) {
  return function (value): void {
    if (originalDescriptor && originalDescriptor.set) {
      originalDescriptor.set.bind(this)(callback(value));
    }

    this[privatePropertyName] = callback(value);
  };
}

function getter(originalDescriptor: TypedPropertyDescriptor<any>, privatePropName: string) {
  return function () {
    return originalDescriptor && originalDescriptor.get ? originalDescriptor.get.bind(this)() : this[privatePropName];
  };
}

export function createPrivateProperty(target: any, propertyName: string, decoratorName: string) {
  const privatePropName = `$$__${propertyName}`;

  if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
    console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${decoratorName} decorator.`);
  }

  Object.defineProperty(target, privatePropName, {
    configurable: true,
    writable: true
  });

  return privatePropName;
}
