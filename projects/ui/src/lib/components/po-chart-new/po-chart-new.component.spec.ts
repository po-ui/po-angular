import { TestBed, waitForAsync } from '@angular/core/testing';

import { PoChartNewBaseComponent } from './po-chart-new-base.component';
import { PoChartNewComponent } from './po-chart-new.component';
import { PoChartNewModule } from './po-chart-new.module';

describe('PoChartNewComponent:', () => {
  let component: PoChartNewComponent;
  let fixture;
  let nativeElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoChartNewModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartNewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component instanceof PoChartNewComponent).toBeTruthy();
    expect(component instanceof PoChartNewBaseComponent).toBeTruthy();
  });
});
