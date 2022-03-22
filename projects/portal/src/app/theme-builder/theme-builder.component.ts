import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  PoModalComponent,
  PoButtonComponent,
  PoSwitchComponent,
  PoRadioComponent,
  PoDisclaimerComponent,
  PoInputComponent,
  PoSelectComponent,
  PoTextareaComponent
} from '@po-ui/ng-components';

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['theme-builder.component.css']
})
export class ThemeBuilderComponent implements AfterViewInit {
  @ViewChild('viewCSSModal') viewCSSModal: PoModalComponent;

  @ViewChild('buttonP') buttonP: PoButtonComponent;
  @ViewChild('buttonD') buttonD: PoButtonComponent;
  @ViewChild('buttonL') buttonL: PoButtonComponent;
  @ViewChild('switch') switch: PoSwitchComponent;
  @ViewChild('radio') radioComponent: PoRadioComponent;
  @ViewChild('disclaimer') disclaimerComponent: PoDisclaimerComponent;
  @ViewChild('input') inputComponent: PoInputComponent;
  @ViewChild('select') selectComponent: PoSelectComponent;
  @ViewChild('textarea') textareaComponent: PoTextareaComponent;
  @ViewChild('resultButtonD') resultButtonD: HTMLElement;
  @ViewChild('resultButtonP') resultButtonP: HTMLElement;
  @ViewChild('resultButtonL') resultButtonL: HTMLElement;
  @ViewChild('resultSwitch') resultSwitch: HTMLElement;
  @ViewChild('resultRadio') resultRadio: HTMLElement;
  @ViewChild('resultDisclaimer') resultDisclaimer: HTMLElement;
  @ViewChild('resultInput') resultInput: HTMLElement;
  @ViewChild('resultSelect') resultSelect: HTMLElement;
  @ViewChild('resultTextarea') resultTextarea: HTMLElement;

  botaoDefaultView = true;
  botaoPrimaryView = true;
  botaoLinkView = true;
  switchView = true;
  radioView = true;
  disclaimerView = true;
  inputView = true;
  selectView = true;
  textareaView = true;
  acordionView = true;
  calendarView = true;
  stepperView = true;
  switchSampleBuilder = true;

  switchAllComponentes = true;

  // Cor primária
  brandFormP = this.formBuilder.group({
    colorAction: ['#c9357d'] as any
  });

  // Cor secundária
  brandFormS = this.formBuilder.group({
    colorAction: ['#753399'] as any
  });

  // Cor terciária
  brandFormT = this.formBuilder.group({
    colorAction: ['#ffd464'] as any
  });

  // Botão Primário
  buttonFormPrimary = this.formBuilder.group({
    color: [null],
    colorHover: [null],
    borderColor: [null],
    textColor: [null],
    colorAction: [null],
    borderRadius: [null],
    padding: [null]
  });

  // Botão Default
  buttonFormDefault = this.formBuilder.group({
    color: [null],
    colorHover: [null],
    colorBackgroundHover: [null],
    borderRadius: [null],
    padding: [null],
    borderWidth: [null]
  });

  // Botão Link
  buttonFormLink = this.formBuilder.group({
    color: [null],
    colorHover: [null],
    colorBackgroundHover: [null],
    borderRadius: [null],
    padding: [null]
  });

  // Switch
  switchForm = this.formBuilder.group({
    backgroundColor: [null],
    color: [null],
    colorIcon: [null],
    borderColor: [null],
    colorDois: [null]
  });

  // Radio
  radioForm = this.formBuilder.group({
    color: [null],
    backgroundColor: [null],
    colorHover: [null],
    borderColor: [null]
  });

  // disclaimer
  disclaimerForm = this.formBuilder.group({
    color: [null],
    borderColor: [null],
    colorIcon: [null],
    textColor: [null],
    colorHover: [null],
    borderRadius: [null],
    fontSize: [null]
  });

  //input
  inputForm = this.formBuilder.group({
    borderColor: [null],
    borderColorHover: [null],
    textColor: [null],
    backgroundColor: [null],
    backgroundColorHover: [null],
    fontSize: [null],
    padding: [null]
  });

  //select
  selectForm = this.formBuilder.group({
    borderColor: [null],
    borderColorHover: [null],
    colorBackground: [null],
    colorBackgroundHover: [null],
    colorText: [null],
    fontSize: [null],
    paddingHorizontal: [null],
    paddingVertical: [null]
  });

  //textarea
  textareaForm = this.formBuilder.group({
    borderColor: [null],
    borderColorHover: [null],
    textColor: [null],
    backgroundColor: [null],
    backgroundColorHover: [null],
    fontSize: [null]
  });

  private readonly formPropertyP = {
    colorAction: '--color-primary'
  };

  private readonly formPropertyS = {
    colorAction: '--color-secondary'
  };

  private readonly formPropertyT = {
    colorAction: '--color-tertiary'
  };

  // Variáveis customizaveis
  private readonly formPropertyDictButtonP = {
    color: '--color',
    colorHover: '--color-hover',
    borderColor: '--border-color',
    textColor: '--text-color',
    borderRadius: '--border-radius',
    padding: '--padding'
  };

  private readonly formPropertyDictButtonD = {
    color: '--color',
    colorHover: '--border-color-hover',
    colorBackgroundHover: '--background-hover',
    borderRadius: '--border-radius',
    padding: '--padding',
    borderWidth: '--border-width'
  };

  private readonly formPropertyDictButtonL = {
    color: '--color',
    colorHover: '--border-color-hover',
    colorBackgroundHover: '--background-hover',
    borderRadius: '--border-radius',
    padding: '--padding'
  };

  private readonly formPropertyDictSwitch = {
    backgroundColor: '--color-checked',
    color: '--track-checked',
    colorDois: '--track-unchecked',
    colorIcon: '--color-unchecked',
    borderColor: '--border-color'
  };

  private readonly formPropertyDictRadio = {
    color: '--color-checked',
    backgroundColor: '--color-unchecked',
    colorHover: '--shadow-color-hover',
    borderColor: '--border-color'
  };

  private readonly formPropertyDictDisclaimer = {
    color: '--color',
    borderColor: '--border-color',
    colorIcon: '--color-icon',
    textColor: '--text-color',
    colorHover: '--color-hover',
    borderRadius: '--border-radius',
    fontSize: '--font-size'
  };

  private readonly formPropertyDictInput = {
    borderColor: '--color',
    borderColorHover: '--color-hover',
    textColor: '--text-color',
    backgroundColor: '--background',
    backgroundColorHover: '--background-hover',
    fontSize: '--font-size',
    padding: '--padding'
  };

  private readonly formPropertyDictSelect = {
    borderColor: '--color',
    borderColorHover: '--color-hover',
    colorBackground: '--background',
    colorBackgroundHover: '--background-hover',
    colorText: '--text-color',
    fontSize: '--font-size',
    paddingHorizontal: '--padding-horizontal',
    paddingVertical: '--padding-vertical'
  };

  private readonly formPropertyDictTextarea = {
    borderColor: '--color',
    borderColorHover: '--color-hover',
    textColor: '--text-color',
    backgroundColor: '--background',
    backgroundColorHover: '--background-hover',
    fontSize: '--font-size'
  };

  constructor(private formBuilder: FormBuilder) {}

  openGetcss() {
    this.viewCSSModal.open();
  }

  resetCss() {
    this.brandFormP.reset({
      colorAction: ['#c9357d']
    });
    document.getElementsByTagName('html')[0].style.setProperty('--color-primary', null);

    this.brandFormS.reset({
      colorAction: ['#753399']
    });
    document.getElementsByTagName('html')[0].style.setProperty('--color-secondary', null);

    this.brandFormT.reset({
      colorAction: ['#ffd464']
    });
    document.getElementsByTagName('html')[0].style.setProperty('--color-tertiary', null);

    this.buttonFormDefault.reset();
    Object.keys(this.formPropertyDictButtonD).forEach((fieldName: string) => {
      this.buttonD.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonD[fieldName], null);
    });

    this.buttonFormPrimary.reset();
    Object.keys(this.formPropertyDictButtonP).forEach((fieldName: string) => {
      this.buttonP.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], null);
    });

    this.buttonFormLink.reset();
    Object.keys(this.formPropertyDictButtonL).forEach((fieldName: string) => {
      this.buttonL.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonL[fieldName], null);
    });

    this.switchForm.reset();
    Object.keys(this.formPropertyDictSwitch).forEach((fieldName: string) => {
      this.switch.switchContainer.nativeElement.style.setProperty(this.formPropertyDictSwitch[fieldName], null);
    });

    this.radioForm.reset();
    Object.keys(this.formPropertyDictRadio).forEach((fieldName: string) => {
      document.getElementById('myRadio').style.setProperty(this.formPropertyDictRadio[fieldName], null);
      document.getElementById('myRadio2').style.setProperty(this.formPropertyDictRadio[fieldName], null);
      this.radioComponent.radio.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], null);
    });

    this.disclaimerForm.reset();
    Object.keys(this.formPropertyDictDisclaimer).forEach((fieldName: string) => {
      this.disclaimerComponent.disclaimerContainer.nativeElement.style.setProperty(
        this.formPropertyDictDisclaimer[fieldName],
        null
      );
    });

    this.inputForm.reset();
    Object.keys(this.formPropertyDictInput).forEach((fieldName: string) => {
      this.inputComponent.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
    });

    this.selectForm.reset();
    Object.keys(this.formPropertyDictSelect).forEach((fieldName: string) => {
      this.selectComponent.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
    });

    this.textareaForm.reset();
    Object.keys(this.formPropertyDictTextarea).forEach((fieldName: string) => {
      this.textareaComponent.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
    });
  }

  copyToClipboard() {
    const fieldJsonElement = document.querySelector('#fieldsCSS');

    if (window.getSelection) {
      window.getSelection().selectAllChildren(fieldJsonElement);
      document.execCommand('copy');
    }
  }

  verifyCss() {
    return this.checkChanges();
  }

  ngAfterViewInit(): void {
    this.brandFormP.valueChanges.subscribe(changes => this.checkChangesBrandP(changes));
    this.brandFormS.valueChanges.subscribe(changes => this.checkChangesBrandS(changes));
    this.brandFormT.valueChanges.subscribe(changes => this.checkChangesBrandT(changes));
    this.buttonFormPrimary.valueChanges.subscribe(changes => this.checkChangesButtonP(changes));
    this.buttonFormDefault.valueChanges.subscribe(changes => this.checkChangesButtonD(changes));
    this.buttonFormLink.valueChanges.subscribe(changes => this.checkChangesButtonL(changes));

    this.switchForm.valueChanges.subscribe(changes => this.checkChangesSwitch(changes));
    this.radioForm.valueChanges.subscribe(changes => this.checkChangesRadio(changes));
    this.disclaimerForm.valueChanges.subscribe(changes => this.checkChangesDisclaimer(changes));
    this.inputForm.valueChanges.subscribe(changes => this.checkChangesInput(changes));
    this.selectForm.valueChanges.subscribe(changes => this.checkChangesSelect(changes));
    this.textareaForm.valueChanges.subscribe(changes => this.checkChangesTextarea(changes));
  }

  switchIndividual() {
    if (this.verifyIfAllNotVisibility()) {
      this.switchAllComponentes = false;
    }

    if (this.verifyIfAllIsVisibility()) {
      this.switchAllComponentes = true;
    }
  }

  switchAllEmit(valueSwitchAll) {
    if (valueSwitchAll) {
      this.botaoDefaultView = true;
      this.botaoPrimaryView = true;
      this.botaoLinkView = true;
      this.switchView = true;
      this.radioView = true;
      this.disclaimerView = true;
      this.inputView = true;
      this.selectView = true;
      this.textareaView = true;
      this.acordionView = true;
      this.calendarView = true;
      this.stepperView = true;
    } else {
      this.botaoDefaultView = false;
      this.botaoPrimaryView = false;
      this.botaoLinkView = false;
      this.switchView = false;
      this.radioView = false;
      this.disclaimerView = false;
      this.inputView = false;
      this.selectView = false;
      this.textareaView = false;
      this.acordionView = false;
      this.calendarView = false;
      this.stepperView = false;
    }
  }

  private checkChangesBrandP(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementsByTagName('html')[0].style.setProperty(this.formPropertyP[fieldName], value);
      }
    });
  }

  private checkChangesBrandT(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementsByTagName('html')[0].style.setProperty(this.formPropertyT[fieldName], value);
      }
    });
  }

  private checkChangesBrandS(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementsByTagName('html')[0].style.setProperty(this.formPropertyS[fieldName], value);
      }
    });
  }

  private checkChangesButtonP(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultButtonP['nativeElement'].innerHTML = '<br>po-button[p-kind="primary"] {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }

        if (changes[fieldName]) {
          this.buttonP.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], value);

          this.resultButtonP['nativeElement'].innerHTML += `${this.formPropertyDictButtonP[fieldName]}: ${value};<br>`;
        }
      });

      this.resultButtonP['nativeElement'].innerHTML += '}<br>';
    } else {
      this.resultButtonP['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesButtonD(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultButtonD['nativeElement'].innerHTML = '<br>po-button[p-kind="secondary"] {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }

        if (changes[fieldName]) {
          this.buttonD.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonD[fieldName], value);

          this.resultButtonD['nativeElement'].innerHTML += `${this.formPropertyDictButtonD[fieldName]}: ${value};<br>`;
        }
      });

      this.resultButtonD['nativeElement'].innerHTML += '}<br>';
    } else {
      this.resultButtonD['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesButtonL(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultButtonL['nativeElement'].innerHTML = '<br>po-button[p-kind="tertiary"] {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.buttonL.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonL[fieldName], value);

          this.resultButtonL['nativeElement'].innerHTML += `${this.formPropertyDictButtonL[fieldName]}: ${value};<br>`;
        }
      });

      this.resultButtonL['nativeElement'].innerHTML += '}';
    } else {
      this.resultButtonL['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesSwitch(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultSwitch['nativeElement'].innerHTML = 'po-switch {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

        if (changes[fieldName]) {
          this.switch.switchContainer.nativeElement.style.setProperty(this.formPropertyDictSwitch[fieldName], value);

          this.resultSwitch['nativeElement'].innerHTML += `${this.formPropertyDictSwitch[fieldName]}: ${value};<br>`;
        }
      });

      this.resultSwitch['nativeElement'].innerHTML += '}';
    } else {
      this.resultSwitch['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesRadio(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultRadio['nativeElement'].innerHTML = 'po-radio {<br>';

      this.checkDiffRadio(changes);

      this.resultRadio['nativeElement'].innerHTML += '}';
    } else {
      this.resultRadio['nativeElement'].innerHTML = '';
    }
  }

  private checkDiffRadio(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementById('myRadio').style.setProperty(this.formPropertyDictRadio[fieldName], value);
        document.getElementById('myRadio2').style.setProperty(this.formPropertyDictRadio[fieldName], value);
        this.resultRadio['nativeElement'].innerHTML += `${this.formPropertyDictRadio[fieldName]}: ${value};<br>`;
      }
    });
  }

  private checkChangesDisclaimer(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultDisclaimer['nativeElement'].innerHTML = 'po-disclaimer {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.disclaimerComponent.disclaimerContainer.nativeElement.style.setProperty(
            this.formPropertyDictDisclaimer[fieldName],
            value
          );

          this.resultDisclaimer[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDisclaimer[fieldName]}: ${value};<br>`;
        }
      });

      this.resultDisclaimer['nativeElement'].innerHTML += '}';
    } else {
      this.resultDisclaimer['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesInput(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultInput['nativeElement'].innerHTML = 'input.po-input {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }

        if (changes[fieldName]) {
          this.inputComponent.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], value);

          this.resultInput['nativeElement'].innerHTML += `${this.formPropertyDictInput[fieldName]}: ${value};<br>`;
        }
      });

      this.resultInput['nativeElement'].innerHTML += '}';
    } else {
      this.resultInput['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesSelect(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultSelect['nativeElement'].innerHTML = 'po-select {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.selectComponent.selectElement.nativeElement.style.setProperty(
            this.formPropertyDictSelect[fieldName],
            value
          );

          this.resultSelect['nativeElement'].innerHTML += `${this.formPropertyDictSelect[fieldName]}: ${value};<br>`;
        }
      });

      this.resultSelect['nativeElement'].innerHTML += '}';
    } else {
      this.resultSelect['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesTextarea(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultTextarea['nativeElement'].innerHTML = 'po-textarea {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.textareaComponent.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictTextarea[fieldName],
            value
          );

          this.resultTextarea[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictTextarea[fieldName]}: ${value};<br>`;
        }
      });

      this.resultTextarea['nativeElement'].innerHTML += '}';
    } else {
      this.resultTextarea['nativeElement'].innerHTML = '';
    }
  }

  private checkChanges() {
    return (
      !!this.resultButtonD?.['nativeElement']?.innerHTML ||
      !!this.resultButtonP?.['nativeElement']?.innerHTML ||
      !!this.resultButtonL?.['nativeElement']?.innerHTML ||
      !!this.resultRadio?.['nativeElement']?.innerHTML ||
      !!this.resultDisclaimer?.['nativeElement']?.innerHTML ||
      !!this.resultSwitch?.['nativeElement']?.innerHTML ||
      !!this.resultSelect?.['nativeElement']?.innerHTML ||
      !!this.resultTextarea?.['nativeElement']?.innerHTML ||
      !!this.resultInput?.['nativeElement']?.innerHTML
    );
  }

  private verifyIfAllNotVisibility() {
    return (
      !this.botaoDefaultView ||
      !this.botaoPrimaryView ||
      !this.botaoLinkView ||
      !this.switchView ||
      !this.radioView ||
      !this.disclaimerView ||
      !this.inputView ||
      !this.selectView ||
      !this.textareaView ||
      !this.acordionView ||
      !this.calendarView ||
      !this.stepperView
    );
  }

  private verifyIfAllIsVisibility() {
    return (
      this.botaoDefaultView &&
      this.botaoPrimaryView &&
      this.botaoLinkView &&
      this.switchView &&
      this.radioView &&
      this.disclaimerView &&
      this.inputView &&
      this.selectView &&
      this.textareaView &&
      this.acordionView &&
      this.calendarView &&
      this.stepperView
    );
  }

  private isEmpty(objectVerify) {
    return Object.values(objectVerify).every(x => x === null || x === '');
  }
}
