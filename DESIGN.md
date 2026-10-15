---
name: Agenda
description: Agenda de clientes para profissionais que atendem por consulta — calma, quente e legível de relance.
colors:
  terracota: "#c67139"
  terracota-400: "#f6a06b"
  terracota-500: "#d67f48"
  terracota-600: "#b2622d"
  terracota-700: "#8c491a"
  terracota-100: "#fff2eb"
  terracota-200: "#ffe1d0"
  terracota-800: "#643312"
  salvia: "#7a8a5e"
  salvia-100: "#f0fae1"
  salvia-200: "#e1eecc"
  salvia-800: "#3d472b"
  creme: "#f5ead8"
  areia: "#ebddc5"
  carvao-quente: "#201e1d"
  noite-cafe: "#221d19"
  noite-cafe-raised: "#2b2521"
  papel-noturno: "#f2e7d5"
typography:
  display:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.2
  dialog-title:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-compact:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  input-mobile:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  control:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
  overline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "10.5px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "28px"
  card: "32px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.carvao-quente}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.terracota-500}"
  button-primary-active:
    backgroundColor: "{colors.terracota-400}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.carvao-quente}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.terracota-700}"
    rounded: "{rounded.pill}"
    padding: "10px 6px"
  button-icon:
    rounded: "{rounded.pill}"
    size: "36px"
  input:
    backgroundColor: "{colors.areia}"
    textColor: "{colors.carvao-quente}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "40px"
  card:
    backgroundColor: "{colors.areia}"
    rounded: "{rounded.card}"
    padding: "14px"
  tag-concluido:
    backgroundColor: "{colors.salvia-100}"
    textColor: "{colors.salvia-800}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  tag-accent:
    backgroundColor: "{colors.terracota-100}"
    textColor: "{colors.terracota-800}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  nav-item-active:
    backgroundColor: "{colors.terracota-200}"
    textColor: "{colors.terracota-800}"
    rounded: "{rounded.md}"
    size: "36px"
  dialog:
    backgroundColor: "{colors.areia}"
    rounded: "{rounded.card}"
    padding: "22px"
    width: "440px"
---

# Design System: Agenda

## Overview

**Creative North Star: "A Sala de Espera Acolhedora"**

O sistema é a recepção de um consultório bem cuidado, e não um hospital nem um software corporativo. O fundo é creme como papel de boa gramatura, o acento terracota lembra barro cozido e o sálvia funciona como uma planta no canto da sala. Quem chega, seja a profissional entre dois atendimentos ou a recepção no meio do expediente, deve sentir calma antes de qualquer outra coisa. Pacientes e clientes estão por trás de cada linha, e o calor do sistema é uma forma de discrição: nada grita, nada alarma.

A densidade é moderada. A agenda do dia é uma pilha vertical de cards suaves, um por horário, e a tela respira sem desperdiçar espaço. Os componentes são macios e acolhedores: botões em pílula, cards de cantos generosos, campos arredondados que convidam ao toque, inclusive com o polegar no celular. A tipografia alterna a voz calorosa e encorpada da Caprasimo, nos títulos e nos botões, com a neutralidade limpa da Figtree em tudo que precisa ser lido rápido.

A profundidade é plana, feita de camadas tonais. Superfícies se distinguem pelo tom (creme → areia) e por uma borda fina e translúcida, e a sombra fica reservada para o que realmente flutua, como os diálogos. O tema escuro é a mesma sala à noite: café escuro em vez de creme, com os mesmos acentos.

**Key Characteristics:**
- Fundo creme quente e superfícies areia; nunca branco puro nem cinza frio.
- Um acento principal (terracota) para ação e um secundário (sálvia) para conclusão.
- Formas em pílula e cantos muito arredondados em todos os componentes interativos.
- Caprasimo nos títulos e botões, Figtree no corpo e nos dados.
- Plano por padrão: profundidade por tom e borda, sombra só no que flutua.
- Tema claro e escuro trocam apenas fundo, superfície e texto; os acentos são os mesmos.

## Colors

Uma paleta terrosa e quente: um acento de barro, um secundário vegetal, e neutros de papel e café em vez de cinzas.

### Primary
- **Terracota** (`terracota`): a cor da ação. É o fundo do botão primário (sempre com texto carvão, nos dois temas), do item de navegação ativo (nas rampas claras `terracota-200`/`terracota-800`) e da marca circular provisória. No hover o botão clareia para `terracota-500` e, pressionado, para `terracota-400`: com texto escuro, clarear mantém o contraste e escurecer o derrubaria.
- **Tinta Terracota** (token semântico `accent-ink`: `terracota-700` no claro, `terracota-500` no escuro): o terracota quando ele é *texto, ícone ou contorno*, como botões ghost, a tag "Agendado", o anel de foco e a borda de campo focado. O terracota puro só dá 3:1 sobre creme, insuficiente para texto pequeno. `terracota-700` (claro) e `terracota-300` (escuro) também carregam mensagens de erro, num tom mais contido que um vermelho de alarme.

### Secondary
- **Sálvia** (`salvia`): conclusão e calma. Aparece no status "Concluído" (`salvia-100` de fundo, `salvia-800` de texto) e no avatar dos clientes na lista mobile (`salvia-200` / `salvia-800` no escuro).

### Neutral
- **Creme** (`creme`): fundo da página no tema claro e texto sobre o botão primário.
- **Areia** (`areia`): superfície elevada no claro, usada em cards, campos, diálogos e barra de navegação mobile.
- **Carvão Quente** (`carvao-quente`): texto e títulos no claro e texto sobre o terracota nos dois temas. O texto secundário é o mesmo carvão a 68% de opacidade (cerca de 5:1 sobre areia). Divisórias e bordas de card usam carvão a 16% (`line`), e o contorno de campos usa carvão a 55% (`line-strong`, 3:1 contra o fundo).
- **Noite Café** (`noite-cafe`, `noite-cafe-raised`): fundo e superfície elevada no tema escuro.
- **Papel Noturno** (`papel-noturno`): texto e títulos no escuro, com derivações de 55% (secundário), 14% (`line`) e 45% (`line-strong`).

### Named Rules
**The Same Room Rule.** Claro e escuro são a mesma sala em horários diferentes. Só `surface`, `surface-raised`, `content`, `content-muted`, `heading`, `line`, `line-strong` e `accent-ink` trocam de valor; as rampas de terracota e sálvia não mudam. Use sempre os tokens semânticos (`bg-surface`, `text-content`…), e `dark:` só para ajustes pontuais nas rampas de acento.

**The Ink Rule.** O terracota puro (`accent`) só aparece como *fundo* ou como mancha (marca, caret, seleção). Quando o terracota precisa ser lido como texto, ícone pequeno ou contorno de foco, use `accent-ink`. Texto sobre fundo terracota é sempre `on-accent` (carvão), em qualquer tema.

**The Two Accents Rule.** Terracota é ação, sálvia é concluído. Não introduza um terceiro matiz (azul, roxo, vermelho de erro) sem decisão explícita; estados neutros como "Cancelado" usam o próprio texto a 10% de opacidade.

**The No Cold Gray Rule.** Todo neutro deriva do carvão quente ou do papel noturno por opacidade ou `color-mix`. Cinzas frios do Tailwind (`gray-*`, `slate-*`) não pertencem a esta sala.

## Typography

**Display Font:** Caprasimo (com Georgia, serif)
**Body Font:** Figtree (com system-ui, sans-serif)

**Character:** A Caprasimo é encorpada e amigável, uma serifa display de traço macio que dá voz humana a títulos e botões. A Figtree é a recepcionista eficiente: geométrica, clara, ótima para horários, nomes e telefones.

### Hierarchy
- **Display** (400, 2.25rem → 3rem, 1.15): o título da landing. Só ali.
- **Headline** (400, 1.5rem → 1.875rem, 1.15): o título de cada tela do app, como a data do dia na agenda ("quarta-feira, 15 de outubro") ou "Clientes".
- **Title** (400, 17–20px, 1.2): títulos de card (17px) e de diálogo (20px). A Caprasimo a 14px também é a voz de todos os botões.
- **Body** (400–600, 15px base, 14px em campos e tabelas): conteúdo, nomes de clientes (600), horários (600).
- **Label** (600, 12px): rótulos de campo, em carvão a 70%. Tags usam 11px, 600, com tracking de 0.02em.
- **Overline** (400, 10.5px, 0.08em, MAIÚSCULAS): apenas cabeçalhos de tabela.

### Named Rules
**The Warm Voice Rule.** A Caprasimo fala apenas em títulos, títulos de card/diálogo e botões, sempre no peso 400. Nunca em corpo de texto, dados, rótulos ou tags, e nunca em negrito sintético.

**The Data Is Figtree Rule.** Horários, durações, nomes, telefones e e-mails são sempre Figtree, porque o que precisa ser lido rápido usa a fonte neutra.

## Layout

Shell de app com dois comportamentos. No desktop (`md`, 768px+) há um trilho lateral fixo de 72px com a marca, os ícones de navegação e, no rodapé, a troca de tema e o botão de sair, e o conteúdo fica num `main` com 32px de respiro. No mobile, um cabeçalho compacto (marca + tema + sair) fica no topo e uma barra de navegação fixa no rodapé com ícone + rótulo; o conteúdo usa 16px de margem e reserva 80px embaixo para a barra.

Cada tela abre com uma linha de cabeçalho: título Headline, controles secundários ao lado e a ação primária empurrada para a direita (`ml-auto`), com quebra de linha permitida. O conteúdo fica limitado em largura (a lista da agenda em 768px, a busca em 448px) e não se estica pela tela toda. Elementos empilhados usam ritmo de 8px (listas de cards) e 20px (seções da tela).

**Toque.** Em `pointer: coarse` (celular, tablet, notebook com tela de toque), todo alvo interativo tem no mínimo 44px: botões, botões de ícone, campos, opções segmentadas e ícones soltos (via `tap-target`). No trilho lateral, o rótulo aparece sob o ícone, porque não há tooltip no toque. Com mouse, a densidade original fica como está.

**Celular.** O título da tela ocupa a linha inteira e os controles descem juntos para a linha de baixo. O card de horário vira duas linhas: hora, cliente e status em cima, ações embaixo, alinhadas à direita, na zona do polegar. O diálogo vira uma folha presa ao rodapé. Barra inferior e conteúdo respeitam as áreas seguras do aparelho (`env(safe-area-inset-*)`, com `viewport-fit=cover`).

Tabelas são exclusivas do desktop. No mobile, a mesma informação vira uma pilha de cards com avatar circular.

Estados vazios são um card tracejado, centralizado no espaço restante da tela, com uma frase em destaque e uma instrução curta.

## Elevation & Depth

Plano com camadas tonais. A profundidade vem do contraste entre o fundo creme e a superfície areia (ou café e café elevado no escuro), reforçado por uma borda translúcida de 1px. Cards, campos e a barra de navegação ficam todos no mesmo plano. A sombra entra apenas no que realmente sai do plano: o diálogo, sobre um véu marrom a 50%.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 1px 2px rgba(46, 43, 37, 0.14)`): disponível como `.elev-sm`, para um realce mínimo quando necessário.
- **Lifted** (`box-shadow: 0 3px 10px rgba(46, 43, 37, 0.16)`): disponível como `.elev-md`.
- **Floating** (`box-shadow: 0 12px 32px rgba(46, 43, 37, 0.22)`): diálogos. A única sombra usada hoje.

### Named Rules
**The Flat Room Rule.** Superfícies em repouso não têm sombra. Para separar algo, use tom (`surface` → `surface-raised`) e borda `line`. Sombra é reservada para camadas que flutuam sobre a página (diálogos e, no futuro, menus e popovers).

## Shapes

A forma é a pílula. Todo elemento interativo em linha (botões, campos de uma linha, tags, controles segmentados) é totalmente arredondado (999px). Superfícies de conteúdo usam cantos muito generosos: cards e diálogos ficam em torno de 32px, e áreas internas como a lista de sugestões e os itens de navegação em 16px. Os textareas abrem mão da pílula e usam 16px. Não há cantos retos nem quase-retos em nenhum lugar.

A marca provisória é um círculo sólido terracota, e o avatar de cliente é um círculo sálvia. O círculo é o motivo recorrente da identidade.

**Ícone do app** (`public/favicon.svg`): disco terracota com ponteiros de relógio em creme na pose 10:10, saindo de um pino central. O V dos ponteiros também se lê como um visto (horário + atendimento feito). Não tem letra, porque o nome ainda é provisório. Variantes rasterizadas: `favicon-32.png`, `apple-touch-icon.png` (180px, fundo cheio, porque o iOS aplica a própria máscara) e `icon-512.png`.

## Components

### Buttons
Macios, em pílula, falando com a voz da Caprasimo.
- **Shape:** pílula completa (999px); padding de 10px × 18px; texto Caprasimo 14px.
- **Primary:** fundo terracota, texto carvão (`on-accent`) nos dois temas. Hover clareia para `terracota-500` e pressionado para `terracota-400`. Transição de cor em 150ms.
- **Secondary:** transparente, com borda `line`. Hover e pressionado aplicam um véu do próprio texto a 7% e 14%.
- **Ghost:** texto em tinta terracota (`accent-ink`), padding horizontal mínimo, véu da mesma tinta a 10%/18% no hover/pressionado. Usado para ações em linha ("Concluir", "Cancelar", "trocar", fechar diálogo).
- **Icon:** círculo de 36px, combinável com secondary ou ghost (navegação de dia, fechar).
- **Disabled:** 45% de opacidade, cursor bloqueado.
- **Focus:** contorno de 2px em tinta terracota (`accent-ink`), com 2px de afastamento, global em `:focus-visible`.

### Chips (tags de status)
- **Style:** pílula, 11px, 600, tracking 0.02em, padding de 4px × 11px.
- **State:** "Agendado" é contornado em tinta terracota (`tag-outline`, `accent-ink`), "Concluído" é sálvia preenchido (`tag-accent-2`), "Cancelado" é neutro, com o texto a 10% (`tag-neutral`). Também existe a variante `tag-accent` (terracota preenchido).

### Cards / Containers
- **Corner Style:** muito arredondado (~32px).
- **Background:** superfície areia (claro) ou café elevado (escuro).
- **Shadow Strategy:** nenhuma em repouso (ver The Flat Room Rule).
- **Border:** 1px `line`; tracejada nos estados vazios.
- **Internal Padding:** 14px, com gap interno de 8px. Na agenda o card vira linha horizontal: horário/duração, cliente/observação, status, ações.

### Inputs / Fields
- **Style:** pílula de 40px de altura, fundo areia, borda `line-strong`, padding de 8px × 16px, texto 14px, cursor de digitação terracota e placeholder em `content-muted`. Rótulo acima em 12px/600.
- **Hover:** a borda escurece para o texto a 75%.
- **Focus:** a borda vira tinta terracota (`accent-ink`), sem halo extra.
- **Error:** mensagem em texto terracota escuro (`terracota-700` no claro, `terracota-300` no escuro) abaixo do formulário.
- **Textarea:** cantos de 16px, altura mínima de 90px, redimensionável na vertical.
- **Mobile:** abaixo de 768px o texto do campo sobe para 16px (`input-mobile`), porque com menos que isso o Safari do iOS dá zoom ao focar.
- **Estrutura:** sempre via o componente `Field`, que liga rótulo, dica (`field-hint`) e erro (`field-error`) ao controle por `id`/`aria-describedby` e marca `aria-invalid`, o que deixa a borda em terracota escuro. Erros gerais do formulário usam `form-error` com `role="alert"`.

### Segmented Control
- **Style:** grupo em pílula com borda `line` e divisórias internas; opções em 13px.
- **State:** a opção selecionada inverte as cores (fundo no tom do texto, texto no tom da superfície), as outras ganham véu de 7% no hover. Usado na escolha de duração (30m / 50m / 60m).

### Navigation
- **Desktop:** trilho de 72px com leve lavagem terracota (`terracota-100` a 40%; `terracota-900` a 20% no escuro). Itens são quadrados arredondados de 36px só com ícone (lucide, 18px, traço 2.75) e título em tooltip.
- **Mobile:** barra fixa no rodapé sobre superfície areia, itens divididos igualmente, ícone sobre rótulo em 11px/500.
- **Ativo:** fundo `terracota-200` com ícone `terracota-800` (invertido no escuro: `terracota-800`/`terracota-200`). Inativo: texto secundário, com hover `terracota-100`.

### Dialog
- **Style:** até 440px de largura, superfície areia, cantos de ~32px, padding de 22px, sombra Floating, sobre um véu marrom quente (`#2e2b25` a 50%). Título Caprasimo 20px com botão de fechar ghost circular à direita, e ação primária em largura total no final.
- **Estrutura:** sempre via o componente `Dialog` (`<dialog>` nativo com `showModal()`): foco preso, `Esc` fecha, clique no véu fecha e o foco volta para quem abriu. Usado pelos formulários de agendamento e de cliente e pelo calendário no celular. No celular vira folha presa ao rodapé.
- **Combobox de cliente:** a lista de sugestões flutua sob o campo (`role="combobox"`, `aria-expanded`); `Esc` fecha só a lista, não o diálogo.
- **Telefone:** `react-international-phone` com as variáveis da lib mapeadas para os tokens (borda `line-strong`, 44px no toque, 16px no celular).

### Avatar
Círculo sálvia (`salvia-200` com texto `salvia-800`; no escuro, `salvia-800` com `salvia-100`) com as iniciais do primeiro e do último nome, em 36px nas listas e 44px no detalhe. É decorativo (`aria-hidden`), porque o nome sempre aparece ao lado. Componente `Avatar`.

### Feedback States
Estado vazio (`EstadoVazio`): cartão tracejado centralizado, com uma frase em negrito e uma instrução curta ou ação. Erro de carregamento (`ErrorState`): cartão tracejado com ícone de alerta em terracota escuro, `role="alert"`, a causa em texto secundário e "Tentar de novo". Carregamento (`Carregando`): uma linha de texto secundário com `role="status"`. Horários, datas e telefones usam algarismos tabulares.

### Agenda Slot (signature)
A agenda é uma timeline por hora (06h–22h, estendida se houver horário fora): cada linha mostra a hora cheia e, nela, os cards do horário ou um botão tracejado "livre · toque pra agendar". O card é a unidade central do produto: horário em destaque (600) e duração abaixo (11px, secundário) numa coluna fixa, nome do cliente (600, truncado) com a observação em uma linha, a tag de status, as ações ghost "Concluir"/"Cancelar" enquanto está "Agendado" e os ícones de editar e excluir. Uma faixa lateral de 4px marca o status (terracota, sálvia, linha), decisão do wireframe. No desktop largo, um mini calendário fixo ao lado marca os dias com agendamento; no celular ele abre em diálogo.

### Mini Calendar
Grade de semanas completas, dias como círculos. Selecionado: fundo terracota com texto `on-accent`. Hoje: contorno e texto em `accent-ink`. Dia com agendamento: ponto `accent-ink` sob o número. Algarismos tabulares.

## Do's and Don'ts

### Do:
- **Do** usar sempre os tokens semânticos (`surface`, `surface-raised`, `content`, `content-muted`, `heading`, `line`) para que claro e escuro funcionem sem `dark:` espalhado.
- **Do** usar as classes do sistema (`btn`, `input`, `card`, `tag`, `seg`, `dialog`, `ds-table`) em vez de recriar o mesmo visual com utilitários soltos.
- **Do** manter todo controle interativo em pílula (999px) e toda superfície de conteúdo com cantos generosos (16px ou mais).
- **Do** reservar terracota para ação e foco, e sálvia para conclusão.
- **Do** usar `accent-ink` sempre que o terracota for texto, ícone pequeno ou contorno, e `on-accent` (carvão) para texto sobre fundo terracota.
- **Do** trocar tabela por pilha de cards abaixo de 768px.
- **Do** separar camadas com tom e borda `line`, e não com sombra.

### Don't:
- **Don't** pôr texto creme sobre o terracota nem usar `text-accent` em texto pequeno; os dois ficam em 3:1.
- **Don't** usar branco puro (`#fff`), preto puro ou cinzas frios do Tailwind (`gray-*`, `slate-*`, `zinc-*`).
- **Don't** usar Caprasimo em corpo de texto, dados, rótulos ou tags, nem em pesos acima de 400.
- **Don't** pôr sombra em cards ou campos em repouso.
- **Don't** usar cantos retos ou raios pequenos (menos de 8px) em superfícies e controles.
- **Don't** introduzir um vermelho de alarme para erros ou cancelamentos; erro é terracota escuro, cancelado é neutro.
- **Don't** nomear uma classe de componente `table`, `container` ou outro nome que colida com utilitários nativos do Tailwind; use o prefixo `ds-`.
