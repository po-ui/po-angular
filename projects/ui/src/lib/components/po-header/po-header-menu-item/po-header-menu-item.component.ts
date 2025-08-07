import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderActions } from '../interfaces/po-header-actions.interface';

@Component({
  selector: 'po-header-menu-item',
  templateUrl: './po-header-menu-item.component.html',
  standalone: false
})
export class PoHeaderMenuItemComponent implements OnChanges {
  buttonMoreRef;

  @ViewChild('buttonMoreElement', { read: ElementRef }) buttonMoreElement: ElementRef;
  @ViewChild(PoPopupComponent) poPopupElement: PoPopupComponent;

  @Input('p-item') item: PoHeaderActions;

  @Input('p-item-overflow') itemOverFlow: Array<PoHeaderActions>;

  @Input('p-button-overflow') overflowButton: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemOverFlow']) {
      this.cd.detectChanges();
    }
  }

  openListButtonMore() {
    this.buttonMoreRef = this.buttonMoreElement;
    this.cd.detectChanges();
    this.poPopupElement.toggle();
  }

  onKeyDownButtonMore(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.openListButtonMore();
    }
  }

  onKeyDownButtonList(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.item.action?.();
    }
  }
}
