import { Component, HostBinding, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'td[resizable]',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}
  @HostBinding('style.width.px')
  width: number | null = null;

  @ViewChild('resizer') resizer: ElementRef | undefined;

  ngAfterViewInit(): void {
    if (this.resizer) {
      this.resizer.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.elementRef.nativeElement.classList.add('resizing');
  }

  onMouseMove(event: MouseEvent): void {
    if (this.elementRef.nativeElement.classList.contains('resizing')) {
      this.width = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.elementRef.nativeElement.classList.remove('resizing');
  }
}
