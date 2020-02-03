// tslint:disable: no-self-assignment
import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { PoCheckboxGroupOption } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  lookup1: any;
  lookup2: any;

  items: Array<any> = [];

  show = true;
  show1 = true;
  show2 = true;
  show3 = true;
  show4 = true;
  show5 = true;
  show6 = true;
  options: Array<PoCheckboxGroupOption> = [];

  constructor(public accountService: AccountService) {

    this.options = [
      { value: '1', label: 'Option 1', disabled: false },
      { value: '2', label: 'Option 2', disabled: false }
    ];

    setTimeout(() => {
      this.show1 = false;
    }, 1000);

    setTimeout(() => {
      this.show2 = false;
    }, 1000);

    setTimeout(() => {
      this.show3 = false;
    }, 3000);

    setTimeout(() => {
      this.show4 = false;
    }, 4000);

    setTimeout(() => {
      this.show5 = false;
    }, 5000);

    setTimeout(() => {
      this.show6 = false;
    }, 6000);
  }

  disable() {
    this.options.forEach((option: PoCheckboxGroupOption) => {
      option.disabled = !option.disabled;
    });

    this.options = [...this.options];
  }

  remove() {
    setTimeout(() => {
      this.show = false;
      this.show = true;
    }, 1000);
  }
}
