import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoProgressBarComponent } from './po-progress-bar.component';
import { PoProgressModule } from '../po-progress.module';

describe('PoProgressBarComponent:', () => {
  let component: PoProgressBarComponent;
  let fixture: ComponentFixture<PoProgressBarComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoProgressModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProgressBarComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  describe('Properties:', () => {
    it('should return `0` if value is 0', () => {
      component.value = 0;

      expect(component.valueScale).toBe('0');
    });

    it('should return `1` if value is 100', () => {
      component.value = 100;

      expect(component.valueScale).toBe('1');
    });

    it('should return `0.5` if value is 50', () => {
      component.value = 50;

      expect(component.valueScale).toBe('0.5');
    });

    it('should return `0.25` if value is 25', () => {
      component.value = 25;

      expect(component.valueScale).toBe('0.25');
    });
  });

  describe('Templates:', () => {
    it('should contain the value of 0.25 in style transform scale if value is 25', () => {
      component.value = 25;

      fixture.detectChanges();

      const progressBar = nativeElement.querySelector('.po-progress-bar-primary');

      expect(progressBar.style.transform).toBe('scaleX(0.25)');
    });

    it('should contain the value of 0 in style transform scale if value is 0', () => {
      component.value = 0;

      fixture.detectChanges();

      const progressBar = nativeElement.querySelector('.po-progress-bar-primary');

      expect(progressBar.style.transform).toBe('scaleX(0)');
    });
  });
});
