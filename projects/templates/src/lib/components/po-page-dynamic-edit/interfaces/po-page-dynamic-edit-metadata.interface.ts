import { PoPageDynamicEditOptions } from './po-page-dynamic-edit-options.interface';

/**
 * @docsExtends PoPageDynamicEditOptions
 *
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * <a id="po-page-dynamic-edit-metadata"></a>
 *
 */
export interface PoPageDynamicEditMetadata extends PoPageDynamicEditOptions {
  /**
   * Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions`
   *
   * As rotas criadas serão baseadas na propriedade `p-actions`.
   *
   * > Para o correto funcionamento não pode haver nenhuma rota coringa (`**`) especificada.
   *
   * @default false
   */
  autoRouter?: boolean;

  /** Versão do metadado devolvido pelo backend. */
  version: number;
}
