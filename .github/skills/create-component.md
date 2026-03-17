# Skill: Criar Novo Componente PO UI

## Descrição
Cria um novo componente seguindo o padrão arquitetural do PO UI (base/child).

## Passos

1. Criar pasta em `projects/ui/src/lib/components/po-<nome>/`
2. Criar `po-<nome>-base.component.ts` com:
   - Propriedades privadas com prefixo `_`
   - Inputs com alias `p-` (ex: `@Input('p-label')`)
   - Outputs com alias `p-` (ex: `@Output('p-click')`)
   - Getters/Setters (set antes do get)
   - Documentação JSDoc em português formal e impessoal
   - Tokens CSS customizáveis documentados em tabela markdown
3. Criar `po-<nome>.component.ts` com:
   - `@docExtends` referenciando a classe base
   - Lógica de renderização e interação com a view
   - Exemplos (`@example`) referenciando samples
4. Criar `po-<nome>.component.html`
5. Criar `po-<nome>.component.spec.ts` com:
   - Coverage mínimo de 99%
   - Descrições em inglês
   - Uso de `expectPropertiesValues` para validação de booleanos
6. Criar `po-<nome>.module.ts` que declara e exporta o componente
7. Exportar no `src/public-api.ts`
8. Criar samples em `samples/`:
   - `sample-po-<nome>-basic/` (mínimo necessário)
   - `sample-po-<nome>-labs/` (dinâmico, explorar propriedades)

## Convenções
- Código fonte em inglês
- Documentação em português formal
- Testes em inglês
- Arrays tipados como `Array<T>`, não `T[]`
- Inputs booleanos: `@Input({ alias: 'p-prop', transform: convertToBoolean })`
