---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/components/po-field/**/*.ts", "projects/ui/src/lib/components/po-field/**/*.html"]
name: shared-field-templates
description: Use ao modificar templates HTML de componentes de campo que compartilham templateUrl, como po-input, po-email e po-url.
---

# Templates Compartilhados em Componentes de Campo

Alguns componentes de campo compartilham templates HTML via `templateUrl` apontando para o template de outro componente.

Exemplos conhecidos:

- `PoEmailComponent` usa `templateUrl: '../po-input/po-input.component.html'`.
- `PoUrlComponent` usa `templateUrl: '../po-input/po-input.component.html'`.

## Risco

Ao modificar `po-input.component.html`, qualquer nova propriedade ou método usado no template também precisa existir nas classes dos componentes que compartilham esse template. Caso contrário, o compilador Angular pode falhar com erro semelhante a:

```text
TS2339: Property 'X' does not exist on type 'YComponent'
```

## Procedimento obrigatório

Antes de alterar template de componente de campo, buscar outros componentes que referenciam o mesmo template:

```bash
grep -r "templateUrl.*po-input/po-input.component.html" projects/ui/src/lib/components/po-field/
```

Aplicar a mesma análise para outros templates compartilhados, como `po-textarea` e `po-select`, quando houver alteração semelhante.
