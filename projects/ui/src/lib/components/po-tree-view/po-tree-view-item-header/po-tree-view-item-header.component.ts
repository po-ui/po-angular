import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-tree-view-item-header',
  templateUrl: './po-tree-view-item-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTreeViewItemHeaderComponent {

  @Input('p-expanded') expanded: boolean = false;

  @Input('p-has-sub-items') hasSubItems: boolean = false;

  @Input('p-label') label: string;

  @Output('p-click') click = new EventEmitter<MouseEvent>();

}
