import { Component, ViewChild, ViewChildren, ElementRef, Renderer2 } from '@angular/core';
import { PoMultiselectOption, PoPopupAction } from '../../../ui/src/lib';
import { CdkOption } from '@angular/cdk/listbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  @ViewChild('testt', { read: ElementRef, static: true }) testt: ElementRef;

  toppings = ['Extra Cheese', 'Mushrooms', 'Pepperoni', 'Sausage'];
  order = ['Extra Cheese'];
  multiselect: Array<any> = [];
  multiselectService: Array<any>;
  optionscustommodel;

  options: Array<PoMultiselectOption> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' }
  ];

  optionscustom: Array<any> = [
    { aluno: 'marcela', nota: '8' },
    { aluno: 'joao', nota: '7' }
  ];

  constructor(private renderer: Renderer2) {}

  minhasActions: Array<PoPopupAction> = [
    {
      label: 'Teste: 1',
      action: this.teste.bind(this)
    }
  ];

  items: Array<any> = [
    { label: 'Label Label Label 1', value: 1, icon: 'po-icon-news' },
    { label: 'Label Label Label 2', value: 2, disabled: true },
    { label: 'Label Label Label 3', value: 3, separator: true },
    { label: 'Label Label Label 4', value: 4, danger: true, icon: 'po-icon-news' },
    { label: 'Label Label Label 5', value: 5, selected: true },
    { label: 'Label Label Label 6', value: 6 },
    { label: 'Label Label Label 7', value: 7 }
  ];

  teste(event?) {
    console.log(event);
  }
}
