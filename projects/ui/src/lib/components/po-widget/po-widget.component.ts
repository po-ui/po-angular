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

import { PoLanguageService, poLocaleDefault, PoThemeService } from '../../services';
import { PoButtonComponent } from '../po-button';
import { PoPopupComponent } from '../po-popup';
import { PoKeyCodeEnum } from './../../enums/po-key-code.enum';
import { poWidgetLiteralsDefault } from './literals/po-widget-language';
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
  @ViewChild('tagElement', { read: ElementRef }) tagElement!: ElementRef;

  get showTitleAction(): boolean {
    return !!this.titleAction.observers[0];
  }

  constructor(
    viewRef: ViewContainerRef,
    languageService: PoLanguageService,
    protected cd: ChangeDetectorRef,
    protected poTheme: PoThemeService
  ) {
    super(poTheme);
    const language = languageService.getShortLanguage();
    this.literals = {
      ...poWidgetLiteralsDefault[poLocaleDefault],
      ...poWidgetLiteralsDefault[language]
    };
  }

  get a11Level() {
    return this.poTheme.getA11yLevel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['help'] || changes['actions']) {
      this.checkDefaultActions();
    }
    if (changes['title'] || changes['tagLabel']) {
      this.cd.detectChanges();
    }
    this.setHeight(this.height);
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
    this.checkDefaultActions();
    const actionsHeight = this.a11Level === 'AA' && this.size === 'small' ? 32 : 44;
    const actionsButton = this.a11Level === 'AA' && this.size === 'small' ? 40 : 52;

    if (height) {
      //padding e border
      let bodyHeight = height - 32 - 2;

      if ((this.title || this.tagLabel) && !this.actions.length) {
        bodyHeight -= 24;
        bodyHeight -= 8; //container
      }

      if (this.actions.length) {
        bodyHeight -= actionsHeight;
        bodyHeight -= 8; //container
      }

      if (this.primaryLabel || this.secondaryLabel) {
        bodyHeight -= actionsButton;
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

  togglePopup(targetRef, event) {
    event.stopPropagation();
    this.popupTarget = targetRef;
    this.cd.detectChanges();
    this.poPopupComponent.toggle();
  }

  showTooltip() {
    const sumGap = this.tagLabel ? 12 : 6;
    return (
      this.title &&
      this.wrapperTitle?.nativeElement.offsetWidth + sumGap + (this.tagElement?.nativeElement.offsetWidth || 0) >=
        this.wrapperInfo?.nativeElement.offsetWidth
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
