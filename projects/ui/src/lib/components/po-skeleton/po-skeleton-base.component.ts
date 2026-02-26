import { Directive, Input } from '@angular/core';

import { PoSkeletonAnimation } from './po-skeleton-animation.enum';
import { PoSkeletonVariant } from './po-skeleton-variant.enum';

/**
 * @description
 *
 * O componente `po-skeleton` é utilizado para exibir placeholders durante o carregamento de conteúdo,
 * melhorando a experiência do usuário ao indicar que a informação está sendo processada.
 *
 * Ele oferece diferentes variantes visuais (texto, retângulo, círculo) e animações (pulse, shimmer)
 * para simular diversos tipos de conteúdo em estado de carregamento.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--background`                         | Cor de fundo do skeleton                              | `var(--color-neutral-light-20)`                 |
 * | `--border-radius`                      | Raio da borda                                         | `var(--border-radius-md)`                       |
 *
 */
@Directive()
export class PoSkeletonBaseComponent {
  private _variant: string = PoSkeletonVariant.text;
  private _animation: string = PoSkeletonAnimation.shimmer;
  private _width: string = '100%';
  private _height: string;
  private _borderRadius: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a variante visual do skeleton.
   *
   * Valores válidos:
   * - `text`: Simula uma linha de texto (altura padrão: 1em)
   * - `rect`: Forma retangular (requer definição de altura)
   * - `circle`: Forma circular (largura e altura iguais)
   *
   * @default `text`
   */
  @Input('p-variant') set variant(value: string) {
    this._variant = Object.values(PoSkeletonVariant).includes(value as PoSkeletonVariant)
      ? value
      : PoSkeletonVariant.text;
  }
  get variant(): string {
    return this._variant;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de animação do skeleton.
   *
   * Valores válidos:
   * - `none`: Sem animação
   * - `pulse`: Animação de pulsação
   * - `shimmer`: Animação de brilho deslizante
   *
   * @default `shimmer`
   */
  @Input('p-animation') set animation(value: string) {
    this._animation = Object.values(PoSkeletonAnimation).includes(value as PoSkeletonAnimation)
      ? value
      : PoSkeletonAnimation.shimmer;
  }
  get animation(): string {
    return this._animation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a largura do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * @default `100%`
   */
  @Input('p-width') set width(value: string) {
    this._width = value || '100%';
  }
  get width(): string {
    return this._width;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * Para a variante `text`, o valor padrão é `1em`.
   * Para as variantes `rect` e `circle`, é recomendado definir um valor.
   */
  @Input('p-height') set height(value: string) {
    this._height = value;
  }
  get height(): string {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o raio da borda do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * Esta propriedade sobrescreve o border-radius padrão de cada variante.
   */
  @Input('p-border-radius') set borderRadius(value: string) {
    this._borderRadius = value;
  }
  get borderRadius(): string {
    return this._borderRadius;
  }

  get computedStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.width) {
      styles['width'] = this.width;
    }

    if (this.height) {
      styles['height'] = this.height;
    } else if (this.variant === PoSkeletonVariant.text) {
      styles['height'] = '1em';
    }

    if (this.borderRadius) {
      styles['border-radius'] = this.borderRadius;
    }

    return styles;
  }

  get computedClasses(): { [key: string]: boolean } {
    return {
      'po-skeleton': true,
      [`po-skeleton-${this.variant}`]: true,
      [`po-skeleton-animation-${this.animation}`]: true
    };
  }
}
