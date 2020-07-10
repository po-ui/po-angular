import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PoToolbarBaseComponent } from './po-toolbar-base.component';

/**
 * @docsExtends PoToolbarBaseComponent
 *
 * @example
 *
 * <example name="po-toolbar-basic" title="PO Toolbar Basic">
 *  <file name="sample-po-toolbar-basic/sample-po-toolbar-basic.component.html"> </file>
 *  <file name="sample-po-toolbar-basic/sample-po-toolbar-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-toolbar-labs" title="PO Toolbar Labs">
 *  <file name="sample-po-toolbar-labs/sample-po-toolbar-labs.component.html"> </file>
 *  <file name="sample-po-toolbar-labs/sample-po-toolbar-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-toolbar-logged" title="PO Toolbar - Logged">
 *  <file name="sample-po-toolbar-logged/sample-po-toolbar-logged.component.html"> </file>
 *  <file name="sample-po-toolbar-logged/sample-po-toolbar-logged.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-toolbar',
  templateUrl: './po-toolbar.component.html'
})
export class PoToolbarComponent extends PoToolbarBaseComponent implements OnInit {
  constructor(private titleService: Title, viewRef: ViewContainerRef) {
    super();
  }

  ngOnInit(): void {
    this.setTitle(this.title);
  }

  private setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
