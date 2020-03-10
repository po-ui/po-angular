import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-button-basic',
  templateUrl: './sample-po-button-basic.component.html'
})
export class SamplePoButtonBasicComponent {
  onClick() {
    alert('Po Button!');
  }
}
