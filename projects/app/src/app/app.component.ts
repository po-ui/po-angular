import { Component, inject, ViewChild } from '@angular/core';
import { driver } from 'driver.js';
import {
  ForceBooleanComponentEnum,
  PoDynamicFormComponent,
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoMenuItem
} from 'projects/ui/src/lib';
import { PoDynamicFormRegisterService } from 'projects/ui/src/lib/components/po-dynamic/po-dynamic-form/samples/sample-po-dynamic-form-register/sample-po-dynamic-form-register.service';
import { SamplePoMenuHumanResourcesService } from 'projects/ui/src/lib/components/po-menu/samples/sample-po-menu-human-resources/sample-po-menu-human-resources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  samplePoMenuHumanResourcesService = inject(SamplePoMenuHumanResourcesService);

  menuItemSelected: string;

  menus: Array<PoMenuItem> = [
    { label: 'Register user', action: this.printMenuAction.bind(this), icon: 'an an-user', shortLabel: 'Register' },
    {
      label: 'Timekeeping',
      action: this.printMenuAction.bind(this),
      icon: 'an an-clock',
      shortLabel: 'Timekeeping',
      badge: { value: 1 }
    },
    {
      label: 'Useful links',
      icon: 'an an-share',
      shortLabel: 'Links',
      subItems: [
        { label: 'Ministry of Labour', action: this.printMenuAction.bind(this), link: 'http://trabalho.gov.br/' },
        { label: 'SindPD Syndicate', action: this.printMenuAction.bind(this), link: 'http://www.sindpd.com.br/' }
      ]
    },
    {
      label: 'Benefits',
      icon: 'an an-star',
      shortLabel: 'Benefits',
      subItems: [
        {
          label: 'Meal tickets',
          subItems: [
            { label: 'Acceptance network ', action: this.printMenuAction.bind(this) },
            {
              label: 'Extracts',
              action: this.printMenuAction.bind(this),
              subItems: [
                { label: 'Monthly', action: this.printMenuAction.bind(this), badge: { value: 3, color: 'color-03' } },
                { label: 'Custom', action: this.printMenuAction.bind(this) }
              ]
            }
          ]
        },
        { label: 'Transportation tickets', action: this.printMenuAction.bind(this), badge: { value: 12 } }
      ]
    }
  ];

  printMenuAction(menu: PoMenuItem) {
    this.menuItemSelected = menu.label;
  }

  private registerService = inject(PoDynamicFormRegisterService);
  @ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;
  person = {};
  validateFields: Array<string> = ['state'];

  fields: Array<PoDynamicFormField> = [
    {
      property: 'name',
      divider: 'PERSONAL DATA',
      required: true,
      minLength: 4,
      maxLength: 50,
      gridColumns: 6,
      gridSmColumns: 12,
      order: 1,
      placeholder: 'Type your name'
    },
    {
      property: 'birthday',
      label: 'Date of birth',
      type: 'date',
      format: 'mm/dd/yyyy',
      gridColumns: 6,
      gridSmColumns: 12,
      maxValue: '2010-01-01',
      errorMessage: 'The date must be before the year 2010.',
      order: -1
    },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 6, gridSmColumns: 12, visible: false },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99', gridColumns: 6, gridSmColumns: 12, visible: false },
    { property: 'genre', gridColumns: 6, gridSmColumns: 12, options: ['Male', 'Female', 'Other'], order: 2 },
    {
      property: 'shortDescription',
      label: 'Short Description',
      gridColumns: 12,
      gridSmColumns: 12,
      rows: 5,
      placeholder: 'Type short description'
    },
    {
      property: 'secretKey',
      label: 'Secret Key',
      gridColumns: 6,
      secret: true,
      pattern: '[a-zA]{5}[Z0-9]{3}',
      errorMessage: 'At least 5 alphabetic and 3 numeric characters are required.',
      placeholder: 'Type your password'
    },
    {
      property: 'rememberSecretKey',
      label: 'Remember Secret Key',
      gridColumns: 3,
      type: 'boolean',
      booleanTrue: 'yes',
      booleanFalse: 'no',
      formatModel: true
    },
    {
      property: 'status',
      label: 'Status',
      gridColumns: 3,
      type: 'boolean',
      booleanTrue: 'Active',
      booleanFalse: 'Inactive',
      formatModel: true
    },
    { property: 'email', divider: 'CONTACTS', gridColumns: 6, icon: 'an an-envelope' },
    { property: 'phone', mask: '(99) 99999-9999', gridColumns: 6 },
    { property: 'address', gridColumns: 6 },
    {
      property: 'addressNumber',
      label: 'Address number',
      type: 'number',
      gridColumns: 6,
      maxValue: 10000,
      errorMessage: 'Invalid number.'
    },
    {
      property: 'state',
      gridColumns: 6,
      options: [
        { state: 'Santa Catarina', code: 1 },
        { state: 'São Paulo', code: 2 },
        { state: 'Rio de Janeiro', code: 3 },
        { state: 'Minas Gerais', code: 4 }
      ],
      fieldLabel: 'state',
      fieldValue: 'code'
    },
    { property: 'city', disabled: true, gridColumns: 6, fieldValue: 'code', fieldLabel: 'city' },
    {
      property: 'vacation',
      type: 'date',
      divider: 'Work data',
      range: true,
      gridColumns: 5,
      gridSmColumns: 12
    },
    {
      property: 'entryTime',
      label: 'Entry time',
      type: 'time',
      gridColumns: 2,
      gridSmColumns: 6
    },
    { property: 'exitTime', label: 'Exit time', type: 'time', gridColumns: 2, gridSmColumns: 6 },
    {
      property: 'wage',
      type: 'currency',
      gridColumns: 3,
      gridSmColumns: 12,
      decimalsLength: 2,
      thousandMaxlength: 7,
      icon: 'an an-currency-circle-dollar'
    },
    {
      property: 'hobbies',
      divider: 'MORE INFO',
      gridColumns: 6,
      gridSmColumns: 12,
      optional: true,
      options: ['Soccer', 'Basketball', 'Bike', 'Yoga', 'Travel', 'Run'],
      optionsMulti: true
    },
    {
      property: 'favoriteHero',
      gridColumns: 6,
      gridSmColumns: 12,
      label: 'Favorite hero',
      optional: true,
      searchService: 'https://po-sample-api.onrender.com/v1/heroes',
      columns: [
        { property: 'nickname', label: 'Hero' },
        { property: 'label', label: 'Name' }
      ],
      format: ['id', 'nickname'],
      fieldLabel: 'nickname',
      fieldValue: 'email'
    },
    {
      property: 'partner',
      gridColumns: 6,
      gridSmColumns: 12,
      optionsService: 'https://po-sample-api.onrender.com/v1/people',
      fieldLabel: 'name',
      fieldValue: 'id',
      optional: true
    },
    {
      property: 'videogame',
      gridColumns: 6,
      gridSmColumns: 12,
      label: 'Video game console',
      optional: true,
      fieldValue: 'code',
      fieldLabel: 'console',
      options: [
        { console: 'Nintendo Wii U', code: 'NWU' },
        { console: 'Playstation 4', code: 'PS4' },
        { console: 'Xbox One', code: 'XONE' },
        { console: 'Nintendo Switch', code: 'NSW' },
        { console: 'Playstation 5', code: 'PS5' },
        { console: 'Xbox Series S|X', code: 'XSSX' }
      ],
      optionsMulti: true
    },
    {
      property: 'agree',
      gridColumns: 12,
      label: 'Do you agree?',
      type: 'boolean',
      forceBooleanComponentType: ForceBooleanComponentEnum.checkbox
    },
    {
      property: 'image',
      type: 'upload',
      gridColumns: 12,
      gridSmColumns: 12,
      label: 'Upload your background',
      optional: true,
      url: 'https://po-sample-api.onrender.com/v1/uploads/addFile'
    }
  ];
  ngOnInit() {
    this.person = {
      name: 'Tony Stark',
      birthday: '1970-05-29',
      isJuridicPerson: false,
      videogame: ['PS4', 'NSW', 'XSSX'],
      rememberSecretKey: 'no',
      status: 'active'
    };
  }

  onChangeFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {
    setTimeout(() => {
      const options = this.registerService.getCity(changedValue.value.state);
      this.updateDynamicFormField('city', { options, loading: false });
    }, 500);
    return {
      value: { city: undefined },
      fields: [
        {
          property: 'city',
          gridColumns: 6,
          disabled: false,
          loading: true
        }
      ]
    };
  }

  onLoadFields(value: any) {
    return this.registerService.getUserDocument(value);
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }

  startTour(): void {
    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        {
          popover: {
            title: 'Bem-vindo ao tour! 👋',
            description:
              'Vamos dar uma volta rápida pela aplicação PO UI Human Resources para você conhecer os principais recursos.',
            side: 'over',
            align: 'center'
          }
        },
        {
          element: '.po-field-icon.po-icon-input.po-field-icon-disabled',
          popover: {
            title: 'Menu lateral',
            description: 'Aqui você navega entre as áreas do sistema: cadastro, ponto, links e benefícios.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-toolbar',
          popover: {
            title: 'Toolbar',
            description: 'A barra superior exibe o título da aplicação e ações rápidas.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-widget',
          popover: {
            title: 'Widget de informações',
            description: 'Cards de resumo com dados importantes, como prazos e ações rápidas.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-form',
          popover: {
            title: 'Formulário dinâmico',
            description: 'Cadastre as informações pessoais e de contato neste formulário gerado dinamicamente.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-start-button',
          popover: {
            title: 'Reinicie o tour quando quiser',
            description: 'Clicando neste botão você pode rever a jornada a qualquer momento.',
            side: 'left',
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  }

  private updateDynamicFormField(property: string, updates: Partial<PoDynamicFormField>): void {
    const currentFields = this.dynamicForm?.fields ?? this.fields;
    const index = currentFields.findIndex(field => field.property === property);
    if (index >= 0) {
      currentFields[index] = { ...currentFields[index], ...updates };
      this.fields = [...currentFields];
    }
  }
}
