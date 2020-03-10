import { PoButtonGroupItem } from '../../../po-button-group/po-button-group-item.interface';

// Interface para os botões do `po-rich-text-toolbar`.
export interface PoRichTextToolbarButtonGroupItem extends PoButtonGroupItem {
  // Define o comando do botão.
  command?: string;
}
