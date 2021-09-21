import { Component } from '@angular/core';

import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  input;

  group;

  constructor(formBuild: FormBuilder) {
    this.group = formBuild.group({
      inputreativo: ['']
    });
  }

  canActive() {
    return false;
  }

  onclick() {
    this.input = 'VALOR';
  }

  disableReactive() {
    if (this.group.get('inputreativo').disabled) {
      this.group.get('inputreativo').enable();
    } else {
      this.group.get('inputreativo').disable();
    }
  }
}
