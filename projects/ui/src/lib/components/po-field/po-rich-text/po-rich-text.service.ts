import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class PoRichTextService {
  private model = new Subject<string>();

  emitModel(value: string) {
    console.log('emitModel service:', value);
    this.model.next(value);
  }

  getModel() {
    console.log('getModel service');
    return this.model.asObservable();
  }
}
