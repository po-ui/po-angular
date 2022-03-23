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

  form = this.formBuilder.group({
    borderRadius: [null],
    fontSize: [null],
    color: [null],
    textColor: [null]
  });

  private readonly formPropertyDict = {
    borderRadius: '--border-radius',
    fontSize: '--font-size',
    color: '--color',
    textColor: '--text-color'
  };

  constructor(private formBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(changes => this.checkChanges(changes));
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
