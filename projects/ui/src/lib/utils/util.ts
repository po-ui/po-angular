// Idiomas suportados pelas páginas
export const poLocales = ['pt', 'en', 'es'];
// Idioma padrão
export const poLocaleDefault = 'pt';

/**
 * @deprecated
 * Utilize o método `getShortBrowserLanguage`.
 *
 * @description
 * Retorna idioma do browser ou o idioma padrão.
 */
export function browserLanguage() {
  return getShortBrowserLanguage();
}

/**
 * Retorna o idioma atual do navegador
 */
export function getBrowserLanguage(): string {
  // navigator.userLanguage is the value for IE10
  const language = navigator.language || navigator['userLanguage'];
  const shortLanguage = getShortLanguage(language);

  return poLocales.includes(shortLanguage) ? language : poLocaleDefault;
}

/**
 * Retorna o idioma do navegador, com somente as duas primeiras letras. Por exemplo: "pt" ou "es".
 *
 * Caso o valor retornado pelo navegador não estiver dentro dos idiomas suportados pelo PO,
 * será retornado a linguagem padrão (poLocaleDefault).
 */
export function getShortBrowserLanguage(): string {
  return getShortLanguage(getBrowserLanguage());
}

/**
 * Retorna o idioma com somente a abreviação do idioma (duas primeiras letras).
 * Por exemplo: "pt" ou "es".
 *
 * @param language {string} linguagem.
 *
 * @returns sigla do idioma padrão {string}.
 *
 * @default pt
 */
export function getShortLanguage(language: string): string {
  return (language || poLocaleDefault).toLowerCase().substring(0, 2);
}

export function isLanguage(value) {
  const languageRegex = new RegExp('^[a-z]{2}(\-[a-z]{2})?$', 'i');

  return languageRegex.test(value);
}

/* istanbul ignore next */
export function reloadCurrentPage() {
  window.location.assign(location.href);
}

export function convertToBoolean(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === 'on' || val === '');
  }

  if (typeof val === 'number') {
    return val === 1;
  }

  return !!val;
}

export function convertToInt(value: any, valueDefault?: any): number {
  const validNumber = parseInt(value, 10);
  const validDefaultValue = parseInt(valueDefault, 10);
  const defaultValue = validDefaultValue || validDefaultValue === 0 ? validDefaultValue : undefined;

  return validNumber || validNumber === 0 ? validNumber : defaultValue;
}

export function isTypeof(object: any, type: any) {
  return typeof object === type;
}

/**
 *
 * @param fn Função que será executada dentro do contexto. Podendo ser o nome da função
 * ou a referência da mesma.
 *
 * @param context Contexto do qual a função será executada.
 */
export function callFunction(fn: any, context: any, param?): void {
  if (isTypeof(fn, 'function')) {
    fn.call(context, param);
  } else {
    context[fn](param);
  }
}

export function convertIsoToDate(value: string , start: boolean, end: boolean) {
  if (value) {
    const day = parseInt(value.substring(8, 10), 10);
    const month = parseInt(value.substring(5, 7), 10);
    const year = parseInt(value.substring(0, 4), 10);
    if (start) {
      const date = new Date(year, month - 1, day, 0, 0, 0);

      setYearFrom0To100(date, year);

      return date;
    } else if (end) {
      const date = new Date(year, month - 1, day, 23, 59, 59);

      setYearFrom0To100(date, year);

      return date;
    } else {
      const milliseconds = Date.parse(value);
      const timezone = new Date().getTimezoneOffset() * 60000;
      return new Date(milliseconds + timezone);
    }
  }
}

export function convertDateToISODate(date: Date) {
  if (date) {
    const getMonth = date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = getMonth < 10 ? '0' + getMonth : getMonth;
    const year = formatYear(date.getFullYear());

    return year + '-' + month + '-' + day;
  } else {
    return null;
  }
}

export function convertDateToISOExtended(date: Date, time?: string) {
  if (date) {

  const getMonth = date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = getMonth < 10 ? '0' + getMonth : getMonth;
  const year = formatYear(date.getFullYear());

  const dateString = date.toString();

  if (time !== null) {
    return year + '-' + month + '-' + day + time;
  } else {
    return year + '-' + month + '-' + day + 'T' + dateString.substring(16, 24) +
        dateString.substring(28, 31) + ':' + dateString.substring(31, 33);
  }
  } else {
    return null;
  }
}

/**
 * Transforma o ano em uma string no formato yyyy e caso o ano seja menor que 1000 preenche com zeros a esquerda.
 * @param year Ano
 */
export function formatYear(year: number) {

  if (year >= 1000) {
    return year.toString();
  }

  if (year > 99 && year < 1000) {
    return `0${year}`;
  }

  if (year > 9 && year < 100) {
    return `00${year}`;
  }

  if (year >= 0 && year < 10) {
    return `000${year}`;
  }

}
// Verifica se o navegador em que está sendo usado é Internet Explorer ou Edge
export function isIEOrEdge() {
  const userAgent = window.navigator.userAgent;

  return /msie\s|trident\/|edge\//i.test(userAgent);
}

// Verifica qual o dispositivo que está sendo usado
export function isMobile() {
  const userAgent = window.navigator.userAgent;

  return userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i);
}

export function isEquals(value, comparedValue) {
  return JSON.stringify(value) === JSON.stringify(comparedValue);
}

export function isKeyCodeEnter(event: any): boolean {
  return event.keyCode === 13 || event.which === 13;
}

/**
 * Caso o ano original da data seja entre 0 e 100 atribui esse valor ao ano, pois o `new Date` do javascript transforma o ano para 190X.
 * @param date Data
 * @param year Ano original
 */
export function setYearFrom0To100(date: Date, year: number) {
  if (year >= 0 && year < 100 ) {
    date.setFullYear(year);
  }
}

export function sortOptionsByProperty(options: Array<any>, property: string) {
  options.sort((optionA, optionB) => {
    optionA = optionA[property].toString().toLowerCase();
    optionB = optionB[property].toString().toLowerCase();

    if (optionA < optionB) {
      return -1;
    }
    if (optionA > optionB) {
      return 1;
    }
    return 0;
  });
}

export function removeDuplicatedOptions(list: Array<any>) {
  for (let i = 0; i < list.length; i++) {
    if (i === 0) { continue; }

    if (list.findIndex(op => op.value === list[i].value) !== i) {
      list.splice(i, 1);
      i--;
    }
  }
}

export function removeUndefinedAndNullOptions(list: Array<any>) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value === undefined || list[i].value === null ) {
      list.splice(i, 1);
      i--;
    }
  }
}

export function validValue(value: any) {
  return (value !== null && value !== undefined && value !== '') || value === false;
}

export function isExternalLink(url): boolean {
  return url ? url.startsWith('http') : false;
}

export function openExternalLink(url): void {
  window.open(url, '_blank');
}

export function  getFormattedLink(link: string): string {
  let formattedLink = '';
  // Retira todos os pontos no começo da URL.
  if (link) {
    formattedLink = link.replace(/^(\.)+/g, '');
  }
  // Verifica se foi utilizado uma rota que não comece com barra.
  if (!formattedLink.startsWith('/')) {
    formattedLink = '/'.concat(formattedLink);
  }
  return formattedLink;
}

/**
 * Método responsável por ordenar dois valores.
 *
 * @param leftSide Primeiro valor a ser comparado.
 * @param rightSide Segundo valor a ser comparado.
 * @param ascending Determina se será em ordem ascendente ou descendente.
 */
export function sortValues(leftSide: string, rightSide: string, ascending: boolean = true): number {
  const left = isTypeof(leftSide, 'string') ? leftSide.toLowerCase() : leftSide;
  const right = isTypeof(rightSide, 'string') ? rightSide.toLowerCase() : rightSide;

  if (ascending) {
    if (left < right) {
      return -1;
    } else if (left > right) {
      return 1;
    }
  } else if (ascending === false) {
    if (left < right) {
      return 1;
    } else if (left > right) {
      return -1;
    }
  }
  return 0;
}

export function validateDateRange(date: Date, dateStart: Date, dateEnd: Date) {
  if (dateStart && dateEnd) {
    return (date >= dateStart && date <= dateEnd);
  } else if (dateStart && !dateEnd) {
    return (date >= dateStart);
  } else if (!dateStart && dateEnd) {
    return (date <= dateEnd);
  } else {
    return true;
  }
}

export function uuid() {
  function hex4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return hex4() + hex4() + '-' + hex4() + '-' + hex4() + '-' +
  hex4() + '-' + hex4() + hex4() + hex4();
}

export function capitalizeFirstLetter(text: string): string {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

/**
 * Mapeia um novo array apenas com as propriedades definidas pelo desenvolvedor baseado em um array de
 * origem.
 *
 * Exemplo:
 *
 * ```
 * const people = [
 *  { id: 1, name: 'Fulano', birthdate: '1980-11-01', genre: 'Male', city: 'São Paulo', dependents: 2 },
 *  { id: 2, name: 'Beltrano', birthdate: '1997-01-21', genre: 'Female', city: 'Joinville', dependents: 0 },
 *  { id: 3, name: 'Siclano', birthdate: '1995-07-15', genre: 'Male', city: 'Joinville', dependents: 0 }
 * ];
 *
 * const properties = ['id', 'name'];
 *
 * const idAndName = mapArrayByProperties(people, properties);
 *
 * console.log(idAndName); // [{ id: 1, name: 'Fulano' }, { id: 2, name: 'Beltrano' }, { id: 3, name: 'Siclano' }]
 * ```
 *
 * Um outro uso para o método é "parear" todos os objetos do array com as mesmas propriedades.
 *
 * ```
 * const customers = [
 *  { id: 1, name: 'Fulano', city: 'São Paulo', dependents: 2 }, // sem genre
 *  { id: 2, name: 'Beltrano', genre: 'Female', city: 'Joinville' }, // sem dependents
 *  { id: 3, name: 'Siclano', genre: 'Male', city: 'Joinville', dependents: 0 }
 * ];
 * const properties = ['id', 'name', 'city', 'genre', 'dependents'];
 *
 * const pattern = mapArrayByProperties(customers, properties);
 * console.log(pattern);
 *
 * // [
 * //   { id: 1, name: 'Fulano', city: 'São Paulo', genre: undefined, dependents: 2 },
 * //   { id: 2, name: 'Beltrano', city: 'Joinville', genre: 'Female', dependents: undefined },
 * //   { id: 3, name: 'Siclano', city: 'Joinville', genre: 'Male', dependents: 0 }
 * // ]
 * ```
 *
 * @param items {Array<any>} Array de items original.
 * @param properties {Array<string>} Array de string com a lista de propriedades que devem ser retornadas.
 *
 * @returns Array<any>
 */
export function mapArrayByProperties(items: Array<any> = [], properties: Array<string> = []): Array<any> {
  return items.map(item => mapObjectByProperties(item, properties));
}

/**
 * Mapeia um novo objeto apenas com as propriedades definidas pelo desenvolvedor.
 *
 * Exemplo:
 *
 * ```
 * const person = { id: 1, name: 'Fulano', birthdate: '1980-11-01', genre: 'Male', city: 'São Paulo', dependents: 2 };
 *
 * const properties = ['id', 'name'];
 *
 * const idAndName = mapObjectByProperties(person, properties);
 *
 * console.log(idAndName); // { id: 1, name: 'Fulano' }
 * ```
 *
 * @param object {Array<any>} Array de items original.
 * @param properties {Array<string>} Array de string com a lista de propriedades que devem ser retornadas.
 *
 * @returns Array<any>
 */
export function mapObjectByProperties(object: any = {}, properties: Array<string> = []) {
  const getSelectedProperties = (selectedProperties, property) => ({ ...selectedProperties, [property]: object[property] });

  return properties.reduce(getSelectedProperties, {});
}

/**
 * Retorna os valores de um objeto dentro de um array.
 *
 * > Simula o Object.values(obj), o mesmo deve ser removido assim que a versão typescrit for atualizada.
 *
 * @param object Objeto de onde será pego os valores.
 */
export function valuesFromObject(object: any = {}): Array<any> {
  return Object.keys(object).map(property => object[property]);
}
