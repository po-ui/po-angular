import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PoButtonComponent } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('button') button: PoButtonComponent;
  @ViewChild('result') result: HTMLElement;

  brandForm = this.formBuilder.group({
    colorAction: [null]
  });

  buttonForm = this.formBuilder.group({
    borderRadius: [null],
    fontSize: [null],
    color: [null],
    textColor: [null],
    colorAction: [null]
  });

  private readonly formPropertyDict = {
    borderRadius: '--border-radius',
    fontSize: '--font-size',
    color: '--color',
    textColor: '--text-color',
    colorAction: '--color-action-default'
  };

  constructor(private formBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    this.brandForm.valueChanges.subscribe(changes => this.checkChangesBrand(changes));
    this.buttonForm.valueChanges.subscribe(changes => this.checkChanges(changes));
  }

  private checkChangesBrand(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementsByTagName('html')[0].style.setProperty(this.formPropertyDict[fieldName], value);
      }
    });
  }

  private checkChanges(changes: { [key: string]: string }): void {
    this.result['nativeElement'].innerHTML = 'po-button {<br>';

    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        this.button.buttonElement.nativeElement.style.setProperty(this.formPropertyDict[fieldName], value);

        this.result['nativeElement'].innerHTML += `${this.formPropertyDict[fieldName]}: ${value};<br>`;
      }
    });

    this.result['nativeElement'].innerHTML += '}';
  }
}
