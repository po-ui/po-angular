import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderActions } from '../interfaces/po-header-actions.interface';
import { isExternalLink } from '../../../utils/util';
import { Router } from '@angular/router';

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

  @Output('p-item-click') itemClick = new EventEmitter<PoHeaderActions>();

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

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

  onKeyDownButtonList(event, item: PoHeaderActions) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.onAction(item);
    }
  }

  onAction(item: PoHeaderActions, itemDefault: boolean = true) {
    if (itemDefault) {
      item.action?.();
    }
    this.itemClick.emit(item);
    if (item.link) {
      if (isExternalLink(item.link)) {
        window.open(item.link, '_blank');
      } else {
        this.router.navigateByUrl(item.link);
      }
    }
  }
}
