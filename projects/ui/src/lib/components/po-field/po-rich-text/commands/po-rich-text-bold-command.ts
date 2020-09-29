import { PoRichTextCommand } from './po-rich-text-command.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class PoRichTextBoldCommand implements PoRichTextCommand {
  document;

  execute(element) {
    this.document = element;

    console.log('executou o bold');

    this.document.execCommand('bold');
  }
}
