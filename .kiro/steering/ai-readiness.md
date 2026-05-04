---
inclusion: manual
name: ai-readiness
classification: review
source: .github/review.md
description: Use ao revisar prontidão do repositório para agentes de IA, instruções, skills e padrões automatizáveis.
---

# AI Readiness do PO Angular

## Critérios consolidados

- Modernização Angular documentada para novos componentes e refatorações explícitas.
- Proibição de NgModules novos, `CommonModule`, `*ngIf`, `*ngFor`, `*ngSwitch` e `any` em novos componentes.
- Uso obrigatório de `standalone: true`, Control Flow Syntax, Signals e APIs function-based quando aplicável a novo código.
- Acessibilidade documentada com ARIA, focus trap, navegação por teclado e contraste mínimo.
- Engenharia e qualidade documentadas com cobertura mínima de 99%, Conventional Commits e linguagem canônica.

## Arquivos de conhecimento equivalentes em Kiro

| Origem `.github` | Destino `.kiro` |
|---|---|
| `.github/skills/create-component.md` | `.kiro/steering/component-creation.md` |
| `.github/skills/write-tests.md` | `.kiro/steering/testing.md` |
| `.github/skills/document-component.md` | `.kiro/steering/component-documentation.md` |
| `.github/skills/add-css-tokens.md` | `.kiro/steering/css-tokens.md` |
| `.github/skills/implement-animalia-ds.md` | `.kiro/steering/animalia-design-system.md` |
| `.github/skills/review-accessibility.md` | `.kiro/steering/accessibility.md` |
| `.github/ISSUE_TEMPLATE/*.md` | `.kiro/steering/issue-triage.md` |
| `.github/workflows/*.yml` | `.kiro/steering/ci-and-publishing.md` |

## Nota sobre legado

Componentes existentes podem preservar padrões antigos. As regras modernas devem ser aplicadas em novos componentes e em refatorações explicitamente solicitadas, evitando mudanças amplas sem escopo aprovado.
