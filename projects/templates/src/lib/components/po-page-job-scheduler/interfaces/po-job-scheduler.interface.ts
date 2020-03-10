/**
 * @usedBy PoPageJobSchedulerComponent
 *
 * @description
 *
 * Estrutura do *payload* enviado nas requisições para salvar e/ou atualizar as tarefas do *Job Scheduler*.
 */
export interface PoJobScheduler {
  /**
   * Define uma repetição diária.
   */
  daily?: { hour: number; minute: number };

  /**
   * Objeto contendo os nomes das propriedades dos parâmetros e os valores preenchidos pelo usuário.
   */
  executionParameter?: object;

  /**
   * Data da primeira execução.
   */
  firstExecution?: string;

  /**
   * Define uma repetição mensal.
   */
  monthly?: { day: number; hour: number; minute: number };

  /**
   * Identificador do processo.
   */
  processID: string;

  /**
   * Permite uma execução recorrente.
   */
  recurrent?: boolean;

  /**
   * Define uma repetição semanal.
   */
  weekly?: { daysOfWeek: Array<string>; hour: number; minute: number };
}
