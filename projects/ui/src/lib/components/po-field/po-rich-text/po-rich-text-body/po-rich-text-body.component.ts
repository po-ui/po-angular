import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { isFirefox, isIE, isIEOrEdge, openExternalLink } from './../../../../utils/util';
import { PoKeyCodeEnum } from './../../../../enums/po-key-code.enum';
import { PoRichTextService } from '../po-rich-text.service';
import { PoRichTextLinkCommand } from '../commands/po-rich-text-link-command';

const poRichTextBodyCommands = [
  'bold',
  'italic',
  'underline',
  'justifyleft',
  'justifycenter',
  'justifyright',
  'justifyfull',
  'insertUnorderedList',
  'Createlink'
];

@Component({
  selector: 'po-rich-text-body',
  templateUrl: './po-rich-text-body.component.html',
  providers: [PoRichTextLinkCommand]
})
export class PoRichTextBodyComponent implements OnInit, OnDestroy {
  private isLinkEditing: boolean;
  private linkElement: any;
  private timeoutChange: any;
  private valueBeforeChange: any;
  private modelSubscription: Subscription;

  @ViewChild('bodyElement', { static: true }) bodyElement: ElementRef;

  @Input('p-height') height?: string;

  @Input('p-model-value') modelValue?: string;

  @Input('p-placeholder') placeholder?: string;

  @Input('p-readonly') readonly?: string;

  @Output('p-change') change = new EventEmitter<any>();

  @Output('p-commands') commands = new EventEmitter<any>();

  @Output('p-selected-link') selectedLink = new EventEmitter<any>();

  @Output('p-shortcut-command') shortcutCommand = new EventEmitter<any>();

  @Output('p-value') value = new EventEmitter<any>();

  constructor(private richTextService: PoRichTextService, private richTextLinkCommand: PoRichTextLinkCommand) {}

  ngOnInit() {
    this.bodyElement.nativeElement.designMode = 'on';

    this.modelSubscription = this.richTextService.getModel().subscribe(modelValue => {
      this.modelValue = modelValue;
      console.log('ngOnInit muda o modelValue: ', modelValue);
      this.bodyElement.nativeElement.innerHTML = '';
      this.updateValueWithModelValue();
      this.addClickListenerOnAnchorElements();
    });
  }

  ngOnDestroy() {
    this.modelSubscription?.unsubscribe();
  }

  executeCommand(command: string | { command: any; value: string | any }) {
    this.bodyElement.nativeElement.focus();
    console.log('executeCommand: ', command);

    if (typeof command === 'object') {
      if (command.command === 'InsertHTML') {
        const {
          command: linkCommand,
          value: { urlLink },
          value: { urlLinkText }
        } = command;

        this.richTextLinkCommand.execute(document, { command: linkCommand, link: urlLink, value: urlLinkText });
      } else {
        document.execCommand(command.command, false, command.value);
      }
    } else {
      document.execCommand(command, false, null);
    }

    this.updateModel();
    // this.value.emit(this.modelValue);
  }

  linkEditing(event) {
    this.isLinkEditing = !!event;
  }

  onBlur() {
    if (this.modelValue !== this.valueBeforeChange) {
      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.change.emit(this.modelValue);
      }, 200);
    }
  }

  focus(): void {
    this.bodyElement.nativeElement.focus();
  }

  onClick() {
    this.emitSelectionCommands();
  }

  onFocus() {
    this.valueBeforeChange = this.modelValue;
  }

  onKeyDown(event) {
    const keyK = event.keyCode === PoKeyCodeEnum.keyK;
    const isLinkShortcut = (keyK && event.ctrlKey) || (keyK && event.metaKey);

    if (isLinkShortcut) {
      event.preventDefault();
      this.shortcutCommand.emit();
    }

    this.toggleCursorOnLink(event, 'add');
  }

  onKeyUp(event: any) {
    this.toggleCursorOnLink(event, 'remove');

    this.removeBrElement();
    this.updateModel();
    this.emitSelectionCommands();
  }

  onPaste() {
    this.update();
    setTimeout(() => this.addClickListenerOnAnchorElements());
  }

  update() {
    setTimeout(() => this.updateModel());

    setTimeout(() => {
      this.removeBrElement();
      this.updateModel();
      this.emitSelectionCommands();
    });
  }

  private addClickListenerOnAnchorElements() {
    this.bodyElement.nativeElement.querySelectorAll('a').forEach(element => {
      element.addEventListener('click', this.onAnchorClick);
    });
  }

  private emitSelectionCommands() {
    const commands = poRichTextBodyCommands.filter(command => document.queryCommandState(command));
    const rgbColor = document.queryCommandValue('ForeColor');

    let hexColor;
    if (!isIE()) {
      hexColor = this.rgbToHex(rgbColor);
    }

    if (this.isCursorPositionedInALink()) {
      commands.push('Createlink');
    }

    this.selectedLink.emit(this.linkElement); // importante ficar fora do if para emitir mesmo undefined.
    this.commands.emit({ commands, hexColor });
  }

  private getTextSelection() {
    const textSelection = document.getSelection();
    if (!textSelection) {
      return;
    }
    const focusNode = textSelection.focusNode ? textSelection.focusNode.parentElement : undefined;
    const anchorNode = textSelection.anchorNode ? textSelection.anchorNode.parentNode : undefined;
    const node = focusNode || anchorNode;
    let tagName;

    if (node) {
      tagName = node['tagName'] || node['nodeName'];
      return {
        node,
        tagName
      };
    }
  }

  private isCursorPositionedInALink(): boolean {
    const textSelection = this.getTextSelection();
    this.linkElement = undefined;

    let isLink = false;

    if (textSelection && textSelection.node && textSelection.tagName === 'A') {
      this.linkElement = textSelection.node;
      isLink = true;
    } else if ((isFirefox() || isIEOrEdge()) && this.verifyCursorPositionInFirefoxIEEdge()) {
      isLink = true;
    } else {
      isLink = textSelection ? this.isParentNodeAnchor(textSelection) : false;
    }
    return isLink;
  }

  private isParentNodeAnchor(textSelection): boolean {
    let element = textSelection.node;
    let isLink = false;

    while (element && (element.tagName !== null || element.nodeName !== null)) {
      if (element.tagName === 'A' || element.nodeName === 'A') {
        this.linkElement = element;
        isLink = true;
        return isLink;
      }
      element = element.parentElement || element.parentNode;
    }

    this.linkElement = undefined;
    return isLink;
  }

  private onAnchorClick = event => {
    const { target, ctrlKey, metaKey } = event;
    let url;
    let elementLink;

    if (ctrlKey || metaKey) {
      if (event.path) {
        event.path.forEach(element => {
          if (element.nodeName === 'A') {
            url = element.href;
            elementLink = element;
          }
        });
      } else {
        url = target.attributes.href.value;
        elementLink = target;
      }
      openExternalLink(url);
      elementLink.classList.remove('po-clickable');
    }
  };

  // Tratamento necessário para eliminar a tag <br> criada no firefox quando o body for limpo.
  private removeBrElement() {
    const bodyElement = this.bodyElement.nativeElement;

    if (!bodyElement.innerText.trim() && bodyElement.childNodes.length === 1 && bodyElement.querySelector('br')) {
      bodyElement.querySelector('br').remove();
    }
  }

  private rgbToHex(rgb) {
    // Tratamento necessário para converter o código rgb para hexadecimal.
    const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);

    let r = (+rgb[0]).toString(16);
    let g = (+rgb[1]).toString(16);
    let b = (+rgb[2]).toString(16);

    if (r.length === 1) {
      r = '0' + r;
    }
    if (g.length === 1) {
      g = '0' + g;
    }
    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  private toggleCursorOnLink(event: any, action: 'add' | 'remove') {
    const selection = document.getSelection();
    const element = selection.focusNode ? selection.focusNode.parentNode : undefined;
    const isCtrl = event.key === 'Control';
    const isCommand = event.key === 'Meta';
    const isOnCtrlLink = this.isCursorPositionedInALink() && (isCtrl || isCommand);

    if (element) {
      if (isOnCtrlLink) {
        element['classList'][action]('po-clickable');
      } else {
        const isClickable = element['classList'] && element['classList'].contains('po-clickable');

        if (isClickable) {
          element['classList'].remove('po-clickable');
        }
      }
      this.updateModel();
    }
  }

  private updateModel() {
    this.modelValue = this.bodyElement.nativeElement.innerHTML;

    this.value.emit(this.modelValue);
  }

  private updateValueWithModelValue() {
    if (this.modelValue) {
      this.bodyElement.nativeElement.insertAdjacentHTML('afterbegin', this.modelValue);
    }
  }

  private verifyCursorPositionInFirefoxIEEdge(): boolean {
    const textSelection = document.getSelection();
    const nodeLink = textSelection.focusNode;
    let isLink = false;

    if (nodeLink && nodeLink.nodeName === 'A') {
      this.linkElement = nodeLink;
      isLink = true;
    } else {
      const range = textSelection.getRangeAt(0);
      const fragmentDocument = range.cloneContents();
      const element = fragmentDocument.childNodes[0] || fragmentDocument.firstElementChild;

      this.linkElement = element && element.nodeName === 'A' ? element : undefined;
      isLink = !!this.linkElement;
    }

    return isLink;
  }
}
