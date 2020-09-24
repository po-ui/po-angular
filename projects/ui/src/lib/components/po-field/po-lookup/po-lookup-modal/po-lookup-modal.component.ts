import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { PoDynamicFormComponent } from './../../../po-dynamic/po-dynamic-form/po-dynamic-form.component';

import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';

import { PoLookupModalBaseComponent } from '../po-lookup-modal/po-lookup-modal-base.component';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';

/**
 * @docsPrivate
 *
 * @docsExtends PoLookupModalBaseComponent
 */
@Component({
  selector: 'po-lookup-modal',
  templateUrl: './po-lookup-modal.component.html'
})
export class PoLookupModalComponent extends PoLookupModalBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('inpsearch') inputSearchEl: ElementRef;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  keyUpObservable: Observable<any> = null;

  containerHeight: number = 375;
  tableHeight: number = 370;

  componentRef: ComponentRef<PoDynamicFormComponent>;
  dynamicForm: NgForm;

  constructor(
    private cd: ChangeDetectorRef,
    private componentFactory: ComponentFactoryResolver,
    poLanguage: PoLanguageService
  ) {
    super(poLanguage);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTableHeight();
  }

  ngAfterViewInit() {
    this.initializeEventInput();
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
    this.cd.detectChanges();
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
