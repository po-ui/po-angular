/**
 * @description Item exibido no po-timeline
 */
export class PoTimelineItem {
  /**
   * @description Título do item
   */
  title: string;

  /**
   * @description Ao ser informado é adicionado um po-tooltip
   */
  tooltip?: string;

  /**
   * @description Descrição do item
   */
  description: string;

  /**
   * @description Icone do botão na timeline referente a esse item
   */
  icon?: string;

  /**
   * @description Cor do botão indicativo
   */
  color: string;

  /**
   * @description dados adicionais
   */
  data?: any;
}
