import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PoProgressBaseComponent } from './po-progress-base.component';
import { PoProgressStatus } from './enums/po-progress-status.enum';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poProgressLiterals } from './literals/po-progress.literals';

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
  language;
  literals;

  get isAllowCancel(): boolean {
    return !!this.cancel.observers.length && this.status !== PoProgressStatus.Success;
  }

  get isAllowInfoError(): boolean {
    return !!(!this.infoIcon && this.info && this.status === PoProgressStatus.Error);
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

  private poLanguageService = inject(PoLanguageService);

  ngOnInit(): void {
    this.language = this.poLanguageService.getShortLanguage();

    this.literals = {
      ...poProgressLiterals[this.language]
    };
  }

  emitCancellation() {
    this.cancel.emit(this.status);
  }

  emitRetry() {
    this.retry.emit();
  }
}
