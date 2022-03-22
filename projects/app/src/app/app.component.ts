import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PoButtonComponent } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('button') button: PoButtonComponent;

  form = this.formBuilder.group({
    borderRadius: [null],
    fontSize: [null],
    color: [null]
  });

  private readonly formPropertyDict = {
    borderRadius: '--border-radius',
    fontSize: '--font-size',
    color: '--color'
  };

  constructor(private formBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(changes => this.checkChanges(changes));
  }

  private checkChanges(changes: { [key: string]: string }): void {
    Object.keys(changes).forEach((fieldName: string) => {
      console.log(changes[fieldName]);
      if (fieldName.includes('color')) {
        this.button.buttonElement.nativeElement.style.setProperty(this.formPropertyDict[fieldName], changes[fieldName]);
      }
      if (changes[fieldName]) {
        this.button.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDict[fieldName],
          `var(--${changes[fieldName]})`
        );
      }
    });
  }
}
