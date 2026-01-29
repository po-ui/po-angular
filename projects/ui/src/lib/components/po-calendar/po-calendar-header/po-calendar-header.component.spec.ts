import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoCalendarHeaderComponent } from './po-calendar-header.component';

describe('PoCalendarHeaderComponent', () => {
  let component: PoCalendarHeaderComponent;
  let fixture: ComponentFixture<PoCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCalendarHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call markForCheck and detectChanges when templateContext changes', () => {
    const cdr = (component as any).cdr;

    spyOn(cdr, 'markForCheck');
    spyOn(cdr, 'detectChanges');

    component.ngOnChanges({
      templateContext: { currentValue: {}, previousValue: {}, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should call markForCheck and detectChanges when monthOptions changes', () => {
    const cdr = (component as any).cdr;

    spyOn(cdr, 'markForCheck');
    spyOn(cdr, 'detectChanges');

    component.ngOnChanges({
      monthOptions: { currentValue: [], previousValue: [], firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should call markForCheck and detectChanges when headerTemplate changes', () => {
    const cdr = (component as any).cdr;

    spyOn(cdr, 'markForCheck');
    spyOn(cdr, 'detectChanges');

    component.ngOnChanges({
      headerTemplate: { currentValue: null, previousValue: null, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });
});
