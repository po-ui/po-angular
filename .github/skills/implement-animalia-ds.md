# Skill: Implementar Definições do Animalia DS em Componente

## Descrição
Implementa as definições visuais do Animalia DS em um componente PO UI existente.

## Pré-requisitos
- Consultar a especificação do componente em https://doc.animaliads.io/docs/components/
- Verificar quais estados estão especificados: Enable, Disable, Static, Hover, Focus, Active, Loading

## Passos

### No repositório po-style
1. Identificar o arquivo CSS do componente em `src/css/components/po-<nome>/`
2. Atualizar os estilos para seguir as definições do Animalia DS
3. Remover variáveis CSS legacy que não são mais necessárias
4. Documentar variáveis removidas como BREAKING CHANGE no commit

### No repositório po-angular
1. Atualizar o `-base.component.ts` do componente
2. Atualizar a tabela de tokens CSS customizáveis no JSDoc
3. Adicionar referência ao Animalia DS na documentação de acessibilidade
4. Atualizar testes para cobrir os novos estilos/estados
5. Verificar conformidade com níveis de acessibilidade AA e AAA

## Convenções de Commit
```
feat(<componente>): implementa definições do AnimaliaDS
```

## Ícones
- Usar prefixo `an an-*` (Animalia Icons)
- Dicionário em `projects/ui/src/lib/components/po-icon/po-icon-dictionary.ts`
- Nunca usar prefixo `po-icon` (removido na v21)
