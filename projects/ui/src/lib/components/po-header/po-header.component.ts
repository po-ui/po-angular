import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { debounceTime, delay, fromEvent, map, startWith, Subscription } from 'rxjs';
import { uuid } from '../../utils/util';
import { PoMenuComponent, PoMenuGlobalService } from '../po-menu';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBaseComponent } from './po-header-base.component';

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
  @ViewChildren('menusubmenuitem', { read: ElementRef }) menuSubItems!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private menuGlobalService: PoMenuGlobalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.menuonChangesSubscription = this.menuGlobalService.receiveOnChange$.subscribe(newMenus => {
      if (!this.applicationMenu) return;
      if (this.currentWidth <= 960) {
        this.menorIgualQue960();
      } else {
        this.maior();
      }
      // this.applicationMenu.menus = [];
    });

    this.menusSubscription = this.menuGlobalService.receiveMenus$.subscribe(newMenus => {
      this.previousMenusItems = [...newMenus].filter(item => item.id !== this.id);
    });

    this.menuIdSubscription = this.menuGlobalService.receiveId$.subscribe(id => {
      if (id !== 'po-header-nav-bar') {
        this.existMenuExternal = true;
      }
    });

    this.applicationMenuSubscription = this.menuGlobalService.receiveApplicationMenu$
      .pipe(delay(100))
      .subscribe(newMenu => {
        if (this.existMenuExternal && newMenu.menuid !== 'po-header-nav-bar') {
          this.applicationMenu = newMenu;
          if (this.applicationMenu) {
            this.updateMenu();
            this.combineItemsExternal();
            if (this.currentWidth <= 960) {
              this.menorIgualQue960();
            }
          }
          this.cd.detectChanges();
        }
      });

    this.resizeSub = fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe(width => {
        this.currentWidth = width;
        console.log('oieeeeeeeeee', this.currentWidth);
        if (width <= 960) {
          this.menorIgualQue960();
        } else {
          this.maior();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amountMore']) {
      this.updateButtonMore();
    }

    if (changes['menuCollapse'] && this.afterViewInitWascalled) {
      if (this.currentWidth <= 960) {
        this.menorIgualQue960();
      } else {
        this.maior();
      }
    }

    if (changes['menuItems'] && this.afterViewInitWascalled) {
      console.log(changes);
      this.updateMenu();
      this.combineItemsExternal();
      if (this.currentWidth <= 960) {
        this.menorIgualQue960();
      }
      // this.combineItems();
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
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
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

  clickFirstAction() {
    this.buttonFirstActionRef = this.buttonFirstAction;
  }

  onClickMenu() {
    if (this.menuCollapseJoin.length) {
      this.showMenu = !this.showMenu;
    }
    if (this.existMenuExternal) {
      this.applicationMenu.toggleMenuMobile();
    }
    this.colapsedMenuEvent.emit();
  }

  onCloseMenu() {
    this.showMenu = false;
  }

  menorIgualQue960() {
    if (this.applicationMenu) {
      this.applicationMenu.menus = [
        { label: 'others', subItems: [...this.menuCollapseJoinExternal], id: this.id },
        ...this.previousMenusItems
      ];
    } else {
      this.menuCollapseJoin = this.combineItems();
    }
    this.cd.detectChanges();
  }

  maior() {
    if (this.applicationMenu) {
      this.applicationMenu.menus = [...this.previousMenusItems];
    } else {
      this.menuCollapseJoin = [...this.menuCollapse];
    }
    this.cd.detectChanges();
  }

  private combineItems() {
    const toolActions = this.actionsTools.map(item => ({ label: item.label, action: item.action }));
    const menuActions = this.menuItems.map(item => ({ label: item.label, action: item.action }));

    const joinMenu = {
      label: 'Others',
      subItems: [...toolActions, ...menuActions],
      id: this.id
    };

    return [...this.menuCollapse, joinMenu];
  }

  private combineItemsExternal() {
    const toolActions = this.actionsTools.map(item => ({ label: item.label, action: item.action }));
    const menuActions = this.menuItems.map(item => ({ label: item.label, action: item.action }));

    this.menuCollapseJoinExternal = [...toolActions, ...menuActions];
  }

  onSelected(item: PoHeaderActions) {
    this.menuItems = this.menuItems.map(menuItem => ({
      ...menuItem,
      $selected: menuItem.id === item.id
    }));
    this.updateMenu();
    this.combineItems();
    this.combineItemsExternal();
  }
}
