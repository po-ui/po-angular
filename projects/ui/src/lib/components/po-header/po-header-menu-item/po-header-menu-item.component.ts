import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { PoLanguageService, poLocaleDefault } from '../../../services';
import { PoUtils } from '../../../utils/util';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderActions } from '../interfaces/po-header-actions.interface';

export const poHeaderMoreLiteralsDefault = {
  en: {
    more: 'More'
  },
  es: {
    more: 'Más'
  },
  pt: {
    more: 'Mais'
  },
  ru: {
    more: 'Более'
  }
};

@Component({
  selector: 'po-header-menu-item',
  templateUrl: './po-header-menu-item.component.html',
  standalone: false
})
export class PoHeaderMenuItemComponent implements OnChanges, OnInit, OnDestroy {
  buttonMoreRef;
  lastItemSelected: PoHeaderActions;
  selectedItem = false;
  literals;
  private routeSubscription: Subscription;
  private resizeSubscription: Subscription;

  @ViewChild('buttonMoreElement', { read: ElementRef }) buttonMoreElement: ElementRef;
  @ViewChild(PoPopupComponent) poPopupElement: PoPopupComponent;

  @Input('p-item') item: PoHeaderActions;

  @Input('p-item-overflow') itemOverFlow: Array<PoHeaderActions>;

  @Input('p-button-overflow') overflowButton: boolean = false;

  @Output('p-item-click') itemClick = new EventEmitter<any>();

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    languageService: PoLanguageService
  ) {
    const language = languageService.getShortLanguage();
    this.literals = {
      ...poHeaderMoreLiteralsDefault[poLocaleDefault],
      ...poHeaderMoreLiteralsDefault[language]
    };
  }

  ngOnInit() {
    this.subscribeToRoute();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.checkActiveItemByUrl(this.checkRouterChildrenFragments());
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemOverFlow']) {
      this.cd.detectChanges();
    }
    if (changes['item']) {
      this.checkActiveItemByUrl(this.checkRouterChildrenFragments());
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.resizeSubscription?.unsubscribe();
  }

  openListButtonMore() {
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
    if (!itemDefault) {
      this.lastItemSelected = item;
    } else {
      this.itemClick.emit({ item });
    }
    if (item.link) {
      if (PoUtils.isExternalLink(item.link)) {
        window.open(item.link, '_blank');
      } else {
        this.router.navigateByUrl(item.link);
      }
    }
  }

  onClosePopup() {
    this.buttonMoreElement?.nativeElement.focus();
    if (this.lastItemSelected) {
      this.itemClick.emit({ item: this.lastItemSelected, focus: true });
    }
    this.lastItemSelected = null;
  }

  private checkActiveItemByUrl(urlRouter: string) {
    const urlArray = urlRouter.split('/');
    let counter = urlArray.length;

    while (counter >= 0) {
      const url = urlArray.slice(0, counter).join('/');
      this.selectedItem = this.item?.link === url;

      if (this.selectedItem) {
        break;
      }
      counter--;
    }
  }

  private checkRouterChildrenFragments() {
    const childrenPrimary = this.router.parseUrl(this.router.url).root.children['primary'];

    return childrenPrimary ? `/${childrenPrimary.segments.map(it => it.path).join('/')}` : '/';
  }

  private subscribeToRoute() {
    this.routeSubscription = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd || val instanceof NavigationCancel) {
        const urlRouter = this.checkRouterChildrenFragments();
        this.checkActiveItemByUrl(urlRouter);
        this.cd.detectChanges();
      }
    });
  }
}
