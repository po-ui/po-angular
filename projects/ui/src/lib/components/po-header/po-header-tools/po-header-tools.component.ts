import { Component, ElementRef, Input, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { PoHeaderActionTool } from '../interfaces/po-header-action-tool.interface';
import { PoPopupComponent } from '../../po-popup';
import { PoPopoverComponent } from '../../po-popover';
import { isExternalLink } from '../../../utils/util';
import { Router } from '@angular/router';

@Component({
  selector: 'po-header-tools',
  templateUrl: './po-header-tools.component.html',
  standalone: false
})
export class PoHeaderToolsComponent {
  _actionTools: Array<PoHeaderActionTool> = [];

  @ViewChildren('buttonActionElement', { read: ElementRef }) buttonActionElements: QueryList<ElementRef>;
  @ViewChildren('poPopupAction') poPopupActions: QueryList<PoPopupComponent>;
  @ViewChildren('poPopoverAction') poPopoverActions: QueryList<PoPopoverComponent>;

  @Input('p-actions-tools') set actionTools(value: Array<PoHeaderActionTool>) {
    this._actionTools = value.slice(0, 3);
  }

  get actionTools(): Array<PoHeaderActionTool> {
    return this._actionTools;
  }

  get popoverIndexes(): Array<number> {
    return this.actionTools.map((action, index) => (action.popover ? index : -1)).filter(index => index !== -1);
  }

  @Input('p-header-template') headerTemplate: TemplateRef<any>;

  constructor(private router: Router) {}

  onClickFirstAction(index: number) {
    const action = this.actionTools[index];
    action.action?.();

    if (this.actionTools[index].items && !this.actionTools[index].popover) {
      const popup = this.poPopupActions.get(index);
      popup?.toggle();
    }

    this.checkLink(action);
  }

  onClickFirstActionClosePopover(index: number) {
    const realPopoverIndex = this.popoverIndexes.indexOf(index);
    const popover = this.poPopoverActions.get(realPopoverIndex);
    popover?.close();
  }

  checkSelected(index: number) {
    if (this.actionTools[index].items && !this.actionTools[index].popover) {
      const popup = this.poPopupActions?.get(index);
      if (popup?.showPopup) {
        return true;
      }
      return false;
    } else {
      const realPopoverIndex = this.popoverIndexes.indexOf(index);
      const popover = this.poPopoverActions?.get(realPopoverIndex);

      if (popover && !popover?.isHidden) {
        return true;
      }
      return false;
    }
  }

  private checkLink(item: PoHeaderActionTool) {
    if (item.link) {
      if (isExternalLink(item.link)) {
        window.open(item.link, '_blank');
      } else {
        this.router.navigateByUrl(item.link);
      }
    }
  }
}
