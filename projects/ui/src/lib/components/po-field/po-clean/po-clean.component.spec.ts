import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCleanComponent } from './po-clean.component';
import { PoCleanBaseComponent } from './po-clean-base.component';

describe('PoCleanComponent', () => {
  let component: PoCleanComponent;
  let fixture: ComponentFixture<PoCleanComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCleanComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoCleanComponent).toBeTruthy();
    expect(component instanceof PoCleanBaseComponent).toBeTruthy();
  });

  it('should be created component html with icon', () => {
    expect(fixture.nativeElement.querySelector('.po-icon.po-field-icon.po-icon-close')).toBeDefined();
  });

  it('should set value to input', () => {
    const fakeThis = {
      inputRef: {
        nativeElement: {
          value: ''
        }
      }
    };

    component.setInputValue.call(fakeThis, 'abc');
    expect(fakeThis.inputRef.nativeElement.value).toBe('abc');
  });

  it('shouldn`t set value to input', () => {
    const fakeThis = {
      inputRef: {
        nativeElement: null
      }
    };

    component.setInputValue.call(fakeThis, 'abc');
    expect(fakeThis.inputRef.nativeElement).toBeNull();
  });

  it('should get value from input', () => {
    const fakeThis = {
      inputRef: {
        nativeElement: {
          value: '123'
        }
      }
    };

    component.getInputValue.call(fakeThis);
    expect(component.getInputValue.call(fakeThis)).toBe('123');
  });
});
