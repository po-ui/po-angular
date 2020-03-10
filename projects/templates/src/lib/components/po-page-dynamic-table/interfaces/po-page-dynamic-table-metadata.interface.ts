import { PoPageDynamicTableOptions } from './po-page-dynamic-table-options.interface';

/**
 * @docsExtends PoPageDynamicTableOptions
 *
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * <a id="po-page-dynamic-table-metadata"></a>
 *
 */
export interface PoPageDynamicTableMetaData extends PoPageDynamicTableOptions {
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
