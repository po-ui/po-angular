import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PoTabComponent } from './po-tab/po-tab.component';

@Injectable({
  providedIn: 'root'
})
export class PoTabsService {
  private onChangesTriggeredSource = new Subject<void>();
  private onChangesTriggeredActiveSource = new Subject<any>();

  onChangesTriggered$ = this.onChangesTriggeredSource.asObservable();
  triggerActiveOnChanges$ = this.onChangesTriggeredActiveSource.asObservable();

  triggerOnChanges() {
    this.onChangesTriggeredSource.next();
  }

  triggerActiveOnChanges(tab: PoTabComponent) {
    this.onChangesTriggeredActiveSource.next(tab);
  }
}
