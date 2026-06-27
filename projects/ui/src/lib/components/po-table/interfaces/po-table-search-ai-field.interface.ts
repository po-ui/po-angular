import { PoSearchAiColumn } from '../../po-field/po-search-ai/interfaces/po-search-ai-column.interface';
import { PoSearchAiLiterals } from '../../po-field/po-search-ai/interfaces/po-search-ai-literals.interface';
import { PoSearchAiResult } from '../../po-field/po-search-ai/interfaces/po-search-ai.interface';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface de configuração da busca por IA integrada ao `po-table`, utilizada pela
 * propriedade `p-search-ai-field`.
 *
 * Quando configurada, a tabela renderiza um campo `po-search-ai` na barra de ações,
 * no lugar da busca textual padrão (`po-search`). O filtro gerado pela IA é aplicado
 * automaticamente aos dados da tabela, conforme a estratégia definida em `apply`.
 *
 * #### Endpoint de IA (`url`)
 *
 * O campo `url` deve apontar para um endpoint (proxy) que implemente o contrato do
 * `po-search-ai`: recebe `{ query, columns }` via `POST` e responde com
 * `{ filter, description, confidence }`.
 *
 * > A integração com a LLM e a guarda de chaves devem ocorrer **no backend**, nunca
 * > no client-side. O backend de referência open source está disponível em
 * > [`po-sample-api`](https://github.com/po-ui/po-sample-api).
 *
 * #### Colunas enviadas à IA
 *
 * Por padrão, os metadados enviados ao endpoint são derivados automaticamente de
 * `p-columns` da tabela, respeitando as colunas visíveis e excluindo aquelas com
 * `searchAiIgnore: true`. O campo `columns` permite sobrescrever esse comportamento.
 *
 * #### Estratégia de aplicação do filtro (`apply`)
 *
 * | Valor | Comportamento |
 * |-------|---------------|
 * | `'auto'` (padrão) | Modo serviço: envia `$filter` ao `p-service-api`; modo local: aplica o parser OData interno sobre `p-items`. |
 * | `'parser'` | Sempre usa o parser OData interno. No modo serviço, busca todos os dados e filtra localmente. |
 * | `'server'` | Sempre delega o filtro ao `p-service-api` via `$filter`. |
 * | `'none'` | Não aplica o filtro; apenas emite `p-search-ai-result` para o desenvolvedor tratar. |
 * | `(result) => void` | Override total: o desenvolvedor recebe o resultado e assume o controle. |
 */
export interface PoTableSearchAiField {
  /**
   * Endpoint (proxy) de IA responsável por converter a consulta em linguagem natural
   * em um filtro estruturado (OData). Repassado ao `po-search-ai` via `p-url`.
   *
   * O endpoint deve seguir o contrato do backend de referência (`po-sample-api`):
   * - Recebe: `POST { query: string, columns: PoSearchAiColumn[] }`
   * - Responde: `{ filter: string, description: string, confidence: number }`
   */
  url: string;

  /**
   * @optional
   *
   * @description
   *
   * Override das colunas enviadas ao endpoint de IA. Quando omitido, os metadados
   * são derivados automaticamente de `p-columns` da tabela, excluindo colunas com
   * `visible: false` ou `searchAiIgnore: true`.
   */
  columns?: Array<PoSearchAiColumn>;

  /**
   * @optional
   *
   * @description
   *
   * Nível mínimo de confiança (`0.0` a `1.0`) para que o filtro gerado pela IA seja
   * aplicado automaticamente. Quando a confiança for inferior, o evento
   * `p-search-ai-low-confidence` é emitido em vez de `p-search-ai-result`.
   *
   * @default `0.5`
   */
  minConfidence?: number;

  /**
   * @optional
   *
   * @description
   *
   * Tempo máximo de espera (em milissegundos) pela resposta do endpoint de IA.
   *
   * @default `10000`
   */
  timeout?: number;

  /**
   * @optional
   *
   * @description
   *
   * Texto exibido como placeholder no campo de busca por IA.
   */
  placeholder?: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com os literais usados pelo `po-search-ai` integrado à tabela. Permite
   * sobrescrever as mensagens padrão para internacionalização ou customização.
   */
  literals?: PoSearchAiLiterals;

  /**
   * @optional
   *
   * @description
   *
   * Define como o filtro OData retornado pela IA é aplicado à tabela.
   *
   * - `'auto'` _(padrão)_: aplica automaticamente conforme o modo da tabela —
   *   modo serviço envia `$filter` ao `p-service-api`; modo local usa o parser
   *   OData interno sobre `p-items`.
   * - `'parser'`: sempre usa o parser OData interno. No modo serviço, busca todos
   *   os dados primeiro e filtra localmente em seguida.
   * - `'server'`: sempre envia `$filter` ao `p-service-api`, independentemente
   *   do modo da tabela.
   * - `'none'`: não aplica o filtro; apenas emite `p-search-ai-result`.
   * - `(result: PoSearchAiResult) => void`: override total — o desenvolvedor recebe
   *   o resultado e assume o controle da aplicação do filtro.
   *
   * @default `'auto'`
   */
  apply?: 'auto' | 'parser' | 'server' | 'none' | ((result: PoSearchAiResult) => void);
}
