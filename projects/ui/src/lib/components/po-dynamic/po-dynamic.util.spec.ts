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
    const smColumns = 4;
    const mdColumns = 3;
    const lgColumns = 7;
    const xlColumns = 3;
    const pullColumns = {
      smPull: 0,
      mdPull: 0,
      lgPull: 0,
      xlPull: 0
    };

    const classesGridColumns = getGridColumnsClasses(
      smColumns,
      mdColumns,
      lgColumns,
      xlColumns,
      undefined,
      pullColumns
    );

    expect(classesGridColumns.includes(`po-sm-${smColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${mdColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${lgColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${xlColumns}`)).toBe(true);
  });

  it('should return classes of grid columns according to the gridColumns parameter', () => {
    const gridColumns = 6;

    const classesGridColumns = getGridColumnsClasses(
      undefined,
      undefined,
      undefined,
      undefined,
      gridColumns,
      undefined
    );

    expect(classesGridColumns.includes(`po-sm-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${gridColumns}`)).toBe(true);
  });

  it('should return classes of grid columns according to the defaults size', () => {
    const classesGridColumns = getGridColumnsClasses(undefined, undefined, undefined, undefined, undefined, undefined);

    expect(classesGridColumns.includes(`po-sm-12`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-6`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-4`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-3`)).toBe(true);
  });

  it(`should return classes of grid columns according to the specifics parameters
    and gridColumns parameter`, () => {
    const gridColumns = 6;
    const smColumns = 8;
    const xlColumns = 4;

    const classesGridColumns = getGridColumnsClasses(
      smColumns,
      undefined,
      undefined,
      xlColumns,
      gridColumns,
      undefined
    );

    expect(classesGridColumns.includes(`po-sm-${smColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-md-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-lg-${gridColumns}`)).toBe(true);
    expect(classesGridColumns.includes(`po-xl-${xlColumns}`)).toBe(true);
  });
});
