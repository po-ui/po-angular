import { Directive, input } from '@angular/core';

import { PoSkeletonAnimation } from './po-skeleton-animation.enum';
import { PoSkeletonType } from './po-skeleton-type.enum';
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
 * | `--color`                              | Cor de fundo padrão do skeleton                       | `var(--color-neutral-light-20)`                 |
 * | `--border-radius`                      | Raio da borda do skeleton                             | `var(--border-radius-md)`                       |
 * | `--margin-bottom`                      | Margem inferior do skeleton                           | `var(--spacing-sm)`                             |
 * | `--transition-duration`                | Duração da transição                                  | `0.3s`                                          |
 * | `--transition-property`                | Propriedade CSS da transição                          | `background-color`                              |
 * | `--transition-timing`                  | Função de temporização da transição                   | `ease-in-out`                                   |
 * | **Type: Normal**                       |                                                       |                                                 |
 * | `--color-normal`                       | Cor de fundo do tipo normal                           | `var(--color-neutral-light-20)`                 |
 * | **Type: Primary**                      |                                                       |                                                 |
 * | `--color-primary`                      | Cor de fundo do tipo primary                          | `var(--color-neutral-mid-40)`                   |
 * | **Type: Content**                      |                                                       |                                                 |
 * | `--color-content`                      | Cor de fundo do tipo content                          | `var(--color-neutral-light-00)`                 |
 *
 */
@Directive()
export class PoSkeletonBaseComponent {
  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define a variante visual do skeleton.
   *
   * Valores válidos:
   * - `text`: Simula uma linha de texto (altura padrão: 1em)
   * - `rectangle`: Forma retangular (proporção 3:1 por padrão)
   * - `square`: Forma quadrada (largura e altura iguais)
   * - `circle`: Forma circular (largura e altura iguais)
   *
   * @default `text`
   */
  variant = input<string, string>(PoSkeletonVariant.text, {
    alias: 'p-variant',
    transform: (value: string) => {
      if (!value) return PoSkeletonVariant.text;
      return Object.values(PoSkeletonVariant).includes(value as PoSkeletonVariant) ? value : PoSkeletonVariant.text;
    }
  });

  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define o tipo visual do skeleton, alterando sua cor de fundo.
   *
   * Valores válidos:
   * - `normal`: Cor neutra clara (padrão)
   * - `primary`: Cor neutra média
   * - `content`: Fundo branco
   *
   * @default `normal`
   */
  type = input<string, string>(PoSkeletonType.normal, {
    alias: 'p-type',
    transform: (value: string) => {
      if (!value) return PoSkeletonType.normal;
      return Object.values(PoSkeletonType).includes(value as PoSkeletonType) ? value : PoSkeletonType.normal;
    }
  });

  /**
   *
   * @Input
   *
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
  animation = input<string, string>(PoSkeletonAnimation.shimmer, {
    alias: 'p-animation',
    transform: (value: string) => {
      if (!value) return PoSkeletonAnimation.shimmer;
      return Object.values(PoSkeletonAnimation).includes(value as PoSkeletonAnimation)
        ? value
        : PoSkeletonAnimation.shimmer;
    }
  });

  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define o tamanho do skeleton para as variantes pré-definidas (`rectangle`, `square`, `circle`).
   *
   * Valores válidos:
   * - `sm`: Pequeno (32px para square/circle, 96px x 32px para rectangle)
   * - `md`: Médio (64px para square/circle, 192px x 64px para rectangle)
   * - `lg`: Grande (96px para square/circle, 288px x 96px para rectangle)
   * - `xl`: Extra grande (128px para square/circle, 384px x 128px para rectangle)
   *
   * Esta propriedade é ignorada quando `p-width` ou `p-height` são definidos explicitamente.
   *
   * @default `md`
   */
  size = input<string, string>('md', {
    alias: 'p-size',
    transform: (value: string) => {
      if (!value) return 'md';
      const validSizes = ['sm', 'md', 'lg', 'xl'];
      return validSizes.includes(value) ? value : 'md';
    }
  });

  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define a largura do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * Quando definido, sobrescreve a largura padrão da variante.
   *
   * @default `100%` para variante `text`, tamanho baseado em `p-size` para outras variantes
   */
  width = input<string>('', {
    alias: 'p-width'
  });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define a altura do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * Quando definido, sobrescreve a altura padrão da variante.
   */
  height = input<string>('', {
    alias: 'p-height'
  });

  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define o raio da borda do skeleton.
   * Aceita valores CSS válidos (px, %, em, rem, etc).
   *
   * Esta propriedade sobrescreve o border-radius padrão de cada variante.
   */
  borderRadius = input<string>('', {
    alias: 'p-border-radius'
  });
}
