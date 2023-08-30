import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  PoButtonComponent,
  PoDatepickerComponent,
  PoDisclaimerComponent,
  PoDropdownComponent,
  PoInputComponent,
  PoListViewAction,
  PoListViewLiterals,
  PoModalComponent,
  PoPageSlideComponent,
  PoPopupComponent,
  PoSelectComponent,
  PoSwitchComponent,
  PoTextareaComponent
} from '../../../../ui/src/lib';

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['theme-builder.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ThemeBuilderComponent implements AfterViewInit, OnInit {
  @ViewChild('viewCSSModal') viewCSSModal: PoModalComponent;
  @ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;

  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;
  @ViewChild('targeDefault', { read: ElementRef, static: true }) targeDefault: ElementRef;
  @ViewChild('targetHover', { read: ElementRef, static: true }) targetHover: ElementRef;
  @ViewChild('buttonConfig', { read: ElementRef }) buttonConfig: ElementRef;
  @ViewChild('buttonP') buttonP: PoButtonComponent;
  @ViewChild('buttonPDefault', { read: ElementRef }) buttonPDefault: ElementRef;
  @ViewChild('buttonPHover') buttonPHover: PoButtonComponent;
  @ViewChild('buttonPFocus') buttonPFocus: PoButtonComponent;
  @ViewChild('buttonPPressed') buttonPPressed: PoButtonComponent;
  @ViewChild('buttonPDisabled') buttonPDisabled: PoButtonComponent;
  @ViewChild('buttonD') buttonD: PoButtonComponent;
  @ViewChild('buttonDDefault') buttonDDefault: PoButtonComponent;
  @ViewChild('buttonDHover') buttonDHover: PoButtonComponent;
  @ViewChild('buttonDFocus') buttonDFocus: PoButtonComponent;
  @ViewChild('buttonDPressed') buttonDPressed: PoButtonComponent;
  @ViewChild('buttonDDisabled') buttonDDisabled: PoButtonComponent;
  @ViewChild('buttonL') buttonL: PoButtonComponent;
  @ViewChild('buttonLDefault') buttonLDefault: PoButtonComponent;
  @ViewChild('buttonLHover') buttonLHover: PoButtonComponent;
  @ViewChild('buttonLFocus') buttonLFocus: PoButtonComponent;
  @ViewChild('buttonLPressed') buttonLPressed: PoButtonComponent;
  @ViewChild('buttonLDisabled') buttonLDisabled: PoButtonComponent;
  @ViewChild('switch') switch: PoSwitchComponent;
  @ViewChild('switchDefault') switchDefault: PoSwitchComponent;
  @ViewChild('switchChecked') switchChecked: PoSwitchComponent;
  @ViewChild('switchUnchecked') switchUnchecked: PoSwitchComponent;
  @ViewChild('radioDefault', { read: ElementRef }) radioDefault: ElementRef;
  @ViewChild('radioDefault2', { read: ElementRef }) radioDefault2: ElementRef;
  @ViewChild('radioHover', { read: ElementRef }) radioHover: ElementRef;
  @ViewChild('radioHover2', { read: ElementRef }) radioHover2: ElementRef;
  @ViewChild('disclaimer') disclaimerComponent: PoDisclaimerComponent;
  @ViewChild('disclaimerDefault', { read: ElementRef }) disclaimerDefault: ElementRef;
  @ViewChild('disclaimerHover') disclaimerHover: PoDisclaimerComponent;
  @ViewChild('input') inputComponent: PoInputComponent;
  @ViewChild('inputHover') inputHover: PoInputComponent;
  @ViewChild('inputDefault') inputDefault: PoInputComponent;
  @ViewChild('inputFocus') inputFocus: PoInputComponent;
  @ViewChild('inputDisabled') inputDisabled: PoInputComponent;
  @ViewChild('select') selectComponent: PoSelectComponent;
  @ViewChild('selectDefault', { read: ElementRef }) selectDefault: ElementRef;
  @ViewChild('selectHover') selectHover: PoSelectComponent;
  @ViewChild('selectFocus') selectFocus: PoSelectComponent;
  @ViewChild('selectDisabled') selectDisabled: PoSelectComponent;
  @ViewChild('textarea') textareaComponent: PoTextareaComponent;
  @ViewChild('textareaDefault', { read: ElementRef }) textareaDefault: ElementRef;
  @ViewChild('textareaHover') textareaHover: PoTextareaComponent;
  @ViewChild('textareaFocus') textareaFocus: PoTextareaComponent;
  @ViewChild('textareaDisabled') textareaDisabled: PoTextareaComponent;
  @ViewChild('modalBuilder', { read: ElementRef }) modalBuilder: ElementRef;
  @ViewChild('modalDefault', { read: ElementRef }) modalDefault: ElementRef;
  @ViewChild('datepicker') datepickerComponent: PoDatepickerComponent;
  @ViewChild('datepickerDefault') datepickerDefault: PoDatepickerComponent;
  @ViewChild('datepickerHover') datepickerHover: PoDatepickerComponent;
  @ViewChild('datepickerFocus') datepickerFocus: PoDatepickerComponent;
  @ViewChild('datepickerDisabled') datepickerDisabled: PoDatepickerComponent;
  @ViewChild('linkDefault', { read: ElementRef }) linkDefault: ElementRef;
  @ViewChild('linkVisited', { read: ElementRef }) linkVisited: ElementRef;
  @ViewChild('linkUnvisited', { read: ElementRef }) linkUnvisited: ElementRef;
  @ViewChild('tooltip') tooltip: PoButtonComponent;
  @ViewChild('tooltipDefault') tooltipDefault: PoButtonComponent;
  @ViewChild('dropdown') dropdownComponent: PoDropdownComponent;
  @ViewChild('dropdownDefault') dropdownDefault: PoDropdownComponent;
  @ViewChild('dropdownHover') dropdownHover: PoDropdownComponent;
  @ViewChild('dropdownFocus') dropdownFocus: PoDropdownComponent;
  @ViewChild('dropdownDisabled') dropdownDisabled: PoDropdownComponent;
  @ViewChild('popupBuilder') popupBuilder: PoPopupComponent;
  @ViewChild('popupDefault') popupDefault: PoPopupComponent;
  @ViewChild('popupHover') popupHover: PoPopupComponent;
  @ViewChild('checkboxDefault', { read: ElementRef }) checkboxDefault: ElementRef;
  @ViewChild('checkboxChecked', { read: ElementRef }) checkboxChecked: ElementRef;
  @ViewChild('checkboxUnchecked', { read: ElementRef }) checkboxUnchecked: ElementRef;
  @ViewChild('checkboxHover', { read: ElementRef }) checkboxHover: ElementRef;
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
  @ViewChild('resultCheckbox') resultCheckbox: HTMLElement;

  botaoPrimaryView = true;
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
  checkboxView = true;
  switchSampleBuilder = true;

  switchAllComponentes = true;

  colorBack!: string;
  colorText = '#ffffff';
  changedColorButton = false;
  changedColorPopup = false;
  itemSelected!: string;
  kindButton = 1;
  nameItem!: string;
  ratio!: number;
  ratioButton!: number;
  ratioDisclaimer!: number;
  ratioInput!: number;
  ratioSelect!: number;
  ratioTextarea!: number;
  ratioDatepicker!: number;
  ratioTooltip!: number;
  ratioPopup!: number;

  // Cor primária
  brandFormP: FormGroup;

  // Cor secundária
  brandFormS: FormGroup;

  // Cor terciária
  brandFormT: FormGroup;

  // Botão Primário
  buttonFormPrimary: FormGroup;

  // Botão Default
  buttonFormDefault: FormGroup;

  // Botão Link
  buttonFormLink: FormGroup;

  // Switch
  switchForm: FormGroup;

  // disclaimer
  disclaimerForm: FormGroup;

  //input
  inputForm: FormGroup;

  //select
  selectForm: FormGroup;

  //textarea
  textareaForm: FormGroup;

  //datepicker
  datepickerForm: FormGroup;

  //button do datepicker
  datepickerButtonForm: FormGroup;

  //modal
  modalForm: FormGroup;

  //link
  linkForm: FormGroup;

  //tooltip
  tooltipForm: FormGroup;

  //dropdown
  dropdownForm: FormGroup;

  //popup item
  popupForm: FormGroup;

  //popup container
  popupContainerForm: FormGroup;

  // Radio
  radioForm: FormGroup;

  //checkbox
  checkboxForm: FormGroup;

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
    colorPressed: '--color-pressed',
    borderRadius: '--border-radius',
    padding: '--padding'
  };

  private readonly formPropertyDictButtonD = {
    color: '--color',
    colorHover: '--border-color-hover',
    colorBackgroundHover: '--background-hover',
    colorPressed: '--background-pressed',
    borderRadius: '--border-radius',
    padding: '--padding',
    borderWidth: '--border-width'
  };

  private readonly formPropertyDictButtonL = {
    color: '--color',
    colorHover: '--border-color-hover',
    colorBackgroundHover: '--background-hover',
    colorPressed: '--background-pressed',
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
    textColor: '--text-color',
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
    textColor: '--text-color',
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

  private readonly formPropertyDictRadio = {
    color: '--color-checked',
    backgroundColor: '--color-unchecked',
    colorHover: '--shadow-color-hover',
    borderColor: '--border-color'
  };

  private readonly formPropertyDictCheckbox = {
    color: '--color-checked',
    backgroundColor: '--color-unchecked',
    colorHover: '--shadow-color-hover',
    borderColor: '--border-color'
  };

  listViewLiterals: PoListViewLiterals = {
    showDetails: 'Mais Detalhes',
    hideDetails: 'Menos Detalhes'
  };

  listViewAction: Array<PoListViewAction> = [
    {
      label: 'Reset Css',
      action: this.resetCss.bind(this),
      type: 'primary'
    }
  ];

  constructor(private formBuilder: FormBuilder, private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.brandFormP = this.formBuilder.group({
      colorAction: ['#c9357d'] as any
    });

    this.brandFormS = this.formBuilder.group({
      colorAction: ['#753399'] as any
    });

    this.brandFormT = this.formBuilder.group({
      colorAction: ['#ffd464'] as any
    });

    this.buttonFormPrimary = this.formBuilder.group({
      color: [null],
      colorHover: [null],
      colorPressed: [null],
      borderColor: [null],
      textColor: [null],
      colorAction: [null],
      borderRadius: [null],
      padding: [null]
    });

    this.buttonFormDefault = this.formBuilder.group({
      color: [null],
      colorHover: [null],
      colorBackgroundHover: [null],
      colorPressed: [null],
      borderRadius: [null],
      padding: [null],
      borderWidth: [null]
    });

    this.buttonFormLink = this.formBuilder.group({
      color: [null],
      colorHover: [null],
      colorBackgroundHover: [null],
      colorPressed: [null],
      borderRadius: [null],
      padding: [null]
    });

    this.switchForm = this.formBuilder.group({
      backgroundColor: [null],
      color: [null],
      colorIcon: [null],
      borderColor: [null],
      colorDois: [null]
    });

    this.disclaimerForm = this.formBuilder.group({
      color: [null],
      borderColor: [null],
      colorIcon: [null],
      textColor: [null],
      colorHover: [null],
      borderRadius: [null],
      fontSize: [null]
    });

    this.inputForm = this.formBuilder.group({
      borderColor: [null],
      borderColorHover: [null],
      textColor: [null],
      backgroundColor: [null],
      backgroundColorHover: [null],
      fontSize: [null],
      padding: [null]
    });

    this.selectForm = this.formBuilder.group({
      borderColor: [null],
      borderColorHover: [null],
      colorBackground: [null],
      colorBackgroundHover: [null],
      textColor: [null],
      fontSize: [null],
      paddingHorizontal: [null],
      paddingVertical: [null]
    });

    this.textareaForm = this.formBuilder.group({
      borderColor: [null],
      borderColorHover: [null],
      textColor: [null],
      backgroundColor: [null],
      backgroundColorHover: [null],
      fontSize: [null]
    });

    this.datepickerForm = this.formBuilder.group({
      padding: [null],
      fontSize: [null],
      color: [null],
      textColor: [null],
      colorHover: [null],
      backgroundColor: [null],
      backgroundColorHover: [null]
    });

    this.datepickerButtonForm = this.formBuilder.group({
      padding: [null],
      color: [null],
      backgroundColorHover: [null],
      borderColorHover: [null]
    });

    this.modalForm = this.formBuilder.group({
      borderRadius: [null],
      borderWidth: [null],
      opacityValue: [null],
      backgroundColor: [null],
      borderColor: [null],
      overlayColor: [null],
      dividerColor: [null]
    });

    this.linkForm = this.formBuilder.group({
      colorVisited: [null],
      color: [null],
      colorOutline: [null]
    });

    this.tooltipForm = this.formBuilder.group({
      color: [null],
      borderRadius: [null],
      textColor: [null]
    });

    this.dropdownForm = this.formBuilder.group({
      fontSize: [null],
      borderRadius: [null],
      borderWidth: [null],
      padding: [null],
      color: [null],
      colorHover: [null],
      backgroundColorHover: [null]
    });

    this.popupForm = this.formBuilder.group({
      textColor: [null],
      colorHover: [null],
      colorBackgroundHover: [null]
    });

    this.popupContainerForm = this.formBuilder.group({
      colorBackground: [null]
    });

    this.radioForm = this.formBuilder.group({
      color: [null],
      backgroundColor: [null],
      colorHover: [null],
      borderColor: [null]
    });

    this.checkboxForm = this.formBuilder.group({
      color: [null],
      backgroundColor: [null],
      colorHover: [null],
      borderColor: [null]
    });
  }

  openGetcss() {
    this.viewCSSModal.open();
  }

  resetCss() {
    this.brandFormP.reset({
      colorAction: ['#c9357d']
    });
    document.getElementById('myPortal').style.setProperty('--color-primary', null);

    this.brandFormS.reset({
      colorAction: ['#753399']
    });
    document.getElementById('myPortal').style.setProperty('--color-secondary', null);

    this.brandFormT.reset({
      colorAction: ['#ffd464']
    });
    document.getElementById('myPortal').style.setProperty('--color-tertiary', null);

    this.buttonFormDefault.reset();
    Object.keys(this.formPropertyDictButtonD).forEach((fieldName: string) => {
      this.buttonD.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonD[fieldName], null);
      if (this.itemSelected === 'button') {
        this.buttonDDefault.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonD[fieldName],
          null
        );
        this.buttonDHover.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonD[fieldName], null);
        this.buttonDFocus.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonD[fieldName], null);
        this.buttonDPressed.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonD[fieldName],
          null
        );
        this.buttonDDisabled.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonD[fieldName],
          null
        );
      }
    });

    this.buttonFormPrimary.reset();
    Object.keys(this.formPropertyDictButtonP).forEach((fieldName: string) => {
      this.buttonP.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], null);
      if (this.itemSelected === 'button') {
        this.buttonPDefault.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], null);
        this.buttonPHover.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], null);
        this.buttonPFocus.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], null);
        this.buttonPPressed.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonP[fieldName],
          null
        );
        this.buttonPDisabled.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonP[fieldName],
          null
        );
      }
    });

    this.buttonFormLink.reset();
    Object.keys(this.formPropertyDictButtonL).forEach((fieldName: string) => {
      this.buttonL.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonL[fieldName], null);
      if (this.itemSelected === 'button') {
        this.buttonLDefault.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonL[fieldName],
          null
        );
        this.buttonLHover.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonL[fieldName], null);
        this.buttonLFocus.buttonElement.nativeElement.style.setProperty(this.formPropertyDictButtonL[fieldName], null);
        this.buttonLPressed.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonL[fieldName],
          null
        );
        this.buttonLDisabled.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictButtonL[fieldName],
          null
        );
      }
    });

    this.switchForm.reset();
    Object.keys(this.formPropertyDictSwitch).forEach((fieldName: string) => {
      this.switch.switchContainer.nativeElement.style.setProperty(this.formPropertyDictSwitch[fieldName], null);
      if (this.itemSelected === 'switch') {
        this.switchDefault.switchContainer.nativeElement.style.setProperty(
          this.formPropertyDictSwitch[fieldName],
          null
        );
        this.switchChecked.switchContainer.nativeElement.style.setProperty(
          this.formPropertyDictSwitch[fieldName],
          null
        );
        this.switchUnchecked.switchContainer.nativeElement.style.setProperty(
          this.formPropertyDictSwitch[fieldName],
          null
        );
      }
    });

    this.radioForm.reset();
    Object.keys(this.formPropertyDictRadio).forEach((fieldName: string) => {
      document.getElementById('myRadio').style.setProperty(this.formPropertyDictRadio[fieldName], null);
      document.getElementById('myRadio2').style.setProperty(this.formPropertyDictRadio[fieldName], null);
      if (this.itemSelected === 'radio') {
        this.radioDefault.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], null);
        this.radioDefault2.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], null);
        this.radioHover.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], null);
        this.radioHover2.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], null);
      }
    });

    this.disclaimerForm.reset();
    Object.keys(this.formPropertyDictDisclaimer).forEach((fieldName: string) => {
      this.disclaimerComponent.disclaimerContainer.nativeElement.style.setProperty(
        this.formPropertyDictDisclaimer[fieldName],
        null
      );
      if (this.itemSelected === 'disclaimer') {
        this.disclaimerDefault.nativeElement.style.setProperty(this.formPropertyDictDisclaimer[fieldName], null);
        this.disclaimerHover.disclaimerContainer.nativeElement.style.setProperty(
          this.formPropertyDictDisclaimer[fieldName],
          null
        );
      }
    });

    this.inputForm.reset();
    Object.keys(this.formPropertyDictInput).forEach((fieldName: string) => {
      this.inputComponent.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
      if (this.itemSelected === 'input') {
        this.inputHover.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
        this.inputDefault.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
        this.inputFocus.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
        this.inputDisabled.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], null);
      }
    });

    this.selectForm.reset();
    Object.keys(this.formPropertyDictSelect).forEach((fieldName: string) => {
      this.selectComponent.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
      if (this.itemSelected === 'select') {
        this.selectDefault.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
        this.selectHover.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
        this.selectFocus.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
        this.selectDisabled.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], null);
      }
    });

    this.textareaForm.reset();
    Object.keys(this.formPropertyDictTextarea).forEach((fieldName: string) => {
      this.textareaComponent.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
      if (this.itemSelected === 'textarea') {
        this.textareaDefault.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
        this.textareaHover.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
        this.textareaFocus.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
        this.textareaDisabled.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], null);
      }
    });

    this.dropdownForm.reset();
    Object.keys(this.formPropertyDictDropdown).forEach((fieldName: string) => {
      this.dropdownComponent.dropdownRef.nativeElement.style.setProperty(
        this.formPropertyDictDropdown[fieldName],
        null
      );
      if (this.itemSelected === 'drodpdown') {
        this.dropdownDefault.dropdownRef.nativeElement.style.setProperty(
          this.formPropertyDictDropdown[fieldName],
          null
        );
        this.dropdownHover.dropdownRef.nativeElement.style.setProperty(this.formPropertyDictDropdown[fieldName], null);
        this.dropdownFocus.dropdownRef.nativeElement.style.setProperty(this.formPropertyDictDropdown[fieldName], null);
        this.dropdownDisabled.dropdownRef.nativeElement.style.setProperty(
          this.formPropertyDictDropdown[fieldName],
          null
        );
      }
    });

    this.datepickerForm.reset();
    Object.keys(this.formPropertyDictDatepicker).forEach((fieldName: string) => {
      this.datepickerComponent.inputEl.nativeElement.style.setProperty(
        this.formPropertyDictDatepicker[fieldName],
        null
      );
      if (this.itemSelected === 'datepicker') {
        this.datepickerDefault.inputEl.nativeElement.style.setProperty(
          this.formPropertyDictDatepicker[fieldName],
          null
        );
        this.datepickerHover.inputEl.nativeElement.style.setProperty(this.formPropertyDictDatepicker[fieldName], null);
        this.datepickerDisabled.inputEl.nativeElement.style.setProperty(
          this.formPropertyDictDatepicker[fieldName],
          null
        );
      }
    });

    this.datepickerButtonForm.reset();
    Object.keys(this.formPropertyDictDatepickerButton).forEach((fieldName: string) => {
      this.datepickerComponent.iconDatepicker.buttonElement.nativeElement.style.setProperty(
        this.formPropertyDictDatepickerButton[fieldName],
        null
      );
      if (this.itemSelected === 'datepicker') {
        this.datepickerDefault.iconDatepicker.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictDatepickerButton[fieldName],
          null
        );
        this.datepickerHover.iconDatepicker.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictDatepickerButton[fieldName],
          null
        );
        this.datepickerDisabled.iconDatepicker.buttonElement.nativeElement.style.setProperty(
          this.formPropertyDictDatepickerButton[fieldName],
          null
        );
      }
    });

    this.modalForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      this.modalBuilder.nativeElement.style.setProperty(this.formPropertyDictModal[fieldName], null);
      if (this.itemSelected === 'modal') {
        this.modalDefault.nativeElement.style.setProperty(this.formPropertyDictModal[fieldName], null);
      }
    });

    this.linkForm.reset();
    Object.keys(this.formPropertyDictLink).forEach((fieldName: string) => {
      document.getElementById('myLink').style.setProperty(this.formPropertyDictLink[fieldName], null);
      if (this.itemSelected === 'link') {
        this.linkDefault.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], null);
        this.linkVisited.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], null);
        this.linkUnvisited.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], null);
      }
    });

    this.popupForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      this.popupBuilder.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
        this.formPropertyDictPopup[fieldName],
        null
      );
      if (this.itemSelected === 'popup') {
        this.popupDefault.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
          this.formPropertyDictPopup[fieldName],
          null
        );
        this.popupHover.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
          this.formPropertyDictPopup[fieldName],
          null
        );
      }
    });

    this.popupContainerForm.reset();
    Object.keys(this.formPropertyDictModal).forEach((fieldName: string) => {
      if (this?.popupBuilder?.listbox?.nativeElement?.listbox) {
        this.popupBuilder.listbox.nativeElement.listbox.nativeElement.style.setProperty(
          this.formPropertyDictModal[fieldName],
          null
        );
        if (this.itemSelected === 'popup') {
          this.popupDefault.listbox.nativeElement.listbox.nativeElement.style.setProperty(
            this.formPropertyDictModal[fieldName],
            null
          );
          this.popupHover.listbox.nativeElement.listbox.nativeElement.style.setProperty(
            this.formPropertyDictModal[fieldName],
            null
          );
        }
      }
    });

    this.checkboxForm.reset();
    Object.keys(this.formPropertyDictCheckbox).forEach((fieldName: string) => {
      document.getElementById('myCheckbox').style.setProperty(this.formPropertyDictCheckbox[fieldName], null);
      if (this.itemSelected === 'checkbox') {
        this.checkboxDefault.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], null);
        this.checkboxChecked.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], null);
        this.checkboxUnchecked.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], null);
        this.checkboxHover.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], null);
      }
    });

    const tooltipElement = document.querySelector('.po-tooltip');
    if (tooltipElement) {
      this.tooltipForm.reset();
      Object.keys(this.formPropertyDictTooltip).forEach((fieldName: string) => {
        this.tooltip.buttonElement.nativeElement.nextElementSibling.style.setProperty(
          this.formPropertyDictTooltip[fieldName],
          null
        );
      });
      if (this.itemSelected === 'tooltip') {
        const tooltipDefault = this.tooltipDefault.buttonElement.nativeElement.nextElementSibling;
        Object.keys(this.formPropertyDictTooltip).forEach((fieldName: string) => {
          tooltipDefault.style.setProperty(this.formPropertyDictTooltip[fieldName], null);
        });
      }
    }

    this.setRatioDefault();
    this.changedColorButton = false;
    this.changedColorPopup = false;
  }

  changeKindButton(kindValue: number): void {
    this.kindButton = kindValue;
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
    this.buttonConfig.nativeElement.focus();
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
    this.checkboxForm.valueChanges.subscribe(changes => this.checkChangesCheckbox(changes));

    this.setRatioDefault();
  }

  openPageSlide(itemLabel: string, item: string) {
    this.itemSelected = item;
    this.nameItem = `Personalizar ${itemLabel}`;
    this.cdr.detectChanges();
    if (item === 'button') {
      this.setColorsBackAndText(this.buttonPDefault.nativeElement, this.ratioButton, '--color');
    }
    if (item === 'disclaimer') {
      this.setColorsBackAndText(this.disclaimerDefault.nativeElement, this.ratioDisclaimer, '--color');
    }
    if (item === 'input') {
      this.setColorsBackAndText(this.inputDefault.inp.nativeElement, this.ratioInput);
    }
    if (item === 'select') {
      this.setColorsBackAndText(this.selectDefault.nativeElement, this.ratioSelect);
    }
    if (item === 'textarea') {
      this.setColorsBackAndText(this.textareaDefault.nativeElement, this.ratioTextarea);
    }
    if (item === 'datepicker') {
      this.setColorsBackAndText(this.datepickerDefault.inputEl.nativeElement, this.ratioDatepicker);
    }
    if (item === 'tooltip') {
      const tooltip = this.tooltip.buttonElement.nativeElement.nextElementSibling;
      this.setColorsBackAndText(tooltip, this.ratioTooltip);
    }
    if (item === 'popup') {
      this.popupBuilder.open();
      const popup = this.popupBuilder.poListBoxRef.listboxItemList.nativeElement.children[0].children[0];
      this.setColorsBackAndText(popup, this.ratioPopup, '--background', '--color');
    }
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
      this.botaoPrimaryView = true;
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
      this.checkboxView = true;
    } else {
      this.botaoPrimaryView = false;
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
      this.checkboxView = false;
    }
  }

  verifyIfItemVisibility() {
    return (
      this.botaoPrimaryView ||
      this.switchView ||
      this.radioView ||
      this.disclaimerView ||
      this.inputView ||
      this.selectView ||
      this.textareaView ||
      this.dropdownView ||
      this.datepickerView ||
      this.modalView ||
      this.linkView ||
      this.tooltipView ||
      this.popupView ||
      this.checkboxView
    );
  }

  private calculateRatio(colorBack: any, colorText: any) {
    const color1rgb = this.calculatehexToRgb(colorBack);
    const color2rgb = this.calculatehexToRgb(colorText);

    const color1luminance = this.calculateLuminance(color1rgb.r, color1rgb.g, color1rgb.b);
    const color2luminance = this.calculateLuminance(color2rgb.r, color2rgb.g, color2rgb.b);

    const brightest = Math.max(color1luminance, color2luminance);
    const darkest = Math.min(color1luminance, color2luminance);
    const ratio = (brightest + 0.05) / (darkest + 0.05);

    return Math.round(ratio * 100) / 100;
  }

  private calculatehexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  private calculateLuminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  private checkChangesBrandP(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementById('myPortal').style.setProperty(this.formPropertyP[fieldName], value);
      }
    });
  }

  private checkChangesBrandT(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementById('myPortal').style.setProperty(this.formPropertyT[fieldName], value);
      }
    });
  }

  private checkChangesBrandS(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        document.getElementById('myPortal').style.setProperty(this.formPropertyS[fieldName], value);
        const colorBack = getComputedStyle(document.querySelector('po-page-default')).getPropertyValue(
          '--color-secondary'
        );
        if (!this.changedColorButton) {
          this.ratioButton = this.setRatioComponent(this.changedColorButton, colorBack, '#ffffff');
        }
        if (!this.changedColorPopup) {
          this.ratioPopup = this.setRatioComponent(this.changedColorPopup, colorBack, '#ffffff');
        }
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
          this.buttonPDefault.nativeElement.style.setProperty(this.formPropertyDictButtonP[fieldName], value);
          this.buttonPHover.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonP[fieldName],
            value
          );
          this.buttonPFocus.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonP[fieldName],
            value
          );
          this.buttonPPressed.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonP[fieldName],
            value
          );
          this.buttonPDisabled.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonP[fieldName],
            value
          );
          this.resultButtonP['nativeElement'].innerHTML += `${this.formPropertyDictButtonP[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioButton = this.checkChangesContrast(changes, fieldName, this.ratioButton);
          if (fieldName === 'color') {
            this.changedColorButton = true;
          }
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
          this.buttonDDefault.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonD[fieldName],
            value
          );
          this.buttonDHover.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonD[fieldName],
            value
          );
          this.buttonDFocus.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonD[fieldName],
            value
          );
          this.buttonDPressed.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonD[fieldName],
            value
          );
          this.buttonDDisabled.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonD[fieldName],
            value
          );
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
          this.buttonLDefault.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonL[fieldName],
            value
          );
          this.buttonLHover.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonL[fieldName],
            value
          );
          this.buttonLFocus.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonL[fieldName],
            value
          );
          this.buttonLPressed.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonL[fieldName],
            value
          );
          this.buttonLDisabled.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictButtonL[fieldName],
            value
          );

          this.resultButtonL['nativeElement'].innerHTML += `${this.formPropertyDictButtonL[fieldName]}: ${value};<br>`;
        }
      });

      this.resultButtonL['nativeElement'].innerHTML += '}';
    } else {
      this.resultButtonL['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesContrast(
    changes: { [key: string]: string },
    fieldName: string,
    actualRatio: number,
    background = 'color'
  ) {
    if (fieldName === background || fieldName === 'textColor') {
      if (fieldName === 'textColor') {
        this.colorText = changes[fieldName];
      } else {
        this.colorBack = changes[fieldName];
      }

      return this.calculateRatio(this.colorBack, this.colorText);
    }
    return actualRatio;
  }

  private checkChangesSwitch(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultSwitch['nativeElement'].innerHTML = 'po-switch {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

        if (changes[fieldName]) {
          this.switch.switchContainer.nativeElement.style.setProperty(this.formPropertyDictSwitch[fieldName], value);
          this.switchDefault.switchContainer.nativeElement.style.setProperty(
            this.formPropertyDictSwitch[fieldName],
            value
          );
          this.switchChecked.switchContainer.nativeElement.style.setProperty(
            this.formPropertyDictSwitch[fieldName],
            value
          );
          this.switchUnchecked.switchContainer.nativeElement.style.setProperty(
            this.formPropertyDictSwitch[fieldName],
            value
          );

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
        this.radioDefault.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], value);
        this.radioDefault2.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], value);
        this.radioHover.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], value);
        this.radioHover2.nativeElement.style.setProperty(this.formPropertyDictRadio[fieldName], value);
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
          this.disclaimerDefault.nativeElement.style.setProperty(this.formPropertyDictDisclaimer[fieldName], value);
          this.disclaimerHover.disclaimerContainer.nativeElement.style.setProperty(
            this.formPropertyDictDisclaimer[fieldName],
            value
          );

          this.resultDisclaimer[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDisclaimer[fieldName]}: ${value};<br>`;

          this.ratio = this.ratioDisclaimer = this.checkChangesContrast(changes, fieldName, this.ratioDisclaimer);
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
          this.inputHover.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], value);
          this.inputDefault.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], value);
          this.inputFocus.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], value);
          this.inputDisabled.inp.nativeElement.style.setProperty(this.formPropertyDictInput[fieldName], value);

          this.resultInput['nativeElement'].innerHTML += `${this.formPropertyDictInput[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioInput = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioInput,
            'backgroundColor'
          );
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
          this.selectDefault.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], value);
          this.selectHover.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], value);
          this.selectFocus.selectElement.nativeElement.style.setProperty(this.formPropertyDictSelect[fieldName], value);
          this.selectDisabled.selectElement.nativeElement.style.setProperty(
            this.formPropertyDictSelect[fieldName],
            value
          );

          this.resultSelect['nativeElement'].innerHTML += `${this.formPropertyDictSelect[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioSelect = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioSelect,
            'colorBackground'
          );
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
          this.textareaDefault.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], value);
          this.textareaHover.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], value);
          this.textareaFocus.inputEl.nativeElement.style.setProperty(this.formPropertyDictTextarea[fieldName], value);
          this.textareaDisabled.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictTextarea[fieldName],
            value
          );

          this.resultTextarea[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictTextarea[fieldName]}: ${value};<br>`;

          this.ratio = this.ratioTextarea = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioTextarea,
            'backgroundColor'
          );
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
          this.dropdownDefault.dropdownRef.nativeElement.style.setProperty(
            this.formPropertyDictDropdown[fieldName],
            value
          );
          this.dropdownHover.dropdownRef.nativeElement.style.setProperty(
            this.formPropertyDictDropdown[fieldName],
            value
          );
          this.dropdownFocus.dropdownRef.nativeElement.style.setProperty(
            this.formPropertyDictDropdown[fieldName],
            value
          );
          this.dropdownDisabled.dropdownRef.nativeElement.style.setProperty(
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
          this.datepickerDefault.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictDatepicker[fieldName],
            value
          );
          this.datepickerHover.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictDatepicker[fieldName],
            value
          );
          this.datepickerDisabled.inputEl.nativeElement.style.setProperty(
            this.formPropertyDictDatepicker[fieldName],
            value
          );

          this.resultDatepicker[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictDatepicker[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioDatepicker = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioDatepicker,
            'backgroundColor'
          );
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
          this.datepickerDefault.iconDatepicker.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictDatepickerButton[fieldName],
            value
          );
          this.datepickerHover.iconDatepicker.buttonElement.nativeElement.style.setProperty(
            this.formPropertyDictDatepickerButton[fieldName],
            value
          );
          this.datepickerDisabled.iconDatepicker.buttonElement.nativeElement.style.setProperty(
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
          this.modalDefault.nativeElement.style.setProperty(this.formPropertyDictModal[fieldName], value);

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

      this.checkDiffLink(changes);

      this.resultLink['nativeElement'].innerHTML += '}';
    } else {
      this.resultLink['nativeElement'].innerHTML = '';
    }
  }

  private checkDiffLink(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      let value;
      if (typeof changes[fieldName] === 'number') {
        value = `${changes[fieldName]}px`;
      } else {
        value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
      }

      if (changes[fieldName]) {
        document.getElementById('myLink').style.setProperty(this.formPropertyDictLink[fieldName], value);
        this.linkDefault.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], value);
        this.linkVisited.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], value);
        this.linkUnvisited.nativeElement.style.setProperty(this.formPropertyDictLink[fieldName], value);
        this.resultLink['nativeElement'].innerHTML += `${this.formPropertyDictLink[fieldName]}: ${value};<br>`;
      }
    });
  }

  private checkChangesTooltip(changes: { [key: string]: string }): void {
    const tooltipElement = document.querySelector('.po-tooltip');
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
            const tooltipDefault = this.tooltipDefault.buttonElement.nativeElement.nextElementSibling;
            this.tooltip.buttonElement.nativeElement.nextElementSibling.style.setProperty(
              this.formPropertyDictTooltip[fieldName],
              value
            );
            tooltipDefault.style.setProperty(this.formPropertyDictTooltip[fieldName], value);

            this.resultTooltip[
              'nativeElement'
            ].innerHTML += `${this.formPropertyDictTooltip[fieldName]}: ${value};<br>`;
            this.ratio = this.ratioTooltip = this.checkChangesContrast(changes, fieldName, this.ratioTooltip);
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
    this.popupDefault?.open();
    this.popupHover?.open();

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
          this.popupDefault.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
            this.formPropertyDictPopup[fieldName],
            value
          );
          this.popupHover.poListBoxRef.listboxItemList.nativeElement.children[0].children[0].style.setProperty(
            this.formPropertyDictPopup[fieldName],
            value
          );

          this.resultPopup['nativeElement'].innerHTML += `${this.formPropertyDictPopup[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioPopup = this.checkChangesContrast(changes, fieldName, this.ratioPopup);
        }
      });

      this.resultPopup['nativeElement'].innerHTML += '}';
    } else {
      this.resultPopup['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesCheckbox(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultCheckbox['nativeElement'].innerHTML = 'po-checkbox {<br>';

      this.checkDiffCheckbox(changes);

      this.resultCheckbox['nativeElement'].innerHTML += '}';
    } else {
      this.resultCheckbox['nativeElement'].innerHTML = '';
    }
  }

  private checkDiffCheckbox(changes: any): void {
    Object.keys(changes).forEach((fieldName: string) => {
      const value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;

      if (changes[fieldName]) {
        this.checkboxDefault.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], value);
        this.checkboxChecked.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], value);
        this.checkboxUnchecked.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], value);
        this.checkboxHover.nativeElement.style.setProperty(this.formPropertyDictCheckbox[fieldName], value);
        document.getElementById('myCheckbox').style.setProperty(this.formPropertyDictCheckbox[fieldName], value);
        this.resultCheckbox['nativeElement'].innerHTML += `${this.formPropertyDictCheckbox[fieldName]}: ${value};<br>`;
      }
    });
  }

  private checkChangesPopupContainer(changes: { [key: string]: string }): void {
    this.popupBuilder.open();
    this.popupDefault?.open();
    this.popupHover?.open();

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
          this.popupDefault.listbox['nativeElement'].style.setProperty(
            this.formPropertyDictPopupContainer[fieldName],
            value
          );
          this.popupHover.listbox['nativeElement'].style.setProperty(
            this.formPropertyDictPopupContainer[fieldName],
            value
          );

          this.resultPopupContainer[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictPopupContainer[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioPopup = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioPopup,
            'colorBackground'
          );
          if (fieldName === 'colorBackground') {
            this.changedColorPopup = true;
          }
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
      !!this.resultCheckbox?.['nativeElement']?.innerHTML ||
      !!this.resultInput?.['nativeElement']?.innerHTML
    );
  }

  private setColorsBackAndText(
    component: Element,
    ratioComponent: number,
    tokenColor = '--background',
    tokenText = '--text-color'
  ) {
    this.colorBack = getComputedStyle(component).getPropertyValue(tokenColor);
    this.colorText = getComputedStyle(component).getPropertyValue(tokenText);
    this.ratio = ratioComponent;
  }

  private setRatioComponent(initialComponent: boolean, colorBack: string, colorText?: string) {
    if (!initialComponent) {
      this.colorBack = colorBack;
      this.colorText = colorText ? colorText : this.colorText;
      return this.calculateRatio(this.colorBack, this.colorText);
    }
  }

  private setRatioDefault() {
    this.ratioButton = this.setRatioComponent(false, '#2c3739', '#ffffff');
    this.ratioDisclaimer = this.setRatioComponent(false, '#f2eaf6', '#2c3739');
    this.ratioDatepicker = this.ratioTextarea = this.ratioInput = this.ratioSelect = this.setRatioComponent(
      false,
      '#fbfbfb',
      '#1d2426'
    );
    this.ratioTooltip = this.setRatioComponent(false, '#2c3739', '#ffffff');
    this.ratioPopup = this.setRatioComponent(false, '#ffffff', '#753399');
    this.cdr.detectChanges();
  }

  private verifyIfAllNotVisibility() {
    return (
      !this.botaoPrimaryView ||
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
      !this.checkboxView
    );
  }

  verifyIfAllIsVisibility() {
    return (
      this.botaoPrimaryView &&
      this.switchView &&
      this.radioView &&
      this.disclaimerView &&
      this.inputView &&
      this.selectView &&
      this.textareaView &&
      this.dropdownView &&
      this.datepickerView &&
      this.modalView &&
      this.linkView &&
      this.tooltipView &&
      this.popupView &&
      this.checkboxView
    );
  }

  private isEmpty(objectVerify) {
    return Object.values(objectVerify).every(x => x === null || x === '');
  }
}
