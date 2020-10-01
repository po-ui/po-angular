import { isFirefox, isIE, isIEOrEdge, openExternalLink } from '../../../../utils/util';
import { Injectable } from '@angular/core';

Injectable();
export class PoRichTextLinkCommand {
  document;
  // depois tenho que ver como resolver esta parte
  isLinkEditing = false;

  execute(element, data) {
    this.document = element;
    const { command, link, value } = data;

    console.log('execute linkCommand: ', element, data);
    this.handleCommandLink(command, link, value);
  }

  private handleCommandLink(linkCommand: string, urlLink: string, urlLinkText: string) {
    if (isIE()) {
      this.insertHtmlLinkElement(urlLink, urlLinkText);
    } else {
      // '&nbsp;' necessário para o cursor não ficar preso dentro do link no Firefox.
      const linkValue =
        isFirefox() && !this.isLinkEditing
          ? `&nbsp;${this.makeLinkTag(urlLink, urlLinkText)}&nbsp;`
          : this.makeLinkTag(urlLink, urlLinkText);

      this.document.execCommand(linkCommand, false, linkValue);
    }

    // this.addClickListenerOnAnchorElements();
  }

  private makeLinkTag(urlLink: string, urlLinkText: string) {
    return `<a class="po-rich-text-link" href="${urlLink}" target="_blank">${urlLinkText || urlLink}</a>`;
  }

  // tratamento específico para IE pois não suporta o comando 'insertHTML'.
  private insertHtmlLinkElement(urlLink: string, urlLinkText: string) {
    const selection = this.document.getSelection();
    const selectionRange = selection.getRangeAt(0);
    const elementLink = this.document.createElement('a');
    const elementlinkText = this.document.createTextNode(urlLinkText);

    elementLink.appendChild(elementlinkText);
    elementLink.href = urlLink;
    elementLink.setAttribute('target', '_blank');
    elementLink.classList.add('po-rich-text-link');

    selectionRange.deleteContents();
    selectionRange.insertNode(elementLink);

    // criar a tag utilizando o renderer do angular
  }
}
