import { PoPageDynamicDetailOptions } from './po-page-dynamic-detail-options.interface';

/**
 * @docsExtends PoPageDynamicDetailOptions
 *
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * <a id="po-page-dynamic-detail-metadata"></a>
 *
 */
export interface PoPageDynamicDetailMetaData extends PoPageDynamicDetailOptions {
  /**
   *
   * Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions`
   *
   * As rotas criadas serão baseadas na propriedade `p-actions`.
   *
   * > Para o correto funcionamento não pode haver nenhuma rota coringa (`**`) especificada.
   *
   * @default false
   */
  autoRouter?: boolean;

  /**
   *
   * Versão do metadata, o sistema irá buscar a versão nas próximas iteração.
   *
   * @default false
   */
  version?: string;
}
