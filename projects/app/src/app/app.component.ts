import { Component, ViewChild } from '@angular/core';
import { PoUploadComponent } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('upload', { static: true }) upload: PoUploadComponent;

  uploadModel: Array<any>;

  onModelChange(event) {
    console.log('Arquivo anexo via drag drop', event);
  }

  afterSetFile(event) {
    console.log('Anexei o arquivo', event);
  }
}
