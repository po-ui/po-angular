import { AfterViewChecked, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCheckboxGroupBaseComponent } from './po-checkbox-group-base.component';
import { PoCheckboxGroupOption } from './po-checkbox-group-option.interface';

/**
 * @docsExtends PoCheckboxGroupBaseComponent
 *
 * @example
 *
 * <example name="po-checkbox-group-basic" title="Portinari Checkbox Group Basic">
 *  <file name="sample-po-checkbox-group-basic/sample-po-checkbox-group-basic.component.html"> </file>
 *  <file name="sample-po-checkbox-group-basic/sample-po-checkbox-group-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-group-labs" title="Portinari Checkbox Group Labs">
 *  <file name="sample-po-checkbox-group-labs/sample-po-checkbox-group-labs.component.html"> </file>
 *  <file name="sample-po-checkbox-group-labs/sample-po-checkbox-group-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-group-password-policy" title="Portinari Checkbox Group – Security policy">
 *  <file name="sample-po-checkbox-group-password-policy/sample-po-checkbox-group-password-policy.component.html"> </file>
 *  <file name="sample-po-checkbox-group-password-policy/sample-po-checkbox-group-password-policy.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-checkbox-group',
  templateUrl: './po-checkbox-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoCheckboxGroupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoCheckboxGroupComponent),
      multi: true,
    }
  ]
})
export class PoCheckboxGroupComponent extends PoCheckboxGroupBaseComponent implements AfterViewChecked {

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  onKeyDown(event: KeyboardEvent, option: PoCheckboxGroupOption) {
    const spaceBar = 32;

    if (event.which === spaceBar || event.keyCode === spaceBar) {
      this.checkOption(option);

      event.preventDefault();
    }
  }

}
