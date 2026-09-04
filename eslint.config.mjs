// Flat config (ESLint 9 / angular-eslint 22 / typescript-eslint 8).
//
// Migrado a partir dos arquivos .eslintrc.json legados. As regras foram
// preservadas conforme o modelo anterior. Os presets "recommended" do
// @angular-eslint e do @typescript-eslint sao carregados via os pacotes
// umbrella (angular-eslint / typescript-eslint), ja que os pacotes granulares
// da v22 nao expoem os shareable configs no formato eslintrc usado pelo
// FlatCompat.
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import sonarjs from 'eslint-plugin-sonarjs';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'coverage/**',
      'out-tsc/**',
      // Fixtures de teste manual da migracao do po-gauge: arquivos de entrada
      // propositalmente crafted (usos de po-gauge, @ts-ignore, etc.) que servem
      // de material para a schematic transformar; nao devem ser lintados.
      'projects/ui/schematics/ng-update/v22/gauge-manual-test/**'
    ]
  },
  {
    // O modelo legado (.eslintrc.json) nao reportava diretivas eslint-disable
    // nao utilizadas; mantem o mesmo comportamento.
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    files: ['**/*.ts'],
    extends: [
      // Baseline "recommended" equivalente ao modelo legado
      // (plugin:@typescript-eslint/recommended + plugin:@angular-eslint/recommended).
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    // Habilita o processamento de templates inline dos componentes
    // (equivalente a plugin:@angular-eslint/template/process-inline-templates).
    processor: angular.processInlineTemplates,
    plugins: {
      sonarjs
    },
    languageOptions: {
      parserOptions: {
        // Mantem o escopo de type-checking dos projetos, como no modelo legado.
        project: [
          'tsconfig.json',
          'projects/app/tsconfig.app.json',
          'projects/app/tsconfig.spec.json',
          'projects/code-editor/tsconfig.lib.json',
          'projects/code-editor/tsconfig.spec.json',
          'projects/portal/tsconfig.app.json',
          'projects/portal/tsconfig.spec.json',
          'projects/storage/tsconfig.lib.json',
          'projects/storage/tsconfig.spec.json',
          'projects/sync/tsconfig.lib.json',
          'projects/sync/tsconfig.spec.json',
          'projects/templates/tsconfig.lib.json',
          'projects/templates/tsconfig.spec.json',
          'projects/ui/tsconfig.lib.json',
          'projects/ui/tsconfig.spec.json'
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: '', style: 'kebab-case' }
      ],
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: '', style: 'kebab-case' }],
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/no-output-rename': 'off',
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/no-conflicting-lifecycle': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': ['off', { ignoreParameters: true }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'snake_case', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'import', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'classProperty', format: ['camelCase', 'UPPER_CASE', 'snake_case', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase', 'camelCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE', 'camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: ['objectLiteralMethod'], format: ['PascalCase', 'camelCase', 'snake_case', 'UPPER_CASE'], leadingUnderscore: 'allow' },
        { selector: ['objectLiteralProperty'], format: null, leadingUnderscore: 'allow' },
        { selector: 'function', format: ['PascalCase', 'camelCase'], leadingUnderscore: 'allow' }
      ],
      '@typescript-eslint/member-ordering': ['error', { default: ['signature', 'field', 'constructor', 'method'] }],
      'arrow-parens': ['off', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'brace-style': ['off', 'off'],
      'default-case-last': 'error',
      'dot-notation': 'off',
      'eol-last': 'off',
      'id-blacklist': 'off',
      'id-match': 'off',
      indent: 'off',
      'linebreak-style': 'off',
      'max-len': 'off',
      'max-lines-per-function': ['off', { max: 200 }],
      'max-params': ['error', { max: 8 }],
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-empty-function': 'off',
      'no-empty-pattern': 'off',
      'no-extra-parens': 'off',
      'no-extra-semi': 'error',
      'no-irregular-whitespace': 'off',
      'no-multi-str': 'error',
      'no-self-assign': 'error',
      'no-shadow': 'off',
      'no-trailing-spaces': 'off',
      'no-underscore-dangle': 'off',
      // No modelo legado, o preset @typescript-eslint/recommended desligava a
      // regra core `no-unused-expressions` (em favor da versao TS, que estava
      // `off`). O efeito liquido era nenhuma das duas ativa; mantido igual.
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-use-before-define': 'off',
      'object-shorthand': 'off',
      'padded-blocks': ['off', { blocks: 'never' }, { allowSingleLineBlocks: true }],
      'quote-props': 'off',
      semi: 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/max-switch-cases': 'error',
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-duplicated-branches': 'off',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-identical-functions': 'off',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-same-line-conditional': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'space-before-function-paren': 'off',
      'space-in-parens': ['off', 'never'],
      '@angular-eslint/prefer-standalone': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@angular-eslint/prefer-inject': 'off',
      // Nao fazia parte do preset "recommended" legado do @angular-eslint (v21);
      // o preset da v22 passou a inclui-la. Desligada para preservar o
      // comportamento anterior.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off'
    }
  },
  // Arquivos de schematics sao compilados com tsconfig.schematics.json
  // (strictNullChecks: true). Type-checa-los com o mesmo tsconfig evita que
  // regras type-aware (ex.: no-unnecessary-type-assertion) divirjam do build:
  // sem isso, o lint usa o tsconfig.lib.json (strict: false) e considera
  // desnecessarios os `!`/casts que o build strict realmente exige.
  {
    files: ['projects/*/schematics/**/*.ts'],
    ignores: ['projects/*/schematics/**/*.spec.ts', 'projects/*/schematics/**/files/**/*'],
    languageOptions: {
      parserOptions: {
        project: [
          'projects/code-editor/tsconfig.schematics.json',
          'projects/storage/tsconfig.schematics.json',
          'projects/sync/tsconfig.schematics.json',
          'projects/templates/tsconfig.schematics.json',
          'projects/ui/tsconfig.schematics.json'
        ],
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // Specs de schematics: build strict via tsconfig.schematics-spec.json
  // (apenas ui possui esse tsconfig atualmente).
  {
    files: ['projects/ui/schematics/**/*.spec.ts'],
    ignores: ['projects/ui/schematics/**/files/**/*'],
    languageOptions: {
      parserOptions: {
        project: ['projects/ui/tsconfig.schematics-spec.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // ---------------------------------------------------------------------------
  // Overrides por projeto (equivalentes aos .eslintrc.json de cada projeto).
  // Aplicados apos o bloco compartilhado; em flat config, blocos posteriores
  // sobrescrevem os anteriores para os arquivos correspondentes.
  // ---------------------------------------------------------------------------

  // projects/ui: directive-selector como "warn"; specs e alguns arquivos
  // excluidos das regras TS; regras extras desligadas.
  {
    ignores: ['projects/ui/**/util-expect.spec.ts']
  },
  {
    files: ['projects/ui/**/*.ts'],
    ignores: [
      'projects/ui/**/test.ts',
      'projects/ui/**/*.spec.ts',
      'projects/ui/**/*.po.ts',
      'projects/ui/src/lib/util-test/util-expect.spec.ts'
    ],
    rules: {
      '@angular-eslint/directive-selector': ['warn', { type: 'attribute', prefix: '', style: 'kebab-case' }],
      // Nota: @angular-eslint/no-host-metadata-property foi removida na v22 e
      // por isso nao e mais referenciada (era `off` no modelo legado, sem efeito).
      'prefer-spread': 'off'
    }
  },

  // projects/sync: selectors com prefixo "lib".
  {
    files: ['projects/sync/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'lib', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'lib', style: 'camelCase' }]
    }
  },

  // projects/portal: selectors com prefixo "app"; pastas de docs/samples ignoradas.
  {
    ignores: ['projects/portal/docs/**/*', 'projects/portal/src/app/documentation/samples/**/*']
  },
  {
    files: ['projects/portal/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }]
    }
  },

  // projects/app: no-extra-parens habilitado como erro.
  {
    files: ['projects/app/**/*.ts'],
    rules: {
      'no-extra-parens': 'error'
    }
  },

  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'warn'
    }
  }
);
