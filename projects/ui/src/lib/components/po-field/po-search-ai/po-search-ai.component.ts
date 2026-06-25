import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { uuid } from '../../../utils/util';
import { PoSearchAiResult } from './interfaces/po-search-ai.interface';
import { PoSearchAiBaseComponent } from './po-search-ai-base.component';
import { PoSearchAiService } from './po-search-ai.service';

/**
 * @docsExtends PoSearchAiBaseComponent
 *
 * @example
 *
 * <example name="po-search-ai-basic" title="PO AI Search Basic">
 *  <file name="sample-po-search-ai-basic/sample-po-search-ai-basic.component.html"> </file>
 *  <file name="sample-po-search-ai-basic/sample-po-search-ai-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-search-ai-labs" title="PO AI Search Labs">
 *  <file name="sample-po-search-ai-labs/sample-po-search-ai-labs.component.html"> </file>
 *  <file name="sample-po-search-ai-labs/sample-po-search-ai-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-search-ai-with-ai" title="PO AI Search - Search with AI">
 *  <file name="sample-po-search-ai-with-ai/sample-po-search-ai-with-ai.component.html"> </file>
 *  <file name="sample-po-search-ai-with-ai/sample-po-search-ai-with-ai.component.ts"> </file>
 *  <file name="sample-po-search-ai-with-ai/sample-po-search-ai-with-ai.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-search-ai',
  templateUrl: './po-search-ai.component.html',
  providers: [
    PoSearchAiService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoSearchAiComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoSearchAiComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSearchAiComponent extends PoSearchAiBaseComponent implements OnChanges {
  @ViewChild('inp', { static: true }) inp: ElementRef;

  id = `po-search-ai[${uuid()}]`;

  /* istanbul ignore next */
  constructor() {
    const el = inject(ElementRef);
    const searchAiService = inject(PoSearchAiService);
    const cd = inject(ChangeDetectorRef);

    super(el, searchAiService, cd);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label) {
      this.displayAdditionalHelp = false;
    }
  }

  /**
   * Envia a consulta atual (valor do campo) para o endpoint de IA configurado em `p-url`.
   *
   * Caso a consulta esteja vazia ou `p-url` não esteja definido, nada é feito.
   * O resultado é emitido via `p-result` (ou `p-low-confidence` quando a confiança for baixa)
   * e falhas são emitidas via `p-error`.
   */
  search(): void {
    const query = (this.getScreenValue() || '').toString().trim();

    if (!query || !this.url || this.isDisabled || this.readonly) {
      return;
    }

    this.aiSubscription?.unsubscribe();

    const columnsMetadata = this.searchAiService.extractColumnsMetadata(this.columns || []);

    this.aiLoading = true;
    this.loading = true;
    this.cd?.detectChanges();

    this.aiSubscription = this.searchAiService.sendQuery(this.url, query, columnsMetadata, this.timeout).subscribe({
      next: response => {
        const result: PoSearchAiResult = {
          query,
          filter: response?.filter,
          description: response?.description,
          confidence: response?.confidence
        };

        this.handleResponse(result);
      },
      error: err => this.handleError(query, err)
    });
  }

  /**
   * Limpa o filtro aplicado via IA, esvazia o campo e emite o evento `p-clear`.
   */
  clearSearch(): void {
    this.aiSubscription?.unsubscribe();
    this.aiLoading = false;
    this.loading = false;

    if (this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.value = '';
    }
    this.callOnChange('');

    this.clearEvent.emit();
    this.cd?.detectChanges();
  }

  /**
   * Manipula a tecla pressionada no campo: dispara a busca ao pressionar `Enter`.
   *
   * @param event Evento de teclado.
   */
  onSearchKeydown(event: KeyboardEvent): void {
    this.onKeyDown(event);

    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
    }
  }

  extraValidation(_c: AbstractControl): { [key: string]: any } {
    return null;
  }

  private handleResponse(result: PoSearchAiResult): void {
    this.aiLoading = false;
    this.loading = false;

    const confidence = result.confidence ?? 1;

    if (confidence < this.minConfidence) {
      this.lowConfidence.emit(result);
      this.cd?.detectChanges();
      return;
    }

    this.result.emit(result);
    this.cd?.detectChanges();
  }

  private handleError(query: string, err: { statusCode?: number; message?: string }): void {
    this.aiLoading = false;
    this.loading = false;

    this.error.emit({
      query,
      statusCode: err?.statusCode || 500,
      message: err?.message || 'Erro na busca com IA'
    });

    this.cd?.detectChanges();
  }


}
