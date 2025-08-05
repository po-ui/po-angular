import { ChangeDetectorRef, Component, ElementRef, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { isExternalLink } from '../../../utils/util';
import { PoButtonComponent } from '../../po-button';
import { PoPopoverComponent } from '../../po-popover';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderActionTool } from '../interfaces/po-header-action-tool.interface';
import { PoHeaderLiterals } from '../interfaces/po-header-literals.interface';

@Component({
  selector: 'po-header-tools',
  templateUrl: './po-header-tools.component.html',
  standalone: false
})
export class PoHeaderToolsComponent {
  _actionTools: Array<PoHeaderActionTool> = [];

  @ViewChildren('buttonActionElement', { read: ElementRef }) buttonActionElements: QueryList<ElementRef>;
  @ViewChildren('buttonActionElement') buttonActionComponents: QueryList<PoButtonComponent>;
  @ViewChildren('poPopupAction') poPopupActions: QueryList<PoPopupComponent>;
  @ViewChildren('poPopoverAction') poPopoverActions: QueryList<PoPopoverComponent>;

  @Input('p-force-actions-tools') forceActionTools?: boolean = false;

  @Input('p-actions-tools') set actionTools(value: Array<PoHeaderActionTool>) {
    if (this.forceActionTools) {
      this._actionTools = value;
    } else {
      this._actionTools = value.slice(0, 3);
    }
    this.cd.detectChanges();
  }

  @Input('p-literals') literals: PoHeaderLiterals;

  get actionTools(): Array<PoHeaderActionTool> {
    return this._actionTools;
  }

  get popoverIndexes(): Array<number> {
    return this.actionTools.map((action, index) => (action.popover ? index : -1)).filter(index => index !== -1);
  }

  @Input('p-header-template') headerTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  onClickAction(index: number) {
    const action = this.actionTools[index];
    action.action?.();

    if (this.actionTools[index].items && !this.actionTools[index].popover) {
      const popup = this.poPopupActions.get(index);
      popup?.toggle();
    }

    this.checkLink(action);
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

  onClosePopup(index: number) {
    this.buttonActionComponents.get(index).focus();
  }

  getAriaLabel(action: PoHeaderActionTool): string {
    let label = action?.tooltip || '';
    if (action?.badge) {
      label += `, ${action.badge} ${this.literals?.notifications}`;
    }
    return label;
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
