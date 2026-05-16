/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-user-guide`.
 */
export interface PoUserGuideLiterals {
  /** Label padrão do botão "Próximo" aplicado a todos os passos do tour. */
  next?: string;

  /** Label padrão do botão "Anterior" aplicado a todos os passos do tour. */
  previous?: string;

  /** Label padrão do botão "Finalizar" aplicado ao último passo do tour. */
  done?: string;

  /** Label padrão do botão "Fechar" (X) exibido no canto do popover do tour. */
  close?: string;

  /** Template padrão do texto de progresso exibido no popover (ex: `{ {current} } de { {total} }`). */
  progressTemplate?: string;
}
