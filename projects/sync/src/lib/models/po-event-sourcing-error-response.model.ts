import { PoEventSourcingOperation } from './../services/po-event-sourcing/enums/po-event-sourcing-operation.enum';

/**
 * @description
 *
 * Classe que define a resposta de erro para um item da fila de eventos que não foi enviado ao servidor por
 * alguma inconsistência.
 *
 * > Pode ser utilizada em casos onde um item da fila é enviado ao servidor com inconsistência nos dados, por exemplo
 * uma operação de *delete* ou *update* sem o `id` do objeto.
 */
export class PoEventSourcingErrorResponse {
  /** Mensagem de erro. */
  message: string;

  /** Operação que havia sido requisitada. */
  operation: PoEventSourcingOperation;

  /* istanbul ignore next */
  constructor({ message, operation }) {
    this.message = message;
    this.operation = operation;
  }
}
