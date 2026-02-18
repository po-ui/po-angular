# PO UI Angular - Instruções para AI Coding Agents

## Visão Geral do Projeto

PO UI é uma biblioteca de componentes para aplicações Angular, estruturada como monorepo com múltiplos pacotes publicáveis (`@po-ui/ng-components`, `@po-ui/ng-templates`, `@po-ui/ng-sync`, `@po-ui/ng-storage`, `@po-ui/ng-code-editor`). Cada biblioteca está em `projects/` e inclui schematics para integração com Angular CLI.

**Arquitetura Principal:**
- **Padrão de Componentes**: Componentes divididos em `-base.component.ts` (propriedades/Getters/Setters) e `.component.ts` (lógica/renderização). A classe base gerencia inputs/outputs/validação, a classe filha gerencia interação com a view.
- **Documentação**: Auto-gerada via Dgeni a partir de comentários JSDoc no código fonte. O projeto portal (`projects/portal/`) constrói o site de documentação.
- **Sistema de Build**: Usa Angular CLI + ng-packagr para build das bibliotecas, Gulp para compilação de schematics e substituição de versões.

## Idioma da Documentação e do Código

### Documentação em Português

A documentação oficial do projeto é escrita em português.  

Essa decisão reflete o fato de que o PO UI é uma biblioteca brasileira, com foco principal em entregas para desenvolvedores brasileiros. O objetivo é garantir clareza, acessibilidade e alinhamento com o público-alvo predominante da biblioteca.

Todo conteúdo de documentação — incluindo descrições em JSDoc, guias, exemplos e instruções — deve ser redigido em português formal, técnico e impessoal.

---

### Código Fonte em Inglês

Embora a documentação seja escrita em português, todo o código fonte deve ser escrito em inglês.

Essa prática segue os padrões internacionais de desenvolvimento de software e garante:

- Consistência com o ecossistema Angular e TypeScript  
- Melhor legibilidade para colaboradores internacionais  
- Aderência às boas práticas da comunidade open source  
- Padronização de nomes de variáveis, métodos, classes e interfaces  

Portanto:

- Nomes de variáveis, funções, classes, enums e interfaces devem estar em inglês.  
- Comentários técnicos internos que expliquem lógica específica podem seguir o padrão já adotado no projeto, mas identificadores de código devem permanecer em inglês.

---

### Testes Unitários em Inglês

Os textos descritivos dos testes unitários (descrições de `describe()` e `it()`) devem ser escritos em inglês.

Essa diretriz garante:

- Padronização com ferramentas e relatórios de testes  
- Clareza semântica ao ler mensagens de falha  
- Consistência com o código fonte  
- Aderência às convenções amplamente utilizadas na comunidade Angular/Jasmine  

Exemplo:

```typescript
describe('PoButtonComponent', () => {
  it('should disable the button when disabled property is true', () => {
    // ...
  });
});
```

## Workflows Críticos

### Comandos de Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar testes para biblioteca específica
npm run test:ui              # Componentes UI (ChromeHeadless)
npm run test:ui:browse       # Componentes UI (Chrome, interativo)
npm run test:schematics      # Testes de todos os schematics

# Linting
npm run lint:ui              # Lint da biblioteca UI
npm run format:check         # Verificar formatação Prettier
npm run format:all           # Auto-formatar todos os arquivos

# Build
npm run build:ui:lite        # Build apenas da lib UI (sem schematics/pack)
npm run build:ui             # Build completo com schematics + npm pack
npm run build                # Build de todas as bibliotecas
```

### Padrões de Testes
- **Requisito de Coverage**: 99% em statements, branches, functions e lines (ver `projects/ui/karma.conf.js`)
- **Estrutura de Testes**: Use `describe()` para agrupamento de componentes/métodos, `describe()` aninhados para teste de propriedades
- **Utilitários**: Importe `expectPropertiesValues` de `../../util-test/util-expect.spec` para validação de valores booleanos
- **Arquivo de Setup**: `projects/ui/src/lib/util-test/util-setup.spec.ts` executa antes de todos os testes (configurado em karma.conf.js)

### Testes Locais com Verdaccio
```bash
npm run build:ui             # Build e pack
npm run publish:ui:local     # Publicar em localhost:4873
npm run publish:local        # Publicar todos os pacotes
```

## Padrões de Desenvolvimento de Componentes

### Ordem de Declaração de Propriedades (STYLEGUIDE.md obrigatório)
```typescript
// 1. Private properties for getters/setters (use underscore prefix)
private _prop: string = 'default';

// 2. Public readonly properties
public readonly items: Array<Item> = [];

// 3. Private class variables (no underscore needed)
private internalState: boolean;

// 4. Decorators in order:
@ViewChild('template') template: TemplateRef<any>;
@Input('p-label') label: string;
@Output('p-click') click = new EventEmitter();

// 5. Getters/Setters (set before get)
@Input('p-disabled') set disabled(value: boolean) { 
  this._disabled = convertToBoolean(value); 
}
get disabled(): boolean { 
  return this._disabled; 
}
```

### Convenções para Propriedades Input
- **Inputs booleanos**: Use `@Input({ alias: 'p-prop', transform: convertToBoolean })` ou decorator legado `@InputBoolean()`
- **Propriedades opcionais**: Marque com operador `?` OU use tag JSDoc `@optional` (deve vir antes de `@description`)
- **Aliases**: Sempre prefixe com `p-` (ex: `@Input('p-label')`)
- **Valores padrão**: Documente com tag JSDoc `@default` usando backticks: `@default \`md\``

### Documentação (HOW_TO_DOCUMENT.md)
```typescript
/**
 * @optional
 * 
 * @description
 * 
 * Define o tamanho do elemento. Valores aceitos: `sm`, `md`, `lg`.
 * 
 * @default `md`
 */
@Input('p-size') size: string = 'md';
```

**Regras:**
- Use `/** */` para documentação (linhas únicas `//` são ignoradas pelo Dgeni)
- Escreva descrições impessoais e formais (evite "você deve/você pode")
- Use backticks para valores/nomes de propriedades, triple backticks para blocos de código
- Arrays tipados como `Array<T>` não `T[]`
- Linke para outros componentes/APIs com links markdown

## Estrutura de Módulos

Todos os pacotes exportam padrão barrel module:
- `PoModule` (ui) → agrega `PoComponentsModule`, `PoServicesModule`, `PoDirectivesModule`, etc.
- Cada componente tem seu próprio `.module.ts` que declara/exporta o componente
- API pública definida em `src/public-api.ts` (entry point em ng-package.json)

## Padrões de Commit & PR (CONTRIBUTING.md)

### Nomenclatura de Branches
```
<COMPONENT>/<ISSUE>        # po-button/DTHFUI-222 ou po-button/235
<COMPONENT>/<DEV>          # po-button/fulano (se não houver issue)
```

### Formato de Commit (Angular conventional commits)
```
<type>(scope): <descrição curta>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`  
**Scope**: Nome do componente (não nome do projeto)  
**Use rebase/squash** antes do PR para garantir um único commit por feature

### Checklist de Pull Request
- Incluir nome do componente + número da issue no título
- Descrever comportamento atual vs novo comportamento
- Fornecer código de reprodução/demo quando aplicável
- Todos os checks de lint/format/test devem passar (lint, format:check, test)

## Desenvolvimento de Schematics

Cada biblioteca tem schematics em `projects/<lib>/schematics/`:
- `ng-add/`: Schematic de instalação
- `ng-generate/`: Geradores de componentes/features
- `ng-update/`: Scripts de migração

**Build**: `gulp build:schematics --lib ui` compila TS para JS em `dist/ng-components/schematics/`  
**Test**: `npm run test:ui:schematics` executa specs Jasmine nos schematics compilados

## Gerenciamento de Versões

- Versões gerenciadas via `standard-version` (conventional changelog)
- `scripts/version-replace.js` atualiza placeholders de versão (`0.0.0-PLACEHOLDER`) em arquivos package.json durante o build
- Execute `npm run release` para gerar CHANGELOG.md (pula commit/tag conforme config)

## Build da Documentação do Portal

O site portal auto-gera documentação dos componentes a partir do código fonte:
1. Processadores Dgeni parsam tags JSDoc de `projects/ui/src/lib/`
2. Tasks Gulp em `projects/portal/gulpfile.js` transformam markdown → HTML
3. Páginas de componentes/guias geradas em `src/app/documentation/` e `src/app/guide/`
4. Build com `npm run build:portal:docs` (requer `npm run build:ui` primeiro)

## Sistema de Theming & Tokens CSS

PO UI usa `@po-ui/style` para theming com CSS custom properties (tokens). Componentes são estilizados usando variáveis CSS que podem ser customizadas por componente ou globalmente.

### Theme Service (PoThemeService)

Localizado em `projects/ui/src/lib/services/po-theme/`:
- **Propósito**: Gerenciar cores de tema, modo claro/escuro, níveis de acessibilidade (AA/AAA) e modos de densidade
- **Métodos Principais**: 
  - `setTheme(config, type, a11yLevel, persistPreference)` - Aplicar tema customizado
  - `cleanThemeActive()` - Resetar para tema padrão
- **Persistência**: Salva automaticamente preferências do usuário no localStorage

### Padrão de Documentação de Tokens

Todo componente documenta tokens CSS customizáveis em seu `-base.component.ts`:

```typescript
/**
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                  | Descrição                    | Valor Padrão                      |
 * |------------------------------|------------------------------|-----------------------------------|
 * | `--font-family`              | Família tipográfica usada    | `var(--font-family-theme)`        |
 * | `--color`                    | Cor principal do botão       | `var(--color-action-default)`     |
 * | `--border-radius`            | Raio dos cantos              | `var(--border-radius-md)`         |
 * | **Hover**                    |                              |                                   |
 * | `--color-hover`              | Cor no estado hover          | `var(--color-action-hover)`       |
 */
```

**Convenções de Nomenclatura de Tokens:**
- Baseado em estados: `--{property}-{state}` (ex: `--color-hover`, `--background-pressed`, `--text-color-disabled`)
- Baseado em variantes: `--{property}-{variant}` (ex: `--color-button-danger`, `--border-color-danger-hover`)
- Referencie tokens globais usando `var(--global-token-name)`

### Categorias Comuns de Tokens

1. **Tipografia**: `--font-family`, `--font-size`, `--font-weight`, `--line-height`
2. **Cores**: `--color-*`, `--text-color-*`, `--background-*`, `--border-color-*`
3. **Espaçamento**: `--padding`, `--margin`
4. **Forma**: `--border-radius`, `--border-width`
5. **Efeitos**: `--shadow`, `--outline-color-focused`

### Fontes de Tokens Globais

- Tema base: `@po-ui/style/css/po-theme-default.min.css` (configurado em `angular.json`)
- Constantes de tema: `projects/ui/src/lib/services/po-theme/helpers/`
  - `po-theme-poui.constant.ts` - Tema PO padrão
  - `po-theme-default-aa.constant.ts` / `po-theme-default-aaa.constant.ts` - Variantes de acessibilidade
  - `po-theme-light-defaults.constant.ts` / `po-theme-dark-defaults.constant.ts` - Modos claro/escuro

### Ao Adicionar/Modificar Componentes

1. **Documente tokens** em comentário JSDoc acima da classe do componente (no `-base.component.ts`)
2. **Agrupe tokens logicamente** (Padrão → Hover → Focused → Pressed → Disabled → Danger/variantes)
3. **Use formato de tabela markdown** com colunas Propriedade, Descrição, Valor Padrão
4. **Referencie guia de customização de tema** no cabeçalho da documentação
5. **Teste com níveis de acessibilidade AA e AAA** para garantir que valores de tokens funcionem corretamente

## Acessibilidade

Componentes seguem padrões WCAG:
- Indicadores de foco: espessura mínima de 2px (WCAG 2.4.12)
- Navegação por teclado: Espaço/Enter ativam botões (WAI-ARIA 3.5)
- Tamanhos padrão: Verifique utilitário `getDefaultSizeFn()` para conformidade AA/AAA
- Níveis de acessibilidade: **AAA** (padrão - maior contraste, áreas clicáveis maiores) vs **AA** (proporções balanceadas)
- Modos de densidade: Controle espaçamento entre/dentro de componentes via enum `PoDensityMode`
- Documente recursos de acessibilidade na seção `@description` do componente

## Localizações Importantes de Arquivos

- **Código fonte de componentes**: `projects/ui/src/lib/components/po-<name>/`
- **Serviços**: `projects/ui/src/lib/services/`
- **Utilitários**: `projects/ui/src/lib/utils/util.ts` (convertToBoolean, validateSizeFn, etc.)
- **Decorators**: `projects/ui/src/lib/decorators/` (@InputBoolean, @InputRequired)
- **Helpers de teste**: `projects/ui/src/lib/util-test/`
- **Config de build**: `angular.json` (definições de projeto), `tsconfig*.json` (opções do compilador)
