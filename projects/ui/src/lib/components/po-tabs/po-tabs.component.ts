import { ChangeDetectorRef, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';

import { isMobile } from './../../utils/util';

import { PoTabComponent } from './po-tab/po-tab.component';
import { PoTabDropdownComponent } from './po-tab-dropdown/po-tab-dropdown.component';
import { PoTabsBaseComponent } from './po-tabs-base.component';

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
export class PoTabsComponent extends PoTabsBaseComponent {
  maxNumberOfTabs = poTabsMaxNumberOfTabs;

  private previousActiveTab: PoTabComponent;

  // Tabs utilizados no ng-content
  @ContentChildren(PoTabComponent) tabs: QueryList<PoTabComponent>;

  @ViewChild('tabDropdown', { static: true }) tabDropdown: PoTabDropdownComponent;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  get isMobileDevice() {
    return isMobile();
  }

  get isShowTabDropdown() {
    return !this.isMobileDevice && this.visibleTabs.length > this.maxNumberOfTabs;
  }

  // tabs que serão apresentadas na aba "Mais"
  get overflowedTabs() {
    return this.visibleTabs.filter((_tab, index) => index > this.maxNumberOfTabs - 2);
  }

  get visibleTabs() {
    return this.tabs.filter(tab => !tab.hide);
  }

  closePopover(): void {
    const containsPopoverVisible = this.tabDropdown && this.tabDropdown.popover && !this.tabDropdown.popover.isHidden;

    if (containsPopoverVisible) {
      this.tabDropdown.popover.close();
    }
  }

  isVisibleTab(tab) {
    if (this.isMobileDevice) {
      return true;
    }

    const visibleTabIndex = this.visibleTabs.findIndex(visibleTab => visibleTab.id === tab.id);

    return this.visibleTabs.length <= this.maxNumberOfTabs || visibleTabIndex < this.maxNumberOfTabs - 1;
  }

  // Função disparada quando alguma tab ficar ativa
  onTabActive(tab) {
    this.previousActiveTab = this.tabs.find(tabChild => tabChild.active && tabChild.id !== tab.id);

    this.deactivateTab();
  }

  // funcao será disparada quando mudar o estado do poTab para desabilitado ou escondido.
  onTabChangeState(tab: PoTabComponent) {
    if (tab.active) {
      tab.active = false;

      this.activeDistinctTab();

      this.changeDetector.detectChanges();
    }
  }

  // selectiona a aba informada por parametro, caso houver click faz a emição do evento.
  selectedTab(tab: PoTabComponent) {
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
}
