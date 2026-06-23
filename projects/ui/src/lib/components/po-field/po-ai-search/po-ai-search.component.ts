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
import { PoAiSearchResult } from './interfaces/po-ai-search.interface';
import { PoAiSearchBaseComponent } from './po-ai-search-base.component';
import { PoAiSearchService } from './po-ai-search.service';

/**
 * @docsExtends PoAiSearchBaseComponent
 *
 * @example
 *
 * <example name="po-ai-search-basic" title="PO AI Search Basic">
 *  <file name="sample-po-ai-search-basic/sample-po-ai-search-basic.component.html"> </file>
 *  <file name="sample-po-ai-search-basic/sample-po-ai-search-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-ai-search-labs" title="PO AI Search Labs">
 *  <file name="sample-po-ai-search-labs/sample-po-ai-search-labs.component.html"> </file>
 *  <file name="sample-po-ai-search-labs/sample-po-ai-search-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-ai-search-with-ai" title="PO AI Search - Search with AI">
 *  <file name="sample-po-ai-search-with-ai/sample-po-ai-search-with-ai.component.html"> </file>
 *  <file name="sample-po-ai-search-with-ai/sample-po-ai-search-with-ai.component.ts"> </file>
 *  <file name="sample-po-ai-search-with-ai/sample-po-ai-search-with-ai.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-ai-search',
  templateUrl: './po-ai-search.component.html',
  providers: [
    PoAiSearchService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoAiSearchComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoAiSearchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoAiSearchComponent extends PoAiSearchBaseComponent implements OnChanges {
  @ViewChild('inp', { static: true }) inp: ElementRef;

  id = `po-ai-search[${uuid()}]`;

  /* istanbul ignore next */
  constructor() {
    const el = inject(ElementRef);
    const aiSearchService = inject(PoAiSearchService);
    const cd = inject(ChangeDetectorRef);

    super(el, aiSearchService, cd);
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

    const columnsMetadata = this.aiSearchService.extractColumnsMetadata(this.columns || []);

    this.aiLoading = true;
    this.loading = true;
    this.appliedDescription = '';
    this.cd?.detectChanges();

    this.aiSubscription = this.aiSearchService.sendQuery(this.url, query, columnsMetadata, this.timeout).subscribe({
      next: response => {
        const result: PoAiSearchResult = {
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
    this.appliedDescription = '';

    if (this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.value = '';
    }
    this.callOnChange('');

    this.announce('Filtro de busca por IA removido.');
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

  private handleResponse(result: PoAiSearchResult): void {
    this.aiLoading = false;
    this.loading = false;

    const confidence = result.confidence ?? 1;

    if (confidence < this.minConfidence) {
      this.appliedDescription = '';
      this.lowConfidence.emit(result);
      this.announce('A busca por IA retornou baixa confiança e não foi aplicada automaticamente.');
      this.cd?.detectChanges();
      return;
    }

    this.appliedDescription = this.showAppliedFeedback ? result.description || '' : '';
    this.result.emit(result);
    this.announce(
      this.appliedDescription
        ? `Filtro de busca por IA aplicado: ${this.appliedDescription}`
        : 'Filtro de busca por IA aplicado.'
    );
    this.cd?.detectChanges();
  }

  private handleError(query: string, err: { statusCode?: number; message?: string }): void {
    this.aiLoading = false;
    this.loading = false;
    this.appliedDescription = '';

    this.error.emit({
      query,
      statusCode: err?.statusCode || 500,
      message: err?.message || 'Erro na busca com IA'
    });

    this.announce('Ocorreu um erro na busca por IA.');
    this.cd?.detectChanges();
  }

  private announce(message: string): void {
    this.liveAnnouncement = message;
  }
}
