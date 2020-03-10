import { browser, by, element } from 'protractor';

export class PoTableLabsPage {
  private sampleTable = 'sample-po-table-labs';

  private checkLabel = '.po-checkbox-group-label';

  private checkInput = '.po-checkbox-group-input';

  private getPoCheckbox(checkGroup: string, checkValue: string) {
    return element(
      by.css(
        `${this.sampleTable} po-checkbox-group[name="${checkGroup}"] ${this.checkInput}[value="${checkValue}"]+${this.checkLabel}`
      )
    );
  }

  private getPoTableColumn(columnName: string) {
    return element.all(
      by.cssContainingText(`${this.sampleTable} po-table .po-table-header-ellipsis span`, `${columnName}`)
    );
  }

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poCheckboxAllowSort() {
    return this.getPoCheckbox('options', 'allowSort');
  }

  get poCheckboxStripedTable() {
    return this.getPoCheckbox('options', 'stripedTable');
  }

  get poCheckboxShowMore() {
    return this.getPoCheckbox('options', 'showMore');
  }

  get poCheckboxShowCheckbox() {
    return this.getPoCheckbox('checkboxOptions', 'showCheckbox');
  }

  get poCheckboxSingleSelect() {
    return this.getPoCheckbox('checkboxOptions', 'singleSelect');
  }

  get poCheckboxHideSelectAll() {
    return this.getPoCheckbox('checkboxOptions', 'hideSelectAll');
  }

  get poCheckboxShowActions() {
    return this.getPoCheckbox('actionOptions', 'showActions');
  }

  get poCheckboxNoBrasil() {
    return this.getPoCheckbox('actionOptions', 'noBrazil');
  }

  get poCheckboxShowSingleAction() {
    return this.getPoCheckbox('actionOptions', 'showSingleAction');
  }

  get poTableColumnDestiny() {
    return this.getPoTableColumn('Destino');
  }

  get poTableColumnCountry() {
    return this.getPoTableColumn('País');
  }

  get poTableColumnLeave() {
    return this.getPoTableColumn('Ida');
  }

  get poTableColumnBack() {
    return this.getPoTableColumn('Volta');
  }

  get poTableColumnFlightNumber() {
    return this.getPoTableColumn('Número do voo');
  }

  get poTableColumnPrice() {
    return this.getPoTableColumn('Valor');
  }

  get poButtonChangeMore() {
    return element(by.css(`${this.sampleTable} .po-table-footer .po-button`));
  }

  get poTableActions() {
    return element.all(by.css(`${this.sampleTable} po-table .po-icon.po-icon-more.po-clickable`));
  }
}
