const poChartAnimationDurationTime = 1500;

export const poChartAngleStepInterval = (Math.PI * 2) / Math.floor(poChartAnimationDurationTime / 60);
export const poChartCompleteCircle = 0.0001;
export const poChartGaugeStartAngle = -Math.PI;
export const poChartPadding: number = 24;
export const poChartStartAngle = -Math.PI / 2;

// tamanho da largura da serie proporcional ao grafico do tipo Donut, o valor 0.27 fica proximo de 32px
export const poChartDonutSerieWidth = 0.27;

// tamanho da largura da serie proporcional ao grafico do tipo Gauge, o valor 0.04 fica proximo de 8px
export const poChartGaugeSerieWidth = 0.06;
