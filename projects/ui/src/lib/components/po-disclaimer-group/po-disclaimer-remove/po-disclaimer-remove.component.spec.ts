import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDisclaimerComponent } from '../../po-disclaimer/po-disclaimer.component';
import { PoDisclaimerRemoveComponent } from './po-disclaimer-remove.component';
import { PoTagModule } from '../../po-tag/po-tag.module';

describe('PoDisclaimerRemoveComponent', () => {
  let component: PoDisclaimerRemoveComponent;
  let fixture: ComponentFixture<PoDisclaimerRemoveComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent, PoDisclaimerRemoveComponent],
      imports: [PoTagModule],
      schemas: [NO_ERRORS_SCHEMA]
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
    expect(nativeElement.querySelector('po-tag').innerHTML).toBeTruthy();
  });

  it('should be created without close span', () => {
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeFalsy();
  });

  it('should be created with label', () => {
    component.label = 'Remover todos';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-tag-value').innerHTML).toContain('Remover todos');
  });

  it('should emit removeAllAction', () => {
    spyOn(component.removeAllAction, 'emit');
    component.removeAction();
    expect(component.removeAllAction.emit).toHaveBeenCalled();
  });
});
