/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.
 *
 * É publicado no `Observable` `PoUserGuideService.tourStart$` exatamente uma vez por execução, imediatamente
 * após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
 * `PoUserGuideService.stepChange$`.
 *
 * As aplicações consumidoras podem assinar `tourStart$` para registrar telemetria do início do tour,
 * exibir mensagens contextuais ou disparar lógica de negócio dependente do início da jornada do usuário.
 */
export interface PoUserGuideStartEvent {
  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;

  /**
   * @description
   *
   * Índice do passo inicial do tour, com base zero.
   *
   * Corresponde ao argumento `startIndex` informado a `PoUserGuideService.start`. Quando o método é invocado
   * sem argumentos, o valor é `0`.
   */
  startIndex: number;

  /**
   * @description
   *
   * Marca de tempo, em milissegundos, do momento de emissão do evento, obtida a partir de `Date.now()`.
   *
   * Útil para correlacionar o início do tour com outros eventos de telemetria da aplicação.
   */
  timestamp: number;
}
