---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/components/**/*.ts", "projects/ui/src/lib/components/**/*.html", "projects/ui/src/lib/components/**/*.scss", "**/*.css", "**/*.scss"]
name: animalia-design-system
classification: skill
description: Use ao implementar definições visuais do Animalia DS em componentes PO UI.
source: .github/skills/implement-animalia-ds.md
---

# Implementação do Animalia DS

## Pré-requisitos

- Consultar a especificação do componente no Animalia DS quando a tarefa citar adequação visual, tokens, estados ou acessibilidade.
- Verificar estados especificados: Enable, Disable, Static, Hover, Focus, Active e Loading.

## No repositório po-style

1. Identificar o arquivo CSS do componente em `src/css/components/po-<nome>/`.
2. Atualizar estilos conforme a especificação do Animalia DS.
3. Remover variáveis CSS legacy somente quando houver justificativa.
4. Documentar remoções de variáveis como breaking change quando afetarem consumidores.

## No repositório po-angular

1. Atualizar o arquivo `-base.component.ts` do componente quando houver alteração de API, tokens ou documentação.
2. Atualizar a tabela de tokens CSS customizáveis no JSDoc.
3. Documentar impactos de acessibilidade na seção `@description` quando aplicável.
4. Atualizar testes para cobrir novos estados ou comportamentos.
5. Verificar conformidade com AA e AAA.

## Ícones

- Usar prefixo `an an-*` para Animalia Icons.
- Consultar o dicionário em `projects/ui/src/lib/components/po-icon/po-icon-dictionary.ts`.
- Não usar prefixo `po-icon` para implementações novas associadas à v21 ou posterior.

## Commit sugerido

```text
feat(<componente>): implementa definições do AnimaliaDS
```
