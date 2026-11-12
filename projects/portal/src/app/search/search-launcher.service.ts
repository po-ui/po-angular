import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SearchOpenRequest {
  via: 'header' | 'shortcut' | 'icon_mobile';
  shortcutKey?: 'ctrl_k' | 'cmd_k';
  /** Consulta para já abrir buscada ("Ver todos" do popover). */
  query?: string;
}

/** Pede a abertura do modal de busca (atalho, ícone no mobile). Quem escuta é o `SearchModalComponent`. */
@Injectable({ providedIn: 'root' })
export class SearchLauncherService {
  private readonly requests = new Subject<SearchOpenRequest>();

  readonly requests$ = this.requests.asObservable();

  open(request: SearchOpenRequest): void {
    this.requests.next(request);
  }
}
