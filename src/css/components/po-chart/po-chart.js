const dataSet = [
  { color: '#0C6C94', path: 'M 199.5 0 A 199.5 199.5 0 0 1 335.19446118529845 53.25615156994965 L 199.5 199.5 Z' },
  { color: '#0B92B4', path: 'M 335.19446118529845 53.25615156994965 A 199.5 199.5 0 0 1 368.4214777460427 305.6403992648096 L 199.5 199.5 Z' },
  { color: '#29B6C5', path: 'M 368.4214777460427 305.6403992648096 A 199.5 199.5 0 1 1 106.27990865952415 23.118978995830332 L 199.5 199.5 Z' },
  { color: '#94DAE2', path: 'M 106.27990865952415 23.118978995830332 A 199.5 199.5 0 0 1 199.49999999999997 0 L 199.5 199.5 Z' }
];

function setSvgArea() {
  const svgContainer = document.getElementsByClassName('po-chart-svg-container')
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  svgElement.setAttributeNS(null, 'viewBox', '0 0 400 400');
  svgElement.setAttributeNS(null, 'width', '100%');
  svgElement.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMin meet');

  drawPaths(svgElement);
  svgElementAppend(svgContainer, svgElement);
  setLegendColor();
}

function drawPaths(svgElement) {
  dataSet.forEach((data) => {
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    svgPath.setAttributeNS(null, 'd', data.path);
    svgPath.setAttributeNS(null, 'fill', data.color);
    svgElement.appendChild(svgPath);
  });
}

function setLegendColor() {
  const legendContainer = document.getElementsByClassName('po-chart-legend-container');

  Array.prototype.forEach.call(legendContainer, (legendContainerItem) => {
    const legendSquare = legendContainerItem.getElementsByClassName('po-chart-legend-square');

    Array.prototype.forEach.call(legendSquare, (legendSquareItem, index) => {
      legendSquareItem.style.backgroundColor = dataSet[index].color;
    });
  });
}

function svgElementAppend(svgContainer, svgElement) {
  Array.prototype.forEach.call(svgContainer, (svgContainerItem) => {
    svgElementClone = svgElement.cloneNode(true);
    svgContainerItem.appendChild(svgElementClone);
  });
}

setSvgArea();
