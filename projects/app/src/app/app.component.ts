import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('checkboxGroup', { static: true }) checkboxgroup;

  onBlur() {
    console.log('blur');
  }

  onEnter() {
    console.log('enter');
  }

  onChange(e) {
    console.log('change: ', e);
  }

  onChangeModel(e) {
    console.log('change model: ', e);
  }

  dialog(e) {
    alert(e)
    this.checkboxgroup.focus();

    console.log(this.checkboxgroup)
  }

}
