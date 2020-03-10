import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';
import { PoColorPaletteService } from './po-color-palette.service';

describe('PoColorPaletteService:', () => {
  const service = new PoColorPaletteService();

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service instanceof PoColorPaletteService).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getColorFromType: should return `color-01` as default color.', () => {
      expect(service['getColorFromType']('')).toBe(PoColorPaletteEnum.Color01);
    });

    it('getColorFromType: should return `color-07` if type is `danger`.', () => {
      const type = 'danger';

      expect(service['getColorFromType'](type)).toBe(PoColorPaletteEnum.Color07);
    });

    it('getColorFromType: should return `color-08` if `value.color` is `warning`.', () => {
      const type = 'warning';

      expect(service['getColorFromType'](type)).toBe(PoColorPaletteEnum.Color08);
    });

    it('getColorFromType: should return `color-11` if `value.color` is `success`.', () => {
      const type = 'success';

      expect(service['getColorFromType'](type)).toBe(PoColorPaletteEnum.Color11);
    });

    it('getColor: should call `getColorFromType` and return `color-01` if `value.color` is `primary`.', () => {
      const value = { color: 'primary' };

      spyOn(service, <any>'getColorFromType').and.callThrough();

      expect(service['getColor'](value)).toBe(PoColorPaletteEnum.Color01);
      expect(service['getColorFromType']).toHaveBeenCalledWith('primary');
    });

    it('getColor: shouldn`t call `getColorFromType` and return `color-05` if `value.color` in colors range.', () => {
      const value = { color: 'color-05' };

      spyOn(service, <any>'getColorFromType').and.callThrough();

      expect(service['getColor'](value)).toBe(PoColorPaletteEnum.Color05);
      expect(service['getColorFromType']).not.toHaveBeenCalled();
    });

    it('getColor: should call `getColorFromType` and return `color-01` if `value.color` isn`t in colors range.', () => {
      const value = { color: 'color-20' };

      spyOn(service, <any>'getColorFromType').and.callThrough();

      expect(service['getColor'](value)).toBe(PoColorPaletteEnum.Color01);
      expect(service['getColorFromType']).toHaveBeenCalledWith('color-20');
    });

    it('getColor: should call `getColorFromType` and return `color-07` if value type is `danger`.', () => {
      const value = { type: 'danger' };

      spyOn(service, <any>'getColorFromType').and.callThrough();

      expect(service['getColor'](value)).toBe(PoColorPaletteEnum.Color07);
      expect(service['getColorFromType']).toHaveBeenCalledWith('danger');
    });
  });
});
