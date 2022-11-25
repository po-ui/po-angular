import { TemplateRef } from '@angular/core';

export interface PoItemListAction {
  action?: Function;
  disabled?: boolean | Function;
  icon?: string | TemplateRef<void>;
  label: string;
  url?: string;
  selected?: boolean;
  separator?: boolean;
  type?: string;
  visible?: boolean | Function;
}
