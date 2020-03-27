import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PoProgressBaseComponent } from './po-progress-base.component';
import { PoProgressStatus } from './enums/po-progress-status.enum';

/**
 * @docsExtends PoProgressBaseComponent
 *
 * @example
 * <example name="po-progress-basic" title="PO Progress Basic">
 *   <file name="sample-po-progress-basic/sample-po-progress-basic.component.html"> </file>
 *   <file name="sample-po-progress-basic/sample-po-progress-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-progress-labs" title="PO Progress Labs">
 *   <file name="sample-po-progress-labs/sample-po-progress-labs.component.html"> </file>
 *   <file name="sample-po-progress-labs/sample-po-progress-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-progress-publication" title="PO Progress - Publication">
 *   <file name="sample-po-progress-publication/sample-po-progress-publication.component.html"> </file>
 *   <file name="sample-po-progress-publication/sample-po-progress-publication.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-progress',
  templateUrl: './po-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoProgressComponent extends PoProgressBaseComponent {
  get isAllowCancel(): boolean {
    return !!this.cancel.observers.length && this.status !== PoProgressStatus.Success;
  }

  get isAllowProgressInfo(): boolean {
    return !!(this.info || this.infoIcon || this.isAllowCancel || this.isAllowRetry);
  }

  get isAllowRetry(): boolean {
    return !!this.retry.observers.length && this.status === PoProgressStatus.Error;
  }

  get statusClass(): string {
    if (this.status === PoProgressStatus.Success) {
      return 'po-progress-success';
    }

    if (this.status === PoProgressStatus.Error) {
      return 'po-progress-error';
    }

    return 'po-progress-default';
  }

  emitCancellation() {
    this.cancel.emit(this.status);
  }

  emitRetry() {
    this.retry.emit();
  }
}
