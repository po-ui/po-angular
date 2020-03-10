import { PoEventSourcingOperation } from '../enums/po-event-sourcing-operation.enum';

/**
 * @docsPrivate
 *
 * @description
 *
 * Define as informações de um evento para um determinado registro.
 */
export interface PoEventSourcingSummaryItem {
  /** Identificador customizado do registro. */
  customRequestId: string;

  /** Especifica a operação que deverá ser realizada na API. */
  operation: PoEventSourcingOperation;

  /** Objeto *json* com os dados do registro. */
  record: object;
}
