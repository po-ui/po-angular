import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  PoAccordionComponent,
  PoBreadcrumbComponent,
  PoButtonComponent,
  PoComboComponent,
  PoDatepickerComponent,
  PoDisclaimerComponent,
  PoDropdownComponent,
  PoInputComponent,
  PoListViewAction,
  PoListViewLiterals,
  PoModalComponent,
  PoMultiselectComponent,
  PoPageSlideComponent,
  PoPopupComponent,
  PoSelectComponent,
  PoSwitchComponent,
  PoTagComponent,
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
  @ViewChild('multiselect') multiselectComponent: PoMultiselectComponent;
  @ViewChild('multiselectDefault', { read: ElementRef }) multiselectDefault: ElementRef;
  @ViewChild('multiselectHover') multiselectHover: PoMultiselectComponent;
  @ViewChild('multiselectFocus') multiselectFocus: PoMultiselectComponent;
  @ViewChild('multiselectDisabled') multiselectDisabled: PoMultiselectComponent;
  @ViewChild('combo') comboComponent: PoComboComponent;
  @ViewChild('comboDefault', { read: ElementRef }) comboDefault: ElementRef;
  @ViewChild('comboHover') comboHover: PoComboComponent;
  @ViewChild('comboFocus') comboFocus: PoComboComponent;
  @ViewChild('comboDisabled') comboDisabled: PoComboComponent;
  @ViewChild('accordion') accordionComponent: PoAccordionComponent;
  @ViewChild('accordionDefault', { read: ElementRef }) accordionDefault: ElementRef;
  @ViewChild('accordionHover') accordionHover: PoAccordionComponent;
  @ViewChild('accordionFocus') accordionFocus: PoAccordionComponent;
  @ViewChild('accordionPressed') accordionPressed: PoAccordionComponent;
  @ViewChild('accordionDisabled') accordionDisabled: PoAccordionComponent;
  @ViewChild('breadcrumb') breadcrumbComponent: PoBreadcrumbComponent;
  @ViewChild('breadcrumbDefault', { read: ElementRef }) breadcrumbDefault: ElementRef;
  @ViewChild('tag') tagComponent: PoTagComponent;
  @ViewChild('tagDefault', { read: ElementRef }) tagDefault: ElementRef;
  @ViewChild('tagDanger', { read: ElementRef }) tagDanger: ElementRef;
  @ViewChild('tagSuccess', { read: ElementRef }) tagSuccess: ElementRef;
  @ViewChild('tagWarning', { read: ElementRef }) tagWarning: ElementRef;
  @ViewChild('tagNeutral', { read: ElementRef }) tagNeutral: ElementRef;
  @ViewChild('tagRemovable', { read: ElementRef }) tagRemovable: ElementRef;
  @ViewChild('tagHover', { read: ElementRef }) tagHover: ElementRef;
  @ViewChild('tagDisabled', { read: ElementRef }) tagDisabled: ElementRef;

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
  @ViewChild('resultMultiselect') resultMultiselect: HTMLElement;
  @ViewChild('resultCombo') resultCombo: HTMLElement;
  @ViewChild('resultAccordion') resultAccordion: HTMLElement;
  @ViewChild('resultBreadcrumb') resultBreadcrumb: HTMLElement;
  @ViewChild('resultTag') resultTag: HTMLElement;
  @ViewChild('resultTagsGlobal') resultTagsGlobal: HTMLElement;

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
  multiselectView = true;
  comboView = true;
  accordionView = true;
  breadcrumbView = true;
  tagView = true;
  switchSampleBuilder = true;

  resultTagI = '';
  resultTagD = '';
  resultTagS = '';
  resultTagW = '';
  resultTagN = '';
  resultTagR = '';

  switchAllComponentes = true;

  colorText = '#ffffff';
  changedColorButton = false;
  changedColorPopup = false;
  changedColorAccordion = false;
  kindButton = 1;
  tagSelected = 1;

  colorBack!: string;
  itemSelected!: string;
  nameItem!: string;
  ratio!: number;
  ratioButton!: number;
  ratioDisclaimer!: number;
  ratioInput!: number;
  ratioSelect!: number;
  ratioMultiselect!: number;
  ratioCombo!: number;
  ratioAccordion!: number;
  ratioTag!: number;
  ratioTagDefault!: number;
  ratioTagDanger!: number;
  ratioTagSuccess!: number;
  ratioTagWarning!: number;
  ratioTagNeutral!: number;
  ratioTagRemovable!: number;
  ratioTextarea!: number;
  ratioDatepicker!: number;
  ratioTooltip!: number;
  ratioPopup!: number;
  tagActive;

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

  //multiselect
  multiselectForm: FormGroup;

  //combo
  comboForm: FormGroup;

  //accordion
  accordionForm: FormGroup;

  //breadcrumb
  breadcrumbForm: FormGroup;

  //tag
  tagForm;
  tagsFormGlobal: FormGroup;
  tagFormI: FormGroup;
  tagFormD: FormGroup;
  tagFormS: FormGroup;
  tagFormW: FormGroup;
  tagFormN: FormGroup;
  tagFormR: FormGroup;

  private readonly formPropertyP = {
    colorAction: '--color-primary'
  };

  private readonly formPropertyS = {
    colorAction: '--color-action-default'
  };

  private readonly formPropertyT = {
    colorAction: '--color-brand-03-base'
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

  private readonly formPropertyDictMultiselect = {
    borderColor: '--color',
    borderColorHover: '--color-hover',
    colorBackground: '--background',
    colorBackgroundHover: '--background-hover',
    textColor: '--text-color-placeholder',
    fontSize: '--font-size',
    colorFocus: '--color-focused',
    colorDisabled: '--background-disabled'
  };

  private readonly formPropertyDictCombo = {
    borderColor: '--color',
    borderColorHover: '--color-hover',
    colorBackground: '--background',
    colorBackgroundHover: '--background-hover',
    colorFocus: '--color-focused',
    colorDisabled: '--background-disabled',
    fontSize: '--font-size',
    textColor: '--text-color',
    textColorPlaceholder: '--text-color-placeholder'
  };

  private readonly formPropertyDictAccordion = {
    colorBackground: '--background-color',
    colorHover: '--background-hover',
    colorPressed: '--background-pressed',
    colorDisabled: '--background-disabled',
    textColor: '--color',
    textColorDisabled: '--color-disabled',
    textColorHover: '--color-hover',
    textColorPressed: '--color-pressed',
    textColorFocus: '--color-focus',
    fontSize: '--font-size'
  };

  private readonly formPropertyDictBreadcrumb = {
    colorIcon: '--color-icon',
    colorCurrentPage: '--color-current-page',
    color: '--color'
  };

  private formPropertyDictTag;
  private readonly formPropertyDictTagI = {
    backgroundColor: '--color-info',
    textColor: '--text-color-info'
  };

  private readonly formPropertyDictTagD = {
    backgroundColor: '--color-negative',
    textColor: '--text-color-negative'
  };

  private readonly formPropertyDictTagS = {
    backgroundColor: '--color-positive',
    textColor: '--text-color-positive'
  };

  private readonly formPropertyDictTagW = {
    backgroundColor: '--color-tag-warning',
    textColor: '--text-color-warning'
  };

  private readonly formPropertyDictTagN = {
    backgroundColor: '--color-neutral',
    textColor: '--text-color-neutral'
  };

  private readonly formPropertyDictTagR = {
    backgroundColor: '--color',
    textColor: '--text-color',
    borderColor: '--border-color',
    colorHover: '--color-hover',
    colorDisabled: '--color-disabled',
    textColorDisabled: '--text-color-disabled',
    borderColorDisabled: '--border-color-disabled'
  };

  private readonly formPropertyDictTagsGlobal = {
    borderRadius: '--border-radius',
    fontSize: '--font-size',
    lineHeight: '--line-height'
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

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {}

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

    this.multiselectForm = this.formBuilder.group({
      borderColor: [null],
      borderColorHover: [null],
      colorBackground: [null],
      colorBackgroundHover: [null],
      textColor: [null],
      fontSize: [null],
      colorFocus: [null],
      colorDisabled: [null]
    });

    this.comboForm = this.formBuilder.group({
      borderColor: [null],
      borderColorHover: [null],
      colorBackground: [null],
      colorBackgroundHover: [null],
      textColor: [null],
      textColorPlaceholder: [null],
      fontSize: [null],
      colorFocus: [null],
      colorDisabled: [null]
    });

    this.accordionForm = this.formBuilder.group({
      fontSize: [null],
      colorBackground: [null],
      colorHover: [null],
      colorPressed: [null],
      textColor: [null],
      textColorHover: [null],
      textColorPressed: [null],
      textColorFocus: [null],
      colorDisabled: [null],
      textColorDisabled: [null]
    });

    this.breadcrumbForm = this.formBuilder.group({
      colorIcon: [null],
      colorCurrentPage: [null],
      color: [null]
    });

    this.tagFormI = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null]
    });

    this.tagFormD = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null]
    });

    this.tagFormS = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null]
    });

    this.tagFormW = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null]
    });

    this.tagFormN = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null]
    });

    this.tagFormR = this.formBuilder.group({
      backgroundColor: [null],
      textColor: [null],
      borderColor: [null],
      colorHover: [null],
      colorDisabled: [null],
      textColorDisabled: [null],
      borderColorDisabled: [null]
    });

    this.tagsFormGlobal = this.formBuilder.group({
      borderRadius: [null],
      fontSize: [null],
      lineHeight: [null]
    });
    this.tagForm = this.tagFormI;
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
    document.getElementById('myPortal').style.setProperty('--color-action-default', null);

    this.brandFormT.reset({
      colorAction: ['#ffd464']
    });
    document.getElementById('myPortal').style.setProperty('--color-brand-03-base', null);

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

    this.multiselectForm.reset();
    Object.keys(this.formPropertyDictMultiselect).forEach((fieldName: string) => {
      this.multiselectComponent.inputElement.nativeElement.style.setProperty(
        this.formPropertyDictMultiselect[fieldName],
        null
      );
      if (this.itemSelected === 'multiselect') {
        this.multiselectDefault.nativeElement.style.setProperty(this.formPropertyDictMultiselect[fieldName], null);
        this.multiselectHover.inputElement.nativeElement.style.setProperty(
          this.formPropertyDictMultiselect[fieldName],
          null
        );
        this.multiselectFocus.inputElement.nativeElement.style.setProperty(
          this.formPropertyDictMultiselect[fieldName],
          null
        );
        this.multiselectDisabled.inputElement.nativeElement.style.setProperty(
          this.formPropertyDictMultiselect[fieldName],
          null
        );
      }
    });

    this.comboForm.reset();
    Object.keys(this.formPropertyDictCombo).forEach((fieldName: string) => {
      this.comboComponent.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
      if (this.itemSelected === 'combo') {
        this.comboDefault.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
        this.comboHover.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
        this.comboFocus.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
        this.comboDisabled.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
        this.comboHover.iconElement.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
        this.comboFocus.iconElement.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], null);
      }
    });

    this.accordionForm.reset();
    Object.keys(this.formPropertyDictAccordion).forEach((fieldName: string) => {
      const accordionList = this.accordionComponent.accordionsHeader.toArray();
      accordionList[0].accordionElement.nativeElement.style.setProperty(
        this.formPropertyDictAccordion[fieldName],
        null
      );
      if (this.itemSelected === 'accordion') {
        this.accordionDefault.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], null);
        this.accordionHover.accordionsHeader
          .toArray()[0]
          .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], null);
        this.accordionFocus.accordionsHeader
          .toArray()[0]
          .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], null);
        this.accordionPressed.accordionsHeader
          .toArray()[0]
          .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], null);
        this.accordionDisabled.accordionsHeader
          .toArray()[0]
          .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], null);
      }
    });

    this.breadcrumbForm.reset();
    Object.keys(this.formPropertyDictBreadcrumb).forEach((fieldName: string) => {
      this.breadcrumbComponent.breadcrumbElement.nativeElement.style.setProperty(
        this.formPropertyDictBreadcrumb[fieldName],
        null
      );
      if (this.itemSelected === 'breadcrumb') {
        this.breadcrumbDefault.nativeElement.style.setProperty(this.formPropertyDictBreadcrumb[fieldName], null);
      }
    });

    this.tagsFormGlobal.reset();
    this.tagFormI.reset();
    Object.keys(this.formPropertyDictTagI).forEach((fieldName: string) => {
      this.tagComponent.poTag.nativeElement.style.setProperty(this.formPropertyDictTagI[fieldName], null);
      if (this.itemSelected === 'tag') {
        this.tagDefault.nativeElement.style.setProperty(this.formPropertyDictTagI[fieldName], null);
        this.tagDefault.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.tagFormD.reset();
    Object.keys(this.formPropertyDictTagD).forEach((fieldName: string) => {
      if (this.itemSelected === 'tag') {
        this.tagDanger.nativeElement.style.setProperty(this.formPropertyDictTagD[fieldName], null);
        this.tagDanger.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.tagFormS.reset();
    Object.keys(this.formPropertyDictTagS).forEach((fieldName: string) => {
      if (this.itemSelected === 'tag') {
        this.tagSuccess.nativeElement.style.setProperty(this.formPropertyDictTagS[fieldName], null);
        this.tagSuccess.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.tagFormW.reset();
    Object.keys(this.formPropertyDictTagW).forEach((fieldName: string) => {
      if (this.itemSelected === 'tag') {
        this.tagWarning.nativeElement.style.setProperty(this.formPropertyDictTagW[fieldName], null);
        this.tagWarning.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.tagFormN.reset();
    Object.keys(this.formPropertyDictTagN).forEach((fieldName: string) => {
      if (this.itemSelected === 'tag') {
        this.tagNeutral.nativeElement.style.setProperty(this.formPropertyDictTagN[fieldName], null);
        this.tagNeutral.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.tagFormR.reset();
    Object.keys(this.formPropertyDictTagR).forEach((fieldName: string) => {
      if (this.itemSelected === 'tag') {
        this.tagRemovable.nativeElement.style.setProperty(this.formPropertyDictTagR[fieldName], null);
        this.tagHover.nativeElement.style.setProperty(this.formPropertyDictTagR[fieldName], null);
        this.tagDisabled.nativeElement.style.setProperty(this.formPropertyDictTagR[fieldName], null);
        this.tagRemovable.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
        this.tagHover.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
        this.tagDisabled.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], null);
      }
    });

    this.setRatioDefault();
    this.changedColorButton = false;
    this.changedColorPopup = false;
    this.changedColorAccordion = false;
  }

  changeKindButton(kindValue: number): void {
    this.kindButton = kindValue;
  }

  changeTag(tagValue: number): void {
    this.tagSelected = tagValue;
    if (tagValue === 1) {
      this.formPropertyDictTag = this.formPropertyDictTagI;
      this.ratio = this.ratioTagDefault;
      this.ratioTag = this.ratioTagDefault;
      this.tagActive = this.tagDefault;
      this.tagForm = this.tagFormI;
    }
    if (tagValue === 2) {
      this.formPropertyDictTag = this.formPropertyDictTagD;
      this.ratio = this.ratioTagDanger;
      this.ratioTag = this.ratioTagDanger;
      this.tagActive = this.tagDanger;
      this.tagForm = this.tagFormD;
    }
    if (tagValue === 3) {
      this.formPropertyDictTag = this.formPropertyDictTagS;
      this.ratio = this.ratioTagSuccess;
      this.ratioTag = this.ratioTagSuccess;
      this.tagActive = this.tagSuccess;
      this.tagForm = this.tagFormS;
    }
    if (tagValue === 4) {
      this.formPropertyDictTag = this.formPropertyDictTagW;
      this.ratio = this.ratioTagWarning;
      this.ratioTag = this.ratioTagWarning;
      this.tagActive = this.tagWarning;
      this.tagForm = this.tagFormW;
    }
    if (tagValue === 5) {
      this.formPropertyDictTag = this.formPropertyDictTagN;
      this.ratio = this.ratioTagNeutral;
      this.ratioTag = this.ratioTagNeutral;
      this.tagActive = this.tagNeutral;
      this.tagForm = this.tagFormN;
    }
    if (tagValue === 6) {
      this.formPropertyDictTag = this.formPropertyDictTagR;
      this.ratio = this.ratioTagRemovable;
      this.ratioTag = this.ratioTagRemovable;
      this.tagActive = this.tagRemovable;
      this.tagForm = this.tagFormR;
    }
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
    this.multiselectForm.valueChanges.subscribe(changes => this.checkChangesMultiselect(changes));
    this.comboForm.valueChanges.subscribe(changes => this.checkChangesCombo(changes));
    this.accordionForm.valueChanges.subscribe(changes => this.checkChangesAccordion(changes));
    this.breadcrumbForm.valueChanges.subscribe(changes => this.checkChangesBreadcrumb(changes));
    this.tagFormI.valueChanges.subscribe(changes => {
      this.resultTagI = '';
      this.checkChangesTag(changes);
    });
    this.tagFormD.valueChanges.subscribe(changes => {
      this.resultTagD = '';
      this.checkChangesTag(changes);
    });
    this.tagFormS.valueChanges.subscribe(changes => {
      this.resultTagS = '';
      this.checkChangesTag(changes);
    });
    this.tagFormW.valueChanges.subscribe(changes => {
      this.resultTagW = '';
      this.checkChangesTag(changes);
    });
    this.tagFormN.valueChanges.subscribe(changes => {
      this.resultTagN = '';
      this.checkChangesTag(changes);
    });
    this.tagFormR.valueChanges.subscribe(changes => {
      this.resultTagR = '';
      this.checkChangesTag(changes);
    });
    this.tagsFormGlobal.valueChanges.subscribe(changes => this.checkChangesTagsGlobal(changes));

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
    if (item === 'multiselect') {
      this.setColorsBackAndText(
        this.multiselectDefault.nativeElement,
        this.ratioMultiselect,
        '--background',
        '--text-color-placeholder'
      );
    }
    if (item === 'combo') {
      this.setColorsBackAndText(this.comboDefault.nativeElement, this.ratioCombo);
    }
    if (item === 'accordion') {
      this.setColorsBackAndText(
        this.accordionDefault.nativeElement,
        this.ratioAccordion,
        '--background-color',
        '--color'
      );
    }
    if (item === 'tag') {
      this.tagSelected = 1;
      this.tagActive = this.tagDefault;
      this.formPropertyDictTag = this.formPropertyDictTagI;
      this.tagForm = this.tagFormI;
      this.setColorsBackAndText(
        this.tagDefault.nativeElement,
        this.ratioTagDefault,
        '--color-info',
        '--text-color-info'
      );
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
      this.multiselectView = true;
      this.accordionView = true;
      this.breadcrumbView = true;
      this.comboView = true;
      this.tagView = true;
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
      this.multiselectView = false;
      this.accordionView = false;
      this.breadcrumbView = false;
      this.comboView = false;
      this.tagView = false;
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
      this.checkboxView ||
      this.multiselectView ||
      this.comboView ||
      this.accordionView ||
      this.breadcrumbView ||
      this.tagView
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
          '--color-action-default'
        );
        if (!this.changedColorButton) {
          this.ratioButton = this.setRatioComponent(this.changedColorButton, colorBack, '#ffffff');
        }
        if (!this.changedColorPopup) {
          this.ratioPopup = this.setRatioComponent(this.changedColorPopup, colorBack, '#ffffff');
        }
        if (!this.changedColorAccordion) {
          this.ratioAccordion = this.setRatioComponent(this.changedColorAccordion, '#ffffff', colorBack);
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

  private checkChangesMultiselect(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultMultiselect['nativeElement'].innerHTML = 'po-multiselect {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.multiselectComponent.inputElement.nativeElement.style.setProperty(
            this.formPropertyDictMultiselect[fieldName],
            value
          );
          this.multiselectDefault.nativeElement.style.setProperty(this.formPropertyDictMultiselect[fieldName], value);
          this.multiselectHover.inputElement.nativeElement.style.setProperty(
            this.formPropertyDictMultiselect[fieldName],
            value
          );
          this.multiselectFocus.inputElement.nativeElement.style.setProperty(
            this.formPropertyDictMultiselect[fieldName],
            value
          );
          this.multiselectDisabled.inputElement.nativeElement.style.setProperty(
            this.formPropertyDictMultiselect[fieldName],
            value
          );

          this.resultMultiselect[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictMultiselect[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioMultiselect = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioMultiselect,
            'colorBackground'
          );
        }
      });

      this.resultMultiselect['nativeElement'].innerHTML += '}';
    } else {
      this.resultMultiselect['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesCombo(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultCombo['nativeElement'].innerHTML = 'po-combo {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.comboComponent.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboDefault.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboHover.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboHover.iconElement.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboFocus.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboFocus.iconElement.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);
          this.comboDisabled.inputEl.nativeElement.style.setProperty(this.formPropertyDictCombo[fieldName], value);

          this.resultCombo['nativeElement'].innerHTML += `${this.formPropertyDictCombo[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioCombo = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioCombo,
            'colorBackground'
          );
        }
      });

      this.resultCombo['nativeElement'].innerHTML += '}';
    } else {
      this.resultCombo['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesAccordion(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultAccordion['nativeElement'].innerHTML = 'po-accordion {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.accordionComponent.accordionsHeader
            .toArray()[0]
            .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);
          this.accordionDefault.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);
          this.accordionHover.accordionsHeader
            .toArray()[0]
            .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);
          this.accordionFocus.accordionsHeader
            .toArray()[0]
            .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);
          this.accordionPressed.accordionsHeader
            .toArray()[0]
            .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);
          this.accordionDisabled.accordionsHeader
            .toArray()[0]
            .accordionElement.nativeElement.style.setProperty(this.formPropertyDictAccordion[fieldName], value);

          this.resultAccordion[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictAccordion[fieldName]}: ${value};<br>`;
          this.ratio = this.ratioAccordion = this.checkChangesContrast(
            changes,
            fieldName,
            this.ratioAccordion,
            'colorBackground'
          );
          if (fieldName === 'textColor') {
            this.changedColorAccordion = true;
          }
        }
      });

      this.resultAccordion['nativeElement'].innerHTML += '}';
    } else {
      this.resultAccordion['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesBreadcrumb(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultBreadcrumb['nativeElement'].innerHTML = 'po-breadcrumb {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.breadcrumbComponent.breadcrumbElement.nativeElement.style.setProperty(
            this.formPropertyDictBreadcrumb[fieldName],
            value
          );
          this.breadcrumbDefault.nativeElement.style.setProperty(this.formPropertyDictBreadcrumb[fieldName], value);

          this.resultBreadcrumb[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictBreadcrumb[fieldName]}: ${value};<br>`;
        }
      });

      this.resultBreadcrumb['nativeElement'].innerHTML += '}';
    } else {
      this.resultBreadcrumb['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesTag(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultTag['nativeElement'].innerHTML = 'po-tag {<br>';
      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.tagActive.nativeElement.style.setProperty(this.formPropertyDictTag[fieldName], value);

          this.ratio = this.ratioTag = this.checkChangesContrast(changes, fieldName, this.ratioTag, 'backgroundColor');
          if (this.tagSelected === 1) {
            this.tagComponent.poTag.nativeElement.style.setProperty(this.formPropertyDictTag[fieldName], value);
            this.ratioTagDefault = this.ratioTag;
            this.resultTagI += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
          } else if (this.tagSelected === 2) {
            this.ratioTagDanger = this.ratioTag;
            this.resultTagD += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
          } else if (this.tagSelected === 3) {
            this.ratioTagSuccess = this.ratioTag;
            this.resultTagS += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
          } else if (this.tagSelected === 4) {
            this.ratioTagWarning = this.ratioTag;
            this.resultTagW += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
          } else if (this.tagSelected === 5) {
            this.ratioTagNeutral = this.ratioTag;
            this.resultTagN += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
          } else if (this.tagSelected === 6) {
            this.ratioTagRemovable = this.ratioTag;
            this.resultTagR += `${this.formPropertyDictTag[fieldName]}: ${value};<br>`;
            this.tagHover.nativeElement.style.setProperty(this.formPropertyDictTag[fieldName], value);
            this.tagDisabled.nativeElement.style.setProperty(this.formPropertyDictTag[fieldName], value);
          }
          this.resultTag['nativeElement'].innerHTML = `po-tag {<br>${this.resultTagI || ''}${this.resultTagD || ''}${
            this.resultTagS || ''
          }${this.resultTagW || ''}${this.resultTagN || ''}${this.resultTagR || ''}`;
        }
      });

      this.resultTag['nativeElement'].innerHTML += '}';
    } else {
      this.resultTag['nativeElement'].innerHTML = '';
    }
  }

  private checkChangesTagsGlobal(changes: { [key: string]: string }): void {
    if (!this.isEmpty(changes)) {
      this.resultTagsGlobal['nativeElement'].innerHTML = 'po-tag {<br>';

      Object.keys(changes).forEach((fieldName: string) => {
        let value;
        if (typeof changes[fieldName] === 'number') {
          value = `${changes[fieldName]}px`;
        } else {
          value = /color/i.test(fieldName) ? changes[fieldName] : `var(--${changes[fieldName]})`;
        }
        if (changes[fieldName]) {
          this.tagComponent.poTag.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagDefault.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagSuccess.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagDanger.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagWarning.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagNeutral.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagRemovable.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagHover.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);
          this.tagDisabled.nativeElement.style.setProperty(this.formPropertyDictTagsGlobal[fieldName], value);

          this.resultTagsGlobal[
            'nativeElement'
          ].innerHTML += `${this.formPropertyDictTagsGlobal[fieldName]}: ${value};<br>`;
        }
      });

      this.resultTagsGlobal['nativeElement'].innerHTML += '}';
    } else {
      this.resultTagsGlobal['nativeElement'].innerHTML = '';
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
      !!this.resultMultiselect?.['nativeElement']?.innerHTML ||
      !!this.resultCombo?.['nativeElement']?.innerHTML ||
      !!this.resultAccordion?.['nativeElement']?.innerHTML ||
      !!this.resultTag?.['nativeElement']?.innerHTML ||
      !!this.resultTagsGlobal?.['nativeElement']?.innerHTML ||
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
    this.ratioDatepicker = this.ratioTextarea = this.ratioInput = this.ratioSelect = this.ratioMultiselect = this.ratioCombo = this.setRatioComponent(
      false,
      '#fbfbfb',
      '#1d2426'
    );
    this.ratioTooltip = this.setRatioComponent(false, '#2c3739', '#ffffff');
    this.ratioPopup = this.setRatioComponent(false, '#ffffff', '#753399');
    this.ratioAccordion = this.setRatioComponent(false, '#753399', '#ffffff');
    this.ratioTagDefault = this.setRatioComponent(false, '#e3e9f7', '#173782');
    this.ratioTagDanger = this.setRatioComponent(false, '#f6e6e5', '#72211d');
    this.ratioTagSuccess = this.setRatioComponent(false, '#def7ed', '#0f5236');
    this.ratioTagWarning = this.setRatioComponent(false, '#fcf6e3', '#473400');
    this.ratioTagNeutral = this.setRatioComponent(false, '#eceeee', '#2c3739');
    this.ratioTagRemovable = this.setRatioComponent(false, '#f2eaf6', '#2c3739');
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
      !this.checkboxView ||
      !this.multiselectView ||
      !this.comboView ||
      !this.accordionView ||
      !this.breadcrumbView ||
      !this.tagView
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
      this.checkboxView &&
      this.multiselectView &&
      this.comboView &&
      this.accordionView &&
      this.breadcrumbView &&
      this.tagView
    );
  }

  private isEmpty(objectVerify) {
    return Object.values(objectVerify).every(x => x === null || x === '');
  }
}
