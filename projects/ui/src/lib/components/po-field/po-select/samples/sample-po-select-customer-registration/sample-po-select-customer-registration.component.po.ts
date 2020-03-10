import { browser, by, element } from 'protractor';

export class PoSelectPage {
  private sample = 'sample-po-select';

  private getPoSelect(selectName: string) {
    return element(by.css(`${this.sample} [name=${selectName}] .po-select-button`));
  }

  private getPoSelectItem(selectVal: string, stateVal: number) {
    return element(by.css(`${this.sample} po-select[name=${selectVal}] .po-select-content > li[value="${stateVal}"]`));
  }

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poSelectState() {
    return this.getPoSelect('state');
  }

  get poSelectCity() {
    return this.getPoSelect('city');
  }

  get stateSaoPaulo() {
    return this.getPoSelectItem('state', 1);
  }

  get stateSantaCatarina() {
    return this.getPoSelectItem('state', 2);
  }

  get stateParana() {
    return this.getPoSelectItem('state', 3);
  }

  get cityCampinas() {
    return this.getPoSelectItem('city', 1);
  }

  get citySantoAndre() {
    return this.getPoSelectItem('city', 2);
  }

  get citySantos() {
    return this.getPoSelectItem('city', 3);
  }

  get cityJoinville() {
    return this.getPoSelectItem('city', 4);
  }

  get cityFlorianopolis() {
    return this.getPoSelectItem('city', 5);
  }

  get cityTubarao() {
    return this.getPoSelectItem('city', 6);
  }

  get cityCuritiba() {
    return this.getPoSelectItem('city', 7);
  }

  get cityMafra() {
    return this.getPoSelectItem('city', 8);
  }

  get cityRioNegro() {
    return this.getPoSelectItem('city', 9);
  }
}
