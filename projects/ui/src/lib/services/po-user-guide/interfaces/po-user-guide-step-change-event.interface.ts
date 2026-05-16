import { PoUserGuideStep } from './po-user-guide-step.interface';

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.
 *
 * É publicado no `Observable` `PoUserGuideService.stepChange$` toda vez que o passo ativo é alterado, seja por
 * interação do usuário (cliques nos botões "Próximo"/"Anterior" ou navegação por teclado) ou por chamada
 * programática aos métodos `next`, `previous`, `goTo` e `start` do `PoUserGuideService`.
 *
 * As aplicações consumidoras podem assinar `stepChange$` para reagir à navegação do usuário, atualizar a
 * UI conforme o passo ativo, registrar telemetria de progresso ou disparar lógica de negócio contextual.
 */
export interface PoUserGuideStepChangeEvent {
  /**
   * @description
   *
   * Passo do tour que se tornou ativo após a transição.
   *
   * Corresponde ao elemento da lista `steps` (configurada via `PoUserGuideService.setSteps`) cujo índice é
   * igual ao valor de `index` neste evento.
   */
  step: PoUserGuideStep;

  /**
   * @description
   *
   * Índice, com base zero, do passo ativo após a transição.
   *
   * Está sempre contido no intervalo `[0, totalSteps - 1]`.
   */
  index: number;

  /**
   * @description
   *
   * Direção da transição que originou a mudança de passo.
   *
   * Valores aceitos:
   *
   * - `next`: a transição foi originada pelo método `PoUserGuideService.next` ou pelo botão "Próximo" do popover.
   * - `previous`: a transição foi originada pelo método `PoUserGuideService.previous` ou pelo botão "Anterior" do popover.
   * - `goto`: a transição foi originada pela chamada ao método `PoUserGuideService.goTo` com um índice arbitrário.
   * - `start`: a transição corresponde à exibição do primeiro passo logo após a inicialização do tour
   *   pelo método `PoUserGuideService.start`.
   */
  direction: 'next' | 'previous' | 'goto' | 'start';

  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;
}
