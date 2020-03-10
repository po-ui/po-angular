import { SamplePoDropdownBasicComponentPO } from './sample-po-dropdown-basic.component.po';

describe('SamplePoDropdownBasic E2E', () => {
  const dropdown = new SamplePoDropdownBasicComponentPO();

  beforeEach(() => {
    dropdown.navigateTo();
  });

  it('Check if Po Dropdown is present', () => {
    expect(dropdown.poDropdown.isPresent()).toBeTruthy();
  });

  it('Check if Po Dropdown-Content is present', () => {
    dropdown.poDropdown.click();
    expect(dropdown.poDropdownContent.isDisplayed()).toBeTruthy();
  });

  it('Check if Po Dropdown-Content has content ', () => {
    dropdown.poDropdown.click();
    expect(dropdown.poDropdownContent.count()).toBe(5);
  });
});
