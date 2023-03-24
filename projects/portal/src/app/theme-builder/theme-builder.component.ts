import { Component, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  PoButtonComponent,
  PoSwitchComponent,
  PoRadioComponent,
  PoDisclaimerComponent,
  PoInputComponent,
  PoSelectComponent,
  PoTextareaComponent,
  PoDropdownComponent,
  PoDatepickerComponent,
  PoLinkComponent,
  PoModalComponent,
  PoPopupComponent
} from '@po-ui/ng-components';

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['theme-builder.component.css']
})
export class ThemeBuilderComponent implements AfterViewInit {
  @ViewChild('viewCSSModal') viewCSSModal: PoModalComponent;

  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;
  @ViewChild('buttonP') buttonP: PoButtonComponent;
  @ViewChild('buttonD') buttonD: PoButtonComponent;
  @ViewChild('buttonL') buttonL: PoButtonComponent;
  @ViewChild('switch') switch: PoSwitchComponent;
  @ViewChild('radio') radioComponent: PoRadioComponent;
  @ViewChild('disclaimer') disclaimerComponent: PoDisclaimerComponent;
  @ViewChild('input') inputComponent: PoInputComponent;
  @ViewChild('select') selectComponent: PoSelectComponent;
  @ViewChild('textarea') textareaComponent: PoTextareaComponent;
  @ViewChild('modalBuilder', { read: ElementRef }) modalBuilder: ElementRef;
  @ViewChild('datepicker') datepickerComponent: PoDatepickerComponent;
  @ViewChild('datepickerButton') datepickerComponentButton: PoDatepickerComponent;
  @ViewChild('modal') modalComponent: PoModalComponent;
  @ViewChild('link') linkComponent: PoLinkComponent;
  @ViewChild('tooltip') tooltip: PoButtonComponent;
  @ViewChild('dropdown') dropdownComponent: PoDropdownComponent;
  @ViewChild('popupBuilder') popupBuilder: PoPopupComponent;
  @ViewChild('resultButtonD') resultButtonD: HTMLElement;
  @ViewChild('resultButtonP') resultButtonP: HTMLElement;
  @ViewChild('resultButtonL') resultButtonL: HTMLElement;
  @ViewChild('resultSwitch') resultSwitch: HTMLElement;
  @ViewChild('resultRadio') resultRadio: HTMLElement;
  @ViewChild('resultDisclaimer') resultDisclaimer: HTMLElement;
  @ViewChild('resultInput') resultInput: HTMLElement;
  @ViewChild('resultSelect') resultSelect: HTMLElement;
  @ViewChild('resultTextarea') resultTextarea: HTMLElement;
  @ViewChild('resultDatepicker') resultDatepicker: HTMLElement;
  @ViewChild('resultDatepickerButton') resultDatepickerButton: HTMLElement;
  @ViewChild('resultModal') resultModal: HTMLElement;
  @ViewChild('resultLink') resultLink: HTMLElement;
  @ViewChild('resultTooltip') resultTooltip: HTMLElement;
  @ViewChild('resultDropdown') resultDropdown: HTMLElement;
  @ViewChild('resultPopup') resultPopup: HTMLElement;
  @ViewChild('resultPopupContainer') resultPopupContainer: HTMLElement;

  botaoDefaultView = true;
  botaoPrimaryView = true;
  botaoLinkView = true;
  switchView = true;
  radioView = true;
  disclaimerView = true;
  inputView = true;
  selectView = true;
  textareaView = true;
  datepickerView = true;
  modalView = true;
  linkView = true;
  tooltipView = true;
  dropdownView = true;
  popupView = true;
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

  //datepicker
  datepickerForm = this.formBuilder.group({
    padding: [null],
    fontSize: [null],
    color: [null],
    colorHover: [null],
    backgroundColor: [null],
    backgroundColorHover: [null]
  });
  //button do datepicker
  datepickerButtonForm = this.formBuilder.group({
    padding: [null],
    color: [null],
    backgroundColorHover: [null],
    borderColorHover: [null]
  });

  //modal
  modalForm = this.formBuilder.group({
    borderRadius: [null],
    borderWidth: [null],
    opacityValue: [null],
    backgroundColor: [null],
    borderColor: [null],
    overlayColor: [null],
    dividerColor: [null]
  });

  //link
  linkForm = this.formBuilder.group({
    colorVisited: [null],
    color: [null],
    colorOutline: [null]
  });

  //tooltip
  tooltipForm = this.formBuilder.group({
    color: [null],
    borderRadius: [null],
    textColor: [null]
  });

  dropdownForm = this.formBuilder.group({
    fontSize: [null],
    borderRadius: [null],
    borderWidth: [null],
    padding: [null],
    color: [null],
    colorHover: [null],
    backgroundColorHover: [null]
  });

  //popup item
  popupForm = this.formBuilder.group({
    color: [null],
    colorHover: [null],
    colorBackgroundHover: [null]
  });

  //popup container
  popupContainerForm = this.formBuilder.group({
    colorBackground: [null]
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

  private readonly formPropertyDictDropdown = {
    fontSize: '--font-size',
    borderRadius: '--border-radius',
    borderWidth: '--border-width',
    padding: '--padding',
    color: '--color',
    colorHover: '--color-hover',
    backgroundColorHover: '--background-hover'
  };

  private readonly formPropertyDictDatepicker = {
    padding: '--padding',
    fontSize: '--font-size',
    color: '--color',
    backgroundColor: '--background',
    backgroundColorHover: '--background-hover',
    colorHover: '--color-hover'
  };

  private readonly formPropertyDictDatepickerButton = {
    padding: '--padding',
    color: '--color',
    backgroundColorHover: '--background-hover',
    borderColorHover: '--border-color-hover'
  };

  private readonly formPropertyDictModal = {
    borderRadius: '--border-radius',
    borderWidth: '--border-width',
    opacityValue: '--opacity-overlay',
    backgroundColor: '--background',
    borderColor: '--border-color',
    overlayColor: '--color-overlay',
    dividerColor: '--color-divider'
  };

  private readonly formPropertyDictLink = {
    colorVisited: '--text-color-visited',
    color: '--text-color',
    colorOutline: '--outline-color-focused'
  };

  private readonly formPropertyDictTooltip = {
    color: '--color',
    borderRadius: '--border-radius',
    textColor: '--text-color'
  };

  private readonly formPropertyDictPopup = {
    color: '--color',
    colorHover: '--color-hover',
    colorBackgroundHover: '--background-hover'
  };

  private readonly formPropertyDictPopupContainer = {
    colorBackground: '--background'
  };

  constructor(private formBuilder: FormBuilder, private renderer: Renderer2) {}

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

    this.dropdownForm.reset();
    Object.keys(this.formPropertyDictDropdown).forEach((fieldName: string) => {
      this.dropdownComponent.dropdownRef.nativeElement.style.setProperty(
        this.formPropertyDictDropdown[fieldName],
        null
      );
    });

    this.datepickerForm.reset();
    Object.keys(this.formPropertyDictDatepicker).forEach((fieldName: string) => {
      this.datepickerComponent.inputEl.nativeElement.style.setProperty(
        this.formPropertyDictDatepicker[fieldName],
        null
      );
    });

    this.datepickerButtonForm.reset();
    Object.keys(this.formPropertyDictDatepickerButton).forEach((fieldName: string) => {
      this.datepickerComponent.iconDatepicker.buttonElement.nativeElement.style.setProperty(
        this.formPropertyDictDatepickerButton[fieldName],
        null
      );
    });

    this.modalForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      this.modalBuilder.nativeElement.style.setProperty(this.formPropertyDictModal[fieldName], null);
    });

    this.linkForm.reset();
    Object.keys(this.formPropertyDictLink).forEach((fieldName: string) => {
      this.linkComponent.linkEl.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], null);
    });

    this.tooltipForm.reset();
    Object.keys(this.formPropertyDictTooltip).forEach((fieldName: string) => {
      this.tooltip.buttonElement.nativeElement.style.setProperty(this.formPropertyDictTooltip[fieldName], null);
    });

    this.popupForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      this.popupBuilder.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
        this.formPropertyDictPopup[fieldName],
        null
      );
    });

    this.popupContainerForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      if (this?.popupBuilder?.listbox?.nativeElement?.listbox) {
        this.popupBuilder.listbox.nativeElement.listbox.nativeElement.style.setProperty(
          this.formPropertyDictModal[fieldName],
          null
        );
      }
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
    //foco no botão da tooltip para criar a div que possibilita a customização
    this.tooltip.focus();
    this.buttonP.focus();

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
    this.dropdownForm.valueChanges.subscribe(changes => this.checkChangesDropdown(changes));
    this.datepickerForm.valueChanges.subscribe(changes => this.checkChangesDatepicker(changes));
    this.datepickerButtonForm.valueChanges.subscribe(changes => this.checkChangesDatepickerButton(changes));
    this.modalForm.valueChanges.subscribe(changes => this.checkChangesModal(changes));
    this.linkForm.valueChanges.subscribe(changes => this.checkChangesLink(changes));
    this.tooltipForm.valueChanges.subscribe(changes => this.checkChangesTooltip(changes));
    this.popupForm.valueChanges.subscribe(changes => this.checkChangesPopup(changes));
    this.popupContainerForm.valueChanges.subscribe(changes => this.checkChangesPopupContainer(changes));
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
      this.dropdownView = true;
      this.datepickerView = true;
      this.modalView = true;
      this.linkView = true;
      this.tooltipView = true;
      this.popupView = true;
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
      this.dropdownView = false;
      this.datepickerView = false;
      this.modalView = false;
      this.linkView = false;
      this.tooltipView = false;
      this.popupView = false;
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

  private checkChangesDropdown(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultDropdown['nativeElement'].innerHTML = 'po-dropdown {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.dropdownComponent.dropdownRef.nativeElement.style.setProperty(
            this.formPropertyDictDropdown[fieldName],
            value
          );

          this.resultDropdown[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDropdown[fieldName]}: ${value};<br>`;
        }
      });

      this.resultDropdown['nativeElement'].innerHTML += '}';
    } else {
      this.resultDropdown['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesDatepicker(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultDatepicker['nativeElement'].innerHTML = 'input.po-datepicker {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.datepickerComponent.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictDatepicker[fieldName],
            value
          );

          this.resultDatepicker[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDatepicker[fieldName]}: ${value};<br>`;
        }
      });

      this.resultDatepicker['nativeElement'].innerHTML += '}';
    } else {
      this.resultDatepicker['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesDatepickerButton(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultDatepickerButton['nativeElement'].innerHTML = 'po-datepicker po-button[p-kind="tertiary"] {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.datepickerComponent.iconDatepicker.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictDatepickerButton[fieldName],
            value
          );

          this.resultDatepickerButton[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDatepickerButton[fieldName]}: ${value};<br>`;
        }
      });

      this.resultDatepickerButton['nativeElement'].innerHTML += '}';
    } else {
      this.resultDatepickerButton['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesModal(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultModal['nativeElement'].innerHTML = 'po-modal {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          if (fieldName === 'opacityValue') {
            value = `${changes[fieldName]}`;
          } else {
            value = `${changes[fieldName]}px`;
          }
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.modalBuilder.nativeElement.style.setProperty(this.formPropertyDictModal[fieldName], value);

          this.resultModal['nativeElement'].innerHTML += `${this.formPropertyDictModal[fieldName]}: ${value};<br>`;
        }
      });

      this.resultModal['nativeElement'].innerHTML += '}';
    } else {
      this.resultModal['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesLink(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultLink['nativeElement'].innerHTML = 'po-link {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.linkComponent.linkEl.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], value);

          this.resultLink['nativeElement'].innerHTML += `${this.formPropertyDictLink[fieldName]}: ${value};<br>`;
        }
      });

      this.resultLink['nativeElement'].innerHTML += '}';
    } else {
      this.resultLink['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesTooltip(changes: { [key: string]: string }): void {
    const tooltipElement = this.renderer.selectRootElement('.po-tooltip', true);
    if (tooltipElement) {
      if (!this.isEmpty(changes)) {
        this.resultTooltip['nativeElement'].innerHTML = '.po-tooltip {<br>';

        Object.keys(changes).forEach((fieldName: string) => {
          let value;
          if (typeof changes[fieldName] === 'number') {
            value = `${changes[fieldName]}px`;
          } else {
            value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
          }
          if (changes[fieldName]) {
            tooltipElement.style.setProperty(this.formPropertyDictTooltip[fieldName], value);

            this.resultTooltip[
              'nativeElement'
            ].innerHTML += `${this.formPropertyDictTooltip[fieldName]}: ${value};<br>`;
          }
        });

        this.resultTooltip['nativeElement'].innerHTML += '}';
      } else {
        this.resultTooltip['nativeElement'].innerHTML = '';
      }
    }
  }

  private checkChangesPopup(changes: { [key: string]: string }): void {
    this.popupBuilder.open();

    if (!this.isEmpty(changes)) {
      this.resultPopup['nativeElement'].innerHTML = 'po-popup po-item-list {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.popupBuilder.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
            this.formPropertyDictPopup[fieldName],
            value
          );

          this.resultPopup['nativeElement'].innerHTML += `${this.formPropertyDictPopup[fieldName]}: ${value};<br>`;
        }
      });

      this.resultPopup['nativeElement'].innerHTML += '}';
    } else {
      this.resultPopup['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesPopupContainer(changes: { [key: string]: string }): void {
    this.popupBuilder.open();

    if (!this.isEmpty(changes)) {
      this.resultPopupContainer['nativeElement'].innerHTML = 'po-popup po-listbox {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.popupBuilder.listbox['nativeElement'].style.setProperty(
            this.formPropertyDictPopupContainer[fieldName],
            value
          );

          this.resultPopupContainer[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictPopupContainer[fieldName]}: ${value};<br>`;
        }
      });

      this.resultPopupContainer['nativeElement'].innerHTML += '}';
    } else {
      this.resultPopupContainer['nativeElement'].innerHTML = '';
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
      !!this.resultDropdown?.['nativeElement']?.innerHTML ||
      !!this.resultDatepicker?.['nativeElement']?.innerHTML ||
      !!this.resultDatepickerButton?.['nativeElement']?.innerHTML ||
      !!this.resultModal?.['nativeElement']?.innerHTML ||
      !!this.resultLink?.['nativeElement']?.innerHTML ||
      !!this.resultTooltip?.['nativeElement']?.innerHTML ||
      !!this.resultPopup?.['nativeElement']?.innerHTML ||
      !!this.resultPopupContainer?.['nativeElement']?.innerHTML ||
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
      !this.dropdownView ||
      !this.datepickerView ||
      !this.modalView ||
      !this.linkView ||
      !this.tooltipView ||
      !this.popupView ||
      !this.acordionView ||
      !this.calendarView ||
      !this.stepperView
    );
  }

  private verifyIfAllIsVisibility() {
    return (
      (this.botaoDefaultView &&
        this.botaoPrimaryView &&
        this.botaoLinkView &&
        this.switchView &&
        this.radioView &&
        this.disclaimerView &&
        this.inputView &&
        this.selectView &&
        this.textareaView &&
        this.datepickerView &&
        this.linkView &&
        this.tooltipView &&
        this.dropdownView &&
        this.popupView &&
        this.modalView) ||
      (this.linkView && this.tooltipView && this.acordionView && this.calendarView && this.stepperView)
    );
  }

  private isEmpty(objectVerify) {
    return Object.values(objectVerify).every(x => x === null || x === '');
  }
}
