import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-code-editor-diff',
  templateUrl: './sample-po-code-editor-diff.component.html'
})
export class SamplePoCodeEditorDiffComponent {
  code = [
    `class Calc {
  sumValues(firstValue: any, secondValue: any): any {
    const result = firstValue + secondValue;
    return result;
  }
  subtractValues(firstValue: any, secondValue: any): any {
    const result = firstValue - secondValue;
    return result;
  }
}`,
    `class Calculator {

  sum(firstValue: number, secondValue: number): number {
    return firstValue + secondValue;
  }

  subtract(firstValue: number, secondValue: number): number {
    return firstValue - secondValue;
  }
}
`
  ];
}
