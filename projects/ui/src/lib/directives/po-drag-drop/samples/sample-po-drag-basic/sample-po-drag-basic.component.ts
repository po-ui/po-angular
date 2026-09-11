import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-drag-basic',
  templateUrl: './sample-po-drag-basic.component.html',
  standalone: false
})
export class SamplePoDragBasicComponent {
  widget = { title: 'Arraste-me', body: 'Este widget pode ser arrastado livremente.' };
}
