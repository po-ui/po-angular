import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { PoPopupComponent } from '../po-popup';
import { PoKeyCodeEnum } from './../../enums/po-key-code.enum';
import { PoWidgetBaseComponent } from './po-widget-base.component';
import { PoLanguageService, poLocaleDefault } from '../../services';
import { poWidgetLiteralsDefault } from './literals/po-widget-language';
import { PoButtonComponent } from '../po-button';

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
  templateUrl: './po-widget.component.html',
  standalone: false
})
export class PoWidgetComponent extends PoWidgetBaseComponent implements OnInit, OnChanges {
  popupTarget: any;
  literals;
  @ViewChild('popup', { static: true }) poPopupComponent: PoPopupComponent;
  @ViewChild('buttonPopUp') buttonPopUp: PoButtonComponent;

  @ViewChild('wrapperInfo') wrapperInfo!: ElementRef;
  @ViewChild('wrapperTitle') wrapperTitle!: ElementRef;

  get showTitleAction(): boolean {
    return !!this.titleAction.observers[0];
  }

  constructor(
    viewRef: ViewContainerRef,
    languageService: PoLanguageService,
    private cd: ChangeDetectorRef
  ) {
    super();
    const language = languageService.getShortLanguage();
    this.literals = {
      ...poWidgetLiteralsDefault[poLocaleDefault],
      ...poWidgetLiteralsDefault[language]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['help'] || changes['actions']) {
      this.checkDefaultActions();
    }
  }

  ngOnInit() {
    this.setHeight(this.height);
    this.checkDefaultActions();
    this.showTooltip();
    this.cd.detectChanges();
  }

  hasTitleHelpOrSetting(): boolean {
    return !!this.title || !!this.help || !!this.setting.observers[0] || !!this.tagLabel || !!this?.actions.length;
  }

  onClick(event: MouseEvent) {
    if (this.click.observed && !this.disabled) {
      this.click.emit(event);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (
      this.click.observed &&
      !this.disabled &&
      (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space)
    ) {
      this.click.emit(event);

      event.preventDefault();
    }
  }

  openHelp() {
    if (!this.disabled) {
      window.open(this.help, '_blank');
    }
  }

  runPrimaryAction() {
    if (!this.disabled) {
      this.primaryAction.emit();
    }
  }

  runSecondaryAction() {
    if (!this.disabled) {
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

  settingOutput() {
    if (!this.disabled) {
      this.setting.emit();
    }
  }

  togglePopup(targetRef) {
    this.popupTarget = targetRef;
    this.cd.detectChanges();
    this.poPopupComponent.toggle();
  }

  showTooltip() {
    return (
      this.title && this.wrapperTitle?.nativeElement.offsetWidth + 6 >= this.wrapperInfo?.nativeElement.offsetWidth
    );
  }

  closePopUp() {
    this.buttonPopUp?.focus();
  }

  private checkDefaultActions() {
    if (this.setting.observed && !this.actions.some(action => action.$id === 'widget_configuration')) {
      this.actions = [
        ...this.actions,
        {
          icon: 'ICON_SETTINGS',
          label: this.literals.configuration,
          type: 'default',
          action: this.settingOutput.bind(this),
          $id: 'widget_configuration'
        }
      ];
    }

    if (this.help && !this.actions.some(action => action.$id === 'widget_help')) {
      this.actions = [
        ...this.actions,
        {
          icon: 'ICON_HELP',
          label: this.literals.help,
          type: 'default',
          action: this.openHelp.bind(this),
          $id: 'widget_help'
        }
      ];
    }

    if (!this.help) {
      this.actions = this.actions.filter(action => action.$id !== 'widget_help');
    }
  }
}
