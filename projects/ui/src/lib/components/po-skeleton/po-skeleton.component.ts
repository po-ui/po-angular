import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { PoSkeletonBaseComponent } from './po-skeleton-base.component';
import { PoSkeletonVariant } from './po-skeleton-variant.enum';

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
 * <example name="po-skeleton-card-loading" title="PO Skeleton - Card Loading">
 *  <file name="sample-po-skeleton-card-loading/sample-po-skeleton-card-loading.component.html"> </file>
 *  <file name="sample-po-skeleton-card-loading/sample-po-skeleton-card-loading.component.ts"> </file>
 *  <file name="sample-po-skeleton-card-loading/sample-po-skeleton-card-loading.component.css"> </file>
 * </example>
 */
@Component({
  selector: 'po-skeleton',
  templateUrl: './po-skeleton.component.html',
  styleUrls: ['./po-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSkeletonComponent extends PoSkeletonBaseComponent {
  private readonly sizeMap = {
    sm: { square: 32, circle: 32, rectangleWidth: 96, rectangleHeight: 32 },
    md: { square: 64, circle: 64, rectangleWidth: 192, rectangleHeight: 64 },
    lg: { square: 96, circle: 96, rectangleWidth: 288, rectangleHeight: 96 },
    xl: { square: 128, circle: 128, rectangleWidth: 384, rectangleHeight: 128 }
  };

  computedStyles = computed(() => {
    const styles: { [key: string]: string } = {};
    const variant = this.variant();
    const size = this.size();
    const sizeConfig = this.sizeMap[size as keyof typeof this.sizeMap];

    // Width
    const widthValue = this.width();
    if (widthValue) {
      styles['width'] = widthValue;
    } else if (variant === PoSkeletonVariant.text) {
      styles['width'] = '100%';
    } else if (variant === PoSkeletonVariant.square) {
      styles['width'] = `${sizeConfig.square}px`;
    } else if (variant === PoSkeletonVariant.circle) {
      styles['width'] = `${sizeConfig.circle}px`;
    } else if (variant === PoSkeletonVariant.rectangle) {
      styles['width'] = `${sizeConfig.rectangleWidth}px`;
    }

    // Height
    const heightValue = this.height();
    if (heightValue) {
      styles['height'] = heightValue;
    } else if (variant === PoSkeletonVariant.text) {
      styles['height'] = '1em';
    } else if (variant === PoSkeletonVariant.square) {
      styles['height'] = `${sizeConfig.square}px`;
    } else if (variant === PoSkeletonVariant.circle) {
      styles['height'] = `${sizeConfig.circle}px`;
    } else if (variant === PoSkeletonVariant.rectangle) {
      styles['height'] = `${sizeConfig.rectangleHeight}px`;
    }

    // Border radius
    const borderRadiusValue = this.borderRadius();
    if (borderRadiusValue) {
      styles['border-radius'] = borderRadiusValue;
    } else if (variant === PoSkeletonVariant.circle) {
      // Ensure circle is always round when no custom border-radius is provided
      styles['border-radius'] = '50%';
    }

    return styles;
  });

  computedClasses = computed(() => {
    return {
      'po-skeleton': true,
      [`po-skeleton-${this.variant()}`]: true,
      [`po-skeleton-type-${this.type()}`]: true,
      [`po-skeleton-animation-${this.animation()}`]: true
    };
  });
}
