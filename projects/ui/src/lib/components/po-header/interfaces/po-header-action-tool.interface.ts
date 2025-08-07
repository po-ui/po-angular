import { TemplateRef } from '@angular/core';

export interface PoHeaderActionTool {
  title?: string;
  tooltip?: string;
  icon?: string;
  popover?: PoHeaderActionPopoverAction;
  action?: Function;
  items?: Array<PoHeaderActionToolItem>;
  badge?: number;
}

export interface PoHeaderActionPopoverAction {
  title: string;
  content?: TemplateRef<any>;
}

export interface PoHeaderActionToolItem {
  label: string;
  action: Function;
}
