import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[resizable]'
})
export class MyResizeDirective implements OnInit {
  ngOnInit() {}
  @Output()
  readonly resizable = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown').pipe(
    tap(e => e.preventDefault()),
    switchMap(() => {
      const { width, right } = this.elementRef.nativeElement.closest('th')!.getBoundingClientRect();

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(({ clientX }) => width + clientX - right),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      );
    })
  );

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
  // @Input("resizable") resizable: boolean;

  // @Input() index: number;

  // private startX: number;

  // private startWidth: number;

  // private column: HTMLElement;

  // private table: HTMLElement;

  // private pressed: boolean;

  // constructor(private renderer: Renderer2, private el: ElementRef) {
  //   this.column = this.el.nativeElement;
  // }

  // ngOnInit() {
  //   if (this.resizable) {
  //     const row = this.renderer.parentNode(this.column);
  //     const thead = this.renderer.parentNode(row);
  //     this.table = this.renderer.parentNode(thead);
  //     console.log(row);

  //     const resizer = this.renderer.createElement("span");
  //     this.renderer.addClass(resizer, "resize-holder");
  //     this.renderer.appendChild(this.column, resizer);
  //     this.renderer.listen(resizer, "mousedown", this.onMouseDown);
  //     this.renderer.listen(this.table, "mousemove", this.onMouseMove);
  //     this.renderer.listen("document", "mouseup", this.onMouseUp);
  //   }
  // }

  // onMouseDown = (event: MouseEvent) => {
  //   this.pressed = true;
  //   this.startX = event.pageX;
  //   this.startWidth = this.column.offsetWidth;
  // };

  // onMouseMove = (event: MouseEvent) => {
  //   const offset = 35;
  //   if (this.pressed && event.buttons) {
  //     this.renderer.addClass(this.table, "resizing");

  //     // Calculate width of column
  //     let width = this.startWidth + (event.pageX - this.startX - offset);

  //     const tableCells = Array.from(
  //       this.table.querySelectorAll(".mat-row")
  //     ).map((row: any) => row.querySelectorAll(".mat-cell").item(this.index));

  //     // Set table header width
  //     this.renderer.setStyle(this.column, "width", `${width}px`);

  //     // Set table cells width
  //     for (const cell of tableCells) {
  //       this.renderer.setStyle(cell, "width", `${width}px`);
  //     }
  //   }
  // };

  // onMouseUp = (event: MouseEvent) => {
  //   if (this.pressed) {
  //     this.pressed = false;
  //     this.renderer.removeClass(this.table, "resizing");
  //   }
  // };
}
