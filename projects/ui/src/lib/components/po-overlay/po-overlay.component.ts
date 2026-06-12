import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PoOverlayBaseComponent } from './po-overlay-base.component';

@Component({
  selector: 'po-overlay',
  templateUrl: './po-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoOverlayComponent extends PoOverlayBaseComponent {}
