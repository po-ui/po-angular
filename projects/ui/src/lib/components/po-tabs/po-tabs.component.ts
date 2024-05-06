import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { Subscription, fromEvent } from 'rxjs';
import { PoTabDropdownComponent } from './po-tab-dropdown/po-tab-dropdown.component';
import { PoTabComponent } from './po-tab/po-tab.component';
import { PoTabsBaseComponent } from './po-tabs-base.component';
import { PoTabsService } from './po-tabs.service';

export const poTabsLiterals: Object = {
  en: <any>{
    moreTabs: 'More'
  },
  es: <any>{
    moreTabs: 'Más'
  },
  pt: <any>{
    moreTabs: 'Mais'
  },
  ru: <any>{
    moreTabs: 'Ещё'
  }
};

const poTabsMaxNumberOfTabs = 5;

/**
 * @docsExtends PoTabsBaseComponent
 *
 * @example
 *
 * <example name="po-tabs-basic" title="PO Tabs Basic">
 *  <file name="sample-po-tabs-basic/sample-po-tabs-basic.component.html"> </file>
 *  <file name="sample-po-tabs-basic/sample-po-tabs-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tabs-labs" title="PO Tabs Labs">
 *  <file name="sample-po-tabs-labs/sample-po-tabs-labs.component.html"> </file>
 *  <file name="sample-po-tabs-labs/sample-po-tabs-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tabs-travel" title="PO Tabs - Travel">
 *  <file name="sample-po-tabs-travel/sample-po-tabs-travel.component.html"> </file>
 *  <file name="sample-po-tabs-travel/sample-po-tabs-travel.component.ts"> </file>
 * </example>
 *
 * <example name="po-tabs-business-conf" title="PO Tabs - Business Conference">
 *  <file name="sample-po-tabs-business-conf/sample-po-tabs-business-conf.component.html"> </file>
 *  <file name="sample-po-tabs-business-conf/sample-po-tabs-business-conf.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-tabs',
  templateUrl: './po-tabs.component.html'
})
export class PoTabsComponent extends PoTabsBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  // Tabs utilizados no ng-content
  @ContentChildren(PoTabComponent) tabsChildren: QueryList<PoTabComponent>;
  @ViewChildren('tabButton', { read: ElementRef }) tabButton: QueryList<any>;

  @ViewChild('tabDropdown', { static: true }) tabDropdown: PoTabDropdownComponent;
  @ViewChild('containerTabs', { read: ElementRef, static: true }) containerTabs: ElementRef;

  maxNumberOfTabs = poTabsMaxNumberOfTabs;
  literals;
  tabsDefault = [];
  tabsDropdown = [];
  initializeCalculation = true;
  initializeComponent = false;

  quantityTabsButton;

  private previousActiveTab: PoTabComponent;
  private subscription: Subscription = new Subscription();
  private subscriptionTabsService: Subscription = new Subscription();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private languageService: PoLanguageService,
    private tabsService: PoTabsService
  ) {
    super();
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poTabsLiterals[language]
    };
  }

  ngOnInit(): void {
    this.subscriptionTabsService = this.tabsService.onChangesTriggered$.subscribe(() => {
      if (this.initializeComponent) {
        this.handleKeyboardNavigationTab();
      }
    });
  }

  ngAfterViewInit(): void {
    this.calculateTabs(this.initializeCalculation);

    this.initializeCalculation = false;
    this.changeDetector.detectChanges();
    this.handleKeyboardNavigationTab();
    this.initializeComponent = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionTabsService.unsubscribe();
  }

  get isShowTabDropdown() {
    return this.tabsChildren['_results'].slice(this.quantityTabsButton).filter(item => !item.hide).length;
  }

  // tabs que serão apresentadas na aba "Mais"
  get overflowedTabs() {
    return this.tabsChildren['_results'].slice(this.quantityTabsButton);
  }

  get tabs() {
    return this.tabsChildren['_results'].slice(0, this.quantityTabsButton);
  }

  closePopover(): void {
    const containsPopoverVisible = this.tabDropdown && this.tabDropdown.popover && !this.tabDropdown.popover.isHidden;

    if (containsPopoverVisible) {
      this.tabDropdown.popover.close();
    }
  }

  isVisibleTab(tab) {
    return !tab.hide;
  }

  // Função disparada quando alguma tab ficar ativa
  onTabActive(tab) {
    this.previousActiveTab = this.tabsChildren.find(tabChild => tabChild.active && tabChild.id !== tab.id);

    this.deactivateTab();
  }

  // funcao será disparada quando mudar o estado do poTab para desabilitado ou escondido.
  onTabChangeState(tab: PoTabComponent | any) {
    if (tab.active) {
      tab.active = false;

      this.activeDistinctTab();

      this.changeDetector.detectChanges();
    }
  }

  // selectiona a aba informada por parametro, caso houver click faz a emição do evento.
  selectedTab(tab: PoTabComponent | any) {
    tab.active = true;

    if (tab.click) {
      tab.click.emit(tab);
    }

    this.changeDetector.detectChanges();
  }

  trackByFn(_i, tab: PoTabComponent) {
    return tab.id;
  }

  // ativa a previousActiveTab ou primeira tab encontrada.
  private activeDistinctTab() {
    if (this.previousActiveTab) {
      this.previousActiveTab.active = true;
    } else {
      this.activeFirstTab();
    }
  }

  // Ativa a primeira Tab que não estiver desabilitada ou escondida.
  private activeFirstTab() {
    this.tabs.some(tabChild => {
      if (!tabChild.disabled && !tabChild.hide) {
        tabChild.active = true;
        return true;
      }
    });
  }

  // desativa previousActiveTab e dispara a detecção de mudança.
  private deactivateTab() {
    if (this.previousActiveTab) {
      this.previousActiveTab.active = false;

      this.changeDetector.detectChanges();
    }
  }

  calculateTabs(initializeCalculation?: boolean) {
    if (initializeCalculation) {
      let sumOfWidth = 150;
      const screenSize = this.containerTabs.nativeElement.offsetWidth;
      const listTabButton = [];
      if (this.tabButton?.length) {
        this.tabButton.forEach(element => {
          const width = element.nativeElement.offsetWidth;
          if (sumOfWidth + width <= screenSize || screenSize < 1) {
            listTabButton.push(element);
          }

          sumOfWidth += width;
        });
      }
      this.quantityTabsButton = listTabButton.length;
    }
  }

  handleKeyboardNavigationTab(initialIndex = 0) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    if (this.tabButton?.length) {
      const tabFocusable = this.tabButton
        .filter((element, index) => element.nativeElement.children[0]?.id === this.tabsChildren['_results'][index]?.id)
        .map(el => {
          if (el.nativeElement.children[0].classList.contains('po-tab-focusable')) {
            return el.nativeElement.children[0];
          }
        })
        .filter(Boolean);
      if (tabFocusable) {
        this.initializeTabAccessibilityElements(tabFocusable, initialIndex);
      }
    }
  }

  /**
   * Função que atribui o número de tabs fora do dropdown.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoTabsComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild('poTab', { static: true }) poTab: PoTabsComponent;
   *
   * changeQuantityTabs() {
   *   this.poTab.setQuantityTabsButton(1); //Número de tabs
   * }
   * ```
   */
  setQuantityTabsButton(number: Number) {
    this.quantityTabsButton = number;
  }

  private initializeTabAccessibilityElements(tabRemoveElements, initialIndex) {
    tabRemoveElements.forEach((tabRemoveElement, index) => {
      if (index === initialIndex) {
        this.setTabIndex(tabRemoveElements[initialIndex], 0);
      } else if (tabRemoveElements.length === initialIndex) {
        this.setTabIndex(tabRemoveElements[initialIndex - 1], 0);
      } else {
        this.setTabIndex(tabRemoveElement, -1);
      }

      this.subscription.add(
        fromEvent(tabRemoveElement, 'keydown').subscribe((event: KeyboardEvent) => {
          this.handleKeyDown(event, tabRemoveElements, index);
        })
      );

      if (index !== 0) {
        this.subscription.add(
          fromEvent(tabRemoveElements, 'blur').subscribe(() => {
            this.setTabIndex(tabRemoveElements[index], -1);
            this.setTabIndex(tabRemoveElements[0], 0);
          })
        );
      }
    });
  }

  private setTabIndex(element, tabIndex) {
    element.setAttribute('tabindex', tabIndex);
  }

  private handleKeyDown(event: KeyboardEvent, tabRemoveElements, index: number) {
    const KEY_SPACE = 'Space';
    const KEY_ARROW_LEFT = 'ArrowLeft';
    const KEY_ARROW_RIGHT = 'ArrowRight';
    const KEY_HOME = 'Home';
    const KEY_END = 'End';

    if (event.code === KEY_SPACE || event.code === KEY_HOME || event.code === KEY_END) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === KEY_ARROW_LEFT) {
      this.handleArrowLeft(tabRemoveElements, index);
    } else if (event.key === KEY_ARROW_RIGHT) {
      this.handleArrowRight(tabRemoveElements, index);
    } else if (event.key === KEY_HOME) {
      this.handleHomeKey(tabRemoveElements, index);
    } else if (event.key === KEY_END) {
      this.handleEndKey(tabRemoveElements, index);
    }
  }

  private handleArrowLeft(tabRemoveElements, index) {
    if (index > 0) {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[index - 1].focus();
      this.setTabIndex(tabRemoveElements[index - 1], 0);
    } else {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[tabRemoveElements.length - 1].focus();
      this.setTabIndex(tabRemoveElements[tabRemoveElements.length - 1], 0);
    }
  }

  private handleHomeKey(tabRemoveElements, index) {
    if (index > 0) {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[0].focus();
      this.setTabIndex(tabRemoveElements[0], 0);
    }
  }

  private handleEndKey(tabRemoveElements, index) {
    if (index < tabRemoveElements.length - 1) {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[tabRemoveElements.length - 1].focus();
      this.setTabIndex(tabRemoveElements[tabRemoveElements.length - 1], 0);
    }
  }

  private handleArrowRight(tabRemoveElements, index) {
    if (index < tabRemoveElements.length - 1) {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[index + 1].focus();
      this.setTabIndex(tabRemoveElements[index + 1], 0);
    } else {
      this.setTabIndex(tabRemoveElements[index], -1);
      tabRemoveElements[0].focus();
      this.setTabIndex(tabRemoveElements[0], 0);
    }
  }
}
