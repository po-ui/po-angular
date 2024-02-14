import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PoTabsService {
  private onChangesTriggeredSource = new Subject<void>();

  onChangesTriggered$ = this.onChangesTriggeredSource.asObservable();

  triggerOnChanges() {
    this.onChangesTriggeredSource.next();
  }
}
