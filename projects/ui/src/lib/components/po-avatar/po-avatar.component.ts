import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { PoAvatarBaseComponent } from './po-avatar-base.component';

/**
 * @docsExtends PoAvatarBaseComponent
 *
 * @example
 *
 * <example name="po-avatar-basic" title="PO Avatar Basic" >
 *  <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.html"> </file>
 *  <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.ts"> </file>
 *  <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-avatar-labs" title="PO Avatar Labs" >
 *  <file name="sample-po-avatar-labs/sample-po-avatar-labs.component.html"> </file>
 *  <file name="sample-po-avatar-labs/sample-po-avatar-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-avatar-business-card" title="PO Avatar - Business Card" >
 *  <file name="sample-po-avatar-business-card/sample-po-avatar-business-card.component.html"> </file>
 *  <file name="sample-po-avatar-business-card/sample-po-avatar-business-card.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-avatar',
  templateUrl: './po-avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoAvatarComponent extends PoAvatarBaseComponent implements OnInit {
  ngOnInit(): void {
    if (!this.src) {
      this.src = undefined;
    }
  }

  onError(): void {
    this.src = undefined;
  }
}
