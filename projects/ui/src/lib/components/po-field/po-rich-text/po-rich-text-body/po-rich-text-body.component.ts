import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { Subscription } from 'rxjs';

import { PoRichTextService } from '../po-rich-text.service';
import { PoKeyCodeEnum } from './../../../../enums/po-key-code.enum';
import { mapInputSizeToLoadingIcon, PoUtils } from './../../../../utils/util';

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
  standalone: false
})
export class PoRichTextBodyComponent implements OnInit, OnDestroy, OnChanges {
  private richTextService = inject(PoRichTextService);
  private readonly cd = inject(ChangeDetectorRef);

  @ViewChild('bodyElement', { static: true }) bodyElement: ElementRef;

  @Input('p-height') height?: string;

  @Input('p-label') label: string;

  @Input('p-model-value') modelValue?: string;

  @Input('p-placeholder') placeholder?: string;

  @Input('p-readonly') readonly?: string;

  @Input('p-disabled') disabled?: boolean;

  @Input('p-loading') loading?: boolean;

  @Output('p-change') change = new EventEmitter<any>();

  @Output('p-commands') commands = new EventEmitter<any>();

  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @Output('p-selected-link') selectedLink = new EventEmitter<any>();

  @Input('p-size') size: string;

  @Output('p-shortcut-command') shortcutCommand = new EventEmitter<any>();

  @Output('p-value') value = new EventEmitter<any>();

  @Output('p-blur') blur = new EventEmitter<any>();

  private isLinkEditing: boolean;
  private linkElement: any;
  private timeoutChange: any;
  private valueBeforeChange: any;
  private modelSubscription: Subscription;
  private resizeObserver: ResizeObserver;
  hasScroll: boolean = false;
  hasValue: boolean = false;

  @HostListener('window:resize')
  onWindowResize() {
    this.checkScrollState();
  }

  ngOnInit() {
    this.bodyElement.nativeElement.designMode = 'on';

    this.modelSubscription = this.richTextService.getModel().subscribe(modelValue => {
      this.modelValue = modelValue;
      this.bodyElement.nativeElement.innerHTML = '';
      this.updateValueWithModelValue();
      this.addClickListenerOnAnchorElements();

      this.updateHasValue();
      this.checkScrollState();
    });

    this.initResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      setTimeout(() => this.checkScrollState());
    }
  }

  ngOnDestroy() {
    this.modelSubscription?.unsubscribe();
    this.resizeObserver?.disconnect();
  }

  executeCommand(command: string | { command: any; value: string | any }) {
    this.bodyElement.nativeElement.focus();

    if (typeof command === 'object') {
      if (command.command === 'InsertHTML') {
        const {
          command: linkCommand,
          value: { urlLink },
          value: { urlLinkText }
        } = command;

        this.handleCommandLink(linkCommand, urlLink, urlLinkText);
      } else {
        document.execCommand(command.command, false, command.value);
      }
    } else {
      document.execCommand(command, false, null);
    }

    this.updateModel();
    this.value.emit(this.modelValue);
  }

  linkEditing(event) {
    this.isLinkEditing = !!event;
  }

  onBlur() {
    this.blur.emit();
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
    const isFieldFocused = document.activeElement === this.bodyElement.nativeElement;

    if (isLinkShortcut) {
      event.preventDefault();
      this.shortcutCommand.emit();
    }

    this.toggleCursorOnLink(event, 'add');

    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  onKeyUp(event: any) {
    this.toggleCursorOnLink(event, 'remove');

    this.removeBrElement();
    this.updateModel();
    this.emitSelectionCommands();

    this.updateHasValue();
    this.checkScrollState();
  }

  onPaste() {
    this.update();
    setTimeout(() => {
      this.addClickListenerOnAnchorElements();

      this.updateHasValue();
      this.checkScrollState();
    });
  }

  update() {
    setTimeout(() => this.updateModel());

    setTimeout(() => {
      this.removeBrElement();
      this.updateModel();
      this.emitSelectionCommands();

      this.updateHasValue();
      this.checkScrollState();
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
    if (!PoUtils.isIE()) {
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

  private handleCommandLink(linkCommand: string, urlLink: string, urlLinkText: string) {
    if (PoUtils.isIE()) {
      this.insertHtmlLinkElement(urlLink, urlLinkText);
    } else {
      // '&nbsp;' necessário para o cursor não ficar preso dentro do link no Firefox.
      const linkValue =
        PoUtils.isFirefox() && !this.isLinkEditing
          ? `&nbsp;${this.makeLinkTag(urlLink, urlLinkText)}&nbsp;`
          : this.makeLinkTag(urlLink, urlLinkText);

      document.execCommand(linkCommand, false, linkValue);
    }

    this.addClickListenerOnAnchorElements();
  }

  // tratamento específico para IE pois não suporta o comando 'insertHTML'.
  private insertHtmlLinkElement(urlLink: string, urlLinkText: string) {
    const selection = document.getSelection();
    const selectionRange = selection.getRangeAt(0);
    const elementLink = document.createElement('a');
    const elementlinkText = document.createTextNode(urlLinkText);

    elementLink.appendChild(elementlinkText);
    elementLink.href = urlLink;
    elementLink.setAttribute('target', '_blank');
    elementLink.classList.add('po-rich-text-link');

    selectionRange.deleteContents();
    selectionRange.insertNode(elementLink);
  }

  private isCursorPositionedInALink(): boolean {
    const textSelection = this.getTextSelection();
    this.linkElement = undefined;

    let isLink = false;

    if (textSelection && textSelection.node && textSelection.tagName === 'A') {
      this.linkElement = textSelection.node;
      isLink = true;
    } else if ((PoUtils.isFirefox() || PoUtils.isIEOrEdge()) && this.verifyCursorPositionInFirefoxIEEdge()) {
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

  private makeLinkTag(urlLink: string, urlLinkText: string) {
    return `<a class="po-rich-text-link" href="${urlLink}" target="_blank">${urlLinkText || urlLink}</a>`;
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
      PoUtils.openExternalLink(url);
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

  //Transforma o tamanho do input para o tamanho do ícone de loading correspondente
  mapSizeToIcon(size: string): string {
    return mapInputSizeToLoadingIcon(size);
  }

  private get bodyEl(): HTMLElement {
    return this.bodyElement?.nativeElement;
  }

  private updateHasValue(): void {
    const text = this.bodyEl?.innerText?.trim();
    this.hasValue = !!text;
  }

  private checkScrollState(): void {
    const el = this.bodyEl;
    if (!el) return;

    this.hasScroll = el.scrollHeight > el.clientHeight;
    this.cd.markForCheck();
  }

  private initResizeObserver(): void {
    const el = this.bodyEl;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.checkScrollState();
    });

    this.resizeObserver.observe(el);
  }
}
