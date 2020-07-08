import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';

/**
 * @usedBy PoDisclaimerGroupComponent, PoPageListComponent
 *
 * @description
 *
 * Estrutura do objeto representando o estado dos *disclaimers* após a remoção.
 */
export interface PoDisclaimerGroupRemoveAction {
  /**
   * *Disclaimer* que foi removido.
   */
  removedDisclaimer: PoDisclaimer;

  /**
   * Lista com os *disclaimers* atuais (restantes).
   */
  currentDisclaimers: Array<PoDisclaimer>;
}
