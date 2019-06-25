import { EventEmitter } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoChartBaseComponent } from './po-chart-base.component';

class PoCharComponent extends PoChartBaseComponent {

  rebuildComponent() { }

}

describe('PoChartBaseComponent:', () => {

  let component: PoCharComponent;

  beforeEach(() => {
    component = new PoCharComponent();
  });

  it('should be create', () => {
    expect(component instanceof PoChartBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('p-height: should update property with 200 if values is lower than 200', () => {
      const validValues = [105, 1, 7, 0, -5];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', validValues, 200);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    it('p-height: should update property with valid values', () => {
      const validValues = [250, 300, 500];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', validValues, validValues);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    it('p-height: should update property with 400 if invalid values.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', invalidValues, 400);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    // TODO quando aceitar types
    // it('p-type: should update property with valid values.', () => {
    //   const validValues = (<any>Object).values(PoChartType);

    //   expectPropertiesValues(poChartBase, 'type', validValues, validValues);
    // });

    // it('p-type: should update property with `PoChartType.Pie` if contains invalid values', () => {
    //   const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    //   expectPropertiesValues(poChartBase, 'type', invalidValues, PoChartType.Pie);
    // });

  });

  describe('Methods:', () => {

    it('onSeriesClick: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value' };
      component.seriesClick = new EventEmitter();

      spyOn(component.seriesClick, 'emit');

      component.onSeriesClick(eventMock);

      expect(component.seriesClick.emit).toHaveBeenCalledWith(eventMock);
    });

    it('onSeriesHover: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value' };
      component.seriesHover = new EventEmitter();

      spyOn(component.seriesHover, 'emit');

      component.onSeriesHover(eventMock);

      expect(component.seriesHover.emit).toHaveBeenCalledWith(eventMock);
    });

  });

});
