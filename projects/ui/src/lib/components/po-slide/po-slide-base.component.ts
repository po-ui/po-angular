import { Input, Directive } from '@angular/core';

import { InputBoolean } from '../../decorators';
import { convertToInt } from './../../utils/util';

import { PoSlideItem } from './interfaces/po-slide-item.interface';

const poSlideIntervalDefault = 4000;

/**
 * @description
 *
 * Componente de slide para visualização e controle de elementos de forma cíclica. Exibe um conjunto de imagens ou dados que permitem
 * customizar sua visualização utilizando a diretiva **[p-slide-content-template](/documentation/po-slide-content-template)**.
 *
 * #### Boas práticas:
 * - Utilizar imagens no slide, mesmo quando possui conteúdo personalizado.
 * - Evitar utilizar apenas um slide isolado, utilize pelo menos dois.
 * - Evitar utilizar mais de 5 slides, pois a ideia do componente é destacar apenas informações importantes.
 */
@Directive()
export abstract class PoSlideBaseComponent {
  private _interval: number = poSlideIntervalDefault;
  private _height?: number;
  private _slides: Array<PoSlideItem | string | any>;

  /**
   * @optional
   *
   * @description
   * Altura do po-slide, caso seja slide com template customizado, não assume o valor `default`.
   *
   * @default `336`
   */
  @Input('p-height') set height(value: number) {
    this._height = convertToInt(value);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Valor em milissegundos que define o tempo de troca dos slides, caso o valor seja menor que `1000` os slides não trocam automaticamente.
   *
   * @default `4000`
   */
  @Input('p-interval') set interval(value: number) {
    this._interval = convertToInt(value, poSlideIntervalDefault);
    this._interval >= 1000 ? this.startInterval() : this.cancelInterval();
  }

  get interval(): number {
    return this._interval;
  }

  /**
   * @description
   *
   * Array de imagens ou dados para o slide, pode ser de três formas:
   *
   * - Array implementando objetos da interface `PoSlideItem`:
   * ```
   * [{ image: '/assets/image-1', action: 'imageClick.bind(this)'}, { image: '/assets/image-2' }]
   * ```
   * - Array de `strings` com os caminhos das imagens:
   * ```
   * ['/assets/image-1', '/assets/image-2' ]
   * ```
   * - Array com lista de itens (para utilizar template):
   * ```
   * [{ label: '1', img: '/assets/image-1' }, { label: '2', img: '/assets/image-1' }]
   * ```
   *
   * > As setas de navegação e o controle com círculos apenas serão renderizados caso possua mais de um slide.
   */
  @Input('p-slides') set slides(value: Array<PoSlideItem | string | any>) {
    this._slides = value;
    this.setSlideItems(value);

    if (value && value.length) {
      this.startSlide();
    }
  }

  get slides(): Array<PoSlideItem | string | any> {
    return this._slides;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a exibição das setas de navegação.
   *
   * @default `false`
   */
  @Input('p-hide-arrows') @InputBoolean() hideArrows: boolean = false;

  abstract setSlideHeight(height: number): void;

  protected abstract cancelInterval(): void;
  protected abstract setSlideItems(value: Array<PoSlideItem | string | any>): void;
  protected abstract startSlide(): void;
  protected abstract startInterval(): void;
}
