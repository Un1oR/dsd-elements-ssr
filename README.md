# DSD Elements SSR

Песочница DSD‑based веб‑компонентов с единой рендер‑логикой на клиенте и на сборке:
как PostCSS, который обогащает уже работающее CSS под окружение, отличное от «референсного»:
в обычном режиме рантайм JS в компонентах создаёт `shadowRoot` и переносит в него содержимое `<template>`,
в то время как Vite‑плагин инлайнит DSD прямо во время сборки, не требуя динамического изменения DOM после.

## Что есть
- Компоненты в `public/components/` (`site-header`, `site-footer`, базовый `DSDElement`) — все рендеры возвращают DSD.
- Статика в `public/` работает без сборки: `npm run serve` раздаёт как есть.
- Vite‑плагин `dsd-elements-ssr` находит теги, вызывает `static render(attrs)`
  и вкладывает DSD внутрь того же элемента, не меняя тег/скрипты.

## Скрипты
- `npm run serve` — dev на статике (`public/`).
- `npm run build` — Vite build + SSR-inlining DSD.
- `npm run preview` — раздача `dist/` после сборки.

## Как работает SSR шаг
1. Плагин сканирует JS по `root/**/*.js`, ищет `customElements.define` и `static render`.
2. Собирает HTML, вкладывая DSD из `render` прямо в найденные элементы, сохраняя их light DOM.
3. В рантайме `DSDElement.renderDSD()` создаёт `shadowRoot` и переносит содержимое `<template>` внутрь.
   Это нужно, потому что браузер не применяет `shadowrootmode="open"` к уже обработанным custom elements
   с динамически вставленным `<template>`.

## Быстрый старт
```bash
npm install
npm run serve   # http://localhost:4173
npm run build
npm run preview # http://localhost:4174
```
