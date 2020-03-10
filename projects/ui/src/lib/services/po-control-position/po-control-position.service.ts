import { ElementRef, Injectable } from '@angular/core';

/**
 * @docsPrivate
 * @description
 *
 * Serviço responsável por gerenciar as posições de um elemento em relação a um elemento alvo. Ele pode receber as
 * seguintes posições:
 *
 * - `right`: Posiciona o elemento no lado direito do componente alvo.
 * - `right-bottom`: Posiciona o elemento no lado direito inferior do componente alvo.
 * - `right-top`: Posiciona o elemento no lado direito superior do componente alvo.
 * - `bottom`: Posiciona o elemento abaixo do componente alvo.
 * - `bottom-left`: Posiciona o elemento abaixo e à esquerda do componente alvo.
 * - `bottom-right`: Posiciona o elemento abaixo e à direita do componente alvo.
 * - `left`: Posiciona o elemento no lado esquerdo do componente alvo.
 * - `left-top`: Posiciona o elemento no lado esquerdo superior do componente alvo.
 * - `left-bottom`: Posiciona o elemento no lado esquerdo inferior do componente alvo.
 * - `top`: Posiciona o elemento acima do componente alvo.
 * - `top-right`: Posiciona o elemento acima e à direita do componente alvo.
 * - `top-left`: Posiciona o elemento acima e à esquerda do componente alvo.
 *
 * Caso o elemento não caiba na tela na posição indicada ele será rotacionado automaticamente para se adequar,
 * inicialmente no lado definido como padrão e em seguida seguindo o sentido horário.
 */

const poControlPositionSidesDefault: Array<string> = [
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'left-top',
  'left-bottom',
  'top',
  'top-right',
  'top-left',
  'right',
  'right-bottom',
  'right-top'
];

@Injectable()
export class PoControlPositionService {
  private arrowDirection: string;
  private customPositions: Array<string>;
  private differenceDiagonalToWidthArrow: number = 3;
  private element: HTMLElement;
  private elementOffset: number;
  private isCornerAligned: boolean;
  private isSetElementWidth: boolean = false;
  // offset da seta em relação ao canto do componente
  private offsetArrow: number = 12;
  private targetElement: HTMLElement;

  /**
   * @description Ajusta a posição do elemento, caso não couber em tela irá para próxima posição.
   *
   * @param value posição para exibição do elemento
   */
  adjustPosition(value: string) {
    const position = value || 'bottom';
    this.elementPosition(position);
    this.customPositions && this.customPositions.length
      ? this.adjustCustomPosition(position)
      : this.adjustDefaultPosition(position);
  }

  /**
   * @description Retorna a direção da seta, conforme a posição do elemento.
   */
  getArrowDirection() {
    return this.arrowDirection;
  }

  /**
   * @description Método responsável por definir as propriedades utilizadas para exibir o elemento na posição correta.
   *
   * @param element elemento que será exibido
   * @param elementOffset offSet do elemento
   * @param targetElement elemento de onde deve partir a exibição
   * @param customPositions posições que sobrescreve as posições padrões
   * @param isSetElementWidth indica se deve definir o tamanho do elemento a ser exibido, caso for verdadeiro será igual do targetElement
   * @param isCornerAligned indica se o elemento filho será alinhado nos cantos do elemneto pai.
   */
  setElements(
    element: ElementRef | HTMLElement,
    elementOffset: number,
    targetElement: ElementRef | HTMLElement,
    customPositions?: Array<string>,
    isSetElementWidth: boolean = false,
    isCornerAligned: boolean = false
  ) {
    this.element = element instanceof ElementRef ? element.nativeElement : element;
    this.targetElement = targetElement instanceof ElementRef ? targetElement.nativeElement : targetElement;

    this.elementOffset = elementOffset;

    this.customPositions = customPositions;
    this.isSetElementWidth = isSetElementWidth;
    this.isCornerAligned = isCornerAligned;
  }

  private adjustCustomPosition(position: string) {
    const positionLength = this.customPositions.length;

    let sidesCount = 0;

    while (sidesCount++ < positionLength) {
      if (this.overflowAllSides(position)) {
        position = this.nextPosition(position, this.customPositions);
        this.elementPosition(position);
      }
    }
  }

  private adjustDefaultPosition(position: string) {
    const mainPositions = this.getMainPositions();
    const mainPositionLength = mainPositions.length;

    let mainSidesCount = 0;

    while (mainSidesCount++ < mainPositionLength) {
      const mainPosition = this.getMainPosition(position);
      this.elementPosition(position);

      if (this.overflowMain(mainPosition)) {
        position = this.nextPosition(mainPosition, mainPositions);
        continue;
      } else if (this.overflowAllSides(position)) {
        this.verifySubPositions(position);
        return;
      }

      return;
    }
  }

  private elementPosition(position: string) {
    this.isCornerAligned ? this.setAlignedElementPosition(position) : this.setElementPosition(position);
  }

  private getMainPosition(position: string) {
    return position.indexOf('-') > -1 ? position.substring(0, position.indexOf('-')) : position;
  }

  private getMainPositions() {
    const defaultMainPositions = ['top', 'right', 'bottom', 'left'];

    return this.customPositions && this.customPositions.length
      ? this.getMainPositionsByCustomPositions(this.customPositions)
      : defaultMainPositions;
  }

  private getMainPositionsByCustomPositions(customPositions: Array<string>) {
    const mainPositions = [];
    const customPositionsLength = customPositions.length;

    for (let i = 0; i < customPositionsLength; i++) {
      const position = customPositions[i];

      const mainPosition = this.getMainPosition(position);

      if (!mainPositions.includes(mainPosition)) {
        mainPositions.push(mainPosition);
      }
    }

    return mainPositions;
  }

  private getOverflows() {
    const sizesAndPositions = this.getSizesAndPositions();

    return {
      right: sizesAndPositions.element.right > sizesAndPositions.window.innerWidth,
      top: sizesAndPositions.element.top <= 0,
      left: sizesAndPositions.element.left <= 0,
      bottom: sizesAndPositions.element.bottom > sizesAndPositions.window.innerHeight
    };
  }

  private getSizesAndPositions() {
    return {
      window: {
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      },
      element: this.element.getBoundingClientRect(),
      target: this.targetElement ? this.targetElement.getBoundingClientRect() : { top: 0, bottom: 0, right: 0, left: 0 }
    };
  }

  private nextPosition(position: string, positions: Array<string> = []): string {
    const index = positions.indexOf(position);
    const nextIndex = index + 1;

    if (index > -1 && nextIndex < positions.length) {
      return positions[nextIndex];
    } else {
      return positions[0];
    }
  }

  private overflowAllSides(position: string) {
    const overflows = this.getOverflows();

    switch (position) {
      case 'top':
        return overflows.top || overflows.right || overflows.left;
      case 'top-right':
        return overflows.top || overflows.right;
      case 'top-left':
        return overflows.top || overflows.left;
      case 'right':
        return overflows.right || overflows.top || overflows.bottom;
      case 'right-top':
        return overflows.right || overflows.top;
      case 'right-bottom':
        return overflows.right || overflows.bottom;
      case 'bottom':
        return overflows.bottom || overflows.right || overflows.left;
      case 'bottom-right':
        return overflows.bottom || overflows.right;
      case 'bottom-left':
        return overflows.bottom || overflows.left;
      case 'left':
        return overflows.left || overflows.top || overflows.bottom;
      case 'left-top':
        return overflows.left || overflows.top;
      case 'left-bottom':
        return overflows.left || overflows.bottom;
    }
  }

  private overflowMain(position: string) {
    const overflows = this.getOverflows();

    switch (position) {
      case 'top':
        return overflows.top;
      case 'right':
        return overflows.right;
      case 'bottom':
        return overflows.bottom;
      case 'left':
        return overflows.left;
    }
  }

  private setAlignedArrowDirection(elementPosition: string) {
    switch (elementPosition) {
      case 'top-left':
        return 'bottom-left';
      case 'top-right':
        return 'bottom-right';
      case 'bottom-right':
        return 'top-right';
      case 'bottom-left':
        return 'top-left';
    }
  }

  private setAlignedBottomPositions(displacement: number, sizesAndPositions) {
    this.element.style.top = sizesAndPositions.target.bottom + this.elementOffset + 'px';
    this.element.style.left = sizesAndPositions.target.left - displacement + 'px';
  }

  private setAlignedElementPosition(position: string) {
    this.setElementWidth();

    const sizesAndPositions: any = this.getSizesAndPositions();

    switch (position) {
      case 'bottom-left':
        this.setAlignedBottomPositions(0, sizesAndPositions);
        break;
      case 'bottom-right':
        this.setAlignedBottomPositions(
          sizesAndPositions.element.width - sizesAndPositions.target.width,
          sizesAndPositions
        );
        break;
      case 'top-left':
        this.setAlignedTopPositions(0, sizesAndPositions);
        break;
      case 'top-right':
        this.setAlignedTopPositions(
          sizesAndPositions.element.width - sizesAndPositions.target.width,
          sizesAndPositions
        );
        break;
    }

    this.arrowDirection = this.setAlignedArrowDirection(position);
  }

  private setAlignedTopPositions(displacement: number, sizesAndPositions) {
    this.element.style.top =
      sizesAndPositions.target.top - sizesAndPositions.element.height - this.elementOffset + 'px';
    this.element.style.left = sizesAndPositions.target.left - displacement + 'px';
  }

  private setArrowDirection(elementPosition: string) {
    switch (elementPosition) {
      case 'top':
        return 'bottom';
      case 'top-left':
        return 'bottom-right';
      case 'top-right':
        return 'bottom-left';
      case 'right':
        return 'left';
      case 'right-top':
        return 'left-bottom';
      case 'right-bottom':
        return 'left-top';
      case 'bottom':
        return 'top';
      case 'bottom-right':
        return 'top-left';
      case 'bottom-left':
        return 'top-right';
      case 'left':
        return 'right';
      case 'left-bottom':
        return 'right-top';
      case 'left-top':
        return 'right-bottom';
    }
  }

  private setBottomPositions(displacement: number, sizesAndPositions) {
    this.element.style.top = sizesAndPositions.target.bottom + this.elementOffset + 'px';
    this.element.style.left = sizesAndPositions.target.left + sizesAndPositions.target.width / 2 - displacement + 'px';
  }

  private setElementPosition(position: string) {
    this.setElementWidth();

    const sizesAndPositions = this.getSizesAndPositions();

    switch (position) {
      case 'top':
        this.setTopPositions(sizesAndPositions.element.width / 2, sizesAndPositions);
        break;
      case 'top-left':
        this.setTopPositions(
          sizesAndPositions.element.width - this.offsetArrow - this.differenceDiagonalToWidthArrow,
          sizesAndPositions
        );
        break;
      case 'top-right':
        this.setTopPositions(this.offsetArrow + this.differenceDiagonalToWidthArrow, sizesAndPositions);
        break;
      case 'right':
        this.setRightPositions(sizesAndPositions.element.height / 2, sizesAndPositions);
        break;
      case 'right-top':
        this.setRightPositions(
          sizesAndPositions.element.height - this.offsetArrow - this.differenceDiagonalToWidthArrow,
          sizesAndPositions
        );
        break;
      case 'right-bottom':
        this.setRightPositions(this.offsetArrow, sizesAndPositions);
        break;
      case 'bottom':
        this.setBottomPositions(sizesAndPositions.element.width / 2, sizesAndPositions);
        break;
      case 'bottom-right':
        this.setBottomPositions(this.offsetArrow + this.differenceDiagonalToWidthArrow, sizesAndPositions);
        break;
      case 'bottom-left':
        this.setBottomPositions(
          sizesAndPositions.element.width - this.offsetArrow - this.differenceDiagonalToWidthArrow,
          sizesAndPositions
        );
        break;
      case 'left':
        this.setLeftPositions(sizesAndPositions.element.height / 2, sizesAndPositions);
        break;
      case 'left-bottom':
        this.setLeftPositions(this.offsetArrow, sizesAndPositions);
        break;
      case 'left-top':
        this.setLeftPositions(sizesAndPositions.element.height - this.offsetArrow, sizesAndPositions);
        break;
    }

    this.arrowDirection = this.setArrowDirection(position);
  }

  private setElementWidth() {
    if (this.isSetElementWidth && this.targetElement) {
      this.element.style.width = `${this.targetElement.clientWidth}px`;
    }
  }

  private setLeftPositions(displacement: number, sizesAndPositions) {
    this.element.style.top = sizesAndPositions.target.top - displacement + sizesAndPositions.target.height / 2 + 'px';
    this.element.style.left =
      sizesAndPositions.target.left - sizesAndPositions.element.width - this.elementOffset + 'px';
  }

  private setRightPositions(displacement: number, sizesAndPositions) {
    this.element.style.top = sizesAndPositions.target.top - displacement + sizesAndPositions.target.height / 2 + 'px';
    this.element.style.left = sizesAndPositions.target.right + this.elementOffset + 'px';
  }

  private setTopPositions(displacement: number, sizesAndPositions) {
    this.element.style.top =
      sizesAndPositions.target.top - sizesAndPositions.element.height - this.elementOffset + 'px';
    this.element.style.left = sizesAndPositions.target.left + sizesAndPositions.target.width / 2 - displacement + 'px';
  }

  private verifySubPositions(position: string) {
    if (position.indexOf('-') > -1) {
      position = position.substring(0, position.indexOf('-'));
      this.elementPosition(position);
    }

    let align = 0;
    while (align++ < 3) {
      if (this.overflowAllSides(position)) {
        position = this.nextPosition(position, poControlPositionSidesDefault);
        this.elementPosition(position);
      } else {
        return null;
      }
    }
  }
}
