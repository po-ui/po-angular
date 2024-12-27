import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { Router } from '@angular/router';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isTypeof } from '../../utils/util';
import { PoProgressStatus } from './enums/po-progress-status.enum';
import { poProgressLiterals } from './literals/po-progress.literals';
import { PoProgressBaseComponent } from './po-progress-base.component';

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
export class PoProgressComponent extends PoProgressBaseComponent implements OnInit {
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
  private router = inject(Router);

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

  actionIsDisabled(action: any) {
    return isTypeof(action.disabled, 'function') ? action.disabled(action) : action.disabled;
  }

  callAction(): void {
    this.customActionClick.emit();
  }

  isActionVisible(action: any) {
    if (action && (action.label || action.icon)) {
      return action.visible !== undefined
        ? isTypeof(action.visible, 'function')
          ? action.visible()
          : !!action.visible
        : true;
    }
  }
}
