/**
 * ARQUIVO GERADO. Não edite à mão.
 *
 * HTML estático dos exemplos do showcase do Hero da Home (limpo: sem atributos do Angular, sem ids, sem scripts e sem eventos).
 * Para regerar (por exemplo, se um exemplo de PREVIEW_SAMPLES ou o componente mudou):
 *
 *   npm run portal:showcase:generate
 *
 * O script está em scripts/generate-home-showcase-samples.js.
 */
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewEncapsulation } from '@angular/core';

/** Nomes dos exemplos (chaves de PREVIEW_SAMPLES), na ordem dos cards. */
export const HOME_HERO_SHOWCASE_SAMPLE_NAMES = ["po-tag","po-button","po-switch","po-input","po-select","po-widget","po-radio-group","po-checkbox","po-link","po-badge","po-button-group","po-divider"];

/**
 * Exemplo estático dos componentes do PO UI. Os elementos `po-*` do template ficam como elementos HTML comuns
 * (CUSTOM_ELEMENTS_SCHEMA, sem importar o PoModule): o visual vem das classes do tema.
 */
@Component({
  selector: 'app-home-hero-showcase-samples',
  templateUrl: './home-hero-showcase-samples.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  // None: sem atributos de escopo; preserveWhitespaces: o espaço entre elementos inline faz parte do visual
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class HomeHeroShowcaseSamplesComponent {
  /** Nome do exemplo a mostrar (um dos HOME_HERO_SHOWCASE_SAMPLE_NAMES). */
  @Input() name = '';
}
