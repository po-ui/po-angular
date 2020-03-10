import { PoSwitchPage } from './sample-po-switch-labs.component.po';

describe('Po-Switch E2E', () => {
  const page: PoSwitchPage = new PoSwitchPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Verify if switch is clickable', () => {
    page.poSwitch.click();
    expect(page.poSwitch.getAttribute('class')).toContain('po-switch-container-off');
    page.poSwitch.click();
    expect(page.poSwitch.getAttribute('class')).toContain('po-switch-container-on');
  });

  it('Switch disable', () => {
    page.poCheckboxDisabled.click();
    expect(page.poSwitch.getAttribute('class')).toContain('po-switch-container-disabled');
  });

  it('Change the switch label', () => {
    page.poInputLabelSwitch.clear();
    page.poInputLabelSwitch.sendKeys('My Label');
    expect(page.poFieldTitle.getText()).toContain('My Label');
  });

  it('Change the Label On', () => {
    page.poInputLabelOn.clear();
    page.poInputLabelOn.sendKeys('Here is On!');
    expect(page.poSwitchLabel.getText()).toContain('Here is On!');
  });

  it('Change the Label Off', () => {
    page.poInputLabelOff.clear();
    page.poInputLabelOff.sendKeys('Here is Off!');
    page.poSwitch.click();
    expect(page.poSwitchLabel.getText()).toContain('Here is Off!');
  });

  it('Trun on required Switch', () => {
    expect(page.poFieldOptional.isPresent()).toBeTruthy();
    page.poCheckboxRequired.click();
    expect(page.poFieldOptional.isPresent()).toBeFalsy();
  });
});
