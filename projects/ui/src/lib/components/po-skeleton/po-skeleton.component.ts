import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { PoSkeletonBaseComponent } from './po-skeleton-base.component';
import { PoSkeletonSize } from './enums/po-skeleton-size.enum';
import { PoSkeletonVariant } from './enums/po-skeleton-variant.enum';

/**
 * @docsExtends PoSkeletonBaseComponent
 *
 * @example
 *
 * <example name="po-skeleton-basic" title="PO Skeleton Basic">
 *  <file name="sample-po-skeleton-basic/sample-po-skeleton-basic.component.html"> </file>
 *  <file name="sample-po-skeleton-basic/sample-po-skeleton-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-skeleton-labs" title="PO Skeleton Labs">
 *  <file name="sample-po-skeleton-labs/sample-po-skeleton-labs.component.html"> </file>
 *  <file name="sample-po-skeleton-labs/sample-po-skeleton-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-skeleton-credit-card" title="PO Skeleton - Credit Card">
 *  <file name="sample-po-skeleton-credit-card/sample-po-skeleton-credit-card.component.html"> </file>
 *  <file name="sample-po-skeleton-credit-card/sample-po-skeleton-credit-card.component.ts"> </file>
 *  <file name="sample-po-skeleton-credit-card/sample-po-skeleton-credit-card.component.css"> </file>
 * </example>
 *
 * <example name="po-skeleton-widget-card" title="PO Skeleton - Widget Card">
 *  <file name="sample-po-skeleton-widget-card/sample-po-skeleton-widget-card.component.html"> </file>
 *  <file name="sample-po-skeleton-widget-card/sample-po-skeleton-widget-card.component.ts"> </file>
 *  <file name="sample-po-skeleton-widget-card/sample-po-skeleton-widget-card.component.css"> </file>
 * </example>
 *
 * <example name="po-skeleton-user-profile" title="PO Skeleton - User Profile">
 *  <file name="sample-po-skeleton-user-profile/sample-po-skeleton-user-profile.component.html"> </file>
 *  <file name="sample-po-skeleton-user-profile/sample-po-skeleton-user-profile.component.ts"> </file>
 *  <file name="sample-po-skeleton-user-profile/sample-po-skeleton-user-profile.component.css"> </file>
 * </example>
 *
 * <example name="po-skeleton-social-post" title="PO Skeleton - Social Post">
 *  <file name="sample-po-skeleton-social-post/sample-po-skeleton-social-post.component.html"> </file>
 *  <file name="sample-po-skeleton-social-post/sample-po-skeleton-social-post.component.ts"> </file>
 *  <file name="sample-po-skeleton-social-post/sample-po-skeleton-social-post.component.css"> </file>
 * </example>
 *
 * <example name="po-skeleton-article" title="PO Skeleton - Article">
 *  <file name="sample-po-skeleton-article/sample-po-skeleton-article.component.html"> </file>
 *  <file name="sample-po-skeleton-article/sample-po-skeleton-article.component.ts"> </file>
 *  <file name="sample-po-skeleton-article/sample-po-skeleton-article.component.css"> </file>
 * </example>
 */
@Component({
  selector: 'po-skeleton',
  templateUrl: './po-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSkeletonComponent extends PoSkeletonBaseComponent {
  private readonly sizeMap: Record<
    PoSkeletonSize,
    { square: number; circle: number; rectangleWidth: number; rectangleHeight: number }
  > = {
    [PoSkeletonSize.xs]: { square: 24, circle: 24, rectangleWidth: 72, rectangleHeight: 24 },
    [PoSkeletonSize.sm]: { square: 32, circle: 32, rectangleWidth: 96, rectangleHeight: 32 },
    [PoSkeletonSize.md]: { square: 48, circle: 48, rectangleWidth: 144, rectangleHeight: 48 },
    [PoSkeletonSize.lg]: { square: 64, circle: 64, rectangleWidth: 192, rectangleHeight: 64 },
    [PoSkeletonSize.xl]: { square: 96, circle: 96, rectangleWidth: 288, rectangleHeight: 96 },
    [PoSkeletonSize.xxl]: { square: 144, circle: 144, rectangleWidth: 432, rectangleHeight: 144 }
  };

  private readonly defaultTextDimensions = { width: '100%', height: '1em' };

  private readonly defaultBorderRadius: Record<PoSkeletonVariant, string | undefined> = {
    [PoSkeletonVariant.text]: undefined,
    [PoSkeletonVariant.square]: undefined,
    [PoSkeletonVariant.rectangle]: undefined,
    [PoSkeletonVariant.circle]: '50%'
  };

  computedStyles = computed(() => {
    const styles: { [key: string]: string } = {};
    const variant = this.variant();
    const size = this.size();
    const sizeConfig = this.sizeMap[size];

    const defaultDimensions = this.getDimensions(variant, sizeConfig);

    styles['width'] = this.width() || defaultDimensions.width || '';
    styles['height'] = this.height() || defaultDimensions.height || '';

    const borderRadiusValue = this.borderRadius();
    const defaultRadius = this.defaultBorderRadius[variant];
    if (borderRadiusValue || defaultRadius) {
      styles['border-radius'] = borderRadiusValue || defaultRadius;
    }

    return styles;
  });

  computedClasses = computed(() => ({
    'po-skeleton': true,
    [`po-skeleton-${this.variant()}`]: true,
    [`po-skeleton-type-${this.type()}`]: true,
    [`po-skeleton-animation-${this.animation()}`]: true
  }));

  private getDimensions(
    variant: PoSkeletonVariant,
    sizeConfig: { square: number; circle: number; rectangleWidth: number; rectangleHeight: number }
  ): { width: string; height: string } {
    switch (variant) {
      case PoSkeletonVariant.text:
        return this.defaultTextDimensions;
      case PoSkeletonVariant.square:
        return { width: `${sizeConfig.square}px`, height: `${sizeConfig.square}px` };
      case PoSkeletonVariant.circle:
        return { width: `${sizeConfig.circle}px`, height: `${sizeConfig.circle}px` };
      case PoSkeletonVariant.rectangle:
        return { width: `${sizeConfig.rectangleWidth}px`, height: `${sizeConfig.rectangleHeight}px` };
      default:
        return { width: '', height: '' };
    }
  }
}
