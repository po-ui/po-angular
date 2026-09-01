import fc from 'fast-check';

import { gaugeSymbolMap, gaugeSymbolsWithoutEquivalent } from './changes';
import { migrateTypeScriptContent } from './gauge-ts-migration';

/**
 * Testes de propriedade para a transformação de referências TypeScript
 * (`migrateTypeScriptContent`).
 */
describe('v22 gauge-ts-migration (property-based):', () => {
  // Símbolos gauge que possuem equivalente direto no po-chart.
  const gaugeSymbols = Object.keys(gaugeSymbolMap);

  // Conjunto de símbolos não-gauge, reais do @po-ui/ng-components, garantidamente
  // distintos dos símbolos gauge e de seus equivalentes (evita colisões de dedup).
  const nonGaugeSymbols = [
    'PoButtonModule',
    'PoTableModule',
    'PoFieldModule',
    'PoModalModule',
    'PoNotificationModule',
    'PoPageModule',
    'PoLoadingModule',
    'PoWidgetModule',
    'PoInfoModule',
    'PoTabsModule'
  ];

  /** Verifica a presença de um identificador com fronteira de palavra. */
  function hasSymbol(content: string, symbol: string): boolean {
    return new RegExp(`\\b${symbol}\\b`).test(content);
  }

  /** Gera um subconjunto não-vazio, sem repetição. */
  function nonEmptySubset(pool: Array<string>): fc.Arbitrary<Array<string>> {
    return fc.subarray(pool, { minLength: 1, maxLength: pool.length });
  }

  function subset(pool: Array<string>): fc.Arbitrary<Array<string>> {
    return fc.subarray(pool, { minLength: 0, maxLength: pool.length });
  }

  /**
   * Extrai os símbolos nomeados do import de `@po-ui/ng-components` presente no
   * conteúdo, retornando a lista de nomes (na forma textual, ex.: `PoChartModule`
   * ou `PoGaugeModule as Foo`). Retorna `[]` quando não há import do pacote.
   */
  function poUiImportSymbols(content: string): Array<string> {
    const match = content.match(/import\s*\{([^}]*)\}\s*from\s*['"]@po-ui\/ng-components['"]/);
    if (!match) {
      return [];
    }
    return match[1]
      .split(',')
      .map(symbol => symbol.trim())
      .filter(symbol => symbol.length > 0);
  }

  /** Indica se há símbolos duplicados na lista de imports informada. */
  function hasDuplicateSymbols(symbols: Array<string>): boolean {
    return new Set(symbols).size !== symbols.length;
  }

  /**
   * Propriedade 9: Preservação dos demais imports (TS)
   *
   * Para qualquer declaração de importação de `@po-ui/ng-components` que misture
   * símbolos gauge (com equivalente) e símbolos não-gauge arbitrários, após
   * `migrateTypeScriptContent`:
   *  - cada símbolo gauge é substituído pelo equivalente de `gaugeSymbolMap`;
   *  - todos os símbolos não-gauge do mesmo import são preservados.
   *
   * **Validates: Requisitos 4.1, 4.2**
   */
  it('should replace gauge symbols by their equivalents while preserving every non-gauge import (Prop 9)', () => {
    fc.assert(
      fc.property(
        nonEmptySubset(gaugeSymbols),
        subset(nonGaugeSymbols),
        fc.boolean(),
        fc.boolean(),
        (chosenGauge, chosenNonGauge, gaugeFirst, isStandalone) => {
          // Compõe a lista de símbolos do import, variando a ordem relativa.
          const symbols = gaugeFirst ? [...chosenGauge, ...chosenNonGauge] : [...chosenNonGauge, ...chosenGauge];

          const source = `import { ${symbols.join(', ')} } from '@po-ui/ng-components';\n`;

          const result = migrateTypeScriptContent(source, isStandalone);

          // 1. Todos os símbolos não-gauge devem permanecer presentes.
          for (const symbol of chosenNonGauge) {
            expect(hasSymbol(result.content, symbol)).toBe(true);
          }

          // 2. Cada símbolo gauge deve ter sido substituído pelo equivalente.
          for (const gauge of chosenGauge) {
            const equivalent = gaugeSymbolMap[gauge];

            expect(hasSymbol(result.content, equivalent)).toBe(true);
            expect(hasSymbol(result.content, gauge)).toBe(false);
          }

          // 3. Como há ao menos um símbolo gauge com equivalente, houve alteração.
          expect(result.changed).toBe(true);

          // 4. Nenhuma advertência para símbolos que possuem equivalente.
          expect(result.warnings.length).toBe(0);
        }
      )
    );
  });

  /**
   * Propriedade 10: Símbolo sem equivalente inalterado (TS)
   *
   * Para qualquer fonte TypeScript que importe ao menos um símbolo gauge SEM
   * equivalente (`PoGaugeCoordinates`/`PoGaugeSvgContainer`, de
   * `gaugeSymbolsWithoutEquivalent`) de `@po-ui/ng-components` — possivelmente
   * misturado a outros símbolos —, após `migrateTypeScriptContent`:
   *  - o conteúdo é retornado INALTERADO (idêntico byte a byte ao original);
   *  - `changed === false`;
   *  - ao menos um `MigrationWarning` é registrado para o símbolo sem equivalente.
   *
   * **Validates: Requisito 4.4**
   */
  it('should keep content unchanged and register a warning when a no-equivalent gauge symbol is imported (Prop 10)', () => {
    // Pool de "outros símbolos" arbitrários: não-gauge + gauge com equivalente.
    // Independentemente da mistura, a presença de um símbolo sem equivalente
    // deve manter o arquivo inalterado (Req. 4.4).
    const otherSymbols = [...nonGaugeSymbols, ...gaugeSymbols];

    fc.assert(
      fc.property(
        nonEmptySubset([...gaugeSymbolsWithoutEquivalent]),
        subset(otherSymbols),
        fc.boolean(),
        fc.boolean(),
        (chosenWithout, chosenOthers, withoutFirst, isStandalone) => {
          // Compõe a lista de símbolos do import, variando a ordem relativa.
          const symbols = withoutFirst ? [...chosenWithout, ...chosenOthers] : [...chosenOthers, ...chosenWithout];

          const source = `import { ${symbols.join(', ')} } from '@po-ui/ng-components';\n`;

          const result = migrateTypeScriptContent(source, isStandalone);

          // 1. Conteúdo idêntico byte a byte ao original.
          expect(result.content).toBe(source);

          // 2. Nenhuma alteração aplicada.
          expect(result.changed).toBe(false);

          // 3. Ao menos uma advertência registrada.
          expect(result.warnings.length).toBeGreaterThanOrEqual(1);

          // 4. Ao menos uma advertência referencia um símbolo sem equivalente.
          const mentionsWithout = result.warnings.some(warning =>
            chosenWithout.some(symbol => warning.reason.includes(symbol))
          );
          expect(mentionsWithout).toBe(true);
        }
      )
    );
  });

  /**
   * Propriedade 1: Idempotência (ponto fixo) — TS
   *
   * Para qualquer fonte TypeScript variada (import de `@po-ui/ng-components`
   * misturando símbolos gauge com equivalente, símbolos não-gauge, opcionalmente
   * símbolos sem equivalente, e opcionalmente uma estrutura `@NgModule`
   * declarando/importando/exportando ou um componente standalone importando os
   * símbolos gauge), aplicar `migrateTypeScriptContent` duas vezes produz o mesmo
   * conteúdo que aplicá-la uma única vez (a transformação é um ponto fixo):
   *
   *   migrate(migrate(x, s).content, s).content === migrate(x, s).content
   *
   * Além disso, após a segunda execução, não há símbolos de import duplicados.
   *
   * **Validates: Requisitos 7.2, 7.4**
   */
  it('should be idempotent (fixed point) and not duplicate import symbols on the second run (Prop 1)', () => {
    // Símbolos gauge que podem aparecer em arrays de módulo/standalone.
    const referenceableGauge = gaugeSymbols;

    /**
     * Constrói uma fonte TypeScript variada a partir dos parâmetros gerados.
     */
    function buildSource(params: {
      chosenGauge: Array<string>;
      chosenNonGauge: Array<string>;
      chosenWithout: Array<string>;
      gaugeFirst: boolean;
      structure: 'none' | 'ngmodule' | 'standalone';
    }): string {
      const { chosenGauge, chosenNonGauge, chosenWithout, gaugeFirst, structure } = params;

      const gaugePart = [...chosenGauge, ...chosenWithout];
      const symbols = gaugeFirst ? [...gaugePart, ...chosenNonGauge] : [...chosenNonGauge, ...gaugePart];

      // Sempre há ao menos um símbolo no import (garantido pelos geradores).
      let source = `import { ${symbols.join(', ')} } from '@po-ui/ng-components';\n\n`;

      // Referências usadas nas estruturas: apenas símbolos gauge com equivalente
      // efetivamente importados (identificadores válidos no corpo do arquivo).
      const refs = chosenGauge;

      if (structure === 'ngmodule') {
        const decls = ['AppComponent', ...refs].join(', ');
        const imps = ['CommonModule', ...refs].join(', ');
        const exps = refs.join(', ');
        source +=
          `@NgModule({\n` +
          `  declarations: [${decls}],\n` +
          `  imports: [${imps}],\n` +
          `  exports: [${exps}]\n` +
          `})\n` +
          `export class AppModule {}\n`;
      } else if (structure === 'standalone') {
        const imps = ['CommonModule', ...refs].join(', ');
        source +=
          `@Component({\n` +
          `  selector: 'app-demo',\n` +
          `  imports: [${imps}],\n` +
          `  template: ''\n` +
          `})\n` +
          `export class DemoComponent {}\n`;
      }

      return source;
    }

    fc.assert(
      fc.property(
        subset(referenceableGauge),
        subset(nonGaugeSymbols),
        subset([...gaugeSymbolsWithoutEquivalent]),
        fc.boolean(),
        fc.constantFrom('none', 'ngmodule', 'standalone'),
        fc.boolean(),
        (chosenGauge, chosenNonGauge, chosenWithout, gaugeFirst, structure, isStandalone) => {
          // Garante ao menos um símbolo no import para uma fonte válida.
          if (chosenGauge.length + chosenNonGauge.length + chosenWithout.length === 0) {
            return true;
          }

          const source = buildSource({
            chosenGauge,
            chosenNonGauge,
            chosenWithout,
            gaugeFirst,
            structure
          });

          const once = migrateTypeScriptContent(source, isStandalone).content;
          const twice = migrateTypeScriptContent(once, isStandalone).content;

          // 1. Ponto fixo: aplicar duas vezes é igual a aplicar uma vez.
          expect(twice).toBe(once);

          // 2. Nenhum símbolo de import duplicado após a segunda execução.
          expect(hasDuplicateSymbols(poUiImportSymbols(twice))).toBe(false);

          return true;
        }
      )
    );
  });
});

/**
 * Testes unitários (baseados em exemplos) para a transformação de referências
 * TypeScript em projetos NgModule e standalone.
 *
 * Cobrem os cenários da migração po-gauge → po-chart em que os símbolos gauge
 * aparecem nas listas `declarations`/`imports`/`exports` de um `@NgModule`, nos
 * `imports` de um componente standalone e na configuração da aplicação
 * standalone, verificando que:
 *  - as referências gauge são atualizadas para os equivalentes do po-chart;
 *  - a declaração de importação é atualizada de forma correspondente;
 *  - todos os demais itens já existentes são preservados.
 *
 * Validates: Requisitos 5.1, 5.2, 5.3
 */
describe('v22 gauge-ts-migration (NgModule e standalone):', () => {
  /** Extrai os símbolos importados de `@po-ui/ng-components`, se houver. */
  function poUiImportSymbols(content: string): Array<string> {
    const match = content.match(/import\s*\{([^}]*)\}\s*from\s*['"]@po-ui\/ng-components['"]/);
    if (!match) {
      return [];
    }
    return match[1]
      .split(',')
      .map(symbol => symbol.trim())
      .filter(symbol => symbol.length > 0);
  }

  /**
   * Extrai o conteúdo textual de uma lista nomeada de um decorator
   * (`declarations: [...]`, `imports: [...]`, `exports: [...]`, `providers: [...]`).
   */
  function arrayContentOf(content: string, key: string): string {
    const match = content.match(new RegExp(`${key}\\s*:\\s*\\[([^\\]]*)\\]`));
    return match ? match[1] : '';
  }

  describe('NgModule (Req 5.1):', () => {
    const source =
      `import { NgModule } from '@angular/core';\n` +
      `import { CommonModule } from '@angular/common';\n` +
      `import { PoButtonModule, PoGaugeModule, PoGaugeComponent, PoFieldModule } from '@po-ui/ng-components';\n` +
      `\n` +
      `import { AppComponent } from './app.component';\n` +
      `\n` +
      `@NgModule({\n` +
      `  declarations: [AppComponent, PoGaugeComponent],\n` +
      `  imports: [CommonModule, PoButtonModule, PoGaugeModule, PoFieldModule],\n` +
      `  bootstrap: [AppComponent]\n` +
      `})\n` +
      `export class AppModule {}\n`;

    const result = migrateTypeScriptContent(source, false);

    it('should mark the file as changed without warnings', () => {
      expect(result.changed).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should update gauge references in declarations to the po-chart equivalent', () => {
      const declarations = arrayContentOf(result.content, 'declarations');

      expect(declarations).toContain('PoChartComponent');
      expect(declarations).not.toContain('PoGaugeComponent');
      // Item já existente preservado.
      expect(declarations).toContain('AppComponent');
    });

    it('should update gauge references in imports to the po-chart equivalent', () => {
      const imports = arrayContentOf(result.content, 'imports');

      expect(imports).toContain('PoChartModule');
      expect(imports).not.toContain('PoGaugeModule');
      // Itens já existentes preservados, na mesma ordem.
      expect(imports).toContain('CommonModule');
      expect(imports).toContain('PoButtonModule');
      expect(imports).toContain('PoFieldModule');
    });

    it('should update the po-ui import declaration replacing gauge symbols by equivalents', () => {
      const symbols = poUiImportSymbols(result.content);

      expect(symbols).toContain('PoChartModule');
      expect(symbols).toContain('PoChartComponent');
      expect(symbols).toContain('PoButtonModule');
      expect(symbols).toContain('PoFieldModule');
      expect(symbols).not.toContain('PoGaugeModule');
      expect(symbols).not.toContain('PoGaugeComponent');
    });

    it('should preserve unrelated imports and the bootstrap array untouched', () => {
      // Imports de @angular preservados.
      expect(result.content).toContain(`import { NgModule } from '@angular/core';`);
      expect(result.content).toContain(`import { CommonModule } from '@angular/common';`);
      // Array bootstrap preservado.
      expect(arrayContentOf(result.content, 'bootstrap')).toContain('AppComponent');
    });
  });

  describe('NgModule com exports (Req 5.1):', () => {
    const source =
      `import { NgModule } from '@angular/core';\n` +
      `import { PoGaugeModule } from '@po-ui/ng-components';\n` +
      `\n` +
      `@NgModule({\n` +
      `  imports: [PoGaugeModule],\n` +
      `  exports: [PoGaugeModule]\n` +
      `})\n` +
      `export class SharedModule {}\n`;

    const result = migrateTypeScriptContent(source, false);

    it('should update gauge references in both imports and exports arrays', () => {
      expect(result.changed).toBe(true);
      expect(arrayContentOf(result.content, 'imports')).toContain('PoChartModule');
      expect(arrayContentOf(result.content, 'exports')).toContain('PoChartModule');
      expect(result.content).not.toContain('PoGaugeModule');
    });
  });

  describe('Componente standalone (Req 5.2):', () => {
    const source =
      `import { Component } from '@angular/core';\n` +
      `import { CommonModule } from '@angular/common';\n` +
      `import { PoTableModule, PoGaugeModule } from '@po-ui/ng-components';\n` +
      `\n` +
      `@Component({\n` +
      `  selector: 'app-dashboard',\n` +
      `  standalone: true,\n` +
      `  imports: [CommonModule, PoGaugeModule, PoTableModule],\n` +
      `  template: '<po-chart p-type="gauge"></po-chart>'\n` +
      `})\n` +
      `export class DashboardComponent {}\n`;

    const result = migrateTypeScriptContent(source, true);

    it('should mark the file as changed without warnings', () => {
      expect(result.changed).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should update gauge references in the standalone imports to the po-chart equivalent', () => {
      const imports = arrayContentOf(result.content, 'imports');

      expect(imports).toContain('PoChartModule');
      expect(imports).not.toContain('PoGaugeModule');
      // Itens já existentes preservados.
      expect(imports).toContain('CommonModule');
      expect(imports).toContain('PoTableModule');
    });

    it('should update the po-ui import declaration preserving the non-gauge symbol', () => {
      const symbols = poUiImportSymbols(result.content);

      expect(symbols).toContain('PoChartModule');
      expect(symbols).toContain('PoTableModule');
      expect(symbols).not.toContain('PoGaugeModule');
    });
  });

  describe('Configuração de aplicação standalone (Req 5.3):', () => {
    const source =
      `import { ApplicationConfig, importProvidersFrom } from '@angular/core';\n` +
      `import { provideRouter } from '@angular/router';\n` +
      `import { PoGaugeModule, PoI18nModule } from '@po-ui/ng-components';\n` +
      `\n` +
      `import { routes } from './app.routes';\n` +
      `\n` +
      `export const appConfig: ApplicationConfig = {\n` +
      `  providers: [provideRouter(routes), importProvidersFrom(PoGaugeModule, PoI18nModule)]\n` +
      `};\n`;

    const result = migrateTypeScriptContent(source, true);

    it('should mark the file as changed without warnings', () => {
      expect(result.changed).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should update the gauge reference in the application config providers', () => {
      expect(result.content).toContain('importProvidersFrom(PoChartModule, PoI18nModule)');
      expect(result.content).not.toContain('PoGaugeModule');
    });

    it('should preserve the remaining providers and po-ui symbols', () => {
      // Provedor não relacionado preservado.
      expect(result.content).toContain('provideRouter(routes)');
      // Símbolo po-ui não-gauge preservado no import.
      const symbols = poUiImportSymbols(result.content);
      expect(symbols).toContain('PoChartModule');
      expect(symbols).toContain('PoI18nModule');
      expect(symbols).not.toContain('PoGaugeModule');
    });
  });

  describe('Interfaces do gauge em NgModule/standalone (Req 5.1, 5.2):', () => {
    const source =
      `import { Component } from '@angular/core';\n` +
      `import { PoGaugeRanges, PoGaugeOptions } from '@po-ui/ng-components';\n` +
      `\n` +
      `@Component({\n` +
      `  selector: 'app-metric',\n` +
      `  template: ''\n` +
      `})\n` +
      `export class MetricComponent {\n` +
      `  ranges: Array<PoGaugeRanges> = [];\n` +
      `  options: PoGaugeOptions = {};\n` +
      `}\n`;

    const result = migrateTypeScriptContent(source, true);

    it('should replace gauge interface imports and usages by their equivalents', () => {
      expect(result.changed).toBe(true);
      expect(result.warnings.length).toBe(0);

      const symbols = poUiImportSymbols(result.content);
      expect(symbols).toContain('PoChartSerie');
      expect(symbols).toContain('PoChartOptions');
      expect(symbols).not.toContain('PoGaugeRanges');
      expect(symbols).not.toContain('PoGaugeOptions');

      // Usos no corpo da classe atualizados.
      expect(result.content).toContain('Array<PoChartSerie>');
      expect(result.content).toContain('options: PoChartOptions');
      expect(result.content).not.toContain('PoGaugeRanges');
      expect(result.content).not.toContain('PoGaugeOptions');
    });
  });
});
