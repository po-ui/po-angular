import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
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
export class PoHeaderComponent extends PoHeaderBaseComponent implements AfterViewInit, OnChanges {
  afterViewInitWascalled = false;
  showMenu = false;
  visibleMenuItems: Array<any> = [...this.menuItems];

  overflowItems: Array<any> = [];
  showOverflow = false;
  resizeSubscription!: Subscription;

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
    private elRef: ElementRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amountMore']) {
      this.updateButtonMore();
    }

    if (changes['menuItems'] && this.afterViewInitWascalled) {
      this.updateMenu();
      this.combineItems();
    }
  }

  ngAfterViewInit(): void {
    this.updateMenu();
    this.cd.detectChanges();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300)) // espera 300ms após o último evento
      .subscribe(() => {
        const largura = document.documentElement.clientWidth;

        console.log('Redimensionado para:', largura);
        this.updateMenu();
      });

    this.combineItems();
    this.afterViewInitWascalled = true;
  }

  toggleOverflowDropdown() {
    this.showOverflow = !this.showOverflow;
  }

  updateMenu() {
    if (this.amountMore) {
      this.updateButtonMore();
      return;
    }
    console.log('chamou');
    const hostElement = this.elRef.nativeElement; // <po-header>
    const parent = hostElement.parentElement;
    let larguraTela;
    if (parent?.getBoundingClientRect().width) {
      larguraTela = parent.getBoundingClientRect().width;
    } else {
      larguraTela = document.documentElement.clientWidth;
    }

    const larguraBrand = this.menuWrapperBrand.nativeElement.offsetWidth;
    const larguraTool = this.menuWrapperTools.nativeElement.offsetWidth;
    const spacingAndMoreButton = 170;

    console.log('larguraTela: ' + larguraTela);
    console.log('larguraBrand: ' + larguraBrand);
    console.log('larguraTool: ' + larguraTool);

    const quantoSobrou = larguraTela - larguraBrand - larguraTool - spacingAndMoreButton;
    const temp = [...this.visibleMenuItems];
    this.visibleMenuItems = [...this.menuItems];
    this.overflowItems = [];
    this.cd.detectChanges();
    const itemWidths = this.menuSubItems.toArray().map(el => el.nativeElement.offsetWidth + 16);
    this.visibleMenuItems = temp;
    let usedWidth = 0;
    for (let i = 0; i < this.menuItems.length; i++) {
      const itemWidth = itemWidths[i];

      if (usedWidth + itemWidth >= quantoSobrou) {
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
    this.showMenu = !this.showMenu;
    console.log('menu clicked');
  }

  onCloseMenu() {
    this.showMenu = false;
  }

  testandoClique() {
    console.log('cliquei dentro do menu');
  }

  private combineItems() {
    const toolActions = this.actionsTools.map(item => ({ label: item.title, action: item.action }));
    this.menuSmallItems = [...this.menuItems, ...toolActions];
  }

  onSelected(item: PoHeaderActions) {
    console.log('@@', item);
    this.menuItems = this.menuItems.map(menuItem => ({
      ...menuItem,
      $selected: menuItem.id === item.id
    }));
    this.updateMenu();
    this.combineItems();
  }
}
