import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { browserLanguage, formatBytes, poLocaleDefault } from '../../../../utils/util';

import { poUploadLiteralsDefault } from '../po-upload-base.component';

@Component({
  selector: 'po-upload-file-restrictions',
  templateUrl: './po-upload-file-restrictions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoUploadFileRestrictionsComponent implements OnInit {
  private _allowedExtensions: string;
  private _maxFileSize: string;
  private _minFileSize: string;

  literals: any;

  @Input('p-allowed-extensions') set allowedExtensions(value) {
    this._allowedExtensions = this.formatAllowedExtensions(<any>value);
  }

  get allowedExtensions(): string {
    return this._allowedExtensions;
  }

  @Input('p-max-files') maxFiles: number;

  @Input('p-max-file-size') set maxFileSize(value) {
    this._maxFileSize = formatBytes(<any>value);
  }

  get maxFileSize(): string {
    return this._maxFileSize;
  }

  @Input('p-min-file-size') set minFileSize(value) {
    this._minFileSize = formatBytes(<any>value);
  }

  get minFileSize(): string {
    return this._minFileSize;
  }

  get language(): string {
    return browserLanguage();
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.setLiterals();
  }

  private formatAllowedExtensions(allowedExtensions: Array<string>): string {
    const conjunction = { 'pt': 'e', 'en': 'and', 'es': 'y' };

    return allowedExtensions
      ? allowedExtensions
          .join(', ')
          .toUpperCase()
          .replace(/,(?=[^,]*$)/, ` ${conjunction[this.language]}`)
      : undefined;
  }

  private setLiterals() {
    this.literals = {
      ...poUploadLiteralsDefault[poLocaleDefault],
      ...poUploadLiteralsDefault[this.language]
    };

    this.changeDetector.detectChanges();
  }
}
