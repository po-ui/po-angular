import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

import { PoUploadLiterals } from '../../interfaces/po-upload-literals.interface';

@Component({
  selector: 'po-upload-drag-drop-area-overlay',
  templateUrl: 'po-upload-drag-drop-area-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoUploadDragDropAreaOverlayComponent implements AfterViewInit {
  @ViewChild('DragDropAreaFixed', { read: ElementRef, static: true }) DragDropAreaFixed: ElementRef;

  @Input('p-directory-compatible') directoryCompatible: boolean;

  @Input('p-disabled') disabled: boolean;

  @Input('p-literals') literals: PoUploadLiterals;

  @Input('p-target') target: ElementRef;

  @Output('p-area-element') areaElement: EventEmitter<any> = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.target) {
      this.setPosition(this.target);
    }
    this.areaElement.emit(this.DragDropAreaFixed.nativeElement);
  }

  private setPosition(targetElement: ElementRef) {
    const boundingClientRect = targetElement.nativeElement.getBoundingClientRect();
    const clientRectKeys = ['bottom', 'left', 'height', 'right', 'top', 'width'];

    clientRectKeys.forEach(clientRectKey => {
      const clientRectValue = boundingClientRect[clientRectKey];

      this.renderer.setStyle(this.DragDropAreaFixed.nativeElement, clientRectKey, `${clientRectValue}px`);
    });
  }
}
