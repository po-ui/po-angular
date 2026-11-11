import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SearchOpenRequest {
  via: 'header' | 'shortcut' | 'icon_mobile';
  shortcutKey?: 'ctrl_k' | 'cmd_k';
}

/** Pede a abertura do modal de busca (atalho, ícone no mobile). Quem escuta é o `SearchModalComponent`. */
@Injectable({ providedIn: 'root' })
export class SearchLauncherService {
  private readonly requests = new Subject<SearchOpenRequest>();

  readonly requests$ = this.requests.asObservable();

  private focusReturning = false;

  /** O modal fechou e o `po-modal` está devolvendo o foco a quem o tinha (às vezes o campo do header). */
  modalClosed(): void {
    this.focusReturning = true;
    setTimeout(() => (this.focusReturning = false));
  }

  /** Foco que volta do modal não reabre o popover: a pessoa acabou de fechar a busca. */
  get isFocusReturning(): boolean {
    return this.focusReturning;
  }

  open(request: SearchOpenRequest): void {
    this.requests.next(request);
  }
}
