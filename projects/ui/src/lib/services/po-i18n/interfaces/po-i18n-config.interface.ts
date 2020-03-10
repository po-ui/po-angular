import { PoI18nConfigDefault } from './po-i18n-config-default.interface';

/**
 * @description
 *
 * <a id="poI18nConfig"></a>
 *
 * Interface para a configuração do módulo `PoI18nModule`.
 *
 * @usedBy PoI18nModule
 */
export interface PoI18nConfig {
  /** Configurações padrões. */
  default?: PoI18nConfigDefault;

  /**
   * Deve ser atribuído a esta propriedade um objeto que contenha os contextos com os
   * idiomas suportados e suas respectivas traduções literais,
   * como também informar a propriedade `url` onde pode ser informado o serviço que retorne as literais traduzidas.
   *
   * Portanto podemos utilizar constantes, onde devemos informar o nome do contexto recebendo um objeto com os
   * idiomas suportados e o arquivo de literais, por exemplo:
   * ```
   *  import { generalEn } from './i18n/general-en';
   *  import { generalPt } from './i18n/general-pt';
   * ...
   *  general: {
   *    pt: generalPt,
   *    en: generalEn
   *  }
   * ...
   * ```
   *
   * E como informado, podemos utilizar a propriedade `url` que deve receber a URL do serviço que
   * retorne as literais traduzidas, por exemplo:
   * ```
   *   hcm: {
   *     url: 'http://localhost:3000/api/translations/hcm/'
   *   }
   * ```
   *
   * Ao optar por utilizar um serviço, deverá ser definida a URL específica do contexto,
   * como nos exemplos abaixo:
   * ```
   *  http://server:port/api/translations/crm
   *  http://server:port/api/translations/general
   * ```
   *
   * Os idiomas e literais serão automaticamente buscados com parâmetros na própria URL:
   * - `language`: o idioma será sempre passado por parâmetro, sendo recomendado a utilização do padrão suportado
   * pelos navegadores (`pt-br`, `en-us`);
   * - `literals`: as literais serão separadas por vírgula. Caso esse parâmetro não seja informado, o
   * serviço deve retornar todas as literais do idioma.
   *
   * Exemplos de requisição:
   * ```
   *  http://server:port/api/translations/crm?language=pt-br
   *  http://server:port/api/translations/crm?language=pt-br&literals=add,remove,text
   * ```
   *
   * > Sempre que o idioma solicitado não for encontrado, será buscado por `pt-br`.
   *
   * Existe também a possibilidade de utilizar ambos, onde será feito a busca das literais nas constantes e depois efetua
   * a busca no serviço, com isso as constantes podem servir como *backup* caso o serviço esteja indisponível, por exemplo:
   *
   * ```
   *  import { generalEn } from './i18n/general-en';
   *  import { generalPt } from './i18n/general-pt';
   * ...
   *  general: {
   *    pt: generalPt,
   *    en: generalEn,
   *    url: 'http://localhost:3000/api/translations/hcm/'
   *  }
   * ...
   * ```
   * > Caso a constante contenha alguma literal que o serviço não possua será utilizado a literal da constante.
   */
  contexts: object;
}
