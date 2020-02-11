import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-rich-text-labs',
  templateUrl: './sample-po-rich-text-labs.component.html'
})
export class SamplePoRichTextLabsComponent implements OnInit {
  errorMessage: string;
  help: string;
  height: number;
  label: string;
  placeholder: string;
  properties: Array<string>;
  richText: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' }
  ];

  ngOnInit() {
    this.restore();
  }

  restore() {
    this.errorMessage = '';
    this.help = '';
    this.label = '';
    this.placeholder = '';
    this.properties = [];
    this.richText = '';
  }
 }
