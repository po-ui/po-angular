# PoSkeleton

O componente `po-skeleton` é utilizado para exibir placeholders durante o carregamento de conteúdo, melhorando a experiência do usuário ao indicar que a informação está sendo processada.

## Uso básico

```html
<po-skeleton></po-skeleton>
```

## Propriedades

### p-variant

Define a variante visual do skeleton.

**Valores válidos:**
- `text`: Simula uma linha de texto (altura padrão: 1em)
- `rect`: Forma retangular (requer definição de altura)
- `circle`: Forma circular (largura e altura iguais)

**Default:** `text`

```html
<po-skeleton p-variant="rect" p-width="100%" p-height="200px"></po-skeleton>
<po-skeleton p-variant="circle" p-width="64px" p-height="64px"></po-skeleton>
```

### p-animation

Define o tipo de animação do skeleton.

**Valores válidos:**
- `shimmer`: Animação de brilho deslizante
- `pulse`: Animação de pulsação
- `none`: Sem animação

**Default:** `shimmer`

```html
<po-skeleton p-animation="pulse"></po-skeleton>
<po-skeleton p-animation="none"></po-skeleton>
```

### p-width

Define a largura do skeleton. Aceita valores CSS válidos (px, %, em, rem, etc).

**Default:** `100%`

```html
<po-skeleton p-width="200px"></po-skeleton>
<po-skeleton p-width="50%"></po-skeleton>
```

### p-height

Define a altura do skeleton. Aceita valores CSS válidos (px, %, em, rem, etc).

Para a variante `text`, o valor padrão é `1em`.
Para as variantes `rect` e `circle`, é recomendado definir um valor.

```html
<po-skeleton p-variant="rect" p-height="100px"></po-skeleton>
```

### p-border-radius

Define o raio da borda do skeleton. Aceita valores CSS válidos (px, %, em, rem, etc).

Esta propriedade sobrescreve o border-radius padrão de cada variante.

```html
<po-skeleton p-border-radius="16px"></po-skeleton>
```

## Exemplos

### Simulando carregamento de lista

```html
<div *ngIf="loading">
  <po-skeleton class="po-mb-2"></po-skeleton>
  <po-skeleton class="po-mb-2"></po-skeleton>
  <po-skeleton class="po-mb-2"></po-skeleton>
</div>

<div *ngIf="!loading">
  <!-- Conteúdo real -->
</div>
```

### Simulando carregamento de card com avatar

```html
<div class="po-row" *ngIf="loading">
  <po-skeleton 
    class="po-mr-2" 
    p-variant="circle" 
    p-width="64px" 
    p-height="64px">
  </po-skeleton>
  <div class="po-col">
    <po-skeleton p-width="200px" class="po-mb-1"></po-skeleton>
    <po-skeleton p-width="150px"></po-skeleton>
  </div>
</div>
```

### Simulando carregamento de imagem

```html
<po-skeleton 
  p-variant="rect" 
  p-width="100%" 
  p-height="300px"
  p-border-radius="8px">
</po-skeleton>
```

## Acessibilidade

O componente possui `aria-hidden="true"` automaticamente, pois é apenas um indicador visual de carregamento e não deve ser anunciado por leitores de tela.

## Customização com tokens CSS

É possível customizar o componente através de tokens CSS:

```css
po-skeleton {
  --background: #e0e0e0;
  --border-radius: 4px;
}
```

**Tokens disponíveis:**

| Token | Descrição | Valor Padrão |
|-------|-----------|--------------|
| `--background` | Cor de fundo do skeleton | `var(--color-neutral-light-20)` |
| `--border-radius` | Raio da borda | `var(--border-radius-md)` |
