# ЛР №6 — Responsive Layout, Container Queries, Fluid Typography, debugging

Тема листа: `[Веб] ЛР-6: Responsive Layout, Container Queries, Fluid Typography та debugging CSS Layout`

## Посилання на деплой

- GitHub repository: `https://github.com/<username>/<repository>` — _заповнити_
- GitHub Pages: `https://<username>.github.io/<repository>/` — _заповнити_
- Vercel: `https://<project>.vercel.app/` — _заповнити_

Деплой статичний: збірки немає, просто корінь репозиторію. Для GitHub Pages
достатньо увімкнути Pages на гілці `main` (root). Для Vercel — імпортувати
репозиторій без framework preset.

## Що де шукати

| Challenge | Файл | Ключові CSS-механізми |
|---|---|---|
| 1. Flexbox header | `challenge-01/style.css` | `display:flex`, `flex-wrap`, `gap`, `flex-basis`, `margin-inline-start:auto` |
| 2. Adaptive cards | `challenge-02/style.css` | `repeat()`, `minmax()`, `auto-fit` |
| 3. Page layout | `challenge-03/style.css` | Grid `grid-template-areas` + Flexbox у header |
| 4. Subgrid | `challenge-04/style.css` | `grid-template-rows: subgrid`, `grid-row: span 3` |
| 5–6. Container Query | `challenge-05/style.css` | `container-type`/`container`, `@container`, одиниці `cqw` |
| 7. Fluid Typography | `challenge-07/style.css` | `clamp()` |
| 8. Debug | `challenge-08/style.css` | виправлення overflow та fixed width |
| 9. AI review | `challenge-09/` | `original/` vs `final/` |
| 10. Final component | `challenge-10/style.css` | Grid + Flexbox + `minmax` + `clamp` + `@container` |

## Challenge 8. Debug the Layout — першопричини

| Проблема | Причина | CSS-властивість | Виправлення |
|---|---|---|---|
| Horizontal overflow | Фіксована ширина `.page` (1200px) і `.main` (1000px) більша за viewport; grid-елемент має `min-width: auto` і не стискається | `width`, `min-width` | Прибрано `width`; колонки — `minmax(180px,300px) minmax(0,1fr)`; `.main { min-inline-size: 0 }` |
| Heading overflow | `white-space: nowrap` забороняв перенос довгого `<h1>` | `white-space` | Прибрано `nowrap`, розмір — `clamp(1.75rem, ...)` |
| Card overflow | Три `.card` по `width:350px` у flex-контейнері без `flex-wrap` | `width`, відсутній `flex-wrap` | `.cards` → Grid `repeat(auto-fit, minmax(200px,1fr))`, `.card { min-inline-size:0 }` |
| Sidebar займає забагато місця | Фіксована колонка `300px` на вузькому екрані | `grid-template-columns` | `minmax(180px,300px)` + один `@media` для переходу в одну колонку з `order` |

`overflow-x: hidden` свідомо не використовується: він лише приховує симптом,
а не усуває першопричину — елемент, ширший за контейнер.

## Challenge 9. AI review — підсумок

Детальна таблиця з «Прийнята? / Перевірка / Обґрунтування» — у
`challenge-09/index.html`. Стисло: прийнято відмову від фіксованих ширин,
зведення трьох Media Queries до одного breakpoint через `auto-fit`, додавання
`min-inline-size: 0` і `gap` замість `margin`. Відхилено надмірне пропонування
Container Query для однорідних карток — тут достатньо Grid.

## Висновок

У роботі опановано різницю між одновимірним **Flexbox** (header, navigation,
група кнопок, вертикальний стек картки) і двовимірним **Grid** (page layout,
сітка карток, subgrid). З'ясовано, що більшість «адаптивності» дає сам layout,
а не Media Query:

- `repeat(auto-fit, minmax(...))` прибирає breakpoint-и для 2/3/4 колонок;
- `clamp(min, preferred, max)` робить типографику fluid: у Challenge 7 три
  breakpoint-и замінено двома `clamp()`-ами, і текст змінюється плавно, без
  стрибків; перевірено в DevTools → Computed `font-size` на кількох ширинах;
- **Container Query** вирішує те, чого не може `@media`: та сама
  `.product-card` у Challenge 5–6 вертикальна у вузькому sidebar і
  двоколонкова у широкому `main`/modal залежно від ширини **контейнера**, а не
  viewport; одиниця `cqw` робить навіть `font-size` залежним від контейнера;
- **Subgrid** (Challenge 4) вирівнює заголовки, текст і кнопки сусідніх карток
  по спільних рядках батьківського Grid — чого звичайний nested Grid не
  робить, бо кожна картка має власні рядки;
- **DevTools** використано для пошуку першопричин layout-проблем у Challenge 8:
  Box Model, computed `width`/`min-width`, Grid/Flexbox overlay показали, що
  overflow створюють фіксовані ширини та `min-width: auto`, а не «поганий»
  контейнер.

Окремий висновок щодо AI: згенероване рішення (Challenge 9) працює на типових
розмірах, але містить фіксовані ширини й зайві breakpoint-и; приймати
рекомендації варто лише після перевірки за MDN/web.dev і в DevTools.
