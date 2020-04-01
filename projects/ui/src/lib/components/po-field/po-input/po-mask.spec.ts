import { PoMask } from './po-mask';

describe('PoMask', () => {
  let mask: PoMask;
  let fakeEvent;

  beforeEach(() => {
    mask = new PoMask('(88)88', false);

    fakeEvent = {
      keyCode: 8,
      ctrlKey: false,
      metaKey: false,
      preventDefault: function () {},
      target: {
        value: '',
        setSelectionRange: function (start: number, end: number) {
          this.selectionStart = start;
          this.selectionEnd = end;
        },
        selectionStart: 0,
        selectionEnd: 0
      }
    };
  });

  it('should return pattern', () => {
    mask.pattern = 'teste';
    expect(mask.getPattern).toBe('teste');
  });

  it('should return valueToInput', () => {
    mask.valueToInput = 'teste';
    expect(mask.getValueToInput).toBe('teste');
  });

  it('should set valueToInput', () => {
    mask.setValueToInput = 'teste set';
    expect(mask.getValueToInput).toBe('teste set');
  });

  it('should return valueToModel', () => {
    mask.valueToModel = 'teste';
    expect(mask.getValueToModel).toBe('teste');
  });

  it('should set valueToModel', () => {
    mask.setValueToModel = 'teste set';
    expect(mask.getValueToModel).toBe('teste set');
  });

  it('should match position when shift is not pressed ', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 4;

    fakeEvent.shiftKey = false;

    fakeMask.setPositionNotShiftKey(fakeEvent);

    expect(fakeMask.finalPosition).toBe(4);
  });

  it('should be different from the initial position of the final when pressing shift', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 4;

    fakeEvent.shiftKey = true;

    fakeMask.setPositionNotShiftKey(fakeEvent);

    expect(fakeMask.finalPosition).toBe(0);
  });

  it('should be equals the positions if the final position is null', () => {
    const fakeMask = mask;
    fakeMask.finalPosition = null;
    fakeMask.initialPosition = 5;

    fakeMask.keydown(fakeEvent);

    expect(fakeMask.finalPosition).toBe(fakeMask.initialPosition);
  });

  it('should reset the initial position when it is less than zero when press backspace in keydown', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = -1;

    fakeEvent.keyCode = 8;

    fakeMask.keydown(fakeEvent);

    expect(fakeMask.initialPosition).toBe(0);
  });

  it('should change position when you press the backspace and have a mask before and initial position equal final position', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 4;
    fakeMask.finalPosition = 4;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 4;
    fakeEvent.target.selectionEnd = 4;
    fakeEvent.keyCode = 8;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.selectionStart).toBe(2);
  });

  it('should change position when you press the backspace and have a mask before and initial position other than zero', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 5;
    fakeMask.finalPosition = 5;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 5;
    fakeEvent.target.selectionEnd = 5;
    fakeEvent.keyCode = 8;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.selectionStart).toBe(3);
  });

  it('should clear a selection range when pressing backspace', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 1;
    fakeMask.finalPosition = 5;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 1;
    fakeEvent.target.selectionEnd = 5;
    fakeEvent.keyCode = 8;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.value).toBe('(9');
  });

  it('should clear a selection range when pressing delete', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 1;
    fakeMask.finalPosition = 5;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 1;
    fakeEvent.target.selectionEnd = 5;
    fakeEvent.keyCode = 46;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.value).toBe('(9');
  });

  it('should move a cursor when mask after delete', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 3;
    fakeMask.finalPosition = 3;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 3;
    fakeEvent.target.selectionEnd = 3;
    fakeEvent.keyCode = 46;

    fakeMask.keydown(fakeEvent);

    expect(fakeMask.initialPosition).toBe(4);
  });

  it('should delete the next character when there is no selection', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 4;
    fakeMask.finalPosition = 4;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 4;
    fakeEvent.target.selectionEnd = 4;
    fakeEvent.keyCode = 46;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.value).toBe('(99)9');
  });

  it('should be enter a character in the cursor position when mask after', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 3;
    fakeMask.finalPosition = 3;

    fakeEvent.target.value = '(99)9';
    fakeEvent.target.selectionStart = 3;
    fakeEvent.target.selectionEnd = 3;
    fakeEvent.key = '9';
    fakeEvent.keyCode = 57;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.value).toBe('(99)99');
  });

  it('should be enter a character in the cursor position when no mask after', () => {
    const fakeMask = mask;
    fakeMask.mask = '(99)99';
    fakeMask.initialPosition = 4;
    fakeMask.finalPosition = 4;

    fakeEvent.target.value = '(99)9';
    fakeEvent.target.selectionStart = 4;
    fakeEvent.target.selectionEnd = 4;
    fakeEvent.key = '9';
    fakeEvent.keyCode = 57;

    fakeMask.keydown(fakeEvent);

    expect(fakeEvent.target.value).toBe('(99)99');
  });

  it('should move to the left by pressing the left key', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 3;
    fakeMask.finalPosition = 3;

    fakeEvent.target.selectionStart = 3;
    fakeEvent.keyCode = 37;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(2);
  });

  it('should not call setSelectionRange when not have mask in keyUp', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '';

    fakeEvent.keyCode = 39;

    spyOn(fakeMask, 'setSelectionRange');

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.setSelectionRange).not.toHaveBeenCalled();
  });

  it('should move to the right by pressing the right key', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';
    fakeEvent.target.selectionStart = 2;
    fakeEvent.target.selectionEnd = 2;

    fakeEvent.keyCode = 39;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(3);
  });

  it('should not move to the left when the initial position is less than or equal 0', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 0;
    fakeMask.finalPosition = 0;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';
    fakeEvent.target.selectionStart = 0;
    fakeEvent.target.selectionEnd = 0;

    fakeEvent.keyCode = 37;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(0);
  });

  it('should not move to the right when the final position is bigger or equal mask lenght', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 7;
    fakeMask.finalPosition = 7;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';
    fakeEvent.target.selectionStart = 7;
    fakeEvent.target.selectionEnd = 7;

    fakeEvent.keyCode = 39;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(7);
  });

  it('should not call revert positions return in keydown when press metakey + r', () => {
    const fakeMask = mask;

    fakeEvent.keyCode = 82;
    fakeEvent.metaKey = true;

    spyOn(fakeMask, 'revertPositions');

    fakeMask.keydown(fakeEvent);

    expect(fakeMask.revertPositions).not.toHaveBeenCalled();
  });

  it('should not call revert positions in keydown when no valid keycode', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 5;
    fakeMask.finalPosition = 5;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 5;
    fakeEvent.target.selectionEnd = 5;
    fakeEvent.metaKey = false;

    fakeEvent.keyCode = 10;

    spyOn(fakeMask, 'revertPositions');

    fakeMask.keydown(fakeEvent);

    expect(fakeMask.revertPositions).not.toHaveBeenCalled();
  });

  it('should move to the end by pressing the end key', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';

    fakeEvent.keyCode = 35;
    fakeEvent.shiftKey = false;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.finalPosition).toBe(7);
  });

  it('select when pressing shift + end', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';

    fakeEvent.keyCode = 35;
    fakeEvent.shiftKey = true;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.finalPosition).toBe(7);
    expect(fakeMask.initialPosition).toBe(2);
  });

  it('should update the input with the formatted value if you press control v', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '99999';
    fakeEvent.keyCode = 17;

    fakeMask.keyup(fakeEvent);

    expect(fakeEvent.target.value).toBe('(99)999');
  });

  it('should move to the home by pressing the home key', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';

    fakeEvent.keyCode = 36;
    fakeEvent.shiftKey = false;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(0);
  });

  it('should select when pressing shift + home', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 2;
    fakeMask.finalPosition = 2;
    fakeMask.mask = '(99)999';

    fakeEvent.target.value = '(99)999';

    fakeEvent.keyCode = 36;
    fakeEvent.shiftKey = true;

    fakeMask.keyup(fakeEvent);

    expect(fakeMask.initialPosition).toBe(0);
    expect(fakeMask.finalPosition).toBe(2);
  });

  it('should invert the selection order if the initial is greater than the end ', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 5;
    fakeMask.finalPosition = 4;

    fakeMask.setSelectionRange(fakeEvent);

    expect(fakeEvent.target.selectionStart).toBe(fakeMask.finalPosition);
    expect(fakeEvent.target.selectionEnd).toBe(fakeMask.initialPosition);
  });

  it('should not invert the selection order if the initial is less than the end ', () => {
    const fakeMask = mask;
    fakeMask.initialPosition = 4;
    fakeMask.finalPosition = 5;

    fakeMask.setSelectionRange(fakeEvent);

    expect(fakeEvent.target.selectionStart).toBe(fakeMask.initialPosition);
    expect(fakeEvent.target.selectionEnd).toBe(fakeMask.finalPosition);
  });

  it('should return when keydown without mask ', () => {
    const fakeThis = {
      mask: ''
    };
    expect(mask.keydown.call(fakeThis, {})).toBe(undefined);
  });

  it('should return when tab key is press in keydown ', () => {
    const fakeMask = mask;

    fakeEvent.keyCode = 9;

    expect(mask.keydown.call(fakeMask, fakeEvent)).toBe(undefined);
  });

  it('should reverse the initial position when it is larger than the final', () => {
    const fakeThis = mask;
    const initial: number = 5;
    const final: number = 4;

    fakeThis.revertPositions(initial, final);

    expect(fakeThis.initialPosition).toBe(4);
    expect(fakeThis.finalPosition).toBe(5);
  });

  it('should reset the positions', () => {
    const fakeThis = mask;

    fakeEvent.target.selectionStart = 3;

    fakeThis.resetPositions(fakeEvent);

    expect(fakeThis.initialPosition).toBe(fakeEvent.target.selectionStart);
    expect(fakeThis.finalPosition).toBe(fakeThis.initialPosition);
  });

  it('should change the positions with a defined value', () => {
    const fakeThis = mask;
    fakeThis.initialPosition = 3;
    fakeThis.finalPosition = 3;
    const value: number = 3;

    fakeEvent.target.selectionStart = 3;
    fakeEvent.target.selectionEnd = 3;

    fakeThis.changePosition(fakeEvent, value);

    expect(fakeEvent.target.selectionStart).toBe(6);
    expect(fakeEvent.target.selectionEnd).toBe(6);
  });

  it('should not do nothing when keydown with keycode 8 ', () => {
    fakeEvent.keyCode = 8;
    fakeEvent.target.value = '12345';
    fakeEvent.target.initialPosition = -1;
    fakeEvent.target.selectionStart = -1;

    mask.keydown(fakeEvent);

    expect(mask.initialPosition).toBe(0);
  });

  it('should check a mask after the cursor', () => {
    const fakeThis = mask;
    fakeThis.mask = '(99)99';
    fakeThis.initialPosition = 3;
    fakeThis.finalPosition = 3;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 3;
    fakeEvent.target.selectionEnd = 3;

    fakeThis.checkMaskAfter(fakeEvent, 1);

    expect(fakeEvent.target.selectionStart).toBe(4);
  });

  it('should check a mask before the cursor', () => {
    const fakeThis = mask;
    fakeThis.mask = '(99)99';
    fakeThis.initialPosition = 4;
    fakeThis.finalPosition = 4;

    fakeEvent.target.value = '(99)99';
    fakeEvent.target.selectionStart = 4;
    fakeEvent.target.selectionEnd = 4;

    fakeThis.checkMaskBefore(fakeEvent, -1);

    expect(fakeEvent.target.selectionStart).toBe(3);
  });

  it('should return when keydown (ctrl+V) ', () => {
    const fakeThis = {
      mask: '(99)99'
    };

    fakeEvent.keyCode = 10;
    fakeEvent.ctrlKey = true;
    fakeEvent.metaKey = true;

    expect(mask.keydown.call(fakeThis, fakeEvent)).toBe(undefined);
  });

  it('should call click', () => {
    const fakeThis = mask;
    fakeThis.initialPosition = 0;
    fakeThis.finalPosition = 0;

    fakeEvent.target.selectionStart = 0;
    fakeEvent.target.selectionEnd = 5;

    fakeThis.click(fakeEvent);

    expect(fakeThis.initialPosition).toBe(0);
    expect(fakeThis.finalPosition).toBe(5);
  });

  it('should return true for code valids (letters and numbers)', () => {
    expect(mask.isKeyCodeValid(48)).toBeTruthy(); // 0
    expect(mask.isKeyCodeValid(65)).toBeTruthy(); // A
    expect(mask.isKeyCodeValid(96)).toBeTruthy(); // a
  });

  it('should return false for code invalids (caracters special)', () => {
    expect(mask.isKeyCodeValid(43)).toBeFalsy(); // +
  });

  it('should format value with controlFormatting', () => {
    const formatedValue = mask.controlFormatting('1234');

    expect(formatedValue).toEqual('(12)34');
  });

  it('should return whitespace when the value is falsy', () => {
    const formatedValue = mask.controlFormatting('');

    expect(formatedValue).toEqual('');
  });

  it('should call controlFormatting on blur', () => {
    const fakeThis = {
      mask: '(99)99',
      controlFormatting: function (val: any) {}
    };

    spyOn(fakeThis, 'controlFormatting');
    mask.blur.call(fakeThis, fakeEvent);
    expect(fakeThis.controlFormatting).toHaveBeenCalled();
  });

  it('should not call controlFormatting when not have mask in on blur', () => {
    const fakeMask = mask;
    fakeMask.mask = '';

    spyOn(fakeMask, 'controlFormatting');

    fakeMask.blur(fakeEvent);

    expect(fakeMask.controlFormatting).not.toHaveBeenCalled();
  });

  it('should be valid key', () => {
    expect(mask.isKeyValid(48)).toBe(true);
  });

  it('should be regex equals to /s', () => {
    const regex = /\s/;
    expect(String(mask.replaceMask(' '))).toBe(String(regex));
  });

  it('should be regex equals to /[a-zA-Z]/', () => {
    const regex = /[a-zA-Z]/;
    expect(String(mask.replaceMask('@'))).toBe(String(regex));
  });

  it('should be regex equals to /[a-zA-Z0-9]/', () => {
    const regex = /[a-zA-Z0-9]/;
    expect(String(mask.replaceMask('w'))).toBe(String(regex));
  });

  it('should be pattern equals to +:1', () => {
    const fakeThis = {
      formatModel: true
    };
    expect(mask.getRegexFromMask.call(fakeThis, '+:1')).toBe('\\+\\:\\w');
  });

  it('should return when value is null', () => {
    expect(mask.controlFormatting(null)).toBe('');
  });

  it('should return undefined when invalid key value', () => {
    expect(mask.formatValue('123456789', '(99)@?9?9')).toBe('(12)');
  });

  it('should return value (12)345', () => {
    expect(mask.formatValue('123456789', '(99)9?9?9')).toBe('(12)345');
  });

  it('should return value 1-1-1', () => {
    expect(mask.formatValue('1-1-1--', '9-9-9-9')).toBe('1-1-1');
  });

  it('should return value -1-1-1', () => {
    expect(mask.formatValue('/1/1-1--', '/9/9-9-9')).toBe('/1/1-1');
  });

  it('should return value 1-1-1 to model', () => {
    mask.formatModel = true;
    mask.formatValue('1-1-1-', '9-9-9');
    expect(mask.valueToModel).toBe('1-1-1');
  });

  it('should test replaceMask function', () => {
    expect(mask.replaceMask('0')).toEqual(/[0]/);
    expect(mask.replaceMask('1')).toEqual(/[0-1]/);
    expect(mask.replaceMask('2')).toEqual(/[0-2]/);
    expect(mask.replaceMask('3')).toEqual(/[0-3]/);
    expect(mask.replaceMask('4')).toEqual(/[0-4]/);
    expect(mask.replaceMask('5')).toEqual(/[0-5]/);
    expect(mask.replaceMask('6')).toEqual(/[0-6]/);
    expect(mask.replaceMask('7')).toEqual(/[0-7]/);
  });

  it('should return mask equals to 888', () => {
    expect(mask.replaceOptionalNumber('888')).toBe('888');
  });

  it('should return value (12)3456', () => {
    mask.mask = '(99)9?9?99';
    expect(mask.controlFormatting('123456789')).toBe('(12)3456');
  });

  it('getRegexFromMask: should return null when not have mask', () => {
    expect(mask.getRegexFromMask(undefined)).toBeNull();
    expect(mask.getRegexFromMask(null)).toBeNull();
    expect(mask.getRegexFromMask('')).toBeNull();
  });
});
