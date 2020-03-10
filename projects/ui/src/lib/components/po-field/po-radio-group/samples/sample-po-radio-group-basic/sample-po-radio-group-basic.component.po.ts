import { browser, by, element } from 'protractor';

export class PoRadioTest {
  private sampleRadio = 'sample-po-radio-group';

  private labelRadio = '.po-radio-group-label';

  private inputRadio = '.po-radio-group-input';

  private getInterestArea(area) {
    return element(
      by.css(
        `${this.sampleRadio} po-radio-group[name="interestName"] ${this.inputRadio}[value="${area}"]+${this.labelRadio}`
      )
    );
  }

  private getGenderName(gender) {
    return element(
      by.css(
        `${this.sampleRadio} po-radio-group[name="genderName"] ${this.inputRadio}[value="${gender}"]+${this.labelRadio}`
      )
    );
  }

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poButton() {
    return element(by.css(`${this.sampleRadio} po-button .po-button`));
  }

  get poRadioMovie() {
    return this.getInterestArea('movies');
  }

  get poRadioBook() {
    return this.getInterestArea('books');
  }

  get poRadioArt() {
    return this.getInterestArea('arts');
  }

  get poRadioMusic() {
    return this.getInterestArea('music');
  }

  get poRadioSport() {
    return this.getInterestArea('sports');
  }

  get poRadioFemale() {
    return this.getGenderName('female');
  }

  get poRadioMale() {
    return this.getGenderName('male');
  }
}
