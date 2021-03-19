import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartModule } from '../../po-chart.module';

import { PoChartLineComponent } from './po-chart-line.component';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  const series = [
    { label: 'category', data: [1, 2, 3], color: '#94DAE2' },
    { label: 'category B', data: [10, 20, 30], color: '#29B6C5' }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    axisXLabelWidth: 72,
    svgPlottingAreaHeight: 20
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartLineComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSeriePointHover: should emit `pointHover` and call `reorderSVGGroup`', () => {
      const selectedItem = { relativeTo: 'po-chart-path-1', label: 'Vancouver', data: 200 };

      const spyReorderSVGGroup = spyOn(component, <any>'reorderSVGGroup');
      const spyPointHover = spyOn(component.pointHover, 'emit');

      component.onSeriePointHover(selectedItem);

      expect(spyPointHover).toHaveBeenCalledWith({ label: 'Vancouver', data: 200 });
      expect(spyReorderSVGGroup).toHaveBeenCalledWith('po-chart-path-1');
    });

    it('onEnter: should return null', () => {
      expect(component.onEnter(0)).toBeNull();
    });

    it('onLeave: should return null', () => {
      expect(component.onLeave(0)).toBeNull();
    });

    it('reorderSVGGroup: should apply false to `animate` and call `renderer.appendChild` and `querySelectorAll`', () => {
      const pathGroup = 'po-chart-line-path-group-0';

      const spyAppendChild = spyOn(component['renderer'], 'appendChild');

      component['reorderSVGGroup'](pathGroup);

      expect(component.animate).toBeFalsy();
      expect(spyAppendChild).toHaveBeenCalled();
    });
  });
});
