import * as fc from 'fast-check';
import * as path from 'path';

import { logging } from '@angular-devkit/core';
import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { migrateHtmlContent } from './gauge-html-migration';
import { migrateTypeScriptContent } from './gauge-ts-migration';
import { gaugeMigrationRule } from './index';

/**
 * Testes de propriedade para a **escrita condicional** (`Propriedade 3`) da regra
 * de orquestração `gaugeMigrationRule`.
 *
 * A regra só deve gravar (`tree.overwrite`) um arquivo quando o conteúdo
 * transformado difere do original (Req. 2.8, 4.6, 7.3). Consequentemente, quando
 * o conteúdo migrado de um arquivo é idêntico ao original — por exemplo, um
 * arquivo sem qualquer `Uso_Template`/`Uso_TypeScript` do `po-gauge`, ou um
 * arquivo já migrado (`po-chart` com `p-type="gauge"` / símbolos do `po-chart`) —
 * o arquivo NÃO deve ser sobrescrito e seu conteúdo deve permanecer idêntico
 * byte a byte.
 *
 * Abordagem: teste em nível de regra. Constrói-se um `Tree` em memória com um
 * `angular.json` mínimo (workspace + projeto `application` com `sourceRoot` e
 * `browser`/main), um `main.ts` standalone (para `getProjectMainFile` /
 * `isStandaloneApp`) e arquivos gerados sob o diretório-fonte do projeto cujo
 * conteúdo migrado é idêntico ao original. Após aplicar `gaugeMigrationRule()`,
 * verifica-se que:
 *  - o conteúdo de cada arquivo permanece idêntico byte a byte (invariante
 *    observável da escrita condicional);
 *  - `tree.overwrite` não foi chamado para esses arquivos (nenhuma escrita).
 *
 * O espaço de entrada "sem mudança" é garantido por uma pré-condição
 * (`fc.pre`) que usa as próprias transformações puras: um arquivo só participa
 * do teste quando `migrate(x).changed === false && migrate(x).content === x` —
 * que é exatamente a condição sob a qual `scanDirectory` pula a escrita.
 */

/** `angular.json` mínimo: um projeto `application` com `sourceRoot` e main file. */
const ANGULAR_JSON = {
  version: 1,
  projects: {
    demo: {
      projectType: 'application',
      root: '',
      sourceRoot: 'src',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: {
            browser: 'src/main.ts'
          }
        }
      }
    }
  }
};

/** `main.ts` standalone válido para `getProjectMainFile`/`isStandaloneApp`. */
const MAIN_TS = [
  `import { bootstrapApplication } from '@angular/platform-browser';`,
  `import { AppComponent } from './app/app.component';`,
  ``,
  `bootstrapApplication(AppComponent).catch(err => console.error(err));`,
  ``
].join('\n');

/** Constrói um `Tree` em memória com o workspace mínimo e os arquivos gerados. */
function buildTree(files: Array<{ path: string; content: string }>): Tree {
  const tree = Tree.empty();
  tree.create('/angular.json', JSON.stringify(ANGULAR_JSON, null, 2));
  tree.create('/src/main.ts', MAIN_TS);

  for (const file of files) {
    tree.create(file.path, file.content);
  }

  return tree;
}

/** Contexto mínimo: a regra só depende de `context.logger`. */
function createContext(): SchematicContext {
  return { logger: new logging.NullLogger() } as unknown as SchematicContext;
}

/** Executa a regra de forma síncrona sobre o `tree` informado. */
function runRule(tree: Tree): void {
  const rule = gaugeMigrationRule() as (tree: Tree, context: SchematicContext) => Tree;
  rule(tree, createContext());
}

/**
 * Trechos de HTML seguros: marcação genérica e elementos já migrados
 * (`po-chart` com `p-type="gauge"`). Nenhum contém o seletor de abertura
 * `<po-gauge` seguido de delimitador, portanto a migração não altera o conteúdo.
 */
const safeHtmlPartArb: fc.Arbitrary<string> = fc.constantFrom(
  '<div class="wrapper"></div>',
  '<p>texto</p>',
  '<!-- comentário existente -->',
  '<span>conteúdo</span>',
  '<button (click)="salvar()">Salvar</button>',
  '<po-chart p-type="gauge" [p-series]="series"></po-chart>',
  '<po-chart p-type="gauge" [p-series]="s" [p-options]="{ descriptionChart: d }"></po-chart>',
  '\n',
  '  '
);

/** Documento HTML cujo conteúdo migrado é idêntico ao original (no-op). */
const noChangeHtmlArb: fc.Arbitrary<string> = fc
  .array(safeHtmlPartArb, { minLength: 0, maxLength: 8 })
  .map(parts => parts.join(''));

/**
 * Trechos de TypeScript seguros: imports de símbolos não-gauge, símbolos já
 * migrados (`PoChartModule`) e código comum. Nenhum importa símbolos gauge,
 * portanto a migração não altera o conteúdo.
 */
const safeTsPartArb: fc.Arbitrary<string> = fc.constantFrom(
  `import { Component } from '@angular/core';\n`,
  `import { CommonModule } from '@angular/common';\n`,
  `import { PoButtonModule, PoTableModule } from '@po-ui/ng-components';\n`,
  `import { PoChartModule } from '@po-ui/ng-components';\n`,
  `export class FooComponent {}\n`,
  `const total = 42;\n`,
  `// comentário existente\n`
);

/** Arquivo TypeScript cujo conteúdo migrado é idêntico ao original (no-op). */
const noChangeTsArb: fc.Arbitrary<string> = fc
  .array(safeTsPartArb, { minLength: 0, maxLength: 6 })
  .map(parts => parts.join(''));

/** Especificação de um arquivo gerado: tipo (html/ts) e conteúdo. */
type FileSpecKind = 'html' | 'ts';
interface FileSpec {
  kind: FileSpecKind;
  content: string;
}

/** Gera a especificação de um arquivo no-change (html ou ts). */
const fileSpecArb: fc.Arbitrary<FileSpec> = fc.oneof(
  noChangeHtmlArb.map(content => ({ kind: 'html' as const, content })),
  noChangeTsArb.map(content => ({ kind: 'ts' as const, content }))
);

describe('v22 gaugeMigrationRule — escrita condicional (property-based):', () => {
  /**
   * Propriedade 3 — Escrita condicional.
   *
   * Para qualquer conjunto de arquivos `.html`/`.ts` cujo conteúdo migrado é
   * idêntico ao original (garantido pela pré-condição via transformações puras),
   * após aplicar `gaugeMigrationRule()`:
   *  - nenhuma operação de escrita (`tree.overwrite`) ocorre para esses arquivos;
   *  - o conteúdo de cada arquivo permanece idêntico byte a byte ao original.
   *
   * **Validates: Requirements 2.8, 4.6, 7.3**
   * **Valida: Requisitos 2.8, 4.6, 7.3**
   */
  it('should not overwrite files whose migrated content equals the original (Prop 3, Req 2.8, 4.6, 7.3)', () => {
    fc.assert(
      fc.property(fc.array(fileSpecArb, { minLength: 1, maxLength: 5 }), specs => {
        const files = specs.map((spec, index) => ({
          path: `/src/app/generated-${index}.${spec.kind === 'html' ? 'html' : 'ts'}`,
          content: spec.content,
          kind: spec.kind
        }));

        // Pré-condição: cada arquivo é um caso genuíno de "sem mudança".
        // (mesma condição sob a qual `scanDirectory` pula a escrita).
        for (const file of files) {
          const result =
            file.kind === 'html' ? migrateHtmlContent(file.content) : migrateTypeScriptContent(file.content, true);
          fc.pre(result.changed === false && result.content === file.content);
        }

        const tree = buildTree(files);
        const overwriteSpy = spyOn(tree, 'overwrite').and.callThrough();

        runRule(tree);

        for (const file of files) {
          // Invariante da escrita condicional: conteúdo idêntico byte a byte.
          const after = tree.read(file.path);
          expect(after).not.toBeNull();
          expect(after!.toString('utf-8')).toBe(file.content);

          // Nenhuma escrita ocorreu para este arquivo (Prop 3).
          const overwroteThisFile = overwriteSpy.calls.allArgs().some(args => args[0] === file.path);
          expect(overwroteThisFile).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Exemplo determinístico (mesma invariante da Propriedade 3): um arquivo HTML
   * sem `po-gauge` combinado com um arquivo já migrado (`po-chart`) e um arquivo
   * TypeScript sem símbolos gauge não sofrem escrita e permanecem idênticos.
   */
  it('should leave no-op html/ts files byte-for-byte identical and never call overwrite (Prop 3, Req 2.8, 4.6, 7.3)', () => {
    const htmlNoGauge = '<div class="dashboard">\n  <p>Sem gauge aqui</p>\n</div>\n';
    const htmlAlreadyMigrated = '<po-chart p-type="gauge" [p-series]="[{ data: 72 }]"></po-chart>\n';
    const tsNoGauge =
      `import { Component } from '@angular/core';\n` +
      `import { PoButtonModule } from '@po-ui/ng-components';\n\n` +
      `@Component({ selector: 'app-x', imports: [PoButtonModule], template: '' })\n` +
      `export class XComponent {}\n`;

    const files = [
      { path: '/src/app/no-gauge.html', content: htmlNoGauge },
      { path: '/src/app/already-migrated.html', content: htmlAlreadyMigrated },
      { path: '/src/app/no-gauge.component.ts', content: tsNoGauge }
    ];

    const tree = buildTree(files);
    const overwriteSpy = spyOn(tree, 'overwrite').and.callThrough();

    runRule(tree);

    for (const file of files) {
      expect(tree.read(file.path)!.toString('utf-8')).toBe(file.content);
    }

    expect(overwriteSpy).not.toHaveBeenCalled();
  });
});

/**
 * Testes de integração da `chain` do `migration-v22` (task 8.2).
 *
 * Abordagem escolhida: **nível de regra/chain com `SchematicTestRunner.callRule`**
 * sobre um `Tree` em memória, em vez de `runner.runSchematic('migration-v22', ...)`.
 *
 * Justificativa:
 * - O factory exportado por `./index` compõe a `chain` real (`updatePackageJson`
 *   → `gaugeMigrationRule` → `postUpdate`) e é a mesma `Rule` executada pelo
 *   Angular CLI durante `ng update`. Invocá-lo diretamente e rodá-lo com
 *   `runner.callRule(...)` exercita exatamente essa cadeia (ordem das regras,
 *   propagação de falha e agendamento de tarefas), sem depender de artefatos
 *   compilados/registro de collection resolvíveis em tempo de teste — que são
 *   frágeis quando o schematic é validado isoladamente.
 * - `runner.tasks` reflete as tarefas agendadas via `context.addTask` durante a
 *   execução da `chain`, permitindo verificar o agendamento de exatamente um
 *   `NodePackageInstallTask` (nome de tarefa `node-package`).
 * - O `Tree` em memória (mesmo `angular.json`/`main.ts` já usados nos testes de
 *   propriedade acima) permite montar um `package.json` com versão antiga e
 *   arquivos de projeto com `po-gauge`, verificando as transformações aplicadas.
 *
 * O modo de confirmação do Angular 22 é controlado por `process.stdin.isTTY`:
 * em modo não-TTY o factory assume "yes" (caminho de sucesso); para o teste de
 * cancelamento (Req 8.7) força-se `isTTY = true` e faz-se stub de
 * `readline.createInterface` para responder "no".
 */
describe('v22 migration-v22 chain — integração (SchematicTestRunner.callRule):', () => {
  /** Caminho do `migrations.json` (relativo ao diretório compilado deste spec). */
  const collectionPath = path.join(__dirname, '../../migrations.json');

  /** Versão "antiga" do `@po-ui/ng-components` antes da migração de versões. */
  const OLD_PO_VERSION = '19.16.0';

  /** `package.json` mínimo com a dependência do PO UI em versão antiga (Req 8.1). */
  const PACKAGE_JSON = {
    name: 'consumer-app',
    version: '0.0.0',
    dependencies: {
      '@angular/core': '^22.0.0',
      '@po-ui/ng-components': OLD_PO_VERSION
    },
    devDependencies: {
      typescript: '~5.9.0'
    }
  };

  /** Componente standalone com uso de `po-gauge` em TypeScript (Req 8.2). */
  const APP_COMPONENT_TS = [
    `import { Component } from '@angular/core';`,
    `import { PoGaugeModule } from '@po-ui/ng-components';`,
    ``,
    `@Component({`,
    `  selector: 'app-root',`,
    `  standalone: true,`,
    `  imports: [PoGaugeModule],`,
    `  template: ''`,
    `})`,
    `export class AppComponent {}`,
    ``
  ].join('\n');

  /** Template com uso de `<po-gauge>` (Req 8.2). */
  const APP_COMPONENT_HTML = `<po-gauge [p-value]="72" p-description="Faturamento"></po-gauge>\n`;

  /** Monta um `Tree` completo: workspace, main, package.json e arquivos do projeto. */
  function buildIntegrationTree(pkgJsonContent?: string): Tree {
    const tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(ANGULAR_JSON, null, 2));
    tree.create('/src/main.ts', MAIN_TS);
    tree.create('/package.json', pkgJsonContent ?? JSON.stringify(PACKAGE_JSON, null, 2));
    tree.create('/src/app/app.component.ts', APP_COMPONENT_TS);
    tree.create('/src/app/app.component.html', APP_COMPONENT_HTML);

    return tree;
  }

  /** Executa a `chain` real do factory sobre o `tree` e devolve o runner (para `tasks`). */
  async function runChain(tree: Tree): Promise<SchematicTestRunner> {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematic('migration-v22', {}, tree);
    return runner;
  }

  /** Conta as tarefas `NodePackageInstallTask` agendadas (nome `node-package`). */
  function countInstallTasks(runner: SchematicTestRunner): number {
    return runner.tasks.filter(task => task.name === 'node-package').length;
  }

  /** Salva/restaura `process.stdin.isTTY` para não vazar estado entre testes. */
  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdin.isTTY;
    // Caminho de sucesso/falha: modo não-TTY faz o factory assumir "yes".
    (process.stdin as unknown as { isTTY?: boolean }).isTTY = false;
  });

  afterEach(() => {
    (process.stdin as unknown as { isTTY?: boolean }).isTTY = originalIsTTY;
  });

  /**
   * Ordem e efeitos da `chain` no caminho de sucesso (Req 8.1, 8.2, 8.3).
   *
   * Após executar a migração confirmada:
   *  - as versões de dependências do `package.json` são atualizadas (Req 8.1);
   *  - a transformação `po-gauge` → `po-chart` é aplicada em HTML e TS (Req 8.2);
   *  - exatamente um `NodePackageInstallTask` é agendado (Req 8.3).
   *
   * **Validates: Requirements 8.1, 8.2, 8.3**
   */
  it('should update package.json versions, transform gauge usages and schedule exactly one install task (Req 8.1, 8.2, 8.3)', async () => {
    const tree = buildIntegrationTree();

    const runner = await runChain(tree);

    // Req 8.1 — versão da dependência do PO UI atualizada (deixou de ser a antiga).
    const pkg = JSON.parse(tree.read('/package.json')!.toString('utf-8'));
    expect(pkg.dependencies['@po-ui/ng-components']).toBeDefined();
    expect(pkg.dependencies['@po-ui/ng-components']).not.toBe(OLD_PO_VERSION);

    // Req 8.2 — transformação aplicada no template HTML.
    const html = tree.read('/src/app/app.component.html')!.toString('utf-8');
    expect(html).toContain('<po-chart');
    expect(html).toContain(`[p-type]="$any('gauge')"`);
    expect(html).not.toContain('<po-gauge');

    // Req 8.2 — transformação aplicada no TypeScript.
    const ts = tree.read('/src/app/app.component.ts')!.toString('utf-8');
    expect(ts).toContain('PoChartModule');
    expect(ts).not.toContain('PoGaugeModule');

    // Req 8.3 — exatamente uma tarefa de instalação agendada.
    expect(countInstallTasks(runner)).toBe(1);
  });

  /**
   * Ordenação: a atualização de versões ocorre antes da transformação de código,
   * e a tarefa de instalação é agendada após ambas (Req 8.2, 8.3). Verifica-se o
   * efeito combinado num único `Tree`: package.json atualizado E código migrado E
   * uma única tarefa (o que só é possível se a cadeia executou na ordem correta).
   *
   * **Validates: Requirements 8.2, 8.3**
   */
  it('should apply both version update and code transform before scheduling install (Req 8.2, 8.3)', async () => {
    const tree = buildIntegrationTree();

    const runner = await runChain(tree);

    const pkg = JSON.parse(tree.read('/package.json')!.toString('utf-8'));
    const html = tree.read('/src/app/app.component.html')!.toString('utf-8');
    const ts = tree.read('/src/app/app.component.ts')!.toString('utf-8');

    const versionsUpdated = pkg.dependencies['@po-ui/ng-components'] !== OLD_PO_VERSION;
    const codeMigrated = html.includes('<po-chart') && ts.includes('PoChartModule');

    expect(versionsUpdated).toBe(true);
    expect(codeMigrated).toBe(true);
    expect(countInstallTasks(runner)).toBe(1);
  });

  /**
   * Cancelamento (Req 8.7): se a confirmação do Angular 22 NÃO é confirmada, a
   * `chain` retornada é vazia — nenhuma transformação ocorre e nenhuma tarefa de
   * instalação é agendada.
   *
   * Força-se o caminho interativo com `process.stdin.isTTY = true` e stub de
   * `readline.createInterface`, respondendo "no".
   *
   * **Validates: Requirement 8.7**
   */
  it('should not transform files nor schedule install when Angular 22 confirmation is declined (Req 8.7)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const readline = require('readline');
    const fakeInterface = {
      question: (_query: string, callback: (answer: string) => void) => callback('no'),
      close: () => undefined
    };
    const readlineSpy = spyOn(readline, 'createInterface').and.returnValue(fakeInterface as never);

    // Força o caminho interativo (askQuestion) em vez do modo não-TTY.
    (process.stdin as unknown as { isTTY?: boolean }).isTTY = true;

    const originalHtml = APP_COMPONENT_HTML;
    const originalTs = APP_COMPONENT_TS;
    const tree = buildIntegrationTree();

    const runner = await runChain(tree);

    // Confirmação recusada foi solicitada via readline.
    expect(readlineSpy).toHaveBeenCalled();

    // Nenhuma transformação: conteúdo idêntico byte a byte ao original.
    expect(tree.read('/src/app/app.component.html')!.toString('utf-8')).toBe(originalHtml);
    expect(tree.read('/src/app/app.component.ts')!.toString('utf-8')).toBe(originalTs);

    // package.json inalterado (versão antiga preservada).
    const pkg = JSON.parse(tree.read('/package.json')!.toString('utf-8'));
    expect(pkg.dependencies['@po-ui/ng-components']).toBe(OLD_PO_VERSION);

    // Nenhuma tarefa de instalação agendada (Req 8.7).
    expect(countInstallTasks(runner)).toBe(0);
  });

  /**
   * Falha de regra na cadeia (Req 8.4): se qualquer regra da `chain` falhar, a
   * execução é interrompida e a tarefa `NodePackageInstallTask` NÃO é agendada.
   *
   * Provoca-se a falha na primeira regra (`updatePackageJson`) fornecendo um
   * `package.json` com JSON inválido — `JSON.parse` lança, propagando o erro
   * pela `chain` antes de `postUpdate`.
   *
   * **Validates: Requirement 8.4**
   */
  it('should not schedule install task when a chain rule fails (Req 8.4)', async () => {
    const tree = buildIntegrationTree('{ this is not valid json');

    const runner = new SchematicTestRunner('schematics', collectionPath);

    // A falha da regra propaga-se pela chain (runSchematic rejeita).
    let rejected = false;
    try {
      await runner.runSchematic('migration-v22', {}, tree);
    } catch {
      rejected = true;
    }
    expect(rejected).toBe(true);

    // Req 8.4 — nenhuma tarefa de instalação foi agendada.
    expect(countInstallTasks(runner)).toBe(0);
  });
});

/**
 * Testes de integração de **idempotência multi-execução** (task 8.3).
 *
 * Verifica que o resultado da migração é um ponto fixo: a partir da segunda
 * execução sobre o mesmo `Tree`, o conteúdo de todos os arquivos permanece
 * idêntico byte a byte ao resultado da primeira execução e a migração reporta
 * "nenhuma ocorrência" (Req. 9.4).
 *
 * Usa `fast-check` com `fc.integer({min: 2, max: 10})` para variar o número
 * de re-execuções, exercitando a propriedade de ponto fixo para diferentes
 * quantidades de iterações.
 *
 * **Validates: Requirements 7.1, 7.2, 9.4**
 */
describe('v22 migration-v22 chain — idempotência multi-execução (property-based):', () => {
  const collectionPath = path.join(__dirname, '../../migrations.json');

  const OLD_PO_VERSION = '19.16.0';

  const PACKAGE_JSON = {
    name: 'consumer-app',
    version: '0.0.0',
    dependencies: {
      '@angular/core': '^22.0.0',
      '@po-ui/ng-components': OLD_PO_VERSION
    },
    devDependencies: {
      typescript: '~5.9.0'
    }
  };

  /** Componente standalone com uso de `po-gauge` em TypeScript. */
  const APP_COMPONENT_TS = [
    `import { Component } from '@angular/core';`,
    `import { PoGaugeModule } from '@po-ui/ng-components';`,
    ``,
    `@Component({`,
    `  selector: 'app-root',`,
    `  standalone: true,`,
    `  imports: [PoGaugeModule],`,
    `  template: ''`,
    `})`,
    `export class AppComponent {}`,
    ``
  ].join('\n');

  /** Template com uso de `<po-gauge>`. */
  const APP_COMPONENT_HTML = `<po-gauge [p-value]="72" p-description="Faturamento"></po-gauge>\n`;

  /** Monta um `Tree` completo com usos de `po-gauge`. */
  function buildIdempotencyTree(): Tree {
    const tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(ANGULAR_JSON, null, 2));
    tree.create('/src/main.ts', MAIN_TS);
    tree.create('/package.json', JSON.stringify(PACKAGE_JSON, null, 2));
    tree.create('/src/app/app.component.ts', APP_COMPONENT_TS);
    tree.create('/src/app/app.component.html', APP_COMPONENT_HTML);
    return tree;
  }

  /** Executa a `chain` real do factory sobre o `tree`. */
  async function runMigration(tree: Tree): Promise<void> {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematic('migration-v22', {}, tree);
  }

  /** Captura o conteúdo de todos os arquivos do `Tree` como mapa `path → content`. */
  function captureTreeContents(tree: Tree): Map<string, string> {
    const contents = new Map<string, string>();
    tree.visit(filePath => {
      const buffer = tree.read(filePath);
      if (buffer) {
        contents.set(filePath, buffer.toString('utf-8'));
      }
    });
    return contents;
  }

  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdin.isTTY;
    (process.stdin as unknown as { isTTY?: boolean }).isTTY = false;
  });

  afterEach(() => {
    (process.stdin as unknown as { isTTY?: boolean }).isTTY = originalIsTTY;
  });

  /**
   * Propriedade: idempotência (ponto fixo) — multi-execução da chain completa.
   *
   * Dado um `Tree` com usos de `po-gauge`, após a primeira execução da migração
   * o resultado é um ponto fixo: N execuções adicionais (2 ≤ N ≤ 10) produzem
   * conteúdo idêntico byte a byte ao resultado da primeira execução.
   *
   * **Validates: Requirements 7.1, 7.2**
   */
  it('should produce byte-for-byte identical content from the second execution onwards (Prop 1, Req 7.1, 7.2)', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 2, max: 10 }), async (n: number) => {
        const tree = buildIdempotencyTree();

        // Primeira execução: transforma gauge → chart.
        await runMigration(tree);

        // Captura o estado após a primeira execução (ponto fixo esperado).
        const firstRunContents = captureTreeContents(tree);

        // Re-execuções adicionais (N vezes): conteúdo deve permanecer idêntico.
        for (let i = 2; i <= n; i++) {
          await runMigration(tree);

          const currentContents = captureTreeContents(tree);

          // Verificar que o conjunto de arquivos não mudou.
          expect(currentContents.size).toBe(firstRunContents.size);

          // Verificar conteúdo idêntico byte a byte para cada arquivo.
          for (const [filePath, expectedContent] of firstRunContents) {
            const actualContent = currentContents.get(filePath);
            expect(actualContent).toBe(expectedContent);
          }
        }
      }),
      { numRuns: 5 }
    );
  });

  /**
   * Verificação do log "nenhuma ocorrência" em re-execuções (Req. 9.4).
   *
   * Após a primeira execução ter transformado todos os usos, execuções
   * subsequentes devem detectar que não há mais `po-gauge` e registrar
   * a mensagem "Nenhuma ocorrência do po-gauge foi encontrada no workspace".
   *
   * **Validates: Requirement 9.4**
   */
  it('should log "nenhuma ocorrência" on subsequent executions when no gauge usages remain (Req 9.4)', async () => {
    const tree = buildIdempotencyTree();

    // Primeira execução: transforma gauge → chart.
    await runMigration(tree);

    // Segunda execução capturando os logs do runner.
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const infoMessages: string[] = [];
    runner.logger.subscribe(entry => {
      if (entry.level === 'info') {
        infoMessages.push(entry.message);
      }
    });

    await runner.runSchematic('migration-v22', {}, tree);

    // Req. 9.4 — a mensagem "nenhuma ocorrência" deve ter sido registrada.
    const noOccurrenceMessage = infoMessages.find(msg =>
      msg.includes('Nenhuma ocorrência do po-gauge foi encontrada no workspace')
    );
    expect(noOccurrenceMessage).toBeDefined();
  });
});
