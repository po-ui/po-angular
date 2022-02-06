import { PoDynamicViewField } from './po-dynamic-view/po-dynamic-view-field.interface';

export function getGridColumnsClasses(gridColumns, offsetColumns, grid, offset, pull) {
  const systemGrid = {
    gridSm: grid?.smGrid || gridColumns || 12,
    gridMd: grid?.mdGrid || gridColumns || 6,
    gridLg: grid?.lgGrid || gridColumns || 4,
    gridXl: grid?.xlGrid || gridColumns || 3,
    offsetSm: offset?.smOffset || offsetColumns || 0,
    offsetMd: offset?.mdOffset || offsetColumns || 0,
    offsetLg: offset?.lgOffset || offsetColumns || 0,
    offsetXl: offset?.xlOffset || offsetColumns || 0,
    pullSm: pull?.smPull || 0,
    pullMd: pull?.mdPull || 0,
    pullLg: pull?.lgPull || 0,
    pullXl: pull?.xlPull || 0
  };

  return (
    `po-sm-${systemGrid.gridSm} po-offset-sm-${systemGrid.offsetSm} po-pull-sm-${systemGrid.pullSm} ` +
    `po-md-${systemGrid.gridMd} po-offset-md-${systemGrid.offsetMd} po-pull-md-${systemGrid.pullMd} ` +
    `po-lg-${systemGrid.gridLg} po-offset-lg-${systemGrid.offsetLg} po-pull-lg-${systemGrid.pullLg} ` +
    `po-xl-${systemGrid.gridXl} po-offset-xl-${systemGrid.offsetXl} po-pull-xl-${systemGrid.pullXl}`
  );
}

export function isVisibleField(field: { visible?: boolean }): boolean {
  const containsVisible = 'visible' in field;

  return containsVisible ? field.visible : true;
}
