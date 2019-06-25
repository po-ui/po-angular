import { PoDynamicViewField } from './po-dynamic-view/po-dynamic-view-field.interface';

export function getGridColumnsClasses(smColumns, mdColumns, lgColumns, xlColumns, gridColumns) {
  const systemGrid = {
    sm: smColumns || gridColumns || 12,
    md: mdColumns || gridColumns || 6,
    lg: lgColumns || gridColumns || 4,
    xl: xlColumns || gridColumns || 3
  };

  return `po-sm-${systemGrid.sm} po-md-${systemGrid.md} po-lg-${systemGrid.lg} po-xl-${systemGrid.xl}`;
}

export function isVisibleField(field: PoDynamicViewField): boolean {
  const containsVisible = 'visible' in field;

  return containsVisible ? field.visible : true;
}
