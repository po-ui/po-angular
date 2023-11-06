import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoMessageHourComponent } from './po-message-hour.component';

describe('PoMessageHourComponent', () => {
  let component: PoMessageHourComponent;
  let fixture: ComponentFixture<PoMessageHourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoMessageHourComponent]
    });
    fixture = TestBed.createComponent(PoMessageHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set message for dawn', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(4);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.dawn}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.dawn}`
    );
  });

  it('should set message for morning', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(10);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.morning}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.morning}`
    );
  });

  it('should set message for night', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(21);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.night}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.night}`
    );
  });

  it('should set message for afternoon', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(15);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.afternoon}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.afternoon}`
    );
  });

  it('should set message for edge case: 5 AM', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(5);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.dawn}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.dawn}`
    );
  });

  it('should set message for edge case: 12 PM', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(12);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.afternoon}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.afternoon}`
    );
  });

  it('should set message for edge case: 6 PM', () => {
    spyOn(component.messageHour, 'emit');

    spyOn(component, 'getCurrentHour').and.returnValue(18);

    component.setMessage();

    expect(component.message).toEqual(`${component.literals.salutation} ${component.literals.night}`);
    expect(component.messageHour.emit).toHaveBeenCalledWith(
      `${component.literals.salutation} ${component.literals.night}`
    );
  });
});
