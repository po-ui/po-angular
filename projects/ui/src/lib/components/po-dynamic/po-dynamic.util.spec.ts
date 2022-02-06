import { isVisibleField, getGridColumnsClasses } from './po-dynamic.util';

describe('isVisibleField:', () => {
  it('should return `true` if not contain visible property', () => {
    const field: any = { property: 'name' };

    expect(isVisibleField(field)).toBe(true);
  });

  it('should return `true` if contain visible property with true value', () => {
    const field = { property: 'name', visible: true };

    expect(isVisibleField(field)).toBe(true);
  });

  it('should return `false` if contain visible property with false value', () => {
    const field = { property: 'name', visible: false };

    expect(isVisibleField(field)).toBe(false);
  });
});

describe('getGridColumnsClasses:', () => {
  it('should return classes of grid columns according to the specifics parameters', () => {
    const grid = {
      smGrid: 4,
      mdGrid: 3,
      lgGrid: 7,
      xlGrid: 3
    };
    const offset = {
      smOffset: 0,
      mdOffset: 0,
      lgOffset: 0,
      xlOffset: 0
    };
    const pull = {
      smPull: 0,
      mdPull: 0,
      lgPull: 0,
      xlPull: 0
    };

    const classesGridColumns = getGridColumnsClasses(undefined, undefined, grid, offset, pull);

    expect(classesGridColumns.includes(`po-sm-${grid.smGrid}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${grid.mdGrid}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${grid.lgGrid}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${grid.xlGrid}`)).toBe(true);
  });

  it('should return classes of grid columns according to the gridColumns parameter', () => {
    const gridColumns = 6;

    const classesGridColumns = getGridColumnsClasses(gridColumns, undefined, undefined, undefined, undefined);

    expect(classesGridColumns.includes(`po-sm-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${gridColumns}`)).toBe(true);
  });

  it('should return classes of grid columns according to the defaults size', () => {
    const classesGridColumns = getGridColumnsClasses(undefined, undefined, undefined, undefined, undefined);

    expect(classesGridColumns.includes(`po-sm-12`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-6`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-4`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-3`)).toBe(true);
  });

  it(`should return classes of grid columns according to the specifics parameters
    and gridColumns parameter`, () => {
    const gridColumns = 6;
    const grid = {
      smGrid: 8,
      mdGrid: undefined,
      lgGrid: undefined,
      xlGrid: 4
    };

    const classesGridColumns = getGridColumnsClasses(gridColumns, undefined, grid, undefined, undefined);

    expect(classesGridColumns.includes(`po-sm-${grid.smGrid}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${grid.xlGrid}`)).toBe(true);
  });

  it('should return classes of grid columns according to the offsetColumns parameter', () => {
    const offsetColumns = 6;

    const classesGridColumns = getGridColumnsClasses(undefined, offsetColumns, undefined, undefined, undefined);

    expect(classesGridColumns.includes(`po-offset-sm-${offsetColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-md-${offsetColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-lg-${offsetColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-xl-${offsetColumns}`)).toBe(true);
  });

  it('should return classes of grid columns according to the defaults size', () => {
    const classesGridColumns = getGridColumnsClasses(undefined, undefined, undefined, undefined, undefined);

    expect(classesGridColumns.includes(`po-offset-sm-0`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-md-0`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-lg-0`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-xl-0`)).toBe(true);
  });

  it(`should return classes of grid columns according to the specifics parameters
    and gridColumns parameter`, () => {
    const offsetColumns = 6;
    const offset = {
      smOffset: 8,
      mdOffset: undefined,
      lgOffset: undefined,
      xlOffset: 4
    };

    const classesGridColumns = getGridColumnsClasses(undefined, offsetColumns, undefined, offset, undefined);

    expect(classesGridColumns.includes(`po-offset-sm-${offset.smOffset}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-md-${offsetColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-lg-${offsetColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-offset-xl-${offset.xlOffset}`)).toBe(true);
  });
});
