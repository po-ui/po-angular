import { Component } from '@angular/core';
import { PoTabComponent, PoTabsComponent } from '../po-tabs';

/**
 * @docsExtends PoTabsBaseComponent
 *
 * @description
 *
 * O componente `po-context-tabs` é responsável por agrupar [abas](/documentation/po-tab) dispostas numa linha horizontal,
 * ideal para facilitar a organização de conteúdos.
 *
 * O componente exibirá as abas enquanto houver espaço na tela, caso a aba ultrapasse o limite da tela a mesma será agrupada em um dropdown.
 *
 * > As abas que estiverem agrupadas serão dispostas numa cascata suspensa que será exibida ao clicar no botão.
 *
 * É possível realizar a navegação entre as abas através da tecla SETAS(direita e esquerda) do teclado.
 * Caso uma aba estiver desabilitada, não receberá foco de navegação.
 *
 * #### Boas práticas
 *
 * - Evite utilizar um `po-context-tabs` dentro de outro `po-context-tabs`;
 * - Evite utilizar uma quantidade excessiva de abas, pois irá gerar um *scroll* muito longo no `dropdown`;
 * - Evite `labels` extensos para as `tabs` pois podem quebrar seu *layout*, use `labels` diretas, curtas e intuitivas.
 *
 *
 * @example
 *
 * <example name="po-context-tabs-basic" title="PO Context Tabs Basic">
 *  <file name="sample-po-context-tabs-basic/sample-po-context-tabs-basic.component.html"> </file>
 *  <file name="sample-po-context-tabs-basic/sample-po-context-tabs-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-context-tabs-labs" title="PO Context Tabs Labs">
 *  <file name="sample-po-context-tabs-labs/sample-po-context-tabs-labs.component.html"> </file>
 *  <file name="sample-po-context-tabs-labs/sample-po-context-tabs-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-context-tabs-travel" title="PO Context Tabs - Travel">
 *  <file name="sample-po-context-tabs-travel/sample-po-context-tabs-travel.component.html"> </file>
 *  <file name="sample-po-context-tabs-travel/sample-po-context-tabs-travel.component.ts"> </file>
 * </example>
 *
 * <example name="po-context-tabs-business-conf" title="PO Context Tabs - Business Conference">
 *  <file name="sample-po-context-tabs-business-conf/sample-po-context-tabs-business-conf.component.html"> </file>
 *  <file name="sample-po-context-tabs-business-conf/sample-po-context-tabs-business-conf.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-context-tabs',
  templateUrl: './po-context-tabs.component.html',
  standalone: false
})
export class PoContextTabsComponent extends PoTabsComponent {
  byQuantityFunction: number;
  initialTabsWidth = [];
  private sumOfWidth = 0;

  get isShowTabDropdown() {
    const tabsShowed = this.tabsChildren['_results'].filter(item => !item.hide);
    if (tabsShowed.length > this.quantityTabsButton) {
      return true;
    }
    return false;
  }

  // tabs que serão apresentadas na aba "Mais"
  get overflowedTabs() {
    return this.tabsChildren['_results'].filter(item => !item.hide)?.slice(this.quantityTabsButton);
  }

  get tabs() {
    return this.tabsChildren['_results'];
  }

  closeTab(tab: PoTabComponent) {
    tab.closeTab.emit(tab);
    const tabWidth = tab.widthButton || this.initialTabsWidth.find(initialTab => initialTab.id === tab.id)?.width;

    this.tabsChildren['_results'] = this.tabsChildren['_results'].filter(item => item.id !== tab.id);
    tab.removed = true;
    tab.hide = true;

    this.onTabChangeState(tab);
    tab.elementRef.nativeElement.remove();
    this.afterRemoveTab(tabWidth);
  }

  onChangeVisibilityTab(tab: PoTabComponent) {
    if (this.initialTabsWidth?.length) {
      const currentInitialTab = this.initialTabsWidth.find(t => t.id === tab.id);
      let tabWidth = tab.widthButton || currentInitialTab.width;
      if (!tab.hide) {
        const currentTabElement = this.tabButton.find(t => t.nativeElement.id === tab.id);
        tabWidth = currentTabElement.nativeElement.offsetWidth;
        currentInitialTab.width = tabWidth;
        tab.widthButton = tabWidth;
        this.changeDetector.detectChanges();
        this.calculateTabs(true);
        this.changeDetector.detectChanges();
      } else {
        this.afterRemoveTab(tabWidth);
      }
    }
  }

  private afterRemoveTab(widthTab: number) {
    this.quantityTabsButton = this.quantityTabsButton - 1;
    this.changeDetector.detectChanges();
    const screenSize = this.containerTabs.nativeElement.offsetWidth;
    this.sumOfWidth = this.sumOfWidth - widthTab;

    for (const t of this.overflowedTabs) {
      if (!t.hide) {
        const firstItemDropdown = this.tabButton.find(tb => tb.nativeElement.id === t.id);
        const width = this.initialTabsWidth.find(i => i.id === firstItemDropdown.nativeElement.id)?.width;
        if (
          this.sumOfWidth + width <= screenSize ||
          screenSize < 1 ||
          this.quantityTabsButton < this.byQuantityFunction
        ) {
          t.showTooltip = false;
          t.widthButton = undefined;
          firstItemDropdown.nativeElement.hidden = false;
          this.sumOfWidth += width;
          firstItemDropdown.nativeElement.style.width = '';
          firstItemDropdown.nativeElement.style.display = 'inline-block';
          this.quantityTabsButton = this.quantityTabsButton + 1;

          if (this.byQuantityFunction > 0 && this.byQuantityFunction === this.quantityTabsButton) {
            break;
          }
        } else {
          break;
        }
      }
    }

    this.changeDetector.detectChanges();
    this.handleKeyboardNavigationTab();
  }

  override calculateTabs(initializeCalculation?: boolean) {
    if (initializeCalculation) {
      this.sumOfWidth = 150;
      const screenSize = this.containerTabs.nativeElement.offsetWidth;
      const listTabButton = [];
      const isFirstCalculation = this.initialTabsWidth.length === 0;

      if (this.tabButton?.length) {
        let initDropdown = false;
        let index = 0;
        this.tabButton.forEach(element => {
          const width = element.nativeElement.offsetWidth;
          if (isFirstCalculation) {
            this.initialTabsWidth.push({ id: element.nativeElement.id, width });
          }

          if (this.byQuantityFunction && index > this.byQuantityFunction - 1) {
            initDropdown = true;
          }

          if (
            !initDropdown &&
            (this.sumOfWidth + width <= screenSize || screenSize < 1 || index < this.byQuantityFunction)
          ) {
            if (!element.nativeElement.hidden) {
              listTabButton.push(element);
              this.sumOfWidth += width;
            }
          } else {
            initDropdown = true;
            element.nativeElement.style.display = 'none';
            element.nativeElement.hidden = true;
          }

          if (element.nativeElement.hidden && index <= this.byQuantityFunction - 1) return;
          index++;
        });
      }
      this.quantityTabsButton = this.byQuantityFunction || listTabButton.length;
    }
  }

  override updateTabsState(initialState: boolean = false, tabs?: PoTabComponent): void {
    if (tabs && this.initCheckChangesTab) {
      this.checkChangesTabs();
    }

    const allVisibleItems = this.tabButton?.filter(tab => !tab.nativeElement.hidden);
    this.defaultLastTabWidth = allVisibleItems?.[allVisibleItems.length - 1]?.nativeElement.offsetWidth;
    if (!this.defaultLastTabWidth) {
      return;
    }

    this.executeTabsState(initialState, allVisibleItems?.[allVisibleItems.length - 1]?.nativeElement.id);
  }

  private checkChangesTabs() {
    let index = 0;
    this.tabButton.forEach((tab, indexTab) => {
      const currentTab = this.initialTabsWidth.find(t => t.id === tab.nativeElement.id);
      const quantityTabs = this.byQuantityFunction || this.quantityTabsButton;
      if (tab.nativeElement.hidden && !this.tabsChildren['_results'][indexTab]?.hide) {
        tab.nativeElement.style.display = 'inline-block';
        tab.nativeElement.hidden = false;
      }

      if (!currentTab) {
        this.initialTabsWidth.push({ id: tab.nativeElement.id, width: tab.nativeElement.offsetWidth });
        if (index > quantityTabs - 1) {
          tab.nativeElement.style.display = 'none';
          tab.nativeElement.hidden = true;
        }
        this.tabsChildren['_results'] = this.tabsChildren['_results'].filter(item => !item.removed);
      }
      if (tab.nativeElement.hidden && index <= quantityTabs - 1) return;
      index++;
    });
    this.calculateTabs(true);
  }

  override onTabActiveByDropdown(tab: PoTabComponent, eventEmitter = true): void {
    if (tab.disabled) {
      this.onTabChangeState(tab);
      return;
    }
    const initialWidth = this.initialTabsWidth.find(t => t.id === tab.id);
    this.changeTabPositionByDropdown(tab, true);
    const showedTabs = this.tabButton.toArray().filter(tab => !tab.nativeElement.hidden);
    const lastTab = showedTabs[showedTabs.length - 1];
    const lastTabWidth = lastTab.nativeElement.offsetWidth;

    lastTab.nativeElement.style.display = 'none';
    lastTab.nativeElement.hidden = true;

    const currentTabIndex = this.tabButton.toArray().findIndex(t => t.nativeElement.id === tab.id);
    const currentTab = this.tabButton.toArray()[currentTabIndex].nativeElement;
    currentTab.hidden = false;
    currentTab.style.display = 'inline-block';

    this.reorderTabs(tab, lastTab.nativeElement);
    tab.widthButton = lastTabWidth;
    if (initialWidth.width > lastTabWidth) {
      tab.showTooltip = true;
    }
    currentTab.style.width = `${lastTabWidth}px`;
    this.handleKeyboardNavigationTab();

    if (eventEmitter) {
      tab.click.emit(tab);
    }
  }

  /**
   * Função que atribui o número de tabs fora do dropdown.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoContextTabsComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild('poContextTabs', { static: true }) poContextTabs: PoContextTabsComponent;
   *
   * changeQuantityTabs() {
   *   this.poContextTabs.setQuantityTabsButton(1); //Número de context-tabs
   * }
   * ```
   */
  override setQuantityTabsButton(number: number) {
    let callAfterFunction = false;
    const currentQuantity = this.byQuantityFunction || this.quantityTabsButton;
    if (number > currentQuantity) {
      callAfterFunction = true;
    }

    this.byQuantityFunction = number;
    if (!callAfterFunction) {
      this.quantityTabsButton = number;
      this.calculateTabs(true);
    } else {
      this.afterRemoveTab(0);
      this.quantityTabsButton = number;
    }
  }
}
