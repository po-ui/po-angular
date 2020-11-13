import { Component, EventEmitter, ViewChild } from '@angular/core';

import { PoModalAction } from '../../../components/po-modal/po-modal-action.interface';
import { PoModalComponent } from '../../../components/po-modal/po-modal.component';

import { PoHttpInterceptorDetail } from './po-http-interceptor-detail.interface';
import { poHttpInterceptorDetailLiteralsDefault } from './po-http-interceptor-detail-literals.interface';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

export const colors = { success: 'color-11', error: 'color-07', warning: 'color-08', info: '' };

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a modal de detalhes exibida pelo interceptor
 */
@Component({
  selector: 'po-http-interceptor-detail',
  templateUrl: './po-http-interceptor-detail.component.html'
})
export class PoHttpInterceptorDetailComponent {
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;

  closed = new EventEmitter<any>();
  details: Array<PoHttpInterceptorDetail> = [];
  private language = this.languageService.getShortLanguage();
  private literals = poHttpInterceptorDetailLiteralsDefault[this.language];

  primaryAction: PoModalAction = {
    action: () => this.close(),
    label: this.literals.closeButton
  };

  title: string;

  constructor(private languageService: PoLanguageService) {}

  set detail(details: Array<PoHttpInterceptorDetail>) {
    if (details && details.length) {
      this.details = this.filterByValidDetails(details);
    }

    this.title = this.formatTitle(this.details);
  }

  close() {
    this.modal.close();
    this.closed.emit();
  }

  formatDetailItemTitle(detail) {
    return detail.code ? `${detail.code} - ${detail.message}` : detail.message;
  }

  open() {
    this.modal.open();
  }

  typeColor(type: string): string {
    return colors[type];
  }

  typeValue(type: string): string {
    return poHttpInterceptorDetailLiteralsDefault[this.language][type] || type;
  }

  private addValidDetail(newDetails: Array<PoHttpInterceptorDetail>, detail: PoHttpInterceptorDetail) {
    return detail.message ? newDetails.concat(this.getValidDetailProperties(detail)) : newDetails;
  }

  private getValidDetailProperties({ code, message, detailedMessage, type }: PoHttpInterceptorDetail) {
    return { code, message, detailedMessage, type };
  }

  private filterByValidDetails(details: Array<PoHttpInterceptorDetail>) {
    return details.reduce((newDetails, detail) => this.addValidDetail(newDetails, detail), []);
  }

  private formatTitle(details: Array<PoHttpInterceptorDetail>) {
    return details.length > 1 ? `${this.literals.details} (${details.length})` : this.literals.detail;
  }
}
