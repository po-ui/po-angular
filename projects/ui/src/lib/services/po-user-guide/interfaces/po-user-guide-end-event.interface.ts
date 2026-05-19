/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.
 *
 * É publicado no `Observable` `PoUserGuideService.tourEnd$` exatamente uma vez por execução, sempre após a
 * emissão do último `PoUserGuideStepChangeEvent` em `PoUserGuideService.stepChange$` e após a limpeza do estado
 * interno do serviço.
 *
 * As aplicações consumidoras podem assinar `tourEnd$` para registrar telemetria de conclusão ou de
 * abandono do tour, executar limpezas de UI ou disparar lógica de negócio dependente do encerramento
 * da jornada do usuário.
 */
export interface PoUserGuideEndEvent {
  /**
   * @description
   *
   * Motivo do encerramento do tour.
   *
   * Valores aceitos:
   *
   * - `completed`: o usuário avançou além do último passo do tour, concluindo a jornada por completo.
   * - `closed`: o tour foi encerrado antes da conclusão, seja pelo usuário (tecla `Esc`, botão "Fechar"
   *   ou clique fora do popover quando `PoUserGuideOptions.allowClose` está habilitado) ou pela aplicação
   *   consumidora através das chamadas a `PoUserGuideService.close` ou `PoUserGuideService.exit`.
   * - `destroyed`: o encerramento foi forçado pela destruição da instância do serviço — cenário raro,
   *   normalmente observado em testes automatizados ou em ciclos de vida atípicos da aplicação.
   */
  reason: 'completed' | 'closed' | 'destroyed';

  /**
   * @description
   *
   * Índice, com base zero, do último passo ativo antes do encerramento do tour.
   *
   * Quando `reason` é `'completed'`, corresponde ao índice do último passo da lista (`totalSteps - 1`).
   * Quando `reason` é `'closed'` ou `'destroyed'`, corresponde ao índice do passo que estava em exibição
   * no momento do encerramento.
   */
  lastIndex: number;

  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;
}
