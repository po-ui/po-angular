import { PoSelectPage } from './sample-po-select-customer-registration.component.po';

describe('Po-Select E2E', () => {
  const select: PoSelectPage = new PoSelectPage();

  beforeEach(() => {
    select.navigateTo();
  });

  it('Dinamic clicks to state SP', () => {
    select.poSelectState.click();
    select.stateSaoPaulo.click();
    expect(select.poSelectState.getText()).toContain('São Paulo');
    expect(select.poSelectCity.getText()).toContain('Campinas');
  });

  it('Dinamic clicks to state SC', () => {
    select.poSelectState.click();
    select.stateSantaCatarina.click();
    expect(select.poSelectState.getText()).toContain('Santa Catarina');
    expect(select.poSelectCity.getText()).toContain('Joinville');
  });

  it('Dinamic clicks to state PR', () => {
    select.poSelectState.click();
    select.stateParana.click();
    expect(select.poSelectState.getText()).toContain('Paraná');
    expect(select.poSelectCity.getText()).toContain('Curitiba');
  });

  it('Check the cities of SP', () => {
    select.poSelectState.click();
    select.stateSaoPaulo.click();
    select.poSelectCity.click();
    expect(select.cityCampinas.isDisplayed()).toBeTruthy();
    expect(select.citySantoAndre.isPresent()).toBeTruthy();
    expect(select.citySantos.isDisplayed()).toBeTruthy();
  });

  it('Check the cities of SC', () => {
    select.poSelectState.click();
    select.stateSantaCatarina.click();
    select.poSelectCity.click();
    expect(select.cityJoinville.isDisplayed()).toBeTruthy();
    expect(select.cityFlorianopolis.isPresent()).toBeTruthy();
    expect(select.cityTubarao.isDisplayed()).toBeTruthy();
  });

  it('Check the cities of PR', () => {
    select.poSelectState.click();
    select.stateParana.click();
    select.poSelectCity.click();
    expect(select.cityCuritiba.isDisplayed()).toBeTruthy();
    expect(select.cityMafra.isPresent()).toBeTruthy();
    expect(select.cityRioNegro.isDisplayed()).toBeTruthy();
  });
});
