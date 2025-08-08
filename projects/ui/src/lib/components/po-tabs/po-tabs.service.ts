import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PoTabComponent } from './po-tab/po-tab.component';

@Injectable({
  providedIn: 'root'
})
export class PoTabsService {
  private onChangesTriggeredSource = new Subject<any>();
  private onChangesTriggeredActiveSource = new Subject<any>();

  onChangesTriggered$ = this.onChangesTriggeredSource.asObservable();
  triggerActiveOnChanges$ = this.onChangesTriggeredActiveSource.asObservable();

  triggerOnChanges(tab?: PoTabComponent) {
    this.onChangesTriggeredSource.next(tab);
  }

  triggerActiveOnChanges(tab: PoTabComponent) {
    this.onChangesTriggeredActiveSource.next(tab);
  }
}
