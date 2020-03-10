import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';

import { PoLookupModalBaseComponent } from '../po-lookup-modal/po-lookup-modal-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoLookupModalBaseComponent
 */
@Component({
  selector: 'po-lookup-modal',
  templateUrl: './po-lookup-modal.component.html'
})
export class PoLookupModalComponent extends PoLookupModalBaseComponent implements OnInit {
  @ViewChild('inpsearch', { static: true }) inputSearchEl: ElementRef;

  keyUpObservable: Observable<any> = null;

  containerHeight: number = 375;
  tableHeight: number = 370;

  ngOnInit() {
    super.ngOnInit();

    this.initializeEventInput();
    this.setTableHeight();
  }

  initializeEventInput(): void {
    this.keyUpObservable = fromEvent(this.inputSearchEl.nativeElement, 'keyup').pipe(
      filter((e: any) => this.validateEnterPressed(e)),
      debounceTime(400)
    );

    this.keyUpObservable.subscribe(() => {
      this.search();
    });
  }

  openModal() {
    this.poModal.open();
  }

  sortBy(sort: PoTableColumnSort) {
    this.sort = sort;
  }

  private setTableHeight() {
    if (window.innerHeight < 615) {
      this.tableHeight -= 50;
      this.containerHeight -= 50;
    }
  }

  private validateEnterPressed(e: any) {
    return e.keyCode === 13;
  }
}
