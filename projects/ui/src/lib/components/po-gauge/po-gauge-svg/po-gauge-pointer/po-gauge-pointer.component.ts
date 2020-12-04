import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { PoGaugeCoordinates } from '../../interfaces/po-gauge-coordinates.interface';

@Component({
  selector: '[po-gauge-pointer]',
  templateUrl: './po-gauge-pointer.component.svg'
})
export class PoGaugePointerComponent implements AfterViewInit {
  private _coordinates: PoGaugeCoordinates;

  radiusScale: number;

  private afterViewInit = false;

  @Input('p-coordinates') set coordinates(value: PoGaugeCoordinates) {
    this._coordinates = value;

    if (this._coordinates?.radius) {
      this.calculateRadiusScale(this.coordinates.radius);
    }

    if (this._coordinates?.hasOwnProperty('pointerDegrees') && this.afterViewInit) {
      this.applyPointerRotation(this.coordinates.pointerDegrees);
    }
  }

  get coordinates() {
    return this._coordinates;
  }

  @ViewChild('pointer') pointer: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this._coordinates?.pointerDegrees) {
      this.applyPointerRotation(this.coordinates.pointerDegrees);
    }

    this.afterViewInit = true;
  }

  private calculateRadiusScale(radius) {
    const scale = radius / 20;
    const maxScaleValue = 24;

    this.radiusScale = scale < maxScaleValue ? scale : maxScaleValue;
  }

  private applyPointerRotation(degrees: number) {
    this.renderer.setStyle(
      this.pointer.nativeElement,
      'transformOrigin',
      `${this.coordinates.radius}px ${this.coordinates.radius}px`
    );
    this.renderer.setStyle(this.pointer.nativeElement, 'transform', `rotate(${degrees}deg)`);
  }
}
