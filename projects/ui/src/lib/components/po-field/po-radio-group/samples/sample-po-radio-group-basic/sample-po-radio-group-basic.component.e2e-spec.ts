import { browser } from 'protractor';

import { PoRadioTest } from './sample-po-radio-group-basic.component.po';

describe('Po-Radio-Group E2E', () => {
  const radio: PoRadioTest = new PoRadioTest();

  beforeEach(() => {
    radio.navigateTo();
  });

  it('Verify if button is disable on init', () => {
    browser.refresh();
    expect(radio.poButton.isEnabled()).toBeFalsy();
  });

  it('Making the choice gender female', () => {
    radio.poRadioFemale.click();
    expect(radio.poRadioFemale).toBeTruthy();
    const btn = radio.poButton;
    expect(btn.isEnabled()).toBeTruthy();
  });

  it('Makink the choice gender male', () => {
    radio.poRadioMale.click();
    expect(radio.poRadioMale).toBeTruthy();
    const btn = radio.poButton;
    expect(btn.isEnabled()).toBeTruthy();
  });

  it('Verify if button is disable after browser reload', () => {
    radio.poRadioMale.click();
    browser.refresh();
    expect(radio.poButton.isEnabled()).toBeFalsy();
  });

  it('Choose interest book', () => {
    radio.poRadioBook.click();
    expect(radio.poRadioBook.getAttribute('class')).toBeTruthy();
    expect(radio.poRadioMovie.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioMusic.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioArt.getAttribute('po-input-radio')).toBeFalsy();
  });

  it('Choose interest film', () => {
    radio.poRadioMovie.click();
    expect(radio.poRadioMovie.getAttribute('class')).toBeTruthy();
    expect(radio.poRadioBook.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioMusic.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioArt.getAttribute('po-input-radio')).toBeFalsy();
  });

  it('Choose interest music', () => {
    radio.poRadioMusic.click();
    expect(radio.poRadioMusic.getAttribute('class')).toBeTruthy();
    expect(radio.poRadioMovie.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioBook.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioArt.getAttribute('po-input-radio')).toBeFalsy();
  });

  it('Choose interest art', () => {
    radio.poRadioArt.click();
    expect(radio.poRadioArt.getAttribute('class')).toBeTruthy();
    expect(radio.poRadioMovie.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioBook.getAttribute('po-input-radio')).toBeFalsy();
    expect(radio.poRadioMusic.getAttribute('po-input-radio')).toBeFalsy();
  });
});
