import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PoLinkModule } from '../po-link/po-link.module';
import { PoMessageHourComponent, poMessageHourDefault } from './po-message-hour.component';

describe('PoMessageHourComponent', () => {
  let component: PoMessageHourComponent;
  let fixture: ComponentFixture<PoMessageHourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoLinkModule, RouterModule.forRoot([], {})],
      declarations: [PoMessageHourComponent]
    });
    fixture = TestBed.createComponent(PoMessageHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and message in the template', () => {
    component.label = 'Arya Stark';
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('.label').textContent).toContain('Arya Stark');
    expect(nativeElement.querySelector('po-link a').textContent).toContain(component.message);
  });

  it('should fallback to english literals when browser language is not supported', () => {
    spyOnProperty(navigator, 'language').and.returnValue('fr-FR');
    spyOn(component, 'getCurrentHour').and.returnValue(10);

    component.ngOnInit();

    expect(component.literals).toEqual(poMessageHourDefault.en);
    expect(component.message).toEqual(`${poMessageHourDefault.en.salutation} ${poMessageHourDefault.en.morning}`);
  });

  it('should fallback to an empty string when a time-of-day literal is missing', () => {
    const getCurrentHourSpy = spyOn(component, 'getCurrentHour');
    component.literals = { salutation: 'Welcome' };

    [4, 10, 15, 20].forEach(hour => {
      getCurrentHourSpy.and.returnValue(hour);

      component.setMessage();

      expect(component.message).toEqual('Welcome ');
    });
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
