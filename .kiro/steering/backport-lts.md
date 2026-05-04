---
inclusion: auto
name: backport-lts
classification: workflow
description: Use ao gerenciar backports, cherry-picks, branches LTS ou compatibilidade entre latest e versões LTS.
---

# Workflow de Backport Latest → LTS

## Escopo

Este fluxo se aplica estritamente a tarefas de manutenção e correção. Novas features não devem ser portadas por este processo sem orientação explícita.

## Branches

| Tipo | Padrão | Exemplo |
|---|---|---|
| Latest | `{componente}/{id-issue}` | `button/DTHFUI-123` |
| LTS | `{componente}/{id-issue}-v{VERSAO_LTS}` | `button/DTHFUI-123-v21` |

## Rebase obrigatório

- Não usar `git merge` para atualizar branches com mudanças upstream.
- Usar sempre `git pull --rebase origin [target-branch]` antes de criar ou atualizar a branch de trabalho.
- O objetivo é manter os commits da alteração no topo da versão alvo e evitar poluição no histórico.

## Fase A — Latest

1. Fazer checkout da `main`.
2. Atualizar com `git pull --rebase`.
3. Criar branch no padrão `{componente}/{id-issue}`.
4. Implementar a correção.
5. Abrir PR com destino para `main`, quando autorizado.

## Fase B — LTS

1. Fazer checkout da branch base LTS, por exemplo `21.x.x`.
2. Executar `git pull --rebase origin [lts-base-branch]`.
3. Criar branch `{componente}/{id-issue}-v{VERSAO_LTS}`.
4. Aplicar `git cherry-pick <hash>` usando o commit da branch Latest.
5. Em caso de conflito, resolver, executar `git add .` e continuar com `git cherry-pick --continue`.

## Histórico e PRs

- A entrega final deve conter apenas um commit quando possível.
- Usar `git rebase -i HEAD~[N]` para squash de commits de ajuste.
- Usar `git push -f` apenas após confirmação explícita quando envolver branch remota existente.
- Branches Latest devem apontar para `main`.
- Branches LTS devem apontar para a branch base LTS correspondente.
