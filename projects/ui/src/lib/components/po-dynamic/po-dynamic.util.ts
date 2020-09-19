import { PoDynamicViewField } from './po-dynamic-view/po-dynamic-view-field.interface';

export function getGridColumnsClasses(smColumns, mdColumns, lgColumns, xlColumns, gridColumns, pullColumns) {
  const systemGrid = {
    sm: smColumns || gridColumns || 12,
    md: mdColumns || gridColumns || 6,
    lg: lgColumns || gridColumns || 4,
    xl: xlColumns || gridColumns || 3,
    pullSm: pullColumns?.smPull || 0,
    pullMd: pullColumns?.mdPull || 0,
    pullLg: pullColumns?.lgPull || 0,
    pullXl: pullColumns?.xlPull || 0
  };

  return `po-sm-${systemGrid.sm} po-pull-sm-${systemGrid.pullSm} po-md-${systemGrid.md} po-pull-md-${systemGrid.pullMd} po-lg-${systemGrid.lg} po-pull-lg-${systemGrid.pullLg} po-xl-${systemGrid.xl} po-pull-xl-${systemGrid.pullXl}`;
}

export function isVisibleField(field: { visible?: boolean }): boolean {
  const containsVisible = 'visible' in field;

  return containsVisible ? field.visible : true;
}
