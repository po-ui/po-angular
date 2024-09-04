/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Renderer2, ViewChild } from '@angular/core';
import { PoModalComponent, PoRadioGroupOption, PoToasterComponent, PoToasterMode, PoToasterType } from '../../../ui/src/lib';

@Component({
  selector: 'sample-po-toaster-labs',
  templateUrl: './sample-po-toaster-labs.component.html',
  styles: `
    .tokenHeader {
      background-color: var(--color-neutral-light-20);
      font-size: 16px;
      padding: 16px;
      align-items: center;
      font-weight: bold;
      color: var(--color-neutral-dark-90);
    }
    .tokenSub {
      background-color: var(--color-neutral-light-10);
      color: var(--color-neutral-dark-80);
      font-style: italic;
      padding: 8px;
    }
    .tokenRow:not(:last-child) {
      border-bottom: 1px solid var(--color-neutral-light-10);
    }
    .tokenRow {
      align-items: center;
    }

    .flex-group {
      display: flex;
      gap: 16px;
      justify-content: center;
      align-items: center;
    }
    .flex-1 {
      flex: 1 auto;
    }
    .justify-center {
      display: flex;
      justify-content: center;
    }
  `
})
export class SamplePoToasterLabsComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild('toasterRef') toasterRef: PoToasterComponent;

  message = 'Title Message';
  supportMessage =
    'Exemplo de uma mensagem bem mais longa que poderia ocupar mais de uma linha. Exemplo de uma mensagem bem mais longa que poderia ocupar mais de uma linha.';
  actionLabel = 'action';
  type: PoToasterType = PoToasterType.Information;
  mode = PoToasterMode.Inline;
  hide = false;
  showClose = true;
  showIcon = true;
  hasAction = false;
  action = undefined;

  toasterTokensDefault: ToasterTokens;
  toasterTokensSuccess: ToasterTokens;
  toasterTokensError: ToasterTokens;
  toasterTokensWarning: ToasterTokens;
  toasterTokensInfo: ToasterTokens;


  // tokensDefaultUseTokens: boolean

  public readonly typeOptions: Array<PoRadioGroupOption> = [
    { label: 'Success', value: PoToasterType.Success },
    { label: 'Error', value: PoToasterType.Error },
    { label: 'Warning', value: PoToasterType.Warning },
    { label: 'Information', value: PoToasterType.Information }
  ];

  public readonly modeOptions: Array<PoRadioGroupOption> = [
    { label: 'Alert', value: PoToasterMode.Alert },
    { label: 'Inline', value: PoToasterMode.Inline }
  ];

  constructor(private renderer: Renderer2) {
    this.toasterTokensDefault = this.initialTokensDefault();
    this.toasterTokensSuccess = this.initialTokensSuccess();
    this.toasterTokensError = this.initialTokensError();
    this.toasterTokensWarning = this.initialTokensWarning();
    this.toasterTokensInfo = this.initialTokensInfo();
  }

  changeAction() {
    if (this.hasAction) {
      this.action = () => this.poModal.open();
    } else {
      this.action = undefined;
    }
  }

  changeHide() {
    this.hide = !this.hide;
  }

  changeTokenDefault(key: any, event: any) {
    this.toasterTokensDefault[key] = event;
    this.changeToken();
  }

  changeTokenSuccess(key: any, event: any) {
    this.toasterTokensSuccess[key] = event;
    this.changeToken();
  }

  changeTokenError(key: any, event: any) {
    this.toasterTokensError[key] = event;
    this.changeToken();
  }

  changeTokenWarning(key: any, event: any) {
    this.toasterTokensWarning[key] = event;
    this.changeToken();
  }

  changeTokenInfo(key: any, event: any) {
    this.toasterTokensInfo[key] = event;
    this.changeToken();
  }

  changeToken() {
    let tokenStyle = 'po-toaster.labs {';
    for (const token of Object.entries({
      ...this.toasterTokensDefault,
      ...this.toasterTokensSuccess,
      ...this.toasterTokensError,
      ...this.toasterTokensWarning,
      ...this.toasterTokensInfo
    })) {
      tokenStyle = tokenStyle.concat(`${token[0]}: ${token[1]};`);
    }
    tokenStyle = tokenStyle.concat('}');

    const style = this.renderer.createElement('style');
    style.id = 'toasterLabs';
    this.renderer.appendChild(style, this.renderer.createText(tokenStyle));

    this.removeTokenStyle();
    this.renderer.appendChild(document.head, style);
  }

  restore() {
    this.message = 'Title Message';
    this.supportMessage =
      'Exemplo de uma mensagem bem mais longa que poderia ocupar mais de uma linha. Exemplo de uma mensagem bem mais longa que poderia ocupar mais de uma linha.';
    this.actionLabel = 'action';
    this.type = PoToasterType.Information;
    this.mode = PoToasterMode.Inline;
    this.hide = false;
    this.showClose = true;
    this.showIcon = true;
    this.hasAction = false;
    this.action = undefined;

    this.removeTokenStyle();
    this.toasterTokensDefault = this.initialTokensDefault();
    this.toasterTokensSuccess = this.initialTokensSuccess();
    this.toasterTokensError = this.initialTokensError();
    this.toasterTokensWarning = this.initialTokensWarning();
    this.toasterTokensInfo = this.initialTokensInfo();
  }

  removeTokenStyle() {
    const elementStyle = document.querySelector('#toasterLabs');
    if (elementStyle) {
      elementStyle.remove();
    }
  }

  initialTokensDefault(): ToasterTokens {
    return {
      '--font-family': 'var(--font-family-theme)',
      '--font-color': 'var(--color-neutral-dark-90)',
      '--font-color-support': 'var(--color-neutral-dark-80)',
      '--border-radius': 'var(--border-radius-md)',
      '--color-icon': 'var(--color-neutral-light-00)',
      '--shadow': 'var(--shadow-lg)'
    };
  }

  initialTokensSuccess(): ToasterTokens {
    return {
      '--color-success': 'var(--color-feedback-positive-base)',
      '--background-success': 'var(--color-feedback-positive-lightest)',
      '--border-color-success': 'var(--color-feedback-positive-lighter)'
    };
  }

  initialTokensError(): ToasterTokens {
    return {
      '--color-error': 'var(--color-feedback-negative-base)',
      '--background-error': 'var(--color-feedback-negative-lightest)',
      '--border-color-error': 'var(--color-feedback-negative-lighter)'
    };
  }

  initialTokensWarning(): ToasterTokens {
    return {
      '--color-warning': 'var(--color-feedback-warning-base)',
      '--background-warning': 'var(--color-feedback-warning-lightest)',
      '--border-color-warning': 'var(--color-feedback-warning-lighter)',
      '--color-icon-warning': 'var(--color-neutral-dark-90)'
    };
  }

  initialTokensInfo(): ToasterTokens {
    return {
      '--color-info': 'var(--color-feedback-info-base)',
      '--background-info': 'var(--color-feedback-info-lightest)',
      '--border-color-info': 'var(--color-feedback-info-lighter)'
    };
  }
}

interface ToasterTokens {
  '--font-family'?: string;
  '--font-color'?: string;
  '--font-color-support'?: string;
  '--border-radius'?: string;
  '--color-icon'?: string;
  '--shadow'?: string;
  '--color-success'?: string;
  '--background-success'?: string;
  '--border-color-success'?: string;
  '--color-error'?: string;
  '--background-error'?: string;
  '--border-color-error'?: string;
  '--color-icon-warning'?: string;
  '--color-warning'?: string;
  '--background-warning'?: string;
  '--border-color-warning'?: string;
  '--color-info'?: string;
  '--background-info'?: string;
  '--border-color-info'?: string;
}
