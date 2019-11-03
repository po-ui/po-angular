import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'po-grid-cell',
  templateUrl: './po-grid-cell.component.html'
})
export class PoGridCellComponent {

  private _width: (string | number);

  _value: any = '';
  edit: boolean = false;
  editValue: string = '';

  @Input('p-align') align?: string = 'left';

  @Input('p-freeze') freeze?: boolean = false;

  @Input('p-tab-index') tabIndex?: number = -1;

  @Input('p-position') position?: string = '';

  @Input('p-width') set width(value: (string | number)) {
    this._width = value;

    if (this.freeze && !this._width) {
      this._width = 100;
    }
  }
  get width(): (string | number) {
    return this._width ? `${this._width}px` : '100%';
  }

  @Input('p-readonly') readonly?: boolean = false;

  @Input('p-required') required?: boolean = false;

  @Output('p-valueChange') valueChange = new EventEmitter<any>();
  // @Input('p-value') value?: string;
  @Input('p-value') set value(value: any) {
    this._value = value;
    this.valueChange.emit(this._value);
  }
  get value(): any {
    return this._value;
  }

  @ViewChild('inputElement', { static: true }) inputElement: ElementRef;
  @ViewChild('contentElement', { static: true }) contentElement: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  onKeyDownContent(event: any) {
    // console.log('onKeyDownContent: ', event);

    // BACKSPACE / DELETE
    if ((!event.ctrlKey) && ((event.keyCode === 8) || (event.keyCode === 46))) {

      if (this.readonly) {
        return;
      }

      event.preventDefault();
      this.value = '';
      return;
    }

    // ENTER
    if (event.keyCode === 13) {
      event.preventDefault();
      this.onEditCell(this.value);
      return;
    }

    // A..Z - 0..9
    if ((event.keyCode >= 65) && (event.keyCode <= 90) || (event.keyCode >= 48) && (event.keyCode <= 57)) {
      event.preventDefault();
      this.onEditCell(event.key);
      return;
    }
  }

  dblclick(event: any) {
    // console.log('dblclick: ', event);

    event.preventDefault();

    this.onEditCell(this.value);
  }

  onBlurInput(event: any) {
    // console.log('onBlurInput: ', event);

    this.value = this.editValue;
    this.editValue = undefined;
    this.edit = false;
  }

  onKeyDownInput(event: any) {
    // console.log('onKeyDownInput: ', event);

    // ENTER
    if (event.keyCode === 13) {
      this.value = this.editValue;
      this.editValue = undefined;
      this.edit = false;
      this.changeDetectorRef.detectChanges();
      this.contentElement.nativeElement.focus();
    }

    // ESCAPE
    if (event.keyCode === 27) {
      this.editValue = undefined;
      this.edit = false;
      this.changeDetectorRef.detectChanges();
      this.contentElement.nativeElement.focus();
      event.stopPropagation();
    }
  }

  private onEditCell(value: any) {
    if (this.readonly) {
      return;
    }

    this.editValue = value;
    this.edit = true;
    this.changeDetectorRef.detectChanges();
    this.inputElement.nativeElement.focus();
  }

}
