import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { debounceTime, delay, fromEvent, map, startWith, Subscription } from 'rxjs';
import { PoLanguageService } from '../../services';
import { uuid } from '../../utils/util';
import { PoMenuComponent, PoMenuGlobalService, PoMenuHeaderTemplateDirective } from '../po-menu';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBaseComponent } from './po-header-base.component';
import { PoHeaderMenuItemComponent } from './po-header-menu-item/po-header-menu-item.component';

/**
 * @docsExtends PoHeaderBaseComponent
 *
 * @example
 *
 * <example name="po-header-basic" title="PO Header Basic">
 *  <file name="sample-po-header-basic/sample-po-header-basic.component.html"> </file>
 *  <file name="sample-po-header-basic/sample-po-header-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-header-labs" title="PO Header Labs">
 *  <file name="sample-po-header-labs/sample-po-header-labs.component.html"> </file>
 *  <file name="sample-po-header-labs/sample-po-header-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-header-apps" title="PO Header Apps">
 *  <file name="sample-po-header-apps/sample-po-header-apps.component.html"> </file>
 *  <file name="sample-po-header-apps/sample-po-header-apps.component.ts"> </file>
 * </example>
 *
 */

@Component({
  selector: 'po-header',
  templateUrl: './po-header.component.html',
  standalone: false
})
export class PoHeaderComponent extends PoHeaderBaseComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  afterViewInitWascalled = false;
  showMenu = false;
  visibleMenuItems: Array<any> = [...this.menuItems];

  overflowItems: Array<any> = [];
  showOverflow = false;
  resizeSubscription!: Subscription;
  private menusSubscription: Subscription;
  private applicationMenuSubscription: Subscription;
  private menuIdSubscription: Subscription;
  private menuonChangesSubscription: Subscription;
  private removedMenuSubscription: Subscription;
  previousMenuComponentId;
  private resizeSub!: Subscription;

  menuExternal = [];
  existMenuExternal = false;
  applicationMenu: PoMenuComponent;
  private id = uuid();
  private currentWidth = 0;

  private previousMenusItems = [];

  @ViewChild('buttonFirstAction', { read: ElementRef }) buttonFirstAction: ElementRef;
  buttonFirstActionRef: ElementRef;

  @ViewChild('navElement', { read: ElementRef }) navElement: ElementRef;
  @ViewChild('menuWrapperBrand') menuWrapperBrand!: ElementRef<HTMLElement>;
  @ViewChild('menuWrapperTools') menuWrapperTools!: ElementRef<HTMLElement>;
  @ViewChild('overflowButton', { static: true }) overflowButton!: ElementRef<HTMLElement>;
  @ViewChild('overflowButton') overflowButtonComponentEl!: PoHeaderMenuItemComponent;
  @ViewChildren('menusubmenuitem', { read: ElementRef }) menuSubItems!: QueryList<ElementRef<HTMLElement>>;
  @ContentChild(PoMenuHeaderTemplateDirective, { static: true }) menuHeaderTemplate: PoMenuHeaderTemplateDirective;

  @ViewChild(PoMenuComponent) set menuComponent(menu: PoMenuComponent) {
    this.previousMenuComponentId = menu?.id || this.previousMenuComponentId;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private menuGlobalService: PoMenuGlobalService,
    poLanguageService: PoLanguageService
  ) {
    super(poLanguageService);
  }

  ngOnInit(): void {
    this.menuonChangesSubscription = this.menuGlobalService.receiveOnChange$.subscribe(_newMenus => {
      if (!this.applicationMenu) return;
      if (this.currentWidth <= 960) {
        this.handleSmallSreen();
      } else {
        this.handleLargeSreen();
      }
      this.cd.detectChanges();
    });

    this.menusSubscription = this.menuGlobalService.receiveMenus$.subscribe(newMenus => {
      this.previousMenusItems = [...newMenus].filter(item => item.id !== this.id);
    });

    this.removedMenuSubscription = this.menuGlobalService.receiveRemovedApplicationMenu$.subscribe(removedMenuId => {
      this.applicationMenu =
        this.applicationMenu && (this.previousMenuComponentId === removedMenuId || this.notChangeContext)
          ? this.applicationMenu
          : undefined;

      if (this.currentWidth <= 960) {
        this.handleSmallSreen();
      } else {
        this.handleLargeSreen();
      }
      this.cd.detectChanges();
    });

    this.menuIdSubscription = this.menuGlobalService.receiveId$.subscribe(id => {
      if (id !== 'po-header-nav-bar') {
        this.existMenuExternal = true;
      }
    });

    this.applicationMenuSubscription = this.menuGlobalService.receiveApplicationMenu$
      .pipe(delay(100))
      .subscribe(newMenu => {
        if (this.applicationMenu && this.notChangeContext && this.previousMenuComponentId !== newMenu.id) {
          return;
        }
        this.applicationMenu = this.previousMenuComponentId === newMenu.id ? undefined : newMenu;

        if (this.applicationMenu) {
          this.updateMenu();
          this.combineItemsExternal();
          if (this.currentWidth <= 960) {
            this.handleSmallSreen();
          }
        }
        this.cd.detectChanges();
      });

    this.resizeSub = fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe(width => {
        this.currentWidth = width;
        if (width <= 960) {
          this.handleSmallSreen();
        } else {
          this.handleLargeSreen();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amountMore']) {
      this.updateButtonMore();
    }

    if (changes['menuCollapse'] && this.afterViewInitWascalled) {
      if (this.currentWidth <= 960) {
        this.handleSmallSreen();
      } else {
        this.handleLargeSreen();
      }
    }

    if (changes['menuItems'] && this.afterViewInitWascalled) {
      this.updateMenu();
      this.combineItemsExternal();
      if (this.currentWidth <= 960) {
        this.handleSmallSreen();
      }
      setTimeout(() => {
        this.updateMenu();
        this.cd.detectChanges();
      });
    }
  }

  ngAfterViewInit(): void {
    this.updateMenu();
    this.cd.detectChanges();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.updateMenu();
      });

    this.combineItems();
    this.combineItemsExternal();
    this.afterViewInitWascalled = true;
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();

    this.removedMenuSubscription?.unsubscribe();
    this.applicationMenuSubscription?.unsubscribe();
    this.menusSubscription?.unsubscribe();
    this.menuIdSubscription?.unsubscribe();
    this.menuonChangesSubscription?.unsubscribe();
  }

  toggleOverflowDropdown() {
    this.showOverflow = !this.showOverflow;
  }

  updateMenu() {
    if (this.amountMore) {
      this.updateButtonMore();
      return;
    }

    const hostElement = this.elRef.nativeElement;
    const parent = hostElement.parentElement;
    let screenWidth;
    if (parent?.getBoundingClientRect().width) {
      screenWidth = parent.getBoundingClientRect().width;
    } else {
      screenWidth = document.documentElement.clientWidth;
    }

    const brandWidth = this.menuWrapperBrand.nativeElement.offsetWidth;
    const toolWidth = this.menuWrapperTools.nativeElement.offsetWidth;
    const spacingAndMoreButton = 170;

    const remaining = screenWidth - brandWidth - toolWidth - spacingAndMoreButton;
    const temp = [...this.visibleMenuItems];
    this.visibleMenuItems = [...this.menuItems];
    this.overflowItems = [];
    this.cd.detectChanges();
    const itemWidths = this.menuSubItems.toArray().map(el => el.nativeElement.offsetWidth + 16);
    this.visibleMenuItems = temp;
    let usedWidth = 0;
    for (let i = 0; i < this.menuItems.length; i++) {
      const itemWidth = itemWidths[i];

      if (usedWidth + itemWidth >= remaining) {
        this.overflowItems = [...this.overflowItems, this.menuItems[i]];
      }
      usedWidth += itemWidths[i];
    }
    this.visibleMenuItems = [...this.menuItems].filter(
      item => !this.overflowItems.some(overflow => overflow.id === item.id)
    );
    this.cd.detectChanges();

    if (this.overflowItems.length) {
      this.showOverflow = true;
    } else {
      this.showOverflow = false;
    }
  }

  updateButtonMore() {
    let itemVisible;
    let itemsInFlow;
    if (this.amountMore <= 0) {
      itemVisible = [...this.menuItems];
      itemsInFlow = [];
    } else if (this.amountMore >= this.menuItems.length) {
      itemVisible = [];
      itemsInFlow = [...this.menuItems];
    } else {
      itemVisible = this.menuItems.slice(0, this.menuItems.length - this.amountMore);

      itemsInFlow = this.menuItems.slice(-this.amountMore);
    }

    this.visibleMenuItems = [...itemVisible];
    this.overflowItems = [...itemsInFlow];

    if (this.overflowItems.length) {
      this.showOverflow = true;
    } else {
      this.showOverflow = false;
    }
  }

  onClickMenu() {
    if (this.menuCollapseJoin.length) {
      this.showMenu = !this.showMenu;
    }
    if (!this.sideMenuOnlyAction) {
      this.applicationMenu?.toggleMenuMobile();
    }
    this.cd.detectChanges();
    this.colapsedMenuEvent.emit();
  }

  onCloseMenu() {
    this.showMenu = false;
  }

  handleSmallSreen() {
    if (this.applicationMenu && !this.notChangeContext) {
      this.applicationMenu.menus = [
        { label: this.literals.headerLinks, subItems: [...this.menuCollapseJoinExternal], id: this.id },
        ...this.previousMenusItems
      ];
    } else {
      this.menuCollapseJoin = this.combineItems();
    }
    this.cd.detectChanges();
  }

  handleLargeSreen() {
    if (this.applicationMenu && !this.notChangeContext) {
      this.applicationMenu.menus = [...this.previousMenusItems];
    } else {
      this.menuCollapseJoin = [...this.menuCollapse];
    }
    this.cd.detectChanges();
  }

  private combineItems() {
    const toolActions = this.actionsTools.map(item => ({ label: item.label, action: item.action, link: item.link }));
    const menuActions = this.menuItems.map(item => ({ label: item.label, action: item.action, link: item.link }));

    const joinMenu = {
      label: this.literals.headerLinks,
      subItems: [...menuActions, ...toolActions],
      id: this.id
    };

    return [...this.menuCollapse, joinMenu];
  }

  private combineItemsExternal() {
    const toolActions = this.actionsTools.map(item => ({ label: item.label, action: item.action, link: item.link }));
    const menuActions = this.menuItems.map(item => ({ label: item.label, action: item.action, link: item.link }));

    this.menuCollapseJoinExternal = [...menuActions, ...toolActions];
  }

  onSelected({ item, focus }: { item: PoHeaderActions; focus: boolean }) {
    if (item.$internalRoute) {
      this.menuItems = this.menuItems.map(menuItem => ({
        ...menuItem,
        $selected: menuItem.id === item.id
      }));
    }
    this.updateMenu();
    this.combineItems();
    this.combineItemsExternal();
    if (focus) {
      this.overflowButtonComponentEl.onClosePopup();
    }
  }
}
