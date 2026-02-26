import { Directive, input } from '@angular/core';

import { PoSkeletonAnimation } from './enums/po-skeleton-animation.enum';
import { PoSkeletonSize } from './enums/po-skeleton-size.enum';
import { PoSkeletonType } from './enums/po-skeleton-type.enum';
import { PoSkeletonVariant } from './enums/po-skeleton-variant.enum';

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
 * | Propriedade                            | Descrição                                            | Valor Padrão                    |
 * |----------------------------------------|------------------------------------------------------|---------------------------------|
 * | **Cores**                              |                                                      |                                 |
 * | `--color`                              | Cor de fundo do skeleton (tipo normal)               | `var(--color-neutral-light-20)` |
 * | `--color-primary`                      | Cor de fundo do skeleton (tipo primary)              | `var(--color-neutral-mid-40)`   |
 * | `--color-content`                      | Cor de fundo do skeleton (tipo content)              | `var(--color-neutral-light-00)` |
 * | `--shimmer-highlight`                  | Cor de destaque do shimmer (tipo normal)             | `var(--color-neutral-light-30)` |
 * | `--shimmer-highlight-primary`          | Cor de destaque do shimmer (tipo primary)            | `var(--color-neutral-light-20)` |
 * | `--shimmer-highlight-content`          | Cor de destaque do shimmer (tipo content)            | `var(--color-neutral-light-05)` |
 * | **Espaçamento**                        |                                                      |                                 |
 * | `--margin-bottom`                      | Margem inferior do skeleton                          | `var(--spacing-xs)`             |
 * | **Bordas**                             |                                                      |                                 |
 * | `--border-radius`                      | Raio da borda do skeleton                            | `var(--border-radius-md)`       |
 * | `--border-radius-text`                 | Raio da borda para a variante text                   | `var(--border-radius-md)`       |
 * | `--border-radius-primary`              | Raio da borda do skeleton (tipo primary)             | `var(--border-radius-md)`       |
 * | `--border-radius-content`              | Raio da borda do skeleton (tipo content)             | `var(--border-radius-lg)`       |
 * | **Transições**                         |                                                      |                                 |
 * | `--transition-property`                | Propriedade CSS da transição                         | `all`                           |
 * | `--transition-duration`                | Duração da transição de cor                          | `var(--duration-moderate)`      |
 * | `--transition-timing`                  | Função de temporização da transição/animação         | `var(--timing-continuous)`      |
 * | **Animações**                          |                                                      |                                 |
 * | `--animation-duration-pulse`           | Duração da animação de pulsação                      | `var(--duration-very-slow)`     |
 * | `--animation-duration-shimmer`         | Duração da animação de brilho deslizante             | `var(--duration-ultra-slow)`    |
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
  variant = input<PoSkeletonVariant>(PoSkeletonVariant.text, {
    alias: 'p-variant'
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
  type = input<PoSkeletonType>(PoSkeletonType.normal, {
    alias: 'p-type'
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
  animation = input<PoSkeletonAnimation>(PoSkeletonAnimation.shimmer, {
    alias: 'p-animation'
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
  size = input<PoSkeletonSize>(PoSkeletonSize.md, {
    alias: 'p-size'
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

  /**
   *
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define a descrição acessível do conteúdo que está sendo carregado.
   *
   * Este texto será anunciado por leitores de tela, garantindo que usuários de tecnologias assistivas
   * sejam informados sobre o estado de carregamento.
   *
   * **Quando usar:**
   * - Use em **skeletons únicos** ou no **primeiro skeleton de um grupo** com descrição contextual
   * - Evite usar em múltiplos skeletons dentro da mesma área sem contexto, para não causar repetição excessiva
   *
   * **Exemplos de uso:**
   *
   * ```html
   * <!-- ✅ BOM: Skeleton único com contexto -->
   * <po-skeleton p-loading-label="Carregando perfil do usuário"></po-skeleton>
   *
   * <!-- ✅ BOM: Grupo de skeletons - apenas o primeiro anuncia -->
   * <po-skeleton p-loading-label="Carregando lista de produtos"></po-skeleton>
   * <po-skeleton p-type="primary" p-loading-label=""></po-skeleton>
   * <po-skeleton p-variant="circle" p-loading-label=""></po-skeleton>
   *
   * <!-- ❌ EVITE: Múltiplos skeletons com a mesma label -->
   * <po-skeleton p-loading-label="Carregando"></po-skeleton>  <!-- "Carregando" -->
   * <po-skeleton p-loading-label="Carregando"></po-skeleton>  <!-- "Carregando" -->
   * <po-skeleton p-loading-label="Carregando"></po-skeleton>  <!-- "Carregando" (repetitivo!) -->
   * ```
   *
   * > **Boas práticas de acessibilidade:**
   * > - Forneça contexto específico na label para que os usuários entendam o que está carregando
   *
   * > - Em casos complexos, considere usar um único `<div role="status">` para todo o grupo
   * >   de skeletons, ao invés de múltiplas labels idênticas, para evitar repetição excessiva de anúncios
   */
  loadingLabel = input<string>('', {
    alias: 'p-loading-label'
  });
}
