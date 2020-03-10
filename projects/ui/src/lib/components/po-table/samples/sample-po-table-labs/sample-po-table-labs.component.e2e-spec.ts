import { PoTableLabsPage } from './sample-po-table-labs.component.po';

describe('Po-Table-Labs E2E', () => {
  const table: PoTableLabsPage = new PoTableLabsPage();

  beforeEach(() => {
    table.navigateTo();
  });

  it('checkboxs disable on Init', () => {
    expect(table.poCheckboxSingleSelect.click()).toBeFalsy();
    expect(table.poCheckboxNoBrasil.click()).toBeFalsy();
    expect(table.poCheckboxHideSelectAll.click()).toBeFalsy();
  });

  it('Load more results', () => {
    table.poButtonChangeMore.click();
    expect(table.poButtonChangeMore.isEnabled()).toBeFalsy();
    expect(table.poCheckboxShowMore.isSelected()).toBeFalsy();
  });

  it('Checkbox select all disable', () => {
    table.poCheckboxShowCheckbox.click();
    table.poCheckboxSingleSelect.click();
    expect(table.poCheckboxHideSelectAll.click()).toBeFalsy();
  });

  it('Checkis if column ´Destino´ exist', () => {
    expect(table.poTableColumnDestiny.isPresent()).toBeTruthy();
  });

  it('Checkis if column ´País´ exist', () => {
    expect(table.poTableColumnCountry.isPresent()).toBeTruthy();
  });

  it('Checkis if column ´Ida´ exist', () => {
    expect(table.poTableColumnLeave.isPresent()).toBeTruthy();
  });

  it('Checkis if column ´Volta´ exist', () => {
    expect(table.poTableColumnBack.isPresent()).toBeTruthy();
  });

  it('Checkis if column ´Número do voo´ exist', () => {
    expect(table.poTableColumnFlightNumber.isPresent()).toBeTruthy();
  });

  it('Checkis if column ´Valor´ exist', () => {
    expect(table.poTableColumnPrice.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Exibir seleção´ exist', () => {
    expect(table.poCheckboxShowCheckbox.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Seleção de apenas uma linha´ exist', () => {
    expect(table.poCheckboxSingleSelect.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Carregar mais resultados´ exist', () => {
    expect(table.poCheckboxShowMore.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Desabilitar detalhes para Brasil´ exist', () => {
    expect(table.poCheckboxNoBrasil.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Esconder checkbox selecionar todos´ exist', () => {
    expect(table.poCheckboxHideSelectAll.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Permitir ordenação´ exist', () => {
    expect(table.poCheckboxAllowSort.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Exibir ações´ exist', () => {
    expect(table.poCheckboxShowActions.isPresent()).toBeTruthy();
  });

  it('Checks if checkbox ´Exibir tabela listrada (striped)´ exist', () => {
    expect(table.poCheckboxStripedTable.isPresent()).toBeTruthy();
  });

  it('Check if icon more is present ', () => {
    table.poCheckboxShowActions.click();
    expect(table.poTableActions.isPresent()).toBeTruthy();
  });
});
