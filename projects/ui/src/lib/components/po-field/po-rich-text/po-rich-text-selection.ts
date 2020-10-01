import { Injectable } from '@angular/core';

@Injectable()
export class PoRichTextSelection {
  // getTextSelection(element) {
  //   const textSelection = element.getSelection();
  //   if (!textSelection) {
  //     return;
  //   }
  //   const focusNode = textSelection.focusNode ? textSelection.focusNode.parentElement : undefined;
  //   const anchorNode = textSelection.anchorNode ? textSelection.anchorNode.parentNode : undefined;
  //   const node = focusNode || anchorNode;
  //   let tagName;
  //   if (node) {
  //     tagName = node['tagName'] || node['nodeName'];
  //     return {
  //       node,
  //       tagName
  //     };
  //   }
  // }
  // private whereCursorIsPositioned() {
  //   // implementar aqui para saber onde o cursor está posionado, e retornar se é um link, ou uma tag de bold, etc...
  // }
  // private isCursorPositionedInALink(): boolean {
  //   const textSelection = this.selection.getTextSelection(document);
  //   this.linkElement = undefined;
  //   let isLink = false;
  //   if (textSelection && textSelection.node && textSelection.tagName === 'A') {
  //     this.linkElement = textSelection.node;
  //     isLink = true;
  //   } else if ((isFirefox() || isIEOrEdge()) && this.verifyCursorPositionInFirefoxIEEdge()) {
  //     isLink = true;
  //   } else {
  //     isLink = textSelection ? this.isParentNodeAnchor(textSelection) : false;
  //   }
  //   return isLink;
  // }
  // private isParentNodeAnchor(textSelection): boolean {
  //   let element = textSelection.node;
  //   let isLink = false;
  //   while (element && (element.tagName !== null || element.nodeName !== null)) {
  //     if (element.tagName === 'A' || element.nodeName === 'A') {
  //       this.linkElement = element;
  //       isLink = true;
  //       return isLink;
  //     }
  //     element = element.parentElement || element.parentNode;
  //   }
  //   this.linkElement = undefined;
  //   return isLink;
  // }
  // private verifyCursorPositionInFirefoxIEEdge(): boolean {
  //   const textSelection = document.getSelection();
  //   const nodeLink = textSelection.focusNode;
  //   let isLink = false;
  //   if (nodeLink && nodeLink.nodeName === 'A') {
  //     this.linkElement = nodeLink;
  //     isLink = true;
  //   } else {
  //     const range = textSelection.getRangeAt(0);
  //     const fragmentDocument = range.cloneContents();
  //     const element = fragmentDocument.childNodes[0] || fragmentDocument.firstElementChild;
  //     this.linkElement = element && element.nodeName === 'A' ? element : undefined;
  //     isLink = !!this.linkElement;
  //   }
  //   return isLink;
  // }
}
