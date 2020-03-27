import { Component } from '@angular/core';

import { PoButtonGroupItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-group-post',
  templateUrl: './sample-po-button-group-post.component.html'
})
export class SamplePoButtonGroupPostComponent {
  setBold: boolean;
  setItalic: boolean;
  setTextAlignment: string;
  setUnderline: boolean;
  textArea: string = '"Luck is a thing that comes in many forms and who can recognize her?" - Ernest Hemingway';

  fontStyle: Array<PoButtonGroupItem> = [
    { icon: 'po-icon-text-bold', action: () => (this.setBold = !this.setBold), tooltip: 'Bold' },
    { icon: 'po-icon-text-italic', action: () => (this.setItalic = !this.setItalic), tooltip: 'Italic' },
    { icon: 'po-icon-text-underline', action: () => (this.setUnderline = !this.setUnderline), tooltip: 'Underline' }
  ];

  textAlign: Array<PoButtonGroupItem> = [
    {
      icon: 'po-icon-align-left',
      selected: true,
      action: () => (this.setTextAlignment = 'left'),
      tooltip: 'Left align'
    },
    { icon: 'po-icon-align-center', action: () => (this.setTextAlignment = 'center'), tooltip: 'Center align' },
    { icon: 'po-icon-align-right', action: () => (this.setTextAlignment = 'right'), tooltip: 'Right align' },
    { icon: 'po-icon-align-justify', action: () => (this.setTextAlignment = 'justify'), tooltip: 'Justify' }
  ];
}
