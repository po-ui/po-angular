import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { PoWidgetBaseComponent } from './po-widget-base.component';

/**
 * @docsExtends PoWidgetBaseComponent
 *
 * @example
 *
 * <example name="po-widget-basic" title="PO Widget Basic">
 *  <file name="sample-po-widget-basic/sample-po-widget-basic.component.html"> </file>
 *  <file name="sample-po-widget-basic/sample-po-widget-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-widget-labs" title="PO Widget Labs">
 *  <file name="sample-po-widget-labs/sample-po-widget-labs.component.html"> </file>
 *  <file name="sample-po-widget-labs/sample-po-widget-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-widget-finance-dashboard" title="PO Widget - Finance dashboard">
 *  <file name="sample-po-widget-finance-dashboard/sample-po-widget-finance-dashboard.component.html"> </file>
 *  <file name="sample-po-widget-finance-dashboard/sample-po-widget-finance-dashboard.component.ts"> </file>
 * </example>
 *
 * <example name="po-widget-card" title="PO Widget - Card">
 *  <file name="sample-po-widget-card/sample-po-widget-card.component.html"> </file>
 *  <file name="sample-po-widget-card/sample-po-widget-card.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-widget',
  templateUrl: './po-widget.component.html'
})
export class PoWidgetComponent extends PoWidgetBaseComponent implements OnInit {
  get showTitleAction(): boolean {
    return !!this.titleAction.observers[0];
  }

  constructor(viewRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this.setHeight(this.height);
  }

  hasTitleHelpOrSetting(): boolean {
    return !!this.title || !!this.help || !!this.setting.observers[0];
  }

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.click.emit(event);
    }
  }

  openHelp(event: MouseEvent) {
    if (!this.disabled) {
      event.stopPropagation();
      window.open(this.help, '_blank');
    }
  }

  runPrimaryAction(event: MouseEvent) {
    if (!this.disabled) {
      event.stopPropagation();
      this.primaryAction.emit();
    }
  }

  runSecondaryAction(event: MouseEvent) {
    if (!this.disabled) {
      event.stopPropagation();
      this.secondaryAction.emit();
    }
  }

  runTitleAction(event: MouseEvent) {
    if (!this.disabled) {
      event.stopPropagation();
      this.titleAction.emit();
    }
  }

  setHeight(height: number) {
    if (height) {
      let bodyHeight = height;
      const hasSettingOrHelp = this.setting.observers.length > 0 || this.help;
      const footerBorder = 1;
      const footerHeight = 40;
      const settingHeight = 37;
      const shadowHeight = 2;
      const titleHeight = 50;

      if (this.noShadow) {
        bodyHeight -= shadowHeight;
      }

      if (hasSettingOrHelp && !this.title) {
        bodyHeight -= settingHeight;
      }

      if (this.title) {
        bodyHeight -= titleHeight;
      }

      if (this.primaryLabel) {
        bodyHeight -= footerHeight + footerBorder;
      }

      this.containerHeight = `${bodyHeight}px`;
    } else {
      this.containerHeight = `auto`;
    }
  }

  settingOutput(event: MouseEvent) {
    if (!this.disabled) {
      event.stopPropagation();
      this.setting.emit();
    }
  }
}
