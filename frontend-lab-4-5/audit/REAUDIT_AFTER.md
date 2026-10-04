# Крок 6 — повторний аудит: «до / після»

Ті самі інструменти, що й на Кроці 2: Lighthouse 13.5.0 (desktop і mobile, медіана з 3),
axe-core 4.13.0, Chrome 154, 2026-10-04.

> **ВАЖЛИВО про умови.** «До» вимірювалось на деплої GitHub Pages
> (`https://usernamik.github.io/Frontend-html-css-java/frontend-lab-4-5/`), «після» —
> на **локальному сервері** (`python -m http.server`, `http://localhost:8123/`), бо
> виправлену версію ще не задеплоєно. Тому метрики Performance (LCP/CLS/TBT) порівнювані
> лише орієнтовно — офіційний «після» прогін треба повторити на тому самому URL після деплою.
> Результати Accessibility/SEO/axe від оточення не залежать і порівнювані напряму.

Команди (ідентичні «до», лише інший URL):

```bash
python -m http.server 8123
npx --yes lighthouse http://localhost:8123/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=reports/after-desktop-{1,2,3}
npx --yes lighthouse http://localhost:8123/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=reports/after-mobile-{1,2,3}
npx --yes @axe-core/cli http://localhost:8123/            --save reports/after-axe-index.json
npx --yes @axe-core/cli http://localhost:8123/about.html  --save reports/after-axe-about.json
```

## Таблиця «до / після»

| Показник | До (GitHub Pages) | Після (localhost) | Зміна |
|---|---:|---:|---|
| Lighthouse Accessibility | **79** | **100** | +21 |
| Lighthouse SEO | **45** | **100** | +55 |
| Lighthouse Best Practices | 100 | 100 | — |
| Lighthouse Performance (desktop / mobile) | 78 / 70 | **99 / 95** | +21 / +25 |
| axe violations, index | 5 правил (24 вузли) | **0** | −всі |
| axe violations, about | 2 правила (5 вузлів) | **0** | −всі |
| FCP (desktop / mobile) | 0.46 s / 1.33 s | 0.25 s / 1.22 s | ✓ |
| LCP (desktop / mobile) | 2.66 s / 14.89 s | **0.43 s / 1.52 s** | ✓ (−2.2 s / −13.4 s) |
| CLS (desktop / mobile) | 0.171 / 0.129 | **0.082** / 0.131 | ✓ desktop <0.1 |
| TBT (desktop / mobile) | 14 ms / 100 ms | **0 ms / 0 ms** | ✓ |
| Total byte weight | 2 860 KiB | **173 KiB** | −2 687 KiB |

Hero оптимізовано за тією ж схемою, що й у товариша: `hero.jpg` (майстер 4000×2500, лишається для `og:image`),
плюс ресайз `img/hero-992.jpg` (53.5 KB) і `img/hero-992.webp` (14.4 KB). У розмітці — `<picture>`
із `<source type="image/webp">` та JPEG-фолбеком. У прогоні браузер завантажив саме `hero-992.webp`
(14 893 B transfer замість 2 784 475 B).

Lighthouse-аудити, що раніше падали, тепер **усі pass**: `is-crawlable`, `meta-description`,
`canonical`, `robots-txt`, `html-has-lang`, `image-alt`, `link-name`, `color-contrast`,
`heading-order`, `target-size`. У категоріях accessibility / seo / best-practices
**жодного failing binary-аудита** (перевірено у `reports/after-desktop-1`).

## Що усунуто (за ID зі звіту)

- **Accessibility:** A-01 (`lang`), A-02 (`:focus-visible`), A-03 (меню → `<a>`),
  A-04 (hero-CTA → `<a>`), A-06 (hero `alt` + розміри), A-08 (FAQ `aria-expanded` синхр.),
  A-09 (`aria-label` соцпосилань), A-10 + A-11 (контраст: `--ink-muted` **5.98:1**,
  `--ink-soft` **5.31:1**), A-12 (`h4`→`h2`), A-13 (target-size 24×24), A-15 (`alt=""`),
  A-16 (прибрано надлишкові `role`/`aria-label`).
- **SEO:** S-01 (`noindex` прибрано), S-02 (meta description), S-03 (унікальні `title`),
  S-04 (`canonical` на обох), S-05 (`robots.txt`: `Allow: /` + `Sitemap:`),
  S-06 (новий `sitemap.xml`), S-07 (Open Graph + `twitter:card`), S-08 (JSON-LD: прибрано
  вигаданий `aggregateRating`, додано `url`/`image`), S-09 (разом з A-12).
- **Performance:** **P-01** (hero → `hero-992.webp`/`.jpg` через `<picture>`, LCP 14.89→1.52 s,
  байт 2 860→173 KiB), P-02 (`width`/`height` → CLS 0.171→0.082), P-03 (busy-loop прибрано → TBT 0),
  P-04 (`font-display: swap`), P-05 (`defer`).

## Що залишилось (свідомо не зроблено в цьому обсязі)

| ID | Причина |
|---|---|
| **P-07** | Аватари не перекодовано; додано лише `loading="lazy"`. Lighthouse `image-delivery-insight` ще оцінює ~82 KiB економії — наступний кандидат. |
| **A-05** | `#trial-submit` лишається `<div role="button">` (не входило в обраний обсяг). |
| **A-07** | Поля без `<label>` — автотести вважають pass (best practice). |
| **A-14** | Мобільне меню `.nav { display:none }` без гамбургера. |
| **P-06, P-08** | Мертвий CSS / немініфіковані файли — Lighthouse ставить pass. |
| **P-09** | Cache lifetime — керується хостингом, не кодом. |

## Хибні спрацювання / уточнення

- **A-07, P-06, P-08** — не стали «виправленням», бо автотести їх не підтверджували.
- **CLS mobile (0.131)** не покращився: ймовірна причина — промо-банер, що вставляється
  в DOM після `load` (`js/main.js`). Ця знахідка не входила в прийнятий обсяг; потребує
  окремого рішення (виносити банер у HTML заздалегідь).

## Що ще потребує ручної перевірки

- Tab-навігація: фокус видимий на меню (`<a>`), hero-CTA, FAQ, header-CTA.
- FAQ скрінрідером: стан `collapsed/expanded` відповідає видимому.
- 320 px: чи доступні цілі натискання (соцпосилання тепер 24×24).
- Повторний офіційний прогін Lighthouse/axe **на задеплоєному URL** після push.

## Артефакти

```text
reports/after-desktop-1..3.report.json, after-mobile-1..3.report.json
reports/after-axe-index.json, after-axe-about.json
screenshots/after-desktop-viewport.png, after-desktop-fullpage.png
screenshots/after-mobile-viewport.png,  after-mobile-fullpage.png
```
