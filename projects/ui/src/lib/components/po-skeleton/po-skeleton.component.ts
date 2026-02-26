import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PoSkeletonBaseComponent } from './po-skeleton-base.component';

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
 */
@Component({
  selector: 'po-skeleton',
  templateUrl: './po-skeleton.component.html',
  styleUrls: ['./po-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSkeletonComponent extends PoSkeletonBaseComponent {}
