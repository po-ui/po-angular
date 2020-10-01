import { Injectable } from '@angular/core';

import { Subject, fromEvent } from 'rxjs';

import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoRichTextCommand } from './enums/po-rich-text-command.enum';

@Injectable()
export class PoRichTextShortcuts {
  emit = new Subject();

  constructor() {}

  verify(event) {
    if (this.isLinkKey(event)) {
      event.preventDefault();
      this.emitShortcuts(PoRichTextCommand.Createlink);
    }

    if (this.isImageKey(event)) {
      this.emitShortcuts(PoRichTextCommand.image);
    }
  }

  emitShortcuts(action) {
    this.emit.next(action);
  }

  listenerShortcuts(element) {
    fromEvent(element, 'keydown').subscribe(event => this.verify(event));
    console.log('elemento:', element);
    return this.emit.asObservable();
  }

  isLinkKey(event) {
    const keyK = event.keyCode === PoKeyCodeEnum.keyK;
    return (keyK && event.ctrlKey) || (keyK && event.metaKey);
  }

  isImageKey(event) {
    const keyI = event.keyCode === PoKeyCodeEnum.keyI;
    return (keyI && event.ctrlKey) || (keyI && event.metaKey);
  }
}
