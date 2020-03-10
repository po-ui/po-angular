import { PoEventSourcingOperation } from './../enums/po-event-sourcing-operation.enum';
import { PoHttpRequestData } from '../../po-http-client/interfaces/po-http-request-data.interface';

/**
 * @description
 *
 * Classe que irá mapear as informações dos `EventSourcing` gerados pela aplicação.
 */
export interface PoEventSourcingItem {
  /** Valor numérico correspondente ao horário da data em que o registro foi criado de acordo com o horário universal. */
  dateTime: number;

  /** Identificador do registro. */
  id: number;

  /** Identificador customizado do registro. */
  customRequestId?: string;

  /**
   * Especifica a operação que deverá ser realizada na API.
   */
  operation: PoEventSourcingOperation;

  /** Objeto *json* com os dados do registro.
   *
   * > Caso a operação seja do tipo HTTP, o registro deverá ter a assinatura da interface `PoHttpOperationData`.
   */
  record: any | PoHttpRequestData;

  /** Nome do *schema* à qual se refere o `EventSourcing`. */
  schema?: string;
}
