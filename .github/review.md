# Code Review — AI Readiness (po-angular)

**Data:** 2026-03-25
**Repositório:** po-ui/po-angular
**PR:** [#2774](https://github.com/po-ui/po-angular/pull/2774)

---

## Sumário Executivo

| Critério | Status |
|----------|--------|
| Modernização Angular v21+ | Implementado |
| Design System & Tokens | Implementado |
| Acessibilidade (A11y) | Implementado |
| Engenharia e Qualidade | Implementado |

## Critérios de Aceite Verificados

### 1. Modernização Angular

- **Proibição de NgModules**: Explícita em `agents-instructions.md` e `create-component.md`
- **Proibição de CommonModule**: Explícita — importar componentes/diretivas individualmente
- **Proibição de `*ngIf` / `*ngFor`**: Explícita — uso obrigatório de `@if`, `@for`, `@switch`
- **Proibição de `any`**: Explícita — exige interfaces/types explícitos
- **Signals obrigatórios**: `signal()`, `computed()`, `effect()` documentados como obrigatórios
- **Standalone Components**: `standalone: true` obrigatório em novos componentes
- **Control Flow Syntax**: `@if`, `@for`, `@switch` com exemplos de uso
- **ControlValueAccessor**: Obrigatório para componentes de campo (input, select, textarea, datepicker, combo, lookup)
- **Function-based APIs**: `input()` e `output()` obrigatórios em novos componentes em vez de `@Input()` / `@Output()`

### 2. Acessibilidade

- **Atributos ARIA**: Checklist completo com `role`, `aria-label`, `aria-describedby`, `aria-expanded`, `aria-live`, `aria-disabled`, `aria-checked`, `aria-selected`, `aria-hidden`
- **Focus Trap**: Regras obrigatórias para modais, drawers, popovers
- **Navegação por teclado**: Tabela completa com Tab, Shift+Tab, Enter/Space, Esc, Arrow keys, Home/End
- **Contraste mínimo**: Ratios documentados para AA (4.5:1) e AAA (7:1)

### 3. Engenharia e Qualidade

- **Coverage**: 99% exigido em statements, branches, functions e lines
- **Conventional Commits**: Padrão `<type>(scope): <descrição curta>` documentado
- **Linguagem canônica**: Instruções em modo imperativo, sem ambiguidades

## Arquivos de AI Readiness

| Arquivo | Propósito |
|---------|-----------|
| `AGENTS.md` | Ponto de entrada para agentes de IA |
| `.github/instructions/agents-instructions.md` | Instruções completas de desenvolvimento |
| `.github/skills/create-component.md` | Skill para criação de novos componentes |
| `.github/skills/write-tests.md` | Skill para escrita de testes unitários |
| `.github/skills/document-component.md` | Skill para documentação de componentes |
| `.github/skills/add-css-tokens.md` | Skill para tokens CSS customizáveis |
| `.github/skills/implement-animalia-ds.md` | Skill para implementação do Animalia DS |
| `.github/skills/review-accessibility.md` | Skill para verificação de acessibilidade |
| `mcp.json` | Configuração de MCP servers (Figma + Context7) |

## Nota sobre Código Legacy

Componentes existentes ainda usam `@Input()`, `@Output()`, `NgModules` e `*ngIf`/`*ngFor`. As regras de Angular v21+ aplicam-se a **novos** componentes e refatorações explícitas. Ao modificar componentes existentes, manter o padrão vigente no arquivo.
