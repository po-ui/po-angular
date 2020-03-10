import { ElementRef } from '@angular/core';

import { PoControlPositionService } from './po-control-position.service';

describe('PoControlPositionService:', () => {
  let component: PoControlPositionService;

  beforeEach(() => {
    component = new PoControlPositionService();
  });

  it('should be created', () => {
    expect(component instanceof PoControlPositionService).toBeTruthy();
  });

  it('should set arrowDirection()', () => {
    expect(component['setArrowDirection']('top')).toBe('bottom');
    expect(component['setArrowDirection']('top-left')).toBe('bottom-right');
    expect(component['setArrowDirection']('top-right')).toBe('bottom-left');
    expect(component['setArrowDirection']('right')).toBe('left');
    expect(component['setArrowDirection']('right-top')).toBe('left-bottom');
    expect(component['setArrowDirection']('right-bottom')).toBe('left-top');
    expect(component['setArrowDirection']('bottom')).toBe('top');
    expect(component['setArrowDirection']('bottom-right')).toBe('top-left');
    expect(component['setArrowDirection']('bottom-left')).toBe('top-right');
    expect(component['setArrowDirection']('left')).toBe('right');
    expect(component['setArrowDirection']('left-bottom')).toBe('right-top');
    expect(component['setArrowDirection']('left-top')).toBe('right-bottom');
  });

  it('overflowAllSides: should call getOverflows()', () => {
    spyOn(component, <any>'getOverflows');

    component['overflowAllSides']('');

    expect(component['getOverflows']).toHaveBeenCalled();
  });

  it('should call overflowAllSides() in top positions', () => {
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'top-right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'top-right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'top-left')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'top-left')).toBe(true);
  });

  it('should call overflowAllSides() in right positions', () => {
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'right-top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'right-top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'right-bottom')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'right-bottom')).toBe(true);
  });

  it('should call overflowAllSides() in bottom positions', () => {
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'bottom')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'bottom')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'bottom')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'bottom-right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('right'), 'bottom-right')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'bottom-left')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'bottom-left')).toBe(true);
  });

  it('should call overflowAllSides() in left positions', () => {
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'left')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'left')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'left')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'left-top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('top'), 'left-top')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('left'), 'left-bottom')).toBe(true);
    expect(component['overflowAllSides'].call(getFakeOverflows('bottom'), 'left-bottom')).toBe(true);
  });

  it('should call overflowMain() in left positions', () => {
    expect(component['overflowMain'].call(getFakeOverflows('top'), 'top')).toBe(true);
    expect(component['overflowMain'].call(getFakeOverflows('left'), 'left')).toBe(true);
    expect(component['overflowMain'].call(getFakeOverflows('bottom'), 'bottom')).toBe(true);
    expect(component['overflowMain'].call(getFakeOverflows('right'), 'right')).toBe(true);
  });

  it('should verify getOverflows() in all sides', () => {
    expect(component['getOverflows'].call(getFakeSizesAndPositions(0, 10, 10, 10)).top).toBe(true);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 10, 10)).top).toBe(false);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 110, 10, 10)).right).toBe(true);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 10, 10)).right).toBe(false);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 110, 10)).bottom).toBe(true);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 10, 10)).bottom).toBe(false);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 10, 0)).left).toBe(true);
    expect(component['getOverflows'].call(getFakeSizesAndPositions(10, 10, 10, 10)).left).toBe(false);
  });

  it('should call setTopPositions() in all top sides in setElementPosition()', () => {
    const fakeThis = getFakeSizesAndPositions(10, 10, 10, 10);
    spyOn(fakeThis, 'setTopPositions');
    component['setElementPosition'].call(fakeThis, 'top');
    expect(fakeThis['setTopPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'top-right');
    expect(fakeThis['setTopPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'top-left');
    expect(fakeThis['setTopPositions']).toHaveBeenCalled();
  });

  it('should call setRightPositions() in all right sides in setElementPosition()', () => {
    const fakeThis = getFakeSizesAndPositions(10, 10, 10, 10);
    spyOn(fakeThis, 'setRightPositions');
    component['setElementPosition'].call(fakeThis, 'right');
    expect(fakeThis['setRightPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'right-top');
    expect(fakeThis['setRightPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'right-bottom');
    expect(fakeThis['setRightPositions']).toHaveBeenCalled();
  });

  it('should call setBottomPositions() in all bottom sides in setElementPosition()', () => {
    const fakeThis = getFakeSizesAndPositions(10, 10, 10, 10);
    spyOn(fakeThis, 'setBottomPositions');
    component['setElementPosition'].call(fakeThis, 'bottom');
    expect(fakeThis['setBottomPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'bottom-left');
    expect(fakeThis['setBottomPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'bottom-right');
    expect(fakeThis['setBottomPositions']).toHaveBeenCalled();
  });

  it('should call setLeftPositions() in all left sides in setElementPosition()', () => {
    const fakeThis = getFakeSizesAndPositions(10, 10, 10, 10);
    spyOn(fakeThis, 'setLeftPositions');
    component['setElementPosition'].call(fakeThis, 'left');
    expect(fakeThis['setLeftPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'left-top');
    expect(fakeThis['setLeftPositions']).toHaveBeenCalled();
    component['setElementPosition'].call(fakeThis, 'left-bottom');
    expect(fakeThis['setLeftPositions']).toHaveBeenCalled();
  });

  it('should get arrow direction in getArrowDirection()', () => {
    const fakeThis = { arrowDirection: 'top' };
    expect(component.getArrowDirection.call(fakeThis)).toBe('top');
  });

  it('should get main position in getMainPosition()', () => {
    expect(component['getMainPosition']('top')).toBe('top');
    expect(component['getMainPosition']('top-left')).toBe('top');
  });

  it('should get size and positions with nativeElement in getSizesAndPositions()', () => {
    const fakeThis = {
      element: {
        getBoundingClientRect: () => {}
      },
      targetElement: {
        getBoundingClientRect: () => {}
      }
    };
    const sizesAndPositions = component['getSizesAndPositions'].call(fakeThis);

    expect(sizesAndPositions.window.innerHeight).not.toBeUndefined();
  });

  it('should get size and positions without nativeElement in getSizesAndPositions()', () => {
    const fakeThis = {
      element: {
        getBoundingClientRect: () => {}
      },
      targetElement: {
        getBoundingClientRect: () => {}
      }
    };
    const result = component['getSizesAndPositions'].call(fakeThis);
    expect(result.window.innerHeight).not.toBeUndefined();
  });

  it('should get size and positions without targetElement in getSizesAndPositions()', () => {
    const fakeThis = {
      element: {
        getBoundingClientRect: () => {}
      },
      targetElement: null
    };
    const result = component['getSizesAndPositions'].call(fakeThis);
    expect(result.window.innerHeight).not.toBeUndefined();
  });

  it('should verify sub positions in verifySubPositions()', () => {
    const fakeThis: any = {
      elementPosition: () => {},
      overflowAllSides: () => {},
      nextPosition: () => {}
    };

    spyOn(fakeThis, 'elementPosition');
    component['verifySubPositions'].call(fakeThis, 'top-left');
    expect(fakeThis['elementPosition']).toHaveBeenCalled();
    component['verifySubPositions'].call(fakeThis, 'top');
    expect(fakeThis['elementPosition']).toHaveBeenCalled();

    spyOn(fakeThis, 'overflowAllSides').and.returnValue(true);
    spyOn(fakeThis, 'nextPosition');
    component['verifySubPositions'].call(fakeThis, 'top');
    expect(fakeThis['overflowAllSides']).toHaveBeenCalledTimes(3);
    expect(fakeThis['nextPosition']).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    const fakePositions = getFakeSizesAndPositions(10, 0, 0, 10);
    const fakeThis = {
      elementOffset: 5,
      element: {
        style: {
          top: '0',
          left: '0'
        }
      }
    };

    it('getMainPositionsByCustomPositions: should return [`right`, `bottom`] if different positions', () => {
      const expectedMainPositions = ['right', 'bottom'];
      const customPositions = ['right-bottom', 'bottom'];

      const mainPosititionsByCustomPositions = component['getMainPositionsByCustomPositions'](customPositions);

      expect(mainPosititionsByCustomPositions).toEqual(expectedMainPositions);
    });

    it('getMainPositionsByCustomPositions: should return [`right`, `bottom`] if has same main positions', () => {
      const expectedMainPositions = ['right', 'bottom'];
      const customPositions = ['right-bottom', 'right-left', 'bottom'];

      const mainPosititionsByCustomPositions = component['getMainPositionsByCustomPositions'](customPositions);

      expect(mainPosititionsByCustomPositions).toEqual(expectedMainPositions);
    });

    it('setElementWidth: should set element width with the same target width if isSetElementWidth and targetElement are true', () => {
      const expectedValue = '200px';
      const _component = {
        isSetElementWidth: true,
        element: {
          style: {
            width: '10px'
          }
        },
        targetElement: {
          clientWidth: 200
        }
      };

      component['setElementWidth'].call(_component);

      expect(_component.element.style.width).toBe(expectedValue);
    });

    it('setElementWidth: shouldn`t set element width if targetElement is false', () => {
      const expectedValue = '10px';
      const _component = {
        isSetElementWidth: true,
        element: {
          style: {
            width: '10px'
          }
        }
      };

      component['setElementWidth'].call(_component);

      expect(_component.element.style.width).toBe(expectedValue);
    });

    it('setElementWidth: shouldn`t set element width if isSetElementWidth is false', () => {
      const expectedValue = '10px';
      const _component = {
        isSetElementWidth: false,
        element: {
          style: {
            width: '10px'
          }
        },
        targetElement: {
          clientWidth: 200
        }
      };

      component['setElementWidth'].call(_component);

      expect(_component.element.style.width).toBe(expectedValue);
    });

    it(`setElements: should set property element, offset, targetElement, customPositions and isSetElementWidth'`, () => {
      const element = new ElementRef('<div></div>');
      const offset = 8;
      const targetElement = new ElementRef('<div></div>');
      const customPositions = ['top'];
      const isSetElementWidth = true;

      component.setElements(element, offset, targetElement, customPositions, isSetElementWidth);

      expect(component['element']).toBe(<any>element.nativeElement);
      expect(component['elementOffset']).toBe(offset);
      expect(component['targetElement']).toBe(<any>targetElement.nativeElement);
      expect(component['customPositions']).toBe(customPositions);
      expect(component['isSetElementWidth']).toBe(isSetElementWidth);
    });

    it(`setElements: should set property offset with 0, element and targetElement with HMTLElement`, () => {
      const element: any = '<div></div>';
      const offset = 0;
      const targetElement: any = '<div></div>';

      component.setElements(element, offset, targetElement);

      expect(component['element']).toBe(element);
      expect(component['elementOffset']).toBe(offset);
      expect(component['targetElement']).toBe(targetElement);
    });

    it('getMainPositions: should return [`top`, `right`, `bottom`, `left`] if `customPositions` is undefined', () => {
      const expectedValue = ['top', 'right', 'bottom', 'left'];
      component['customPositions'] = undefined;

      const mainPositions = component['getMainPositions']();

      expect(mainPositions).toEqual(expectedValue);
    });

    it('getMainPositions: should return [`top`, `right`] if `customPositions` is [´top´, ´top-right´, ´right´]', () => {
      const expectedValue = ['top', 'right'];
      component['customPositions'] = ['top', 'top-right', 'right'];

      spyOn(component, <any>'getMainPositionsByCustomPositions').and.callThrough();

      const mainPositions = component['getMainPositions']();

      expect(mainPositions).toEqual(expectedValue);
      expect(component['getMainPositionsByCustomPositions']).toHaveBeenCalled();
    });

    it('nextPosition: should return `right` if current position is `top`', () => {
      const expectedValue = 'right';

      const position = 'top';
      const positions = ['top', 'right'];

      const nextPosition = component['nextPosition'](position, positions);

      expect(nextPosition).toBe(expectedValue);
    });

    it('nextPosition: should return `top` if current position is `right`', () => {
      const expectedValue = 'top';

      const position = 'right';
      const positions = ['top', 'right'];

      const nextPosition = component['nextPosition'](position, positions);

      expect(nextPosition).toBe(expectedValue);
    });

    it('nextPosition: should return `undefined` if positions is []', () => {
      const position = 'top';

      const nextPosition = component['nextPosition'](position);

      expect(nextPosition).toBe(undefined);
    });

    describe('adjustPosition:', () => {
      it('should call `elementPosition` with value if has value', () => {
        const position = 'left';
        spyOn(component, <any>'elementPosition');
        spyOn(component, <any>'adjustDefaultPosition');
        spyOn(component, <any>'adjustCustomPosition');

        component.adjustPosition(position);

        expect(component['elementPosition']).toHaveBeenCalledWith(position);
      });

      it('should call `elementPosition` with `bottom` if value is `undefined`', () => {
        spyOn(component, <any>'elementPosition');
        spyOn(component, <any>'adjustDefaultPosition');
        spyOn(component, <any>'adjustCustomPosition');

        component.adjustPosition(undefined);

        expect(component['elementPosition']).toHaveBeenCalledWith('bottom');
      });

      it('should call `elementPosition` with `bottom` if value is ``', () => {
        spyOn(component, <any>'elementPosition');
        spyOn(component, <any>'adjustDefaultPosition');
        spyOn(component, <any>'adjustCustomPosition');

        component.adjustPosition('');

        expect(component['elementPosition']).toHaveBeenCalledWith('bottom');
      });

      it('should call `setElementPosition`, and `nextPosition` if `overflowMain` return true', () => {
        spyOn(component, <any>'overflowMain').and.returnValue(true);
        spyOn(component, <any>'setElementPosition');
        spyOn(component, <any>'getMainPosition');
        spyOn(component, <any>'nextPosition');

        component.adjustPosition('top-left');

        expect(component['setElementPosition']).toHaveBeenCalled();
        expect(component['overflowMain']).toHaveBeenCalledTimes(4);
        expect(component['getMainPosition']).toHaveBeenCalled();
        expect(component['nextPosition']).toHaveBeenCalled();
      });

      it(`should call 'verifySubPositions' if 'overflowAllSides' return true and not call 'nextPosition' if 'overflowMain'
        return false`, () => {
        spyOn(component, <any>'overflowMain').and.returnValue(false);
        spyOn(component, <any>'overflowAllSides').and.returnValue(true);
        spyOn(component, <any>'verifySubPositions');
        spyOn(component, <any>'setElementPosition');
        spyOn(component, <any>'nextPosition');

        component.adjustPosition('top-left');

        expect(component['nextPosition']).not.toHaveBeenCalled();
        expect(component['setElementPosition']).toHaveBeenCalled();
        expect(component['verifySubPositions']).toHaveBeenCalled();
        expect(component['overflowAllSides']).toHaveBeenCalled();
        expect(component['overflowMain']).toHaveBeenCalledTimes(1);
      });

      it(`should call 'setElementPosition' and not call 'nextPosition', 'verifySubPositions' if 'overflowMain'
      return false`, () => {
        spyOn(component, <any>'overflowMain').and.returnValue(false);
        spyOn(component, <any>'overflowAllSides').and.returnValue(false);
        spyOn(component, <any>'setElementPosition');

        spyOn(component, <any>'verifySubPositions');
        spyOn(component, <any>'nextPosition');

        component.adjustPosition('top');

        expect(component['nextPosition']).not.toHaveBeenCalled();
        expect(component['verifySubPositions']).not.toHaveBeenCalled();

        expect(component['setElementPosition']).toHaveBeenCalled();
        expect(component['overflowAllSides']).toHaveBeenCalledTimes(1);
        expect(component['overflowMain']).toHaveBeenCalledTimes(1);
      });
    });

    describe('Set sides positions', () => {
      it('should set top and left position in setTopPositions()', () => {
        component['setTopPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.top).toBe('5px');
        component['setTopPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.left).toBe('0px');
      });

      it('should set top and left position in setRightPositions()', () => {
        component['setRightPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.top).toBe('0px');
        component['setRightPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.left).toBe('5px');
      });

      it('should set top and left position in setBottomPositions()', () => {
        component['setBottomPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.top).toBe('5px');
        component['setBottomPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.left).toBe('0px');
      });

      it('should set top and left position in setLeftPositions()', () => {
        component['setLeftPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.top).toBe('0px');
        component['setLeftPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
        expect(fakeThis.element.style.left).toBe('5px');
      });
    });

    it('adjustCustomPosition: should call `overflowAllSides` twice if `customPosition.length` is 2', () => {
      component['customPositions'] = ['top', 'bottom'];

      const overflowAllSides = spyOn(component, <any>'overflowAllSides').and.returnValue(true);
      const nextPosition = spyOn(component, <any>'nextPosition');
      const elementPosition = spyOn(component, <any>'elementPosition');

      component['adjustCustomPosition']('top');

      expect(overflowAllSides).toHaveBeenCalledTimes(component['customPositions'].length);
      expect(nextPosition).toHaveBeenCalled();
      expect(elementPosition).toHaveBeenCalled();
    });

    it('adjustCustomPosition: should call `nextPosition` and `elementPosition` if `overflowAllSides` return true.', () => {
      component['customPositions'] = ['top', 'bottom'];
      const overflowAllSides = spyOn(component, <any>'overflowAllSides').and.returnValue(true);
      const nextPosition = spyOn(component, <any>'nextPosition');
      const elementPosition = spyOn(component, <any>'elementPosition');

      component['adjustCustomPosition']('top');

      expect(overflowAllSides).toHaveBeenCalled();
      expect(nextPosition).toHaveBeenCalled();
      expect(elementPosition).toHaveBeenCalled();
    });

    it('adjustCustomPosition: should not call `nextPosition` and `elementPosition` if `overflowAllSides` return false.', () => {
      component['customPositions'] = ['top', 'bottom'];
      const overflowAllSides = spyOn(component, <any>'overflowAllSides').and.returnValue(false);
      const nextPosition = spyOn(component, <any>'nextPosition');
      const elementPosition = spyOn(component, <any>'elementPosition');

      component['adjustCustomPosition']('top');

      expect(overflowAllSides).toHaveBeenCalled();
      expect(nextPosition).not.toHaveBeenCalled();
      expect(elementPosition).not.toHaveBeenCalled();
    });

    it(`adjustDefaultPosition: should call 'getMainPosition' and 'verifySubPositions' if 'overflowMain' return false and 'overflowAllSides'
      return true.`, () => {
      const getMainPositions = spyOn(component, <any>'getMainPositions').and.returnValue('bottom');
      const overflowMain = spyOn(component, <any>'overflowMain').and.returnValue(false);
      const overflowAllSides = spyOn(component, <any>'overflowAllSides').and.returnValue(true);
      const verifySubPositions = spyOn(component, <any>'verifySubPositions');
      spyOn(component, <any>'elementPosition');

      component['adjustDefaultPosition']('bottom');

      expect(getMainPositions).toHaveBeenCalled();
      expect(overflowMain).toHaveBeenCalled();
      expect(overflowAllSides).toHaveBeenCalled();
      expect(verifySubPositions).toHaveBeenCalled();
    });

    it(`adjustDefaultPosition: should return undefined if 'overflowMain' and 'overflowAllSides' return false.`, () => {
      const getMainPositions = spyOn(component, <any>'getMainPositions').and.returnValue('left');
      const overflowMain = spyOn(component, <any>'overflowMain').and.returnValue(false);
      const overflowAllSides = spyOn(component, <any>'overflowAllSides').and.returnValue(false);
      const nextPosition = spyOn(component, <any>'nextPosition');
      const verifySubPositions = spyOn(component, <any>'verifySubPositions');
      spyOn(component, <any>'elementPosition');

      component['adjustDefaultPosition']('left');

      expect(getMainPositions).toHaveBeenCalled();
      expect(overflowMain).toHaveBeenCalled();
      expect(overflowAllSides).toHaveBeenCalled();
      expect(nextPosition).not.toHaveBeenCalled();
      expect(verifySubPositions).not.toHaveBeenCalled();
    });

    it('elementPosition: should call `setAlignedElementPosition` if `isCornerAligned` is true.', () => {
      component['isCornerAligned'] = true;
      const setAlignedElementPosition = spyOn(component, <any>'setAlignedElementPosition');
      component['elementPosition']('bottom');
      expect(setAlignedElementPosition).toHaveBeenCalled();
    });

    it('elementPosition: should call `setElementPosition` if `isCornerAligned` is false.', () => {
      component['isCornerAligned'] = false;
      const setElementPosition = spyOn(component, <any>'setElementPosition');
      component['elementPosition']('bottom');
      expect(setElementPosition).toHaveBeenCalled();
    });

    describe('setAlignedArrowDirection:', () => {
      it('should return `bottom-left` when parameter is `top-left`.', () => {
        expect(component['setAlignedArrowDirection']('top-left')).toBe('bottom-left');
      });

      it('should return `bottom-right` when parameter is `top-right`.', () => {
        expect(component['setAlignedArrowDirection']('top-right')).toBe('bottom-right');
      });

      it('should return `top-right` when parameter is `bottom-right`.', () => {
        expect(component['setAlignedArrowDirection']('bottom-right')).toBe('top-right');
      });

      it('should return `top-left` when parameter is `bottom-left`.', () => {
        expect(component['setAlignedArrowDirection']('bottom-left')).toBe('top-left');
      });
    });

    it('setAlignedBottomPositions: should set style top and left of element.', () => {
      component['setAlignedBottomPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
      expect(fakeThis.element.style.top).toBe('5px');
      component['setAlignedBottomPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
      expect(fakeThis.element.style.left).toBe('0px');
    });

    describe('setAlignedElementPosition:', () => {
      it('should always call `setElementWidth` and `setAlignedArrowDirection`.', () => {
        const setElementWidth = spyOn(component, <any>'setElementWidth');
        const setAlignedArrowDirection = spyOn(component, <any>'setAlignedArrowDirection');
        const getSizesAndPositions = spyOn(component, <any>'getSizesAndPositions');

        component['setAlignedElementPosition']('bottom');

        expect(setElementWidth).toHaveBeenCalled();
        expect(setAlignedArrowDirection).toHaveBeenCalled();
        expect(getSizesAndPositions).toHaveBeenCalled();
      });

      it('should call `setAlignedBottomPositions` if position is `bottom-left`.', () => {
        const setAlignedBottomPositions = spyOn(component, <any>'setAlignedBottomPositions');
        const getSizesAndPositions = spyOn(component, <any>'getSizesAndPositions');

        component['setAlignedElementPosition']('bottom-left');

        expect(setAlignedBottomPositions).toHaveBeenCalled();
        expect(getSizesAndPositions).toHaveBeenCalled();
      });

      it('should call `setAlignedBottomPositions` if position is `bottom-right`.', () => {
        const setAlignedBottomPositions = spyOn(component, <any>'setAlignedBottomPositions');
        const getSizesAndPositions = spyOn(component, <any>'getSizesAndPositions').and.returnValue(
          getFakeSizesAndPositions(0, 0, 0, 0).getSizesAndPositions()
        );

        component['setAlignedElementPosition']('bottom-right');

        expect(setAlignedBottomPositions).toHaveBeenCalled();
        expect(getSizesAndPositions).toHaveBeenCalled();
      });

      it('should call `setAlignedTopPositions` if position is `top-left`.', () => {
        const setAlignedTopPositions = spyOn(component, <any>'setAlignedTopPositions');
        const getSizesAndPositions = spyOn(component, <any>'getSizesAndPositions');

        component['setAlignedElementPosition']('top-left');

        expect(setAlignedTopPositions).toHaveBeenCalled();
        expect(getSizesAndPositions).toHaveBeenCalled();
      });

      it('should call `setAlignedTopPositions` if position is `top-right`.', () => {
        const setAlignedTopPositions = spyOn(component, <any>'setAlignedTopPositions');
        const getSizesAndPositions = spyOn(component, <any>'getSizesAndPositions').and.returnValue(
          getFakeSizesAndPositions(0, 0, 0, 0).getSizesAndPositions()
        );

        component['setAlignedElementPosition']('top-right');

        expect(setAlignedTopPositions).toHaveBeenCalled();
        expect(getSizesAndPositions).toHaveBeenCalled();
      });
    });

    it('setAlignedTopPositions: should set style top and left.', () => {
      component['setAlignedTopPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
      expect(fakeThis.element.style.top).toBe('5px');
      component['setAlignedTopPositions'].call(fakeThis, 10, fakePositions['getSizesAndPositions']());
      expect(fakeThis.element.style.left).toBe('0px');
    });
  });
});

function getFakeOverflows(positionTrue) {
  return {
    getOverflows: () => {
      return {
        right: positionTrue === 'right',
        left: positionTrue === 'left',
        top: positionTrue === 'top',
        bottom: positionTrue === 'bottom'
      };
    }
  };
}

function getFakeSizesAndPositions(top, right, bottom, left) {
  return {
    setArrowDirection: () => {},
    setTopPositions: () => {},
    setLeftPositions: () => {},
    setRightPositions: () => {},
    setBottomPositions: () => {},
    arrowDirection: 'bottom',
    setElementWidth: () => {},
    getSizesAndPositions: () => {
      return {
        window: {
          scrollY: 0,
          scrollX: 0,
          innerWidth: 100,
          innerHeight: 100
        },
        element: {
          top: top,
          left: left,
          right: right,
          bottom: bottom,
          height: 0,
          width: 0
        },
        target: {
          top: top,
          left: left,
          right: right,
          bottom: bottom,
          height: 0,
          width: 0
        }
      };
    }
  };
}
