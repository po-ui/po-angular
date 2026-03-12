import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoRadioGroupOption, PoUploadFileRestrictions } from '@po-ui/ng-components';

interface PayloadLog {
  id: number;
  timestamp: string;
  scenario: string;
  url: string;
  method: string;
  headers: { [key: string]: string };
  formFieldName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  hasData: boolean;
  dataContent: string;
  hasExtraFormData: boolean;
  extraFormDataContent: string;
  formDataEntries: Array<{ key: string; value: string; type: string }>;
  rawFormData: string;
}

@Component({
  selector: 'sample-po-upload-payload-playground',
  templateUrl: './sample-po-upload-payload-playground.component.html',
  standalone: false
})
export class SamplePoUploadPayloadPlaygroundComponent implements OnInit {
  activeScenario: string = 'single';

  url: string = '/upload-intercepted';
  formField: string = 'files';
  label: string = 'Upload Playground';
  headers: { [name: string]: string | Array<string> };
  headersJson: string = '';
  restrictions: PoUploadFileRestrictions = {};
  properties: Array<string> = [];
  upload: Array<any>;

  payloadLogs: Array<PayloadLog> = [];
  private logCounter: number = 0;

  allowedExtensions: string = '';
  maxFiles: number;
  maxSize: number;
  minSize: number;

  additionalDataJson: string = '{"userId": "123", "category": "documents"}';
  extraFormDataJson: string = '{"token": "abc-xyz-456"}';

  public readonly scenarioOptions: Array<PoRadioGroupOption> = [
    { label: '1. Arquivo único', value: 'single' },
    { label: '2. Múltiplos arquivos', value: 'multiple' },
    { label: '3. Com additionalData', value: 'additionalData' },
    { label: '4. Com extraFormData', value: 'extraFormData' },
    { label: '5. Upload de diretório', value: 'directory' },
    { label: '6. Headers customizados', value: 'customHeaders' },
    { label: '7. formField customizado', value: 'customFormField' },
    { label: '8. Auto-upload', value: 'autoUpload' },
    { label: '9. Com restrições', value: 'restrictions' },
    { label: '10. Completo (todos)', value: 'complete' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'multiple', label: 'Multiple' },
    { value: 'directory', label: 'Directory' },
    { value: 'dragDrop', label: 'Drag Drop' },
    { value: 'autoUpload', label: 'Auto Upload' },
    { value: 'showThumbnail', label: 'Show Thumbnail' }
  ];

  ngOnInit() {
    this.applyScenario('single');
  }

  applyScenario(scenario: string) {
    this.activeScenario = scenario;
    this.resetConfig();

    switch (scenario) {
      case 'single':
        this.label = 'Cenário 1: Arquivo único';
        this.formField = 'files';
        break;

      case 'multiple':
        this.label = 'Cenário 2: Múltiplos arquivos';
        this.properties = ['multiple'];
        this.formField = 'files';
        break;

      case 'additionalData':
        this.label = 'Cenário 3: Com additionalData (data)';
        this.additionalDataJson = '{"userId": "123", "category": "documents"}';
        this.formField = 'files';
        break;

      case 'extraFormData':
        this.label = 'Cenário 4: Com extraFormData';
        this.extraFormDataJson = '{"token": "abc-xyz-456", "projectId": "P001"}';
        this.formField = 'files';
        break;

      case 'directory':
        this.label = 'Cenário 5: Upload de diretório';
        this.properties = ['directory'];
        this.formField = 'files';
        break;

      case 'customHeaders':
        this.label = 'Cenário 6: Headers customizados';
        this.headersJson = '{"Authorization": "Bearer token123", "X-Custom-Header": "valor-custom"}';
        this.onChangeHeaders();
        this.formField = 'files';
        break;

      case 'customFormField':
        this.label = 'Cenário 7: formField customizado';
        this.formField = 'documento';
        break;

      case 'autoUpload':
        this.label = 'Cenário 8: Auto-upload';
        this.properties = ['autoUpload'];
        this.formField = 'files';
        break;

      case 'restrictions':
        this.label = 'Cenário 9: Com restrições';
        this.allowedExtensions = '.pdf,.png,.jpg';
        this.maxFiles = 3;
        this.maxSize = 5;
        this.minSize = 0;
        this.applyRestrictions();
        this.properties = ['multiple'];
        this.formField = 'files';
        break;

      case 'complete':
        this.label = 'Cenário 10: Completo';
        this.properties = ['multiple'];
        this.formField = 'attachments';
        this.headersJson = '{"Authorization": "Bearer token123"}';
        this.onChangeHeaders();
        this.additionalDataJson = '{"userId": "123"}';
        this.extraFormDataJson = '{"token": "abc-xyz-456"}';
        this.allowedExtensions = '.pdf,.png,.jpg,.doc,.docx';
        this.maxFiles = 5;
        this.maxSize = 10;
        this.applyRestrictions();
        break;
    }
  }

  onUploadEvent(event: any) {
    const log: PayloadLog = {
      id: ++this.logCounter,
      timestamp: new Date().toISOString(),
      scenario: this.activeScenario,
      url: event.url || this.url,
      method: 'POST',
      headers: event.headers || {},
      formFieldName: this.formField || 'files',
      fileName: event.file?.name || 'N/A',
      fileSize: event.file?.rawFile?.size || 0,
      fileType: event.file?.rawFile?.type || 'N/A',
      hasData: false,
      dataContent: '{}',
      hasExtraFormData: false,
      extraFormDataContent: '{}',
      formDataEntries: [],
      rawFormData: ''
    };

    if (this.activeScenario === 'additionalData' || this.activeScenario === 'complete') {
      try {
        const data = JSON.parse(this.additionalDataJson);
        event.data = data;
        log.hasData = true;
        log.dataContent = JSON.stringify(data, null, 2);
      } catch {
        event.data = {};
      }
    }

    if (this.activeScenario === 'extraFormData' || this.activeScenario === 'complete') {
      try {
        const extraData = JSON.parse(this.extraFormDataJson);
        event.extraFormData = extraData;
        log.hasExtraFormData = true;
        log.extraFormDataContent = JSON.stringify(extraData, null, 2);
      } catch {
        event.extraFormData = {};
      }
    }

    log.formDataEntries = this.simulateFormDataEntries(log);
    log.rawFormData = this.formatFormDataPreview(log.formDataEntries);

    this.payloadLogs = [log, ...this.payloadLogs];
  }

  onUploadSuccess(_event: any) {}

  onUploadError(_event: any) {}

  clearLogs() {
    this.payloadLogs = [];
    this.logCounter = 0;
  }

  onChangeHeaders() {
    try {
      this.headers = JSON.parse(this.headersJson);
    } catch {
      this.headers = undefined;
    }
  }

  onChangeExtension() {
    this.applyRestrictions();
  }

  onChangeMaxFiles() {
    this.applyRestrictions();
  }

  onChangeMaxSize() {
    this.applyRestrictions();
  }

  onChangeMinSize() {
    this.applyRestrictions();
  }

  getPayloadSummary(log: PayloadLog): string {
    const parts: Array<string> = [];
    parts.push(`POST ${log.url}`);
    parts.push(`FormData field: "${log.formFieldName}"`);
    parts.push(`Arquivo: ${log.fileName} (${this.formatBytes(log.fileSize)}, ${log.fileType})`);

    if (log.hasData) {
      parts.push(`data: ${log.dataContent}`);
    }
    if (log.hasExtraFormData) {
      parts.push(`extraFormData: ${log.extraFormDataContent}`);
    }
    if (Object.keys(log.headers || {}).length > 0) {
      parts.push(`Headers: ${JSON.stringify(log.headers)}`);
    }

    return parts.join('\n');
  }

  private resetConfig() {
    this.properties = [];
    this.headers = undefined;
    this.headersJson = '';
    this.restrictions = {};
    this.allowedExtensions = '';
    this.maxFiles = undefined;
    this.maxSize = undefined;
    this.minSize = undefined;
    this.formField = 'files';
    this.upload = undefined;
  }

  private applyRestrictions() {
    const newRestrictions: PoUploadFileRestrictions = {};

    if (this.allowedExtensions) {
      newRestrictions.allowedExtensions = this.allowedExtensions.split(',').map(ext => ext.trim());
    }
    if (this.maxFiles) {
      newRestrictions.maxFiles = this.maxFiles;
    }
    if (this.maxSize) {
      newRestrictions.maxFileSize = this.maxSize * 1048576;
    }
    if (this.minSize) {
      newRestrictions.minFileSize = this.minSize * 1048576;
    }

    this.restrictions = newRestrictions;
  }

  private simulateFormDataEntries(log: PayloadLog): Array<{ key: string; value: string; type: string }> {
    const entries: Array<{ key: string; value: string; type: string }> = [];

    entries.push({
      key: log.formFieldName,
      value: `File: ${log.fileName} (${this.formatBytes(log.fileSize)})`,
      type: 'File'
    });

    if (log.hasExtraFormData) {
      try {
        const extra = JSON.parse(log.extraFormDataContent);
        Object.keys(extra).forEach(key => {
          entries.push({
            key: key,
            value: String(extra[key]),
            type: 'string'
          });
        });
      } catch {
        // ignora erro de parse
      }
    }

    if (log.hasData) {
      entries.push({
        key: 'data',
        value: log.dataContent,
        type: 'string (JSON)'
      });
    }

    return entries;
  }

  private formatFormDataPreview(entries: Array<{ key: string; value: string; type: string }>): string {
    if (entries.length === 0) {
      return 'FormData vazio';
    }

    return entries.map(e => `  ${e.key}: [${e.type}] ${e.value}`).join('\n');
  }

  private formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
