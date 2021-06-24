import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { isIEOrEdge } from '../../../utils/util';

import { PoSlideContentTemplateDirective } from '../directives/po-slide-content-template.directive';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para cada item do po-slide.
 */
@Component({
  selector: 'po-slide-item',
  templateUrl: './po-slide-item.component.html'
})
export class PoSlideItemComponent {
  @ViewChild('slideItem', { static: true }) itemElement: ElementRef;

  /** Ação executada ao clicar em uma imagem */
  @Input('p-action') action: Function;

  /** Texto alternativo quando a imagem não é encontrada */
  @Input('p-alt') alt: string;

  /** Dados para o template customizado */
  @Input('p-data') data: Array<any>;

  /** Caminho da imagem */
  @Input('p-image') image: string;

  /** Altura da imagem */
  @Input('p-image-height') imageHeight: number;

  /** Template customizado */
  @Input('p-template') template: PoSlideContentTemplateDirective;

  /** Link executado ao clicar em uma imagem */
  @Input('p-link') link: string;

  isIEOrEdge: any = isIEOrEdge();

  setLinkType() {
    if (!this.template && this.link) {
      return this.link.startsWith('http') ? 'externalLink' : 'internalLink';
    }

    return 'noLink';
  }
}
