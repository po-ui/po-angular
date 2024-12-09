import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoRichTextService {
  private model = new Subject<string>();

  emitModel(value: string) {
    this.model.next(value);
  }

  getModel() {
    return this.model.asObservable();
  }
}
