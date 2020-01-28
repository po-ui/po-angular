import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-code-editor-suggestion',
  templateUrl: './sample-po-code-editor-suggestion.component.html'
})
export class SamplePoCodeEditorSuggestionComponent {
  language = 'html';
  suggestions = [
    { label: 'po', insertText: 'PO UI' },
    { label: 'ng', insertText: 'Angular' },
    { label: 'po-btn', insertText: '<po-button p-label="${1:label}"></po-button>' },
    { label: 'po-inp', insertText: '<po-input name="${1:name}" [(ngModel)]="${2:model}"></po-input>' }
  ];
}
