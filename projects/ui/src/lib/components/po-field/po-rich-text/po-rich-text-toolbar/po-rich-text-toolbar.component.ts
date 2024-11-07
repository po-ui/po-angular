import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoLanguageService } from '../../../../services/po-language/po-language.service';
import { isIE } from '../../../../utils/util';

import { PoButtonGroupItem } from '../../../po-button-group';
import { PoRichTextToolbarActions } from '../enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextToolbarButtonGroupItem } from '../interfaces/po-rich-text-toolbar-button-group-item.interface';
import { PoRichTextImageModalComponent } from '../po-rich-text-image-modal/po-rich-text-image-modal.component';
import { PoRichTextLinkModalComponent } from '../po-rich-text-link-modal/po-rich-text-link-modal.component';
import { poRichTextLiteralsDefault } from '../po-rich-text-literals';

const poRichTextDefaultColor = '#000000';

@Component({
  selector: 'po-rich-text-toolbar',
  templateUrl: './po-rich-text-toolbar.component.html'
})
export class PoRichTextToolbarComponent implements AfterViewInit {
  @ViewChild('colorPickerInput', { read: ElementRef }) colorPickerInput: ElementRef;

  @ViewChild('toolbarElement', { static: true }) toolbarElement: ElementRef;

  @ViewChild(PoRichTextImageModalComponent, { static: true }) richTextImageModal: PoRichTextImageModalComponent;

  @ViewChild(PoRichTextLinkModalComponent, { static: true }) richTextLinkModal: PoRichTextLinkModalComponent;

  @Output('p-command') command = new EventEmitter<string | { command: string; value: string }>();

  @Output('p-modal') modal = new EventEmitter<any>();

  @Output('p-link-editing') linkEditing = new EventEmitter<any>();

  readonly literals?: any;

  alignButtons: Array<PoRichTextToolbarButtonGroupItem>;

  formatButtons: Array<PoRichTextToolbarButtonGroupItem>;

  listButtons: Array<PoRichTextToolbarButtonGroupItem>;

  linkButtons: Array<PoRichTextToolbarButtonGroupItem>;

  mediaButtons: Array<PoButtonGroupItem>;

  private _readonly: boolean;
  private selectedLinkElement;

  private _hideToolbarActions: Array<PoRichTextToolbarActions> = [];

  formatToolbarAction = PoRichTextToolbarActions.Format;
  colorToolbarAction = PoRichTextToolbarActions.Color;
  alignToolbarAction = PoRichTextToolbarActions.Align;
  listToolbarAction = PoRichTextToolbarActions.List;
  linkToolbarAction = PoRichTextToolbarActions.Link;
  mediaToolbarAction = PoRichTextToolbarActions.Media;

  /**
   * @optional
   *
   * @description
   *
   * Define as ações da barra de ferramentas do `PoRichTextComponent` que serão ocultadas.
   * Aceita um único valor do tipo `PoRichTextToolbarActions` ou uma lista de valores.
   *
   * > Esta propriedade sobrepõe a configuração da propriedade `p-disabled-text-align` quando for passada como `false`, caso sejam definidas simultaneamente.
   *
   * @default `[]`
   *
   * @example
   * ```
   * // Oculta apenas o seletor de cores
   * component.hideToolbarActions = PoRichTextToolbarActions.Color;
   *
   * // Oculta as opções de alinhamento e link
   * component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Link];
   * ```
   */
  @Input('p-hide-toolbar-actions') set hideToolbarActions(
    actions: Array<PoRichTextToolbarActions> | PoRichTextToolbarActions
  ) {
    this._hideToolbarActions = Array.isArray(actions) ? [...actions] : [actions];
  }

  get hideToolbarActions(): Array<PoRichTextToolbarActions> {
    return this._hideToolbarActions;
  }

  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = value;
    this.toggleDisableButtons(this._readonly);
  }

  get readonly() {
    return this._readonly;
  }

  get isInternetExplorer() {
    return isIE();
  }

  constructor(private languageService: PoLanguageService) {
    this.literals = {
      ...poRichTextLiteralsDefault[this.languageService?.getShortLanguage()]
    };
    this.alignButtons = [
      {
        command: 'justifyleft',
        icon: 'ICON_ALIGN_LEFT',
        tooltip: this.literals.left,
        action: this.emitAlignCommand.bind(this, 'justifyleft'),
        selected: true
      },
      {
        command: 'justifycenter',
        icon: 'ICON_ALIGN_CENTER',
        tooltip: this.literals.center,
        action: this.emitAlignCommand.bind(this, 'justifycenter')
      },
      {
        command: 'justifyright',
        icon: 'ICON_ALIGN_RIGHT',
        tooltip: this.literals.right,
        action: this.emitAlignCommand.bind(this, 'justifyright')
      },
      {
        command: 'justifyfull',
        icon: 'ICON_ALIGN_JUSTIFY',
        tooltip: this.literals.justify,
        action: this.emitAlignCommand.bind(this, 'justifyfull')
      }
    ];

    this.formatButtons = [
      {
        command: 'bold',
        icon: 'ICON_TEXT_BOLD',
        tooltip: this.literals.bold,
        action: this.emitCommand.bind(this, 'bold')
      },
      {
        command: 'italic',
        icon: 'ICON_TEXT_ITALIC',
        tooltip: this.literals.italic,
        action: this.emitCommand.bind(this, 'italic')
      },
      {
        command: 'underline',
        icon: 'ICON_TEXT_UNDERLINE',
        tooltip: this.literals.underline,
        action: this.emitCommand.bind(this, 'underline')
      }
    ];

    this.listButtons = [
      {
        command: 'insertUnorderedList',
        icon: 'ICON_LIST',
        tooltip: this.literals.unorderedList,
        action: this.emitCommand.bind(this, 'insertUnorderedList')
      }
    ];

    this.mediaButtons = [
      {
        tooltip: this.literals.insertImage,
        icon: 'ICON_PICTURE',
        action: () => this.richTextImageModal.openModal()
      }
    ];

    this.linkButtons = [
      {
        command: 'Createlink',
        icon: 'ICON_LINK',
        tooltip: `${this.literals.insertLink} (Ctrl + K)`,
        action: () => this.richTextLinkModal.openModal(this.selectedLinkElement)
      }
    ];
  }

  ngAfterViewInit() {
    this.removeButtonFocus();
    if (this.showColor()) {
      this.setColorInColorPicker(poRichTextDefaultColor);
    }
  }

  changeTextColor(value) {
    const command = 'foreColor';

    this.command.emit({ command, value });
  }

  emitLinkEditing(isLinkEdit: boolean) {
    this.linkEditing.emit(isLinkEdit);
  }

  selectedLink(selectedLinkElement) {
    this.selectedLinkElement = selectedLinkElement;
  }

  setButtonsStates(obj: { commands: Array<string>; hexColor: string }) {
    if (!this.readonly) {
      this.alignButtons.forEach(button => (button.selected = obj.commands.includes(button.command)));
      this.formatButtons.forEach(button => (button.selected = obj.commands.includes(button.command)));
      this.listButtons[0].selected = obj.commands.includes(this.listButtons[0].command);
      this.linkButtons[0].selected = obj.commands.includes(this.linkButtons[0].command);
      this.setColorInColorPicker(obj.hexColor);
    }
  }

  // Verifica se uma ação específica do toolbar está oculta
  isActionHidden(action: PoRichTextToolbarActions): boolean {
    return this.hideToolbarActions.includes(action);
  }

  showColor(): boolean {
    return !this.isInternetExplorer && !this.isActionHidden(PoRichTextToolbarActions.Color);
  }

  shortcutTrigger() {
    this.richTextLinkModal.openModal(this.selectedLinkElement);
  }

  emitCommand(command: string) {
    this.command.emit(command);
  }

  private emitAlignCommand(command: string) {
    const index = this.alignButtons.findIndex(btn => btn.command === command);

    if (!this.alignButtons[index].selected) {
      this.alignButtons[index].selected = false;
    }

    this.command.emit(command);
  }

  private removeButtonFocus() {
    const buttons = this.toolbarElement.nativeElement.querySelectorAll('button');

    buttons.forEach(button => button.setAttribute('tabindex', '-1'));
  }

  private setColorInColorPicker(color: string): void {
    this.colorPickerInput.nativeElement.value = color;
  }

  private toggleDisableButtons(state: boolean) {
    this.alignButtons.forEach(button => (button.disabled = state));
    this.formatButtons.forEach(button => (button.disabled = state));
    this.listButtons[0].disabled = state;
    this.linkButtons[0].disabled = state;
    this.mediaButtons[0].disabled = state;
  }
}
