import { Injectable } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço responsável por gerar o preenchimento de séries com cor combinada com
 * padrão/textura, melhorando a acessibilidade do `po-chart` (não depender apenas
 * de cor). O desenho dos padrões é puro e desacoplado do ECharts.
 *
 * São suportados exatamente 8 padrões (índices 0 a 7), quantidade correspondente
 * ao número de cores categóricas da paleta (`--categorical-01`..`--categorical-08`).
 */
@Injectable()
export class PoChartPatternService {
  /** Quantidade de padrões suportados (igual ao número de cores categóricas). */
  static readonly PATTERN_COUNT = 8;

  private static readonly SUPPORTED_TYPES = new Set<PoChartType>([
    PoChartType.Pie,
    PoChartType.Donut,
    PoChartType.Bar,
    PoChartType.Column
  ]);

  /**
   * Indica se o tipo de gráfico informado suporta a aplicação de padrões.
   *
   * Tipos suportados: `pie`, `donut`, `bar` e `column`.
   *
   * @param type Tipo do gráfico da série.
   * @returns `true` para tipos suportados; `false` para os demais ou desconhecidos.
   */
  isPatternSupportedType(type: PoChartType): boolean {
    return PoChartPatternService.SUPPORTED_TYPES.has(type);
  }

  /**
   * Normaliza qualquer inteiro para o intervalo `0..7` usando o resto não negativo
   * da divisão por `8` (`((v % 8) + 8) % 8`).
   *
   * Exemplos: `8` → `0`, `9` → `1`, `-1` → `7`.
   *
   * @param value Valor inteiro a ser normalizado.
   * @returns Índice de padrão no intervalo `0..7`.
   */
  normalizePatternIndex(value: number): number {
    const count = PoChartPatternService.PATTERN_COUNT;
    return ((value % count) + count) % count;
  }

  /**
   * Gera o preenchimento de uma série no formato aceito pelo ECharts em
   * `itemStyle.color`: um elemento `<canvas>` com a cor de fundo sólida (a
   * `Effective_Color` preservada) e uma textura sobreposta correspondente ao
   * padrão informado, repetida em ambos os eixos (`repeat: 'repeat'`).
   *
   * O índice é normalizado para `0..7` antes do desenho. A cor do traço da
   * textura é calculada a partir da luminância relativa da cor de fundo, de modo
   * que o traço seja claro sobre fundos escuros e escuro sobre fundos claros,
   * mantendo o padrão perceptível independentemente do tema.
   *
   * @param color Cor de fundo (Effective_Color) resolvida pelo `PoColorService`.
   * @param patternIndex Índice do padrão desejado (normalizado para `0..7`).
   * @returns Objeto `{ image, repeat: 'repeat' }` para uso em `itemStyle.color`.
   * @throws Erro quando o contexto 2D do canvas não estiver disponível; o
   * chamador é responsável por tratar o fallback para cor sólida.
   */
  getPatternFill(color: string, patternIndex: number): { image: HTMLCanvasElement; repeat: 'repeat' } {
    const size = 12;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('PoChartPatternService: contexto 2D do canvas indisponível.');
    }

    // Fundo sólido preservando a Effective_Color.
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // Cor do traço com contraste em relação ao fundo.
    const strokeColor = this.getContrastStroke(color);
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    this.drawPattern(ctx, this.normalizePatternIndex(patternIndex), size);

    return { image: canvas, repeat: 'repeat' };
  }

  /**
   * Desenha a textura correspondente ao índice de padrão sobre o contexto do
   * canvas de *tile*. O índice recebido é normalizado antes do desenho.
   *
   * Catálogo: `0` diagonais, `1` grid/xadrez, `2` pontos/círculos, `3` senoidal,
   * `4` triângulos, `5` horizontais, `6` verticais, `7` zigue-zague.
   *
   * @param ctx Contexto 2D do canvas de *tile*.
   * @param index Índice do padrão (será normalizado para `0..7`).
   * @param size Dimensão (largura e altura) do *tile* em pixels.
   */
  private drawPattern(ctx: CanvasRenderingContext2D, index: number, size: number): void {
    const normalized = this.normalizePatternIndex(index);

    switch (normalized) {
      case 0: // Linhas diagonais (45°)
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size, 0);
        ctx.moveTo(-size / 2, size / 2);
        ctx.lineTo(size / 2, -size / 2);
        ctx.moveTo(size / 2, size + size / 2);
        ctx.lineTo(size + size / 2, size / 2);
        ctx.stroke();
        break;

      case 1: // Grid / xadrez (horizontais + verticais)
        ctx.beginPath();
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size, size / 2);
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, size);
        ctx.stroke();
        break;

      case 2: // Pontos / círculos em grade
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 3: // Onda senoidal
        ctx.beginPath();
        for (let x = 0; x <= size; x++) {
          const y = size / 2 + (size / 4) * Math.sin((x / size) * Math.PI * 2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        break;

      case 4: // Triângulos preenchidos
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 4);
        ctx.lineTo(size / 4, (size * 3) / 4);
        ctx.lineTo((size * 3) / 4, (size * 3) / 4);
        ctx.closePath();
        ctx.fill();
        break;

      case 5: // Linhas horizontais
        ctx.beginPath();
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size, size / 2);
        ctx.stroke();
        break;

      case 6: // Linhas verticais
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, size);
        ctx.stroke();
        break;

      case 7: // Zigue-zague (chevron)
        ctx.beginPath();
        ctx.moveTo(0, (size * 3) / 4);
        ctx.lineTo(size / 4, size / 4);
        ctx.lineTo(size / 2, (size * 3) / 4);
        ctx.lineTo((size * 3) / 4, size / 4);
        ctx.lineTo(size, (size * 3) / 4);
        ctx.stroke();
        break;
    }
  }

  /**
   * Calcula a cor de traço (textura) com contraste adequado em relação à cor de
   * fundo, a partir da luminância relativa: fundos escuros recebem traço claro
   * (branco translúcido) e fundos claros recebem traço escuro (preto translúcido).
   *
   * @param background Cor de fundo (Effective_Color).
   * @returns Cor de traço com transparência para manter a textura sutil.
   */
  private getContrastStroke(background: string): string {
    const rgb = this.parseColor(background);
    if (!rgb) {
      return 'rgba(0, 0, 0, 0.55)';
    }

    const luminance = this.relativeLuminance(rgb);
    return luminance < 0.5 ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.55)';
  }

  /**
   * Converte uma cor CSS (hex de 3/6 dígitos, `rgb()`/`rgba()`) em componentes
   * RGB. Cores não reconhecidas retornam `null`.
   */
  private parseColor(color: string): { r: number; g: number; b: number } | null {
    if (!color) {
      return null;
    }

    const value = color.trim();

    const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map(c => c + c)
          .join('');
      }
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }

    const rgbMatch = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10)
      };
    }

    return null;
  }

  /**
   * Calcula a luminância relativa (0..1) de uma cor RGB conforme a fórmula do
   * WCAG, usada para decidir o contraste do traço.
   */
  private relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
    const toLinear = (channel: number): number => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
}
