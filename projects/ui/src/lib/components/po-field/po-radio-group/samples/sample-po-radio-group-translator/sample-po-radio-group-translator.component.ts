import { Component } from '@angular/core';

import { PoRadioGroupOption, PoSelectOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-radio-group-translator',
  templateUrl: './sample-po-radio-group-translator.component.html'
})
export class SamplePoRadioGroupTranslatorComponent {
  language: string = 'es';
  original: string = '';
  translated: string = '';

  readonly languageOptions: Array<PoRadioGroupOption> = [
    { label: 'Spanish', value: 'es' },
    { label: 'English', value: 'en' }
  ];

  readonly optionsList: Array<PoSelectOption> = [
    { value: '1', label: 'Olá' },
    { value: '2', label: 'Tchau' },
    { value: '3', label: 'Estrangeiro' },
    { value: '4', label: 'Alinhamento' },
    { value: '5', label: 'Visão' },
    { value: '6', label: 'Livro' }
  ];

  readonly wordsOptions: Array<any> = [
    { id: '1', en: 'Hello', es: 'Hola' },
    { id: '2', en: 'Bye', es: 'Hasta luego' },
    { id: '3', en: 'Foreign', es: 'Extranjero' },
    { id: '4', en: 'Alignment', es: 'Alineación' },
    { id: '5', en: 'Vision', es: 'Vista' },
    { id: '6', en: 'Book', es: 'Libro' }
  ];

  changeLanguage(value) {
    const word = this.wordsOptions.find(item => item.id === this.original);

    if (word) {
      this.translated = word[value || this.language];
    }
  }
}
