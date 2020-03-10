# Contribuindo com o Portinari

## Conteúdo

- [Introdução](#introduction)
- [Fluxo](#flow)
- [Regras para criação de _branchs_](#branchs)
- [Regras para criação de _commits_](#commits)
  - [Tipo](#type)
  - [Escopo](#scope)
  - [Descrição curta](#short-description)
  - [Corpo](#body)
  - [Rodapé](#footer)
  - [_Breaking Changes_](#breaking-changes)
  - [Exemplos de descrições de commits completos](#commit-example)
- [Regras para criação de _Pull Requests_](#pull-requests)
  - [Componente](#componente)
  - [Número da ISSUE](#issue-number)
  - [_PR Checklist_](#pr-checklist)
  - [Qual o comportamento atual?](#current-behavior)
  - [Qual o novo comportamento?](#new-behavior)
  - [Simulação](#simulation)

<a id="introduction"></a>

## Introdução

Este guia tem por objetivo definir as regras para criação de _Branchs_, _Pull Requests_ e _Commits_ no projeto Portinari.
Para seguir o guia é fundamental o conhecimento da [ferramenta Git](https://git-scm.com/book/en/v2).

<a id="flow"></a>

## Fluxo

1. A primeira etapa consiste em avaliar se nas [_Pull Requests_ do Portinari](https://github.com/portinariui/portinari-angular/pulls) não tem nenhuma outra submissão anterior que resolve o problema, eliminando assim a duplicidade.
2. Com o repositório atualizado, deve-se [gerar a _branch_](#branchs) ou _fork_ que conterá as alterações necessárias dependendo do seu tipo de usuário:

- Para membros do Core Team do Portinari deve ser gerada uma [_branch_](#branchs);
- Para os demais contribuintes do projeto deve-se optar por _fork_.

3. Próximo passo é gerar as alterações e ao finalizar deve-se rodar os testes.

- É muito importante analisar os documentos [**STYLEGUIDE**](https://github.com/portinariui/portinari-angular/blob/master/STYLEGUIDE.md) e [**HOW_TO_DOCUMENT**](https://github.com/portinariui/portinari-angular/blob/master/HOW_TO_DOCUMENT.md) antes de iniciar o desenvolvimento para que a contribuição seja mais rápida e eficiente.

4. Finalizando a etapa anterior deve-se gerar o _commit_ e verificar se foi gerado apenas um [_commit_ final](#commits).
5. Próximo passo é gerar a [_Pull Request_](#pull-requests) preenchendo os campos necessários.
6. Depois é só aguardar aprovação.
7. Caso tiver alguma sugestão deve-se fazer as atualizações necessárias e rodar os testes novamente.
8. Faça um _rebase_ e em seguida faça um _push_ com as alterações e aguarde a aprovação.
9. Caso seja aprovado, parabéns, sua alteração já estará na _branch master_ do Portinari.

<a id="branchs"></a>

## Regras para criação da _Branch_

Antes de criar uma nova _branch_ deve-se assegurar de estar na _branch master_ do projeto.
Caso já esteja na _master_ rode o comando:

```
git pull
```

Se não retornar nenhum erro ela estará atualizada e é hora de criar a _branch_ no projeto Portinari. Para isso rode o comando:

```
git checkout -b <COMPONENTE>/<ISSUE>
```

Onde o `<COMPONENTE>` deve conter o nome do componente e não o projeto onde ele se encontra. E a `<ISSUE>` é o número da ocorrência a qual se refere a alteração.
Exemplos:

Caso a ISSUE seja gerada no Jira:

```
git checkout -b po-button/DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub:

```
git checkout -b po-button/235
```

Caso não exista uma ISSUE definida, crie a _branch_ com o nome do desenvolvedor ou o nome do time e não esqueça de detalhar o que está sendo sugerido na descrição da _Pull Request_. Para isso rode o comando:

```
git checkout -b <COMPONENT>/<DEV|TEAM>
```

Exemplo:

```
git checkout -b po-button/fulano
```

<a id="commits"></a>

## Regras para criação de _Commits_

A descrição dos _commits_ podem ser feitos em português ou inglês.

> Caso durante o desenvolvimento da melhoria ou correção forem gerados vários _commits_ deve-se utilizar o comando _rebase_ do git com a opção de _squash_ para que o mesmo transforme em apenas um _commit_ antes de gerar a _Pull Request_. Segue documentação: [Git rebase](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History).

Deve-se seguir um padrão para criação dos _commits_:

```
<TIPO>(ESCOPO): <DESCRIÇÃO CURTA>
<LINHA EM BRANCO>
<CORPO>
<LINHA EM BRANCO>
<RODAPÉ>
```

Agora vamos detalhar melhor o que deve ser descrito em cada parte:

<a id="type"></a>

### Tipo

Deve ser utilizado um dos tipos descritos abaixo conforme o objetivo da alteração:

- build (quando a alteração está relacionada ao _build_);
- docs (quando a alteração for na documentação);
- feat (quando for uma melhoria, for criada uma nova funcionalidade ou um novo componente);
- fix (para correção de _bugs_);
- perf (quando o item é gerado para melhoria de performance);
- refactor (quando for feito uma refatoração ou aplicação de boas práticas);
- test (quando forem adicionados ou refatorados os testes);
- style (quando realizar mudanças que não alteram o significado do código como espaço em branco, formatação e etc)

> Nunca colocar espaço entre a descrição do tipo e a abertura de parênteses do escopo.

<a id="scope"></a>

### Escopo

No escopo deverá ser definido o nome do componente ou serviço diretamente afetado pelo _commit_, caso mais de um componente seja afetado, deve-se definir o principal. Não deve ser utilizado o prefixo na nomenclatura, por exemplo:

Corretos:
(button): , (event-sourcing): , (avatar): , ...

Errados:
(po-button): , (po-event-sourcing): , (po-avatar): , ...

> Sempre deve estar entre parênteses e após o fechamento do parênteses deve-se colocar dois pontos e um espaço.

<a id="short-description"></a>

### Descrição curta

- Deve-se colocar uma breve descrição do que foi feito no _commit_.
- Nunca iniciar a descrição com letra maiúscula.
- Nunca deve utilizar ponto final na descrição.
- Deve-se utilizar o modo imperativo na descrição.
- Não deve-se ultrapassar 72 caracteres na soma dos caracteres do tipo, escopo e descrição curta.

por exemplo:

Corretas:

```
adiciona nova funcionalidade
```

```
remove variável não mais utilizada
```

Erradas:

```
Adicionada nova funcionalidade.
```

```
Removida variável não mais utilizada no componente po-button devido a quebra no uso do mesmo.
```

<a id="body"></a>

### Corpo

- Deve-se utilizar o modo imperativo na descrição.
- Deve-se quebrar linha a cada 72 caracteres para que a mesma não seja cortada no GitHub.
- Deve descrever a motivação que levou a mudança e também o que foi alterado em relação ao comportamento anterior.

> Antes da declaração do corpo deve-se deixar uma linha em branco.

<a id="footer"></a>

### Rodapé

No rodapé deve-se colocar a palavra `Fixes` e em seguida o número da ISSUE atendida. Exemplos:

Caso a ISSUE seja gerada no Jira:

```
Fixes DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub e no Jira:

```
Fixes #235, DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub:

```
Fixes #235, #456, #665
```

> Antes da declaração do rodapé deve-se deixar uma linha em branco.

<a id="breaking-changes"></a>

### _Breaking Changes_

- As _breaking changes_ devem ser declaradas no rodapé uma linha após a declaração do _Fixes_.
- Deve iniciar utilizando "BREAKING CHANGES: " e após o espaço colocar uma breve descrição da quebra iniciando sempre com caractere minúsculo e não colocar ponto final.
- Deve-se pular uma linha após a breve descrição e iniciar a descrição do que deve ser migrado ou alterado.
- Deve-se quebrar linha a cada 72 caracteres para que a mesma não seja cortada no GitHub.
- O tipo do item de _breaking change_ depende do que está sendo implementado, por exemplo, caso for apenas removida alguma propriedade o tipo deve ser definido como _refactor_, caso ao corrigir um problema seja gerado um _breaking change_ então o tipo deve ser definido como _fix_.

<a id="commit-example"></a>

### Exemplos de descrições de _commits_ completos

Sem _Breaking Changes_:

```
feat(button): adiciona a propriedade p-size

O componente po-button apenas aceita o uso das classes de grid do
Portinari para definir sua largura, não permitindo assim fazer um ajuste
fino.
Adiciona a propriedade size para que o componente possa receber um valor
em pixels fixo para sua largura.

Fixes DTHFUI-221
```

Com _Breaking Changes_:

```
refactor(button): remove a propriedade p-size

Foi removida a propriedade p-size do componente.

Fixes DTHFUI-225

BREAKING CHANGES: removida propriedade p-size

Foi removida a propriedade p-size do po-button pois o mesmo deve ser
definido através do uso das classes de grid do Portinari.

Antes:
<po-button p-size="md"></po-button>

Depois:
<po-button class="po-md-4"></po-button>
```

<a id="pull-requests"></a>

## Regras para criação de _Pull Requests_

Antes de criar a _Pull Request_ é importante verificar se algumas perguntas foram respondidas:

- Verifique nas [_Pull Requests_ do Portinari](https://github.com/portinariui/portinari-angular/pulls) se nenhuma submissão anterior já resolveu o problema.
- A _Pull Request_ resolveu o problema solicitado na ISSUE?
- Foi gerado apenas um _commit_ para solução do problema? Caso tenha mais de um _commit_ ou o padrão não esteja de acordo deve seguir este [Guia de _commits_](#commits).
- Foram rodados todos os testes unitários da aplicação?

Após essas verificações e tudo estando correto basta gerar a _Pull Request_. Por padrão virá um template onde deverão ser preenchidos alguns requisitos citados abaixo:

<a id="componente"></a>

### Componente

Esse texto deve ser substituído pelo nome do componente diretamente afetado pela alteração gerada na _Pull Request_.
Exemplos:

```
po-modal
```

```
po-button
```

<a id="issue-number"></a>

### Número da ISSUE

Esse texto deve ser substituído pelo número da ISSUE gerada no Jira ou no GitHub.
Exemplos:

```
DTHFUI-577
```

```
#334
```

<a id="pr-checklist"></a>

### PR Checklist

Deve-se adicionar um `x` dentro dos colchetes sem deixar espaço em cada um dos itens que forem alterados na _Pull Request_.
Exemplo:

```
- [x] Código
- [x] Testes unitários
- [ ] Documentação
- [x] Samples
```

<a id="current-behavior"></a>

### Qual o comportamento atual?

Deve-se descrever o atual comportamento e o motivo que levou a gerar a alteração.

Exemplo:

```
O po-modal não está permitindo definir uma largura maior que 768px. Está gerando problema pois ao criar um formulário maior gera-se um scroll dificultando a visualização do cliente.
```

<a id="new-behavior"></a>

### Qual o novo comportamento?

Deve-se descrever o novo comportamento gerado, bem como o que e como foi alterado para solucionar o motivo que foi descrito no comportamento atual.

Exemplo:

```
Criação do novo valor "full" na propriedade p-size.
Este valor serve para poder deixar o po-modal ter o tamanho conforme o conteúdo sem a limitação de tamanho.
```

<a id="simulation"></a>

### Simulação

Aqui deve-se descrever sugestões de formas de validar a alteração gerada.

Exemplo:

```
Esta correção pode ser validada utilizando o sample labs no portal
```

> Além desses requisitos podem ser adicionados tópicos para facilitar o entendimento da _Pull Request_. Exemplo: Observações, definições, links...

Após gerar a _Pull Request_ é só aguardar aprovação. Caso tiver alguma sugestão deve-se fazer as atualizações necessárias e rodar os testes novamente.
Faça um _rebase_ e em seguida faça um _push_ com as alterações e aguarde a aprovação.
Caso seja aprovado, parabéns, sua alteração já estará na _branch master_ do Portinari.
