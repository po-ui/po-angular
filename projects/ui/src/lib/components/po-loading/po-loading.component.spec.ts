import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoLoadingComponent } from './po-loading.component';
import { PoLoadingIconComponent } from './po-loading-icon/po-loading-icon.component';

describe('PoLoadingComponent', () => {
  let component: PoLoadingComponent;
  let fixture: ComponentFixture<PoLoadingComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoLoadingComponent, PoLoadingIconComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLoadingComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingComponent).toBeTruthy();
  });

  it('should be check the content of po-loading-label span', () => {
    const expectedContent = 'Carregando resultados';

    component.text = expectedContent;
    fixture.detectChanges();

    const contentComponent = nativeElement.querySelector('.po-loading-label').innerHTML;

    expect(contentComponent).toBe(expectedContent);
  });

  describe('Templates: ', () => {
    it('po-loading-label: should not show span.po-loading-label when text is not defined.', () => {
      component.text = '';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-label')).toBeNull();
    });

    it('po-loading-label: should show span.po-loading-label when text is defined.', () => {
      component.text = 'label';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-loading-label')).toBeTruthy();
    });
  });
});
