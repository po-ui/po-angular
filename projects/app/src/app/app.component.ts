import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  rc = `<p>teste</p>`;
  rc2 = 'model 2';

  mudaModel() {
    this.rc = 'model alterado';
  }
}
