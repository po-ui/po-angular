# Estudo: categorias no menu de documentação do portal (caminho: tags JSDoc)

> Estudo, sem mudança de código. Pasta `docs-study/` não commitada.
> Base: checkout `/home/luizvasconcellos/workspace/po-angular`, branch `feat/portal-global-search` (`7455a7c8`).
> **Decisão do usuário:** as categorias ficam em **tags JSDoc no código-fonte** (não num arquivo de mapa do portal). As 6 perguntas foram respondidas (seção 12, "Decisões tomadas"). Fica **a confirmar** só onde os subcomponentes aparecem na listagem "API Reference" (12.1).
> O `api-list.json` é gerado e ignorado pelo git; foi gerado com `gulp build:api` num worktree em scratch para medir. O teste do `po-menu` rodou no Karma do portal, sem commit.

## 1. Como o menu é montado hoje

```
JSDoc das libs -> Dgeni (docs-grouper.js) -> src/assets/json/api-list.json
  -> DocumentationComponent: http.get('./assets/json/api-list.json')
  -> MenuComponentsService.getMenus(items) -> <po-menu [p-menus] p-filter>
```

| Peça | Caminho | Papel |
|---|---|---|
| Grupos e lista | `projects/portal/docs/processors/docs-grouper.js` | agrupa os docs pelo nome do arquivo e grava `api-list.json` (`name, title, type, types, module, path, preview, hasSamples`) |
| Menu | `projects/portal/docs/templates/menu-components.service.template.ts` | **fonte real**: o `gulp build:menus` copia o template por cima de `src/app/documentation/menu-components.service.ts` |
| Tela | `projects/portal/src/app/documentation/documentation.component.html` | `<po-menu [p-menus]="menus" p-filter>` |

Hoje: 6 grupos (Componentes 87, Ferramentas para I.A. 2, Diretivas 15, Interceptors 2, Serviços 9, Modelos de Dados 5), em ordem alfabética. O grupo vem do `type` (a pasta do arquivo).

## 2. Desenho das tags

### Tags já usadas no repo (não reaproveitar nomes)

| Tag | Uso | Tag | Uso |
|---|---|---|---|
| `@description` | 1858 | `@deprecated` | 65 |
| `@optional` | 1145 | `@throws` | 7 |
| `@default` | 607 | `@override` | 7 |
| `@param` | 373 | `@ignoreExtendedDescription` | 6 |
| `@usedBy` | 273 | `@examplePrivate` | 3 |
| `@docsPrivate` | 152 | `@todo`, `@see`, `@return`, `@internal` | 1–2 |
| `@docsExtends` | 120 | | |
| `@returns`, `@example` | 109, 101 | | |

Registradas no Dgeni (`projects/portal/docs/configuration.js > customTags`): `docsPrivate, runnableExample, example, examplePrivate, description, docsExtends, ignoreExtendedDescription, usedBy, optional, default, override`. As novas seguem o prefixo `docs*` já usado e não colidem.

### Tags propostas (4)

| Tag | Valor | Repete? | Quem usa | Exemplo |
|---|---|---|---|---|
| `@docsCategory` | chave da categoria | não | todo item que aparece no menu (101) | `@docsCategory form` |
| `@docsParent` | rota do pai | não | subcomponente fora do menu (17) | `@docsParent po-table` |
| `@docsShortcut` | chave de outra categoria | sim | item que também aparece em outra categoria (5) | `@docsShortcut tables-lists` |
| `@docsOrder` | inteiro ≥ 1 | não | **ninguém por enquanto**; só para dar prioridade a um item experimental ou importante dentro da categoria (decisão 2) | `@docsOrder 1` |

- **Sem `@docsSection`:** cada chave de categoria pertence a uma única seção no vocabulário (seção 4), então a seção é derivada. Uma tag a menos em 101 arquivos, e não há como ficar "seção X com categoria de Y".
- `@docsCategory` e `@docsParent` se excluem: ou o item está no menu, ou é sub.

### Chave (slug) x texto livre

| | Chave (`form`) + rótulo no portal (recomendado) | Texto livre (`Formulário`) |
|---|---|---|
| Erro de digitação | o build compara com a lista fechada e falha na hora | `Formulario` x `Formulário` x `formulário` viram categorias diferentes, a menos que se valide do mesmo jeito |
| Renomear rótulo | 1 linha no vocabulário | editar todos os arquivos da categoria |
| i18n | rótulo por idioma no vocabulário, se um dia houver | texto preso em português no código |
| Leitura no código | menos óbvia (`tables-lists`) | óbvia |

**Recomendação: chave em inglês, kebab-case**, com o rótulo em português no vocabulário.

### Chaves

| Seção (rótulo) | Chave da seção | Categorias: chave → rótulo |
|---|---|---|
| Componentes | `components` | `actions` Ações · `form` Formulário · `selection` Seleção · `date-time` Data e hora · `search-filters` Busca e filtros · `tables-lists` Tabelas e listas · `visual` Elementos visuais · `charts` Gráficos · `containers` Contêineres · `navigation` Navegação · `feedback` Feedback · `overlay` Sobreposição |
| Templates de página | `page-templates` | `pages` Páginas · `auth` Autenticação |
| Componentes dinâmicos | `dynamic` | `dynamic` (seção sem subnível) |
| Utilitários | `utilities` | `directives` Diretivas · `services` Serviços · `interceptors` Interceptors · `models` Modelos de dados |
| Ferramentas para IA | `ai-tools` | fixa no template (LLMS e MCP não vêm do JSDoc) |

### Onde a tag fica: a classe pública do grupo

O Dgeni agrupa pelo nome do arquivo (`po-button.component.ts` → grupo `po-button`). A tag vai no JSDoc da **classe concreta pública** desse arquivo, que hoje já tem `@docsExtends`/`@example` (71 itens) ou `@description`. Ela não vai na `*-base.component.ts`: arquivos `*-base*` não viram grupo (o grouper ignora nomes com `base`), e várias bases são compartilhadas.

Exceção conferida: o grupo `po-dialog` junta `po-dialog.component.ts` (`@docsPrivate` na prática) e `po-dialog.service.ts`. A tag fica no `PoDialogService`.

**Exemplo 1 — componente comum:** `projects/ui/src/lib/components/po-button/po-button.component.ts`, classe `PoButtonComponent` (JSDoc na linha 11):

```ts
/**
 * @docsExtends PoButtonBaseComponent
 *
 * @example
 *
 * <example name="po-button-basic" title="PO Button Basic">
 * ...
 * </example>
 *
 * @docsCategory actions
 */
@Component({ selector: 'po-button', ... })
export class PoButtonComponent extends PoButtonBaseComponent {
```

**Exemplo 2 — subcomponente:** `projects/ui/src/lib/components/po-accordion/po-accordion-item/po-accordion-item.component.ts`, classe `PoAccordionItemComponent` (JSDoc na linha 18):

```ts
/**
 * @description
 *
 * Componente utilizado para renderizar os itens do `po-accordion`.
 * ...
 *  }
 * ```
 *
 * @docsParent po-accordion
 */
@Component({ selector: 'po-accordion-item', ... })
export class PoAccordionItemComponent implements OnDestroy {
```

**Exemplo 3 — com atalho:** `projects/ui/src/lib/directives/po-tooltip/po-tooltip.directive.ts`, classe `PoTooltipDirective` (JSDoc na linha 9):

```ts
/**
 * @docsExtends PoTooltipBaseDirective
 *
 * @example
 * ...
 * </example>
 *
 * @docsCategory directives
 * @docsShortcut overlay
 */
@Directive({ selector: '[p-tooltip]', ... })
export class PoTooltipDirective extends PoTooltipBaseDirective implements OnInit, OnDestroy {
```

> **Posição: sempre no fim do bloco, logo antes do `*/`.** No Dgeni, o valor de uma tag vai até a próxima tag. Se a tag nova entrasse no começo ou no meio, ela "engoliria" o texto do `@description`, ou o texto livre do início do bloco viraria parte dela. No fim, o valor é só o que está na linha, e as tags de antes (`@example`, `@description`, `@usedBy`) terminam onde a nova começa. Contagem aproximada (script simples, pode ter pegado a classe errada em arquivos com várias classes): os blocos começam com `@docsExtends` (~72), `@description` (~17), texto livre (~12) e `@usedBy` (~11), então "no começo" não seria seguro em todos.

## 3. Dgeni: registro, leitura e herança

**Registro:** em `projects/portal/docs/configuration.js > customTags`, que o `index.js` já concatena em `parseTagsProcessor.tagDefinitions`:

```js
{ name: 'docsCategory' },
{ name: 'docsParent' },
{ name: 'docsShortcut', multi: true },  // multi: o extract-tags do dgeni-packages devolve array
{ name: 'docsOrder' }                    // implementada, mas nenhum arquivo a usa agora (decisão 2)
```

O `extract-tags` grava cada valor em `doc.docsCategory`, `doc.docsParent` e `doc.docsShortcut` (array). Sem registro, o Dgeni só avisa "Invalid tags found" e ignora a tag.

**Leitura**, no `projects/portal/docs/processors/docs-grouper.js`:
- No laço que monta os grupos, para cada doc do grupo **que não seja `docsPrivate`**, copiar `docsCategory`, `docsParent` e `docsShortcut` para o `group` (primeiro valor encontrado).
- **Cuidado:** hoje o `filesInfo` (que vira o `api-list.json`) é empurrado no **primeiro** doc do grupo. No `po-dialog`, o primeiro é o componente privado. A entrada precisa ser montada **depois do laço**, com os valores do grupo inteiro.
- Depois do laço:
  - resolver `section` pelo vocabulário;
  - montar `children` do pai a partir dos `docsParent` (lista invertida);
  - validar (seção 5);
  - gravar no `api-list.json`: `category`, `categoryLabel`, `section`, `sectionLabel`, `shortcuts` (chaves), `parent` e `order` (só se houver `@docsOrder`).

**Herança (`@docsExtends`):**
- O `functions.processClassBasics` só copia propriedades, métodos e descrição da classe base. As tags `@docs*` **não são herdadas**, e é o que se quer: a categoria é do item, não da base. Muitas bases são compartilhadas, como `PoInputGeneric`, que serve a vários campos.
- **Não** adicionar herança. Se a classe concreta não tiver tag, a validação acusa.

**Diretivas, serviços, interceptors e models:** são grupos como os componentes e recebem `@docsCategory` com as chaves de Utilitários (ou de Componentes, como o `po-field-validate`, que vira `form`).

**Interfaces e enums:** não viram item de menu, porque entram no grupo do componente via `@usedBy`. **Não** recebem tag. Se receberem, é um aviso: "tag ignorada em interface".

**Arquivos do gerador que mudam:**

| Arquivo | Mudança |
|---|---|
| `projects/portal/docs/configuration.js` | 3 (ou 4) `customTags` |
| `projects/portal/docs/docs-categories.js` (novo) | vocabulário fechado: seções e categorias, chave → rótulo, ordem |
| `projects/portal/docs/processors/helpers/docs-menu.js` (novo) | função pura `resolveDocsMenu(groups, vocab)` → `{ entries, errors, warnings }` (testável em Node) |
| `projects/portal/docs/processors/docs-grouper.js` | ler as tags no grupo, montar `filesInfo` depois do laço, chamar `resolveDocsMenu`, falhar o build se houver erro |
| `projects/portal/docs/templates/api/componentGroup.template.html` | bloco "Subcomponentes" (do `group.children`) e "Faz parte de [pai]" (do `group.parent`) |
| `projects/portal/docs/templates/menu-components.service.template.ts` | montar Seção › Categoria › Item (seção 4) |
| `projects/portal/docs/processors/search/search-index-builder.js` (opcional) | nome da página do sub com o pai ("PoTable › Table Cell Template") |
| `projects/portal/src/app/documentation/documentation.class.ts` | campos novos no tipo `Documentation` |
| `projects/portal/docs/processors/helpers/docs-menu.spec.js` (novo) | testes Jasmine (Node) |

## 4. Template do menu

O `menu-components.service.template.ts` passa a ler do `api-list.json` os campos já resolvidos pelo gerador. Os rótulos e a ordem vêm do JSON, então o portal não repete o vocabulário.

```ts
@Injectable({ providedIn: 'root' })
export class MenuComponentsService {
  private readonly router = inject(Router);

  getMenus(docs: Array<Documentation>): Array<PoMenuItem> {
    const link = (d: Documentation) => '/documentation/' + d.name;
    const label = (d: Documentation) => d.title.replace('Po ', '');
    const inMenu = docs.filter(d => d.category && !d.parent);

    // seções e categorias na ordem do vocabulário; itens: primeiro os com `order` (menor primeiro),
    // depois o resto em ordem alfabética pelo rótulo (decisão 2); item sem categoria vai para Outros
    return groupBy(inMenu, 'section').map(section => ({
      label: section.label,
      subItems: groupBy(section.items, 'category').map(cat => ({
        label: cat.label,
        subItems: [
          ...cat.items.map(d => ({ label: label(d), link: link(d) })),
          // atalho: action, SEM link -> pela URL só o canônico é marcado (teste da seção 6)
          ...docs
            .filter(d => d.shortcuts?.includes(cat.key))
            .map(d => ({ label: label(d), action: () => this.router.navigateByUrl(link(d)) }))
        ]
      }))
    })).concat(IA_FIXA); // { label: 'Ferramentas para IA', subItems: [LLMS, MCP] }
  }
}
```

- **Ordem (decisão 2):**

  ```ts
  const byOrderThenLabel = (a, b) =>
    (a.order ?? Infinity) - (b.order ?? Infinity) ||
    label(a).localeCompare(label(b), 'pt-BR', { sensitivity: 'base' });
  ```

  - Com `@docsOrder`: vem antes, do menor para o maior número.
  - Empate de número: alfabético.
  - Sem `@docsOrder` (todos, hoje): alfabético pelo rótulo, sem diferenciar acento nem caixa.
  - O atalho entra na mesma ordenação da categoria onde aparece, pelo próprio rótulo. O `@docsOrder` de um item vale **só** na categoria dele, não onde ele é atalho.
- **"Outros" (decisão 5):** item sem `@docsCategory` nem `@docsParent` cai numa categoria `others` ("Outros"), a última da seção Componentes. Assim nada some do menu.
- **Seção sem categoria** (`dynamic`): um nível só, Seção › Item.
- **Subcomponentes** (`parent` preenchido) ficam fora do menu, mas as rotas continuam existindo.
- **Arquivo a editar:** o template, não o `src/` (o build o sobrescreve).

## 5. Validação no build

**Onde mora a lista fechada:** `projects/portal/docs/docs-categories.js`. É vocabulário, não o mapa dos itens: os itens continuam carregando a tag.

| Caso | Regra | Resultado |
|---|---|---|
| Valor de `@docsCategory`/`@docsShortcut` fora da lista | erro | build falha: "po-input.component.ts: categoria 'from' não existe (válidas: actions, form, …)" |
| Item do menu sem `@docsCategory` nem `@docsParent` | **aviso** (decisão 5) | não quebra: `WARN po-novo.component.ts sem @docsCategory/@docsParent -> Outros` no log do build e do CI |
| `@docsParent` aponta para rota que não existe | erro | "po-table-cell-template: pai 'po-tabel' não existe" |
| `@docsParent` aponta para outro subcomponente (cadeia) | erro | um nível só |
| `@docsCategory` e `@docsParent` no mesmo item | erro | — |
| `@docsShortcut` igual à própria `@docsCategory` | erro | — |
| `@docsOrder` que não é inteiro ≥ 1 (`alto`, `0`, `1.5`) | erro | "po-x: @docsOrder precisa ser inteiro ≥ 1" |
| Dois itens com o mesmo `@docsOrder` na mesma categoria | aviso | desempata pelo rótulo |
| `@docsOrder` num subcomponente | aviso | ignorado (sub não está no menu) |
| Tag em interface/enum/classe privada | aviso | ignorada |
| Subcomponente sem pai | não detectável sozinho: para o build, "sem tag" é o caso da linha 2. O teste de aceitação (abaixo) confere os 17 conhecidos | — |

O gerador lança erro no `componentGrouper` só para os casos de **erro**, como já faz a guarda do índice de busca (`search-index-generator.js`). Assim o `gulp build` e o CI param. Os **avisos** só vão para o log.

**Por que valor inválido continua erro (recomendação, não é ambíguo):**
- A falta de tag é um esquecimento. O item ainda aparece, em "Outros", e o aviso lembra quem criou.
- Um valor inválido é um erro de quem escreveu a tag. Categoria com erro de digitação, pai que não existe ou ordem que não é número poria o item num lugar errado, ou o tiraria do menu, sem ninguém notar.
- Parar o build aponta o arquivo exato, e a correção é de uma linha.

**Teste Jasmine em Node** (`projects/portal/docs/processors/helpers/docs-menu.spec.js`, roda em `npm run test:portal:docs`):

```js
const { resolveDocsMenu } = require('./docs-menu');
const vocab = require('../../docs-categories');

const group = (name, tags = {}, type = 'components') => ({ name, componentName: name, fileType: type, ...tags });

it('resolve seção pela categoria e liga sub ao pai', () => {
  const { entries, errors } = resolveDocsMenu(
    [group('po-table', { docsCategory: 'tables-lists' }), group('po-table-cell-template', { docsParent: 'po-table' }, 'directives')],
    vocab
  );
  expect(errors).toEqual([]);
  expect(entries.find(e => e.name === 'po-table')).toEqual(jasmine.objectContaining({ section: 'components', children: ['po-table-cell-template'] }));
});

it('acusa categoria desconhecida, pai inexistente e tag em conflito', () => {
  const { errors } = resolveDocsMenu(
    [group('a', { docsCategory: 'from' }), group('b', { docsParent: 'nao-existe' }), group('c', { docsCategory: 'form', docsParent: 'a' })],
    vocab
  );
  expect(errors.map(e => e.code)).toEqual(['unknown-category', 'parent-not-found', 'category-and-parent']);
});

it('sem tag: só aviso e vai para Outros', () => {
  const { entries, errors, warnings } = resolveDocsMenu([group('po-novo')], vocab);
  expect(errors).toEqual([]);
  expect(warnings.map(w => w.code)).toEqual(['missing-category']);
  expect(entries[0]).toEqual(jasmine.objectContaining({ category: 'others', section: 'components' }));
});

it('@docsOrder: inteiro >= 1; com ordem primeiro, o resto alfabético', () => {
  const bad = resolveDocsMenu([group('a', { docsCategory: 'form', docsOrder: '1.5' })], vocab);
  expect(bad.errors.map(e => e.code)).toEqual(['invalid-order']);

  const { entries } = resolveDocsMenu(
    [group('po-url', { docsCategory: 'form' }), group('po-email', { docsCategory: 'form' }), group('po-novo', { docsCategory: 'form', docsOrder: '1' })],
    vocab
  );
  expect(sortForMenu(entries.filter(e => e.category === 'form')).map(e => e.name)).toEqual(['po-novo', 'po-email', 'po-url']);
});
```

**Teste de aceitação:** lê o `api-list.json` gerado e confere a tabela do usuário: 101 itens no menu (já sem o Gauge), 17 subs com o pai certo, 5 atalhos, nenhum item em "Outros" e nenhum `order`. Ele roda depois do `build:api` no CI e trava regressões quando alguém apagar uma tag.

## 6. Atalhos: teste real do `po-menu` com rota repetida (feito)

Teste Karma no portal, com `/documentation/po-tooltip` em dois lugares: **Componentes › Sobreposição › Tooltip (atalho)** e **Utilitários › Diretivas › Tooltip**.

| Passo | Item marcado | Grupos abertos |
|---|---|---|
| Clique no canônico | Tooltip (canônico) | Utilitários, Diretivas |
| Clique no atalho | Tooltip (atalho) | Componentes, Sobreposição |
| Sair e voltar pela URL | **Tooltip (atalho)** | **Componentes, Sobreposição** |
| Filtro "tooltip" | aparecem os **dois** | — |

Por quê:
1. O `po-menu` marca o item pelo `id` (uuid), e não pelo `link`.
2. Pela URL (`activateMenuByUrl`), ele percorre a árvore em ordem e para no **primeiro** link igual. Componentes vem antes, então o atalho vence.
3. O filtro lista todo item com `link` ou `action`.

O `PoMenuItem` tem `label`, `link`, `action`, `subItems` (até 4 níveis), `icon` (só no 1º nível), `shortLabel` e `badge`. Não tem atalho nem "ativo por outra rota".

**Solução:** atalho com `action: () => router.navigateByUrl(...)` e **sem `link`**. Pela URL, só o canônico é marcado. O filtro ainda mostra o atalho, e o botão do meio do mouse não abre em nova aba nesse item.

### 6.1 Marca visual do atalho (decisão 3: ícone da biblioteca do PO UI)

**O que o `po-menu` aceita hoje** (`po-menu-item.component.html`):

| Recurso | Onde aparece | Serve para o atalho? |
|---|---|---|
| `icon` | **só no 1º nível** (`@if (level === 1 && icon)`), à esquerda do rótulo | não: os atalhos ficam no 3º nível |
| `badge` | à direita do rótulo, em qualquer nível | não: `PoMenuItemBadge.value` é **número** (`convertToInt`), não aceita ícone nem texto |
| `shortLabel` | tooltip do menu colapsado | não |
| `label` | texto puro (`{{ label }}`), que vira também o `aria-label` do item | só com caractere no texto |

**Ícones reais** da biblioteca `@animaliads/animalia-icon` (a mesma da página `/icons`), conferidos no `selection.json` e no CSS do `@po-ui/style`:

| Ícone (classe exata) | Leitura | Recomendação |
|---|---|---|
| `an an-arrow-bend-up-right` | "desvia para outro lugar" | **1ª opção**: lê como atalho/redirecionamento, sem sugerir site externo |
| `an an-arrow-up-right` | seta diagonal simples | 2ª opção, mais discreta |
| `an an-arrow-square-out` | "abre fora" | evitar: na web costuma significar link externo / nova aba |

(Também existem `an-link-simple`, `an-arrow-elbow-up-right`, `an-arrow-u-up-right`, `an-signpost`. Não existe nenhum `an-shortcut`.)

**Onde:** à direita do rótulo, no mesmo lugar do badge (`po-menu-badge-align`), pequeno e na cor do texto secundário.

**Texto acessível:** o `aria-label` do item vira "Tooltip, atalho para Utilitários › Diretivas". O ícone fica `aria-hidden="true"`.

Como o `po-menu` não aceita ícone em subitem, há três caminhos:

| Caminho | Como | Custo | Prós | Contras |
|---|---|---|---|---|
| **A. Mudar o `po-menu`** (recomendado) | `PoMenuItem` ganha um ícone à direita em qualquer nível (ex.: `suffixIcon: 'an an-arrow-bend-up-right'`) e um `ariaLabel` opcional; o template renderiza `<po-icon aria-hidden="true">` depois do rótulo | **M** (lib `ui`: interface, template, CSS no `@po-ui/style` ou no componente, testes com 99% de cobertura, documentação) | limpo, acessível, serve a qualquer app do PO UI | precisa de release da lib; mexe em componente público |
| B. Sufixo no `label` | `label: 'Tooltip ↗'` (caractere Unicode, não é ícone do PO UI) | **P** | zero código novo | não é ícone da biblioteca; o leitor de tela lê o caractere ("seta…") ou o ignora; não há como dizer "atalho para Utilitários" |
| C. Decorar no portal em runtime | serviço do portal acha o item no DOM do menu e injeta `<i class="an an-arrow-bend-up-right">` + troca o `aria-label` | **M** | sem mudar a lib | frágil: depende do HTML interno do `po-menu`, e o menu recria itens ao filtrar e ao colapsar (precisa de `MutationObserver`) |

Recomendação: **A**. Se a mudança na lib não couber nesta entrega, usar **B** como provisório e trocar depois. **C** não vale o risco.

### 6.2 Página de subcomponente marca o pai (decisão 4)

**Como:**
- O `DocumentationComponent` passa a ouvir o `NavigationEnd`.
- Se a página aberta tem `parent` no `api-list.json` (vindo do `@docsParent`), ele chama no `po-menu` o método público `activateMenuByUrl('/documentation/<pai>', menu.menus)`.
- Ele chama também uma vez depois que o menu carrega, porque o `api-list.json` chega por HTTP.
- O `po-menu` não tem outro jeito de marcar um item por programa, nem item oculto.
- Como o sub não está mais no menu, a busca do próprio `po-menu` pela URL não acha nada, e só o pai fica marcado.

```ts
@ViewChild('userMenu') menu?: PoMenuComponent;

private markParent(): void {
  const name = this.router.url.split(/[?#]/)[0].split('/').pop();
  const parent = this.parentOf.get(name);          // montado do api-list.json

  if (parent && this.menu) {
    this.menu.activateMenuByUrl(`/documentation/${parent}`, this.menu.menus);
  }
}
```

**Teste (scratch, sem commit):** build de produção do portal com essa mudança temporária, os subs tirados do menu (simulando o menu novo) e Chrome headless.

| Página aberta | Item marcado | Grupo aberto |
|---|---|---|
| `/documentation/po-table` (pai) | Table | Componentes |
| `/documentation/po-table-cell-template` (sub, pela URL) | **Table** | Componentes |
| `po-table` → link "po-table-cell-template" dentro da página | **Table** | Componentes |
| `/documentation/po-tab` (sub de Tabs) | **Tabs** | Componentes |
| `/documentation/po-step` (sub de Stepper) | **Stepper** | Componentes |
| clique em "List View" depois | List View | Componentes |

Com os subs ainda no menu (o menu de hoje), quem ganha é o item do próprio sub: "Table Cell Template", em Diretivas. Isso confirma que a regra só vale depois que os subs saem do menu.

No Karma (TestBed), o estado interno do `po-menu` ficou certo (`activeMenuItem = Table`, `linkActive = /documentation/po-table`). Mas o DOM não refletiu a marcação pela URL nem para itens comuns, um efeito do ambiente de teste. Por isso a prova é a do build real. O teste Karma da implementação deve conferir o estado interno, e não a classe CSS.

Riscos:
- `activateMenuByUrl` é público, mas **não documentado** (não tem JSDoc de método). Pode mudar numa versão do `po-menu`.
- Mitigação: um teste Karma do portal que quebra se ele mudar, ou pedir para documentá-lo/expor um método oficial (ex.: `activateMenuItemByLink`) na mesma mudança do `po-menu` da 6.1.

## 7. Quantidade de trabalho e script de tags

| Conta | Valor |
|---|---|
| Itens no `api-list.json` | 118 |
| **Arquivos `.ts` que recebem tag** | **118** (1 por grupo: 97 `ui`, 11 `templates`, 7 `sync`, 2 `code-editor`, 1 `storage`) |
| Linhas de tag | 101 `@docsCategory` + 17 `@docsParent` + 5 `@docsShortcut` = **123**; **0** `@docsOrder` (decisão 2) |
| Classes que já usam `@docsExtends` | 71 a 87 (o regex simples falhou em 16 por causa de `forwardRef`; todas têm JSDoc) |

**Script recomendado (viável)**: `projects/portal/docs/scripts/apply-docs-tags.js` (ou só em scratch, se não quiserem versioná-lo), rodado uma vez:
1. Entrada: a tabela do usuário como JSON, com rota → `{ category | parent, shortcuts[] }`.
2. Para cada rota, acha o arquivo do grupo (`<rota>.(component|directive|service|interceptor|model).ts`; no `po-dialog`, o `.service.ts`).
3. Com a API do TypeScript (já instalada), localiza a classe exportada pública e o comentário JSDoc **colado nela**.
4. Insere as linhas ` *` + ` * @docs… valor` **no fim do comentário, antes do `*/`**. Só toca o texto do comentário; se o ponto de inserção não estiver dentro do comentário, aborta.
5. É idempotente: se a tag já existir com o mesmo valor, não faz nada; com valor diferente, avisa e não troca.
6. Depois: `gulp build:api` e o teste de aceitação da seção 5 confirmam que o `api-list.json` bate com a tabela.

**Risco de conflito com outras PRs:** 118 arquivos tocados, mas só 1 a 3 linhas no topo do JSDoc da classe.
- Uma PR que mexa no **mesmo trecho** (outro `@example`, troca do `@docsExtends`) dá conflito trivial.
- Mitigação: aplicar numa PR só, que entra rápido e sem lógica. Com as tags no fim do bloco, o conflito só acontece se outra PR também mexer no fim do JSDoc da classe (ex.: um `@example` novo no fim).
- Se conflitar, descartar a parte das tags e rodar o script de novo após o rebase (ele é idempotente).

## 8. Validação da proposta contra o `api-list.json` real (continua valendo)

O `api-list.json` tem **118 itens** (87 `components`, 15 `directives`, 9 `services`, 5 `models`, 2 `interceptors`).
- 17 subcomponentes e 5 atalhos: todos existem.
- Nenhuma rota canônica repete.
- Nenhum item do JSON fica fora da proposta.

| # | Item | Proposta | Real | Com tags |
|---|---|---|---|---|
| 1 | **Gauge** `po-gauge` | Gráficos | **não existe** (removido; ver 8.1) | **sai da tabela e do plano** (decisão 1). Gráficos fica só com Chart |
| 2 | **Field Validate** `po-field-validate` | Formulário | `type: directives` (hoje em Diretivas) | `@docsCategory form` no `PoFieldValidateModel` (`po-field-validate.model.ts`) resolve |
| 3 | Totais | "100 componentes" | 99 sem o Gauge (87 `components` + 12 diretivas usadas como componente/sub) | — |
| 4 | Rótulo | "Search AI" | título vem do nome: "Search Ai" | a tag não muda o rótulo; ver nota abaixo |

Nota sobre o rótulo: o `title` é montado do nome do arquivo. Para "Search AI" há duas saídas:
- uma tag `@docsLabel` usada uma vez, o que aumenta o vocabulário de tags;
- uma lista de siglas no grouper (`AI`, `I18N`, `URL`).

A segunda é mais barata. Não é preciso decidir agora.

### 8.1 Gauge: confirmação e restos (sem apagar nada)

Confirmado no checkout:
- não há pasta `po-gauge` em `projects/ui/src/lib/components`;
- não há entrada `po-gauge` no `api-list.json` gerado;
- não há rota no `documentation-routing.module.ts` gerado;
- não há pasta de samples nem menção em `llms.txt` / `llms-full.txt`;
- não há nada em `projects/portal/src`.

O que sobra, todo legítimo menos os links:

| Onde | O quê | Situação |
|---|---|---|
| `projects/ui/schematics/ng-update/v22/gauge-*` (html/ts migration, property map, manual test) | migração `<po-gauge>` → `po-chart` | legítimo |
| `projects/ui/src/lib/components/po-chart/enums/po-chart-type.enum.ts:47` | `PoChartType.Gauge = 'gauge'` | legítimo (tipo do chart) |
| `eslint.config.mjs:21-24` | ignora `gauge-manual-test/**` | legítimo |
| `docs/guides/deprecations.md` linhas 147–176 | seção "PoGauge" (removido, use `po-chart` `p-type="gauge"`) | legítimo |
| `docs/guides/deprecations.md` linhas **39, 336, 452, 470** | `<a href="documentation/po-gauge">PoGauge</a>` | **link quebrado**: a rota não existe e cai no `**` do router, que manda para a home |
| Índice da busca (chunk `core`, guia de depreciações) | 3 seções citam po-gauge: `guia:deprecations#po-gauge` ("PoGauge"), `#indice`, `#breaking-changes` | legítimo (texto do guia); o resultado leva ao guia, não a `/documentation/po-gauge` |

O índice foi conferido rodando o `buildGuideDocs` do gerador sobre o `deprecations.md`. Sugestão fora deste escopo: trocar os 4 links por `/documentation/po-chart` ou só texto.

### Subcomponentes sem link na página do pai (continua valendo)

| Pai | Sub | Link hoje |
|---|---|---|
| po-combo | po-combo-option-template | não |
| po-multiselect | po-multiselect-option-template | não |
| po-page-job-scheduler | po-job-scheduler-parameters-template | não (só cita) |
| po-page-job-scheduler | po-job-scheduler-summary-template | não |

Os outros 13 já têm link. O bloco **"Subcomponentes"**, gerado no `componentGroup.template.html` a partir da lista invertida dos `@docsParent`, cobre os 17 de forma uniforme. A página do sub ganha "Faz parte de [pai]".

Também segue valendo:
- As rotas `/documentation/<sub>` continuam (vêm do routing gerado).
- A busca global continua achando o sub e levando à página dele.
- Não há SEO a perder: o portal é SPA sem prerender.

## 9. Outros impactos

| Tema | Situação |
|---|---|
| Rotas `/documentation/<rota>` | não mudam |
| Filtro do menu | deixa de achar subcomponentes (saem do menu); atalhos aparecem duplicados |
| Níveis | Seção › Categoria › Item = 3 (o `po-menu` aceita 4) |
| Menu colapsado / mobile | 3 níveis = um toque a mais; testar a 390 px |
| i18n | o portal é só pt; o vocabulário com chave já deixa a porta aberta |
| Componente novo | sem tag: aviso no build e item em "Outros" (decisão 5). Documentar no `HOW_TO_DOCUMENT.md`: "todo componente público precisa de `@docsCategory` ou `@docsParent`; `@docsOrder` só para destacar" |
| Listagem "API Reference" | agrupada pelas mesmas categorias do menu (decisão 6, seção 12.1) |

## 10. Plano em fases (caminho com tags, com as decisões)

| Fase | Entrega | Esforço |
|---|---|---|
| 1 | Vocabulário (`docs-categories.js`, com a categoria `others`), 4 `customTags` (inclui `@docsOrder`), `docs-menu.js` com erros/avisos e a ordenação (ordem, depois alfabético) + testes Jasmine; o grouper grava os campos no `api-list.json`; **sem mudar o menu ainda** | P–M |
| 2 | Script de tags nos 118 arquivos (123 linhas; sem Gauge; nenhum `@docsOrder`), PR só de comentários + teste de aceitação contra a tabela | P |
| 3 | `menu-components.service.template.ts`: Seção › Categoria › Item, ordenação da decisão 2, "Outros", atalhos com `action`; `DocumentationComponent` marca o pai do sub (6.2); testes Karma do `getMenus` e da marcação | P–M |
| 4 | Bloco "Subcomponentes" e "Faz parte de" no template Dgeni; nome do pai no índice da busca | M |
| 5 | Marca do atalho: **A** (`po-menu` com ícone à direita em subitem + `ariaLabel`, ícone `an an-arrow-bend-up-right`), ou **B** provisório (sufixo no label) | A: M · B: P |
| 6 | Listagem "API Reference" agrupada (12.1): helper compartilhado com o menu, títulos por seção/categoria nos modos grid e lista, filtro escondendo grupos vazios, skeleton agrupado, link "ver também" dos atalhos, subcomponentes conforme 12.1; testes Karma | M |
| 7 | `HOW_TO_DOCUMENT.md`; Chrome headless: acesso direto, sub marcando o pai, clique, atalho, filtro do menu e da listagem, grid e lista, 390 px | P |

**Total (com a listagem agrupada):**
- **M–G** com a marca do atalho provisória (B);
- **G** com a mudança no `po-menu` (A), por causa da lib, dos testes com 99% de cobertura e do release.

O Gauge saiu do plano. O `@docsOrder` existe, mas não gera trabalho de tags agora.

Riscos:
- A tag escrita no meio do JSDoc engole o texto até a próxima tag. A regra "sempre no fim" e a validação pegam isso.
- Conflitos na PR de comentários.
- `activateMenuByUrl` não documentado (6.2).
- O filtro do menu sem subcomponentes.
- Item em "Outros" passando despercebido: o aviso no CI precisa ser lido.
- Listagem e menu com regras diferentes: mitigado por um helper único de agrupamento e ordem (12.1).
- Peso da listagem: nenhum card a mais (atalhos não duplicam), então os previews ao vivo continuam no mesmo número.

## 11. Tags x arquivo de mapa (sem reabrir a decisão)

- **Ganha:** a categoria fica junto do código, e quem cria um componente vê e preenche. A validação do build aponta o arquivo exato. Não existe um mapa central para ficar desatualizado.
- **Perde:** a visão da árvore inteira num lugar só. Para ver o menu, é preciso gerar o `api-list.json`. Mudar a categoria de vários itens edita vários arquivos. A prioridade de ordem fica espalhada em `@docsOrder` (hoje em nenhum arquivo). A primeira aplicação toca 118 arquivos das libs.

## 12. Decisões tomadas

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Gauge | O componente foi removido e não volta. **Sai da tabela e do plano**; Gráficos fica só com Chart. Restos listados em 8.1 (nada apagado). |
| 2 | Ordem dentro da categoria | **Alfabética pelo título**, para todos. `@docsOrder` é implementada só para dar prioridade a um item experimental ou importante: quem tem vem primeiro (menor número primeiro, empate alfabético), o resto alfabético. Valor inteiro ≥ 1, senão erro. **Nenhum arquivo recebe `@docsOrder` agora.** |
| 3 | Marca visual do atalho | Ícone da biblioteca do PO UI à direita do rótulo: `an an-arrow-bend-up-right` (1ª opção) ou `an an-arrow-up-right`; texto acessível "<item>, atalho para <seção> › <categoria>". O `po-menu` não aceita ícone em subitem: recomendado ampliar o `po-menu` (6.1, A); provisório: sufixo no label (B). |
| 4 | Página de subcomponente | **Marca o pai** no menu (ex.: `/documentation/po-table-cell-template` → "Table"), via `activateMenuByUrl` com a rota do pai (6.2). Testado no build real. |
| 5 | Componente sem tag | **Só aviso** no build/CI e o item cai em "Outros". Valores inválidos (categoria ou atalho desconhecido, pai inexistente, cadeia de pais, categoria + pai juntos, `@docsOrder` não numérico) **continuam erro** (recomendação da seção 5; não há ambiguidade). |
| 6 | Listagem "API Reference" | **Sim**: a listagem (`/documentation`, `DocumentationListComponent`) também é agrupada pelas mesmas seções e categorias do menu, na mesma ordem. Detalhes em 12.1. |

### 12.1 Listagem "API Reference" agrupada (decisão 6)

**Hoje:**
- `documentation-list.component.ts` lê o `api-list.json` e ordena por `name`, não pelo título.
- Mostra os 118 itens numa lista só: em grid, com `po-widget` e preview ao vivo; em lista, com um único `po-list-view`.
- O filtro `p-filter` do `po-page-list` procura por `name` ou `title`.
- Enquanto renderiza (`isRendering`), mostra skeletons.
- Os previews usam `@defer (on viewport; prefetch on idle)` com skeleton no `@placeholder`.

**Como passa a ser:**

| Ponto | Proposta |
|---|---|
| Fonte | os mesmos campos do `api-list.json` (`section`, `category`, `order`, `shortcuts`, `parent`) |
| Agrupamento e ordem | um **helper único** do portal (ex.: `src/app/documentation/docs-groups.ts`) monta Seção › Categoria › Itens com a ordem da decisão 2 (`@docsOrder` primeiro, depois alfabético pelo título, sem diferenciar acento nem caixa). É usado pelo `MenuComponentsService` (template) **e** pela listagem, para nunca divergirem. Inclui o grupo "Outros" no fim, se tiver item. A ordem passa a ser pelo **título** (hoje é pelo `name`) |
| Títulos | `<h2>` por seção e `<h3>` por categoria, com contador ("Formulário · 13"). Cada grupo é uma `<section aria-labelledby>`, para leitor de tela e navegação por título. Seção sem categoria (Componentes dinâmicos) tem só o `<h2>` |
| Modo grid | por categoria, um título + a mesma grade `po-row` de `po-widget` de hoje. O card não muda |
| Modo lista | um `po-list-view` **por categoria**, debaixo do título (≈ 18 instâncias), com os mesmos `fieldProperties`, `listActions` e detalhe de hoje |
| Filtro (`p-filter`) | filtra os itens dentro de cada grupo e **esconde grupos e seções que ficarem vazios**. Os contadores mostram o filtrado. Sem nada, mostra o "Nenhum dado encontrado" de hoje. Continua procurando por `name` e `title`, e passa a procurar também pelos subcomponentes (ver abaixo) |
| Skeleton (`isRendering`) | o skeleton ganha um título falso de grupo (`po-skeleton` de ~160×24 px) antes das linhas de hoje. Não precisa refletir os grupos reais |
| `@defer` dos previews | continua por card, `on viewport`: quem está nos grupos de baixo só carrega ao rolar. Agrupar não aumenta o número de previews, porque não há card duplicado (atalhos não viram card, abaixo) |
| Tag do card (`Component`/`Directive`/`Service`) | mantém; ela mostra o tipo técnico, e a categoria já está no título do grupo |

**Atalhos (recomendação):** o card só aparece na categoria **canônica**. Na categoria do atalho, aparece uma linha curta no fim do grupo: "Ver também: [Tooltip](/documentation/po-tooltip) (Utilitários › Diretivas)", com o ícone do atalho (6.1) quando houver.
- Card duplicado dobraria o preview ao vivo e o `@defer`.
- Confundiria a contagem e o filtro ("Tooltip" duas vezes).
- O link mantém a descoberta que o atalho dá no menu.

**Subcomponentes — a confirmar.** Há duas opções:

| Opção | Como | Prós | Contras |
|---|---|---|---|
| **A. Seguir o menu, mostrando dentro do pai** (recomendada) | sem card próprio; o card do pai ganha uma linha "Subcomponentes: Accordion Item" (links), no modo grid no corpo do card e no modo lista no detalhe. O filtro que casar um sub (ex.: "cell template") mostra o **card do pai** com o sub destacado | mesma estrutura do menu (101 cards); um lugar para entender "isso faz parte do Table" | o sub não tem card próprio nem preview |
| B. Card próprio dentro da categoria do pai | os 17 viram cards na categoria do pai, logo depois dele, com tag "Subcomponente" | o sub continua visível como hoje | a listagem fica diferente do menu; 17 cards a mais, e alguns com preview |

Recomendação: **A**, pela coerência com o menu e por deixar a listagem mais curta.

**Testes:**
- Karma do helper: grupos, ordem, "Outros", atalhos e subs.
- Karma da listagem: títulos nos dois modos, filtro escondendo grupos vazios, "Nenhum dado encontrado", "Ver também", subs no pai.
- Chrome headless: rolar o grid e ver os previews carregando só ao entrar na tela; 390 px.

