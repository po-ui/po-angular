import { SamplePoDatepickerBasicComponentPO } from './sample-po-datepicker-basic.component.po';

describe('SamplePodatepickerBasic E2E', () => {
  const datepicker = new SamplePoDatepickerBasicComponentPO();

  beforeEach(() => {
    datepicker.navigateTo();
  });

  it('Check if the element Po datepicker is present', () => {
    datepicker.poDatepickerIcon.click();
    expect(datepicker.poDatepicker.isDisplayed()).toBeTruthy();
  });
});
