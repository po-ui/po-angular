---
inclusion: always
---

# Git Workflow, Branches, Commits e PRs

## Branches

Usar o padrão:

```text
nome-do-componente/ID_TASK_OU_ISSUE
```

Exemplos:

```text
po-button/DTHFUI-11345
po-modal/2679
po-datepicker/meu-time
```

Regras:

- O nome do componente deve ser usado como prefixo.
- O ID pode ser uma task Jira, por exemplo `DTHFUI-11345`, ou uma issue GitHub, por exemplo `2679`.
- Se não houver issue, usar o nome do desenvolvedor ou time.

## Commits

Usar Conventional Commits no formato:

```text
<tipo>(escopo): <descrição curta>
```

Regras:

- Tipos permitidos: `feat`, `fix`, `docs`, `refactor`, `perf`, `build`, `test`.
- Não usar o prefixo `po-` no escopo. Usar `feat(button)`, não `feat(po-button)`.
- Iniciar a descrição com letra minúscula.
- Não terminar a descrição com ponto.
- Usar verbos imperativos em português.
- Manter o header com no máximo 72 caracteres.

Quando aplicável, adicionar footer para fechamento automático:

```text
Fixes DTHFUI-XXXXX
```

## Pull Requests

- Descrições de PR, mensagens de commit e documentação devem ser escritas em português brasileiro.
- Não criar PR automaticamente sem autorização explícita.
- Antes de criar PR, enviar o link da branch para validação quando o usuário solicitar esse fluxo.
- Antes de abrir PR, consolidar commits de ajuste com squash quando necessário.
