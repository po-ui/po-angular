import { PoTimerScrollHelper } from './po-timer-scroll.helper';

describe('PoTimerScrollHelper:', () => {
  describe('wrapOffset:', () => {
    it('should return offset when sectionHeight is 0', () => {
      expect(PoTimerScrollHelper.wrapOffset(100, 0)).toBe(100);
    });

    it('should return offset when sectionHeight is negative', () => {
      expect(PoTimerScrollHelper.wrapOffset(100, -10)).toBe(100);
    });

    it('should wrap offset to [sectionHeight, 2*sectionHeight)', () => {
      const result = PoTimerScrollHelper.wrapOffset(250, 100);
      expect(result).toBeGreaterThanOrEqual(100);
      expect(result).toBeLessThan(200);
    });

    it('should keep offset already in range unchanged', () => {
      expect(PoTimerScrollHelper.wrapOffset(150, 100)).toBe(150);
    });

    it('should handle negative offsets', () => {
      const result = PoTimerScrollHelper.wrapOffset(-50, 100);
      expect(result).toBeGreaterThanOrEqual(100);
      expect(result).toBeLessThan(200);
    });

    it('should handle offset exactly at sectionHeight', () => {
      expect(PoTimerScrollHelper.wrapOffset(100, 100)).toBe(100);
    });

    it('should handle offset at 2*sectionHeight', () => {
      const result = PoTimerScrollHelper.wrapOffset(200, 100);
      expect(result).toBe(100);
    });

    it('should handle large multiples of sectionHeight', () => {
      const result = PoTimerScrollHelper.wrapOffset(500, 100);
      expect(result).toBeGreaterThanOrEqual(100);
      expect(result).toBeLessThan(200);
    });
  });

  describe('getCellStep:', () => {
    it('should return 40 when itemsEl is null', () => {
      expect(PoTimerScrollHelper.getCellStep(null, 10)).toBe(40);
    });

    it('should return 40 when displayCount is 0', () => {
      const el = document.createElement('div');
      expect(PoTimerScrollHelper.getCellStep(el, 0)).toBe(40);
    });

    it('should calculate step from element dimensions', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'scrollHeight', { value: 480 });
      document.body.appendChild(el);
      const step = PoTimerScrollHelper.getCellStep(el, 12);
      expect(step).toBeGreaterThan(0);
      document.body.removeChild(el);
    });

    it('should handle element with rowGap as empty string (falsy branch)', () => {
      const el = document.createElement('div');
      Object.defineProperty(el, 'scrollHeight', { value: 240 });
      document.body.appendChild(el);
      // Default getComputedStyle returns '' for rowGap, triggering || 0 branch
      const step = PoTimerScrollHelper.getCellStep(el, 6);
      expect(step).toBe(40); // 240 / 6
      document.body.removeChild(el);
    });
  });

  describe('computeTopDisplayIndex:', () => {
    it('should return 0 when step is 0', () => {
      expect(PoTimerScrollHelper.computeTopDisplayIndex(100, 0, 72)).toBe(0);
    });

    it('should return 0 when step is negative', () => {
      expect(PoTimerScrollHelper.computeTopDisplayIndex(100, -5, 72)).toBe(0);
    });

    it('should return 0 when displayLength is 0', () => {
      expect(PoTimerScrollHelper.computeTopDisplayIndex(100, 40, 0)).toBe(0);
    });

    it('should compute correct index for aligned offset', () => {
      // offset=120, step=40 → raw=3, displayLength=72 → index=3
      expect(PoTimerScrollHelper.computeTopDisplayIndex(120, 40, 72)).toBe(3);
    });

    it('should wrap index when it exceeds displayLength', () => {
      // offset=2920, step=40 → raw=73, displayLength=72 → index=1
      expect(PoTimerScrollHelper.computeTopDisplayIndex(2920, 40, 72)).toBe(1);
    });

    it('should handle negative offset', () => {
      const result = PoTimerScrollHelper.computeTopDisplayIndex(-40, 40, 72);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(72);
    });
  });

  describe('repeatArray:', () => {
    it('should return empty array for null source', () => {
      expect(PoTimerScrollHelper.repeatArray(null)).toEqual([]);
    });

    it('should return empty array for empty source', () => {
      expect(PoTimerScrollHelper.repeatArray([])).toEqual([]);
    });

    it('should return simple copy when source has less than 6 items', () => {
      const source = [0, 1, 2, 3, 4];
      const result = PoTimerScrollHelper.repeatArray(source);
      expect(result).toEqual(source);
      expect(result).not.toBe(source); // should be a new array
    });

    it('should repeat array when source has 6 or more items', () => {
      const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const result = PoTimerScrollHelper.repeatArray(source);
      expect(result.length).toBeGreaterThanOrEqual(30);
      expect(result.length % source.length).toBe(0);
    });

    it('should repeat at least 3 times for arrays with 6+ items', () => {
      const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      const result = PoTimerScrollHelper.repeatArray(source);
      expect(result.length).toBe(source.length * 3);
    });

    it('should repeat enough times to reach at least 30 items', () => {
      const source = [0, 1, 2, 3, 4, 5, 6, 7];
      const result = PoTimerScrollHelper.repeatArray(source);
      expect(result.length).toBeGreaterThanOrEqual(30);
    });

    it('should contain the same values repeated', () => {
      const source = [10, 20, 30, 40, 50, 60];
      const result = PoTimerScrollHelper.repeatArray(source);
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBe(source[i % source.length]);
      }
    });
  });
});
