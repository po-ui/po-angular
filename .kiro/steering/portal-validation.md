---
inclusion: manual
---

# Validação do Portal PO Angular

Usar este fluxo ao testar, validar ou fazer QA do portal `po-angular` após atualizações de dependências, alterações em componentes ou mudanças de documentação.

## Ordem de build

```bash
npm run build
npm run build:portal
```

Comandos úteis:

| Comando | Descrição |
|---|---|
| `npm run build` | Constrói todas as bibliotecas publicáveis |
| `npm run build:portal:docs` | Constrói documentação, API docs, guias e menus |
| `npm run build:portal:prod` | Build de produção do app Angular do portal |
| `npm run build:portal` | Build completo do portal |

## Validação funcional

1. Servir o portal após o build.
2. Abrir o menu Componentes.
3. Navegar pela documentação dos componentes afetados.
4. Acessar a página Labs de cada componente impactado.
5. Verificar console do navegador.
6. Confirmar renderização, interação, responsividade e ausência de erros.
7. Coletar evidências quando necessário, como screenshots ou gravações.
