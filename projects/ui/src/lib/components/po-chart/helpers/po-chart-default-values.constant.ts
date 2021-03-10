// Padding padrão
export const PoChartPadding = 24;

// Área lateral designada para os rótulos do eixo X
export const PoChartAxisXLabelArea = 56;

// Quantidade de linhas do eixo X
export const PoChartGridLines = 5;

// Padding top para área interna de plotagem do grid para evitar overflow no hover dos pontos do gráfico do tipo linha;
export const PoChartPlotAreaPaddingTop = 8;

// Angulação inicial de raio para gráficos do tipo circular
export const PoChartStartAngle = -Math.PI / 2;

// Valor referente à espessura padrão do gráfico do tipo Donut.
export const PoChartDonutDefaultThickness = 40;

// Valor para subtração do valor de angulo radiano final de série em tipos Donut e Pie. Necessário para o caso de uma série única: se uma circunferência tiver valores de ângulo de raio inicial e final iguais não plota.
export const PoChartCompleteCircle = 0.0001;

// Duração da animação para gráficos dos tipos Donut e Pie.
const durationTime = 1500;
export const PoChartAngleStepInterval = (Math.PI * 2) / Math.floor(durationTime / 60);
