/**
 * Retorna um *array* contendo os pares `[chave, valor]` do objeto.
 *
 * Semelhante ao método `Object.entries()` nativo do javascript.
 *
 * > Veja mais em: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 *
 * @param object Objeto que será extraído os pares [chave, valor].
 */
export const getObjectEntries = (object: object) => {
  const objectName = Object.keys(object)[0];
  const objectValue = object[objectName];

  return [objectName, objectValue];
};

/**
 * Recebe um objeto e valida se o seu valor é diferente de *undefined* ou *null*.
 *
 * @param {object} parameter Objeto contento o nome do parâmetro que está sendo validado
 * e o seu valor.
 */
export const validateParameter = (parameter: object) => {
  const [paramName, paramValue] = getObjectEntries(parameter);

  if (paramValue === undefined || paramValue === null) {
    throw new Error(`The ${paramName} parameter cannot be undefined or null`);
  }
};

/**
 * Recebe um objeto e valida se o seu valor é uma instância de *Array* e se não
 * está vazio.
 *
 * @param value Objeto contento o nome da propriedade que está sendo validada e o seu valor.
 */
export const validateArray = (value: object) => {
  validateParameter(value);

  const [paramName, paramValue] = getObjectEntries(value);

  if (!(paramValue instanceof Array)) {
    throw new Error(`${paramName} is not an Array instance`);
  }

  if (!paramValue.length) {
    throw new Error(`${paramName} cannot be empty array`);
  }
};

/**
 * Recebe um arquivo e converte para uma string base64
 *
 * @param Objeto do tipo file.
 */
export const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    /* istanbul ignore next */
    reader.onerror = error => reject(error);
  });

/**
 * Recebe uma string base64 e converte para um arquivo
 *
 * @param string base64.
 */
export const toFile = (url: string, fileName: string, mimeType: string) =>
  fetch(url)
    .then(result => result.arrayBuffer())
    .then(buffer => new File([buffer], fileName, { type: mimeType }));
