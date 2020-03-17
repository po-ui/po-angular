import { PoI18nConfigDefault } from './po-i18n-config-default.interface';
import { PoI18nConfigWithoutDefault } from './po-i18n-config-without-default.interface';

/**
 * @docsExtends PoI18nConfigWithoutDefault
 *
 * @description
 *
 * <a id="poI18nConfig"></a>
 *
 * Interface para a configuração do módulo `PoI18nModule`.
 *
 * @usedBy PoI18nModule
 */
export interface PoI18nConfig extends PoI18nConfigWithoutDefault {
  /**
   * Configurações padrões.
   */
  default?: PoI18nConfigDefault;
}
