import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDisclaimerComponent } from '../../po-disclaimer/po-disclaimer.component';
import { PoDisclaimerRemoveComponent } from './po-disclaimer-remove.component';

describe('PoDisclaimerRemoveComponent', () => {
  let component: PoDisclaimerRemoveComponent;
  let fixture: ComponentFixture<PoDisclaimerRemoveComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent, PoDisclaimerRemoveComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDisclaimerRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be created with type danger', () => {
    expect(nativeElement.querySelector('.po-disclaimer-label-danger').innerHTML).toBeTruthy();
  });

  it('should be created without close span', () => {
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeFalsy();
  });

  it('should be created with label', () => {
    component.label = 'Remover todos';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-label').innerHTML).toContain('Remover todos');
  });

  it('should emit removeAllAction', () => {
    spyOn(component.removeAllAction, 'emit');
    component.removeAction();
    expect(component.removeAllAction.emit).toHaveBeenCalled();
  });
});
