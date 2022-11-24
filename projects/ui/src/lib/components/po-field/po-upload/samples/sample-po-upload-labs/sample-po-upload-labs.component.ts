import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoUploadFileRestrictions, PoUploadLiterals } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-upload-labs',
  templateUrl: './sample-po-upload-labs.component.html'
})
export class SamplePoUploadLabsComponent implements OnInit {
  allowedExtensions!: string;
  customLiterals!: PoUploadLiterals;
  dragDropHeight!: number | undefined;
  event!: string;
  formField!: string;
  help!: string;
  label!: string;
  literals!: string;
  maxFiles!: number | undefined;
  maxSize!: number | undefined;
  minSize!: number | undefined;
  properties!: Array<string>;
  restrictions!: PoUploadFileRestrictions;
  upload!: Array<any> | undefined;
  url!: string;
  headers!: { [name: string]: string | Array<string> };
  headersLabs!: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'autoupload', label: 'Automatic upload' },
    { value: 'directory', label: 'Directory' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'dragDrop', label: 'Drag Drop' },
    { value: 'multiple', label: 'Multiple upload' },
    { value: 'optional', label: 'Optional' },
    { value: 'required', label: 'Required' },
    { value: 'restrictionsInfo', label: 'Hide Restrictions Info' },
    { value: 'selectButton', label: 'Hide Select Files Button' },
    { value: 'sendButton', label: 'Hide Send Files Button' }
  ];

  constructor() {}

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  onChangeHeaders(headers) {
    try {
      this.headers = JSON.parse(headers);
    } catch {
      this.headers = undefined;
    }
  }
  onChangeExtension() {
    const allowedExtensions = this.allowedExtensions.split(',').map(allowedExtension => allowedExtension.trim());
    this.restrictions = Object.assign({}, this.restrictions, { allowedExtensions });
  }

  onChangeMaxFiles(maxFiles: number) {
    this.restrictions = Object.assign({}, this.restrictions, { maxFiles });
  }

  onChangeMaxSize(maxSize: number) {
    this.restrictions = Object.assign({}, this.restrictions, { maxFileSize: this.getValueInBytes(maxSize) });
  }

  onChangeMinSize(minSize: number) {
    this.restrictions = Object.assign({}, this.restrictions, { minFileSize: this.getValueInBytes(minSize) });
  }

  restore() {
    this.allowedExtensions = '';
    this.customLiterals = {};
    this.dragDropHeight = undefined;
    this.event = '';
    this.formField = '';
    this.label = '';
    this.help = '';
    this.literals = '';
    this.maxFiles = undefined;
    this.maxSize = undefined;
    this.minSize = undefined;
    this.properties = [];
    this.restrictions = {};
    this.upload = undefined;
    this.url = 'https://po-sample-api.herokuapp.com/v1/uploads/addFile';
    this.headers = {};
    this.headersLabs = '';
  }

  private getValueInBytes(value: number) {
    return 1048576 * value;
  }
}
