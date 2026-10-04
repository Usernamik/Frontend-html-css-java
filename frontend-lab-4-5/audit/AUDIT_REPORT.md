# AUDIT REPORT — FlowTask (frontend-lab-4-5)

> **Статус.** Цей звіт перегенеровано **з реальними інструментальними звітами**.
> Раніша версія писалася без JSON-звітів Lighthouse і axe; тепер кожна знахідка має
> Evidence з `audit id`/`ruleId` + selector і зіставлення з кодом `файл:рядок`.
>
> Розмежування достовірності в Evidence:
> `[LH]` — підтверджено Lighthouse; `[axe]` — підтверджено axe; `[code]` — знайдено
> у вихідному коді (ручна перевірка); `[URL]` — перевірено мережевим запитом до деплою.

---

## 1. Метадані аудиту

| Поле | Значення |
|---|---|
| Дата й час запуску аудиту | 2026-10-04, 21:18–21:29 (+03:00, Europe/Kyiv) |
| AI-агент | Freebuff (Buffy) |
| AI-модель | DeepSeek V4.1 Flash |
| Версія opencode | не встановлено в системі (`opencode --version` → command not found) |
| Цільовий сайт | https://usernamik.github.io/Frontend-html-css-java/frontend-lab-4-5/ |
| Lighthouse | **13.5.0**; `formFactor` = desktop і mobile; `fetchTime` = 2026-10-04T18:21:10Z … 18:23:12Z |
| axe | движок **axe-core 4.13.0**, runner `axe` (@axe-core/cli 4.13.0); набір правил за замовчуванням (теги `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, best-practice) |
| Браузер вимірювань | HeadlessChrome 154.0.0.0 (`userAgent` зі звітів axe) |
| Середовище | Node 24.16.0, npx 11.13.0, Python 3.14.5, Windows |
| Git HEAD | `30441f7` («Add frontend lab 4-5 1 variable») |
| Git: незакомічені зміни | тека `frontend-lab-4-5/` **не відслідковується** git (`?? README.md`, `?? audit/`) |

**Канонічний origin для цього «до»:** за рішенням користувача — **GitHub Pages**
(`https://usernamik.github.io/Frontend-html-css-java/frontend-lab-4-5/`), бо саме цей
деплой містить базовий starter і доступний зараз. Наслідок: Lighthouse-аудит
`robots-txt` тут = `notApplicable` (crawler читає `/robots.txt` лише з кореня origin;
див. п. 6, §4.6 ТЗ).

### Проаналізовані файли

```text
index.html          354 рядки — головна сторінка (основний об'єкт)
about.html          108 рядків — друга сторінка
css/styles.css      686 рядків — усі стилі
js/main.js           80 рядків — навігація, акордеон FAQ, форма, промо-банер
robots.txt            4 рядки
img/hero.jpg        2 782 688 байт (2.79 MB)
img/avatar-*.jpg    ~28 KB кожен
reports/before-desktop-1..3.report.json/.html   Lighthouse desktop × 3
reports/before-mobile-1..3.report.json/.html    Lighthouse mobile × 3
reports/before-axe-index.json                   axe (index)
reports/before-axe-about.json                   axe (about)
screenshots/before-desktop-viewport.png / before-desktop-fullpage.png
screenshots/before-mobile-viewport.png  / before-mobile-fullpage.png
```

### Виконані команди

```bash
date -Iseconds; node -v; npx --version; python --version; opencode --version
curl -s -o /dev/null -w "%{http_code}" <URL> /robots.txt /sitemap.xml
npx --yes lighthouse <URL> --preset=desktop --output=json --output=html \
    --output-path=reports/before-desktop-{1,2,3}
npx --yes lighthouse <URL> --output=json --output=html \
    --output-path=reports/before-mobile-{1,2,3}
npx --yes @axe-core/cli <URL>             --save reports/before-axe-index.json
npx --yes @axe-core/cli <URL>/about.html  --save reports/before-axe-about.json
chrome --headless=new --screenshot screenshots/before-*-{viewport,fullpage}.png
python (витяг metadata, category scores, median, failing audits, axe violations,
        розрахунок контрасту — з reports/*.report.json та reports/*axe*.json)
git rev-parse --short HEAD; git status --short
```

> Примітка: попередній аудит виконувався в режимі «лише читання». Цей прохід за
> рішенням користувача додатково **виконує** Lighthouse/axe і створює `reports/` та
> `screenshots/` (передбачено `NEXT_STEPS.md`, Крок 2).

### Оцінки Lighthouse (медіана з 3 запусків)

| Категорія | Desktop (n=3) | Mobile (n=3) |
|---|---:|---:|
| Performance | **78** | **70** |
| Accessibility | **79** | **79** |
| Best Practices | **100** | **100** |
| SEO | **45** | **45** |

Ключові метрики (медіана):

| Метрика | Desktop | Mobile | Поріг «добре» |
|---|---:|---:|---|
| First Contentful Paint | 0.46 s | 1.33 s | ≤1.8 s |
| Largest Contentful Paint | **2.66 s** | **14.89 s** | ≤2.5 s |
| Cumulative Layout Shift | **0.171** | 0.129 | ≤0.10 |
| Total Blocking Time | 14 ms | 100 ms | ≤200 ms |
| Speed Index | 0.84 s | 2.53 s | ≤3.4 s |
| Total byte weight | 2 860 KiB | 2 860 KiB | — |

---

## 2. Короткий підсумок

| Категорія | Висока | Середня | Низька | Всього |
|---|---:|---:|---:|---:|
| Accessibility | 8 | 5 | 3 | **16** |
| SEO | 1 | 4 | 4 | **9** |
| Performance | 2 | 3 | 4 | **9** |
| **Разом** | **11** | **12** | **11** | **34** |

**Порівняння з оцінками Lighthouse:** Performance 78 desktop / 70 mobile,
Accessibility 79, Best Practices 100, SEO 45. Це базовий деплой, тому цифри
збігаються з очікуваними для starter-версії.

### 5 найкритичніших проблем

1. **A-01** — `<html>` без `lang` на обох сторінках → підтверджено axe (`html-has-lang`) і Lighthouse.
2. **A-10** — контраст `.muted` = **2.8:1** / **2.64:1** (18 вузлів на index, 4 на about) → axe `color-contrast`, Lighthouse `color-contrast`.
3. **A-02 / A-03 / A-04 / A-05** — невидимий фокус (`:focus{outline:none}`) і меню/CTA як `<div>` без клавіатури → ручна перевірка коду (автоінструменти це не ловлять).
4. **S-01** — `<meta name="robots" content="noindex">` → Lighthouse `is-crawlable` = 0 (сторінку заблоковано від індексації).
5. **P-01** — `hero.jpg` = 2.79 MB без `width/height/srcset`; це і LCP-елемент (Lighthouse mobile LCP = **14.9 s**), і головний `image-delivery` (економія 2 775 KiB).

### Розбіжності між інструментами (і чому)

| Спостереження | axe | Lighthouse | Пояснення |
|---|---|---|---|
| `heading-order` (h1→h4) | ✅ 1 вузол | ✅ score 0 | **Обидва** (у попередній версії звіту помилково вказано «лише Lighthouse») |
| `target-size` (іконки 18×18) | ❌ не звітує | ✅ score 0 | Lighthouse має власне правило `target-size`; окремий CLI-запуск axe за замовчуванням його не включає |
| `<div>` меню/CTA (без ролі) | ❌ | ❌ | Елементи без `tabindex`/ролі поза досяжністю автотестів → **ручна перевірка** |
| Поля форми без `<label>` | ✅ `label` = pass | ✅ `label` = pass | Placeholder дає accessible name (HTML-AAM fallback) → **не порушення**, лише best practice |
| `label`/`button-name`/`aria-*` | ✅ pass | ✅ pass | Решта ARIA коректна; A-05/A-08 — суто поведінкові (код) |

**Розбіжність із ручним скріншотом користувача:** ваш Lighthouse показав Performance 85,
тут — **78** (desktop). Різниця пояснюється версією/оточенням запуску (у нас Lighthouse
13.5.0, headless, `--preset=desktop`, без розширень; медіана з 3). Accessibility (79),
Best Practices (100) і SEO (45) збігаються повністю — це підтверджує узгодженість.

**Розбіжність коду й деплою:** відсутня. Деплой GitHub Pages віддає той самий starter,
що й локальний код (`<html>` без `lang`, `noindex`, `title=FlowTask`, той самий `robots.txt`).

---

## 3. Детальні знахідки

### 3.1 Accessibility

#### A-01 — Відсутній атрибут `lang` на `<html>`
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Кореневий `<html>` не має `lang`, тому скрінрідер не визначає мову документа (вимова, перенос, автопереклад). |
| Evidence | `[axe]` `html-has-lang` (impact **serious**), target `html`: «The <html> element does not have a lang attribute»; `[LH]` `html-has-lang` score=0; `[code]` `index.html:2` `<html>`, `about.html:2` `<html>` |
| Severity | **Висока** — WCAG 3.1.1; без мови скрінрідер читає контент неправильно. |
| Recommendation | Додати `lang="en"` до `<html>` в `index.html:2` та `about.html:2`. |
| Verification | axe `html-has-lang` = 0 порушень; Lighthouse `html-has-lang` = pass. |

#### A-02 — Невидимий фокус (`:focus { outline: none }`)
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Глобальне правило знімає індикатор фокуса в усьому документі без альтернативи — користувач клавіатури не бачить, де перебуває. |
| Evidence | `[code]` `css/styles.css:40-42` → `:focus { outline: none; }`; автоінструменти це не перевіряють (Lighthouse-аудити `focusable-controls`, `logical-tab-order` = `manual`) |
| Severity | **Висока** — WCAG 2.4.7; блокує клавіатурну навігацію. |
| Recommendation | Видалити правило або замінити на `:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }` у `css/styles.css`. |
| Verification | Ручний тест: Tab по сторінці — фокус видно на кожному контролі. |

#### A-03 — Головна навігація — `<div>` замість посилань/кнопок
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Пункти меню — `<div class="nav-item">` з `cursor:pointer` і JS-обробником `click`. Не фокусуються, не мають ролі, не реагують на Enter/Space. |
| Evidence | `[code]` `index.html:42-45` `<div class="nav-item" data-target="features">Product</div>` …; `js/main.js:7-14` (лише `click`); `about.html:18-21` — ті самі `<div>`, але **без** `data-target` і без обробника (повністю «мертві»). Автотести не звітують (немає ролі/`tabindex`). |
| Severity | **Висока** — WCAG 2.1.1 Keyboard. |
| Recommendation | Замінити на `<a href="#features">Product</a>` (index) і `<a href="index.html#features">…</a>` (about); прибрати JS-обробник, якщо посилання ведуть на якорі. |
| Verification | Ручний тест: Tab зупиняється на кожному пункті, Enter переходить до секції. |

#### A-04 — Hero-CTA — `<div>` без ролі та клавіатури
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Кнопка «Get started» у hero — `<div>` з обробником кліку: не фокусується, не має ролі, недоступна з клавіатури. |
| Evidence | `[code]` `index.html:64` `<div class="button button--primary button--lg" id="hero-cta">Get started</div>`; `js/main.js:39-44` обробник `click` |
| Severity | **Висока** — WCAG 2.1.1, 4.1.2; ключова дія недоступна без мишки. |
| Recommendation | Замінити на `<a class="button button--primary button--lg" href="#trial" id="hero-cta">Get started</a>`. |
| Verification | Ручний тест Tab + Enter активує дію; axe `link-name`/`button-name` = 0. |

#### A-05 — Trial submit — `role="button" tabindex="0"` без обробки клавіатури
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Кнопка форми фокусується, але обробник реагує лише на `click` — Enter/Space її не активують (порушення контракту ролі `button`). |
| Evidence | `[code]` `index.html:288` `<div class="button button--invert" role="button" tabindex="0" id="trial-submit">…`; `js/main.js:46-58` лише `addEventListener('click', …)`. `[LH]` `button-name` = pass (ім'я є), тому автотест це не ловить. |
| Severity | **Висока** — WCAG 2.1.1, 4.1.2. |
| Recommendation | Замінити на `<button type="submit" class="button button--invert" id="trial-submit">Start free trial</button>` і обробляти `submit` форми в `js/main.js`. |
| Verification | Ручний тест: Tab → Enter/Space надсилає форму. |

#### A-06 — Hero-зображення без `alt`
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Головне зображення не має `alt` — скрінрідер не отримує ані опису, ані позначки «декоративне». |
| Evidence | `[axe]` `image-alt` (impact **critical**), target `.hero__image`; `[LH]` `image-alt` score=0, node `main > section.hero > div.shell > img.hero__image`; `[code]` `index.html:67` `<img class="hero__image" src="img/hero.jpg">` |
| Severity | **Висока** — WCAG 1.1.1. |
| Recommendation | Додати `alt` (описовий, якщо змістове, або `alt=""`), а також `width`/`height` у `index.html:67`. |
| Verification | axe `image-alt` = 0; Lighthouse `image-alt` = pass. |

#### A-07 — Поля форми без `<label>` (не підтверджено як порушення)
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Три поля мають лише `placeholder`. Placeholder зникає при введенні і є слабшою назвою, ніж `<label>`; але як accessible name він **зараховується** браузером. |
| Evidence | `[code]` `index.html:285-287` (`name`/`email`/`company`, лише `placeholder`); `[LH]` `label` **score=1** (pass); `[axe]` правило `label` не серед violations. Тобто це **не порушення**, а best practice. |
| Severity | **Низька** — постійної видимої назви немає, але доступне ім'я є. |
| Recommendation | Для кращої якості додати `<label for>` (можна візуально прихований) або `aria-label` до кожного `<input id>`. |
| Verification | axe `label` = 0; ручна перевірка озвучення поля. |

#### A-08 — FAQ: `aria-expanded` не відповідає вмісту і не оновлюється
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Усі кнопки FAQ мають статично `aria-expanded="true"`, хоча відповіді приховані (`display:none`). JS лише перемикає клас `is-open` і **не оновлює** атрибут → скрінрідер отримує хибний стан. |
| Evidence | `[code]` `index.html:243,251,259,267` `aria-expanded="true"`; `css/styles.css:396-398` `.faq__a { display: none }`, розкриття `.faq__item.is-open` (`:402`); `js/main.js:63-66` `classList.toggle('is-open')`. `[axe]` `aria-valid-attr-value` = pass (значення валідне — інструмент не знає, що воно хибне). |
| Severity | **Середня** — WCAG 4.1.2; стан контролера озвучується неправильно. |
| Recommendation | У `js/main.js` синхронно виставляти `aria-expanded`; у `index.html` початково `false` + `aria-controls` з `id` панелей. |
| Verification | Ручний тест скрінрідером: «collapsed/expanded» відповідає видимому стану. |

#### A-09 — Соціальні посилання без доступного імені
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Три посилання містять лише SVG з `aria-hidden="true"` і жодного тексту/`aria-label` → скрінрідер оголошує «link» без назви. |
| Evidence | `[axe]` `link-name` (impact **serious**), targets `.social > a[href="#"]:nth-child(1..3)`; `[LH]` `link-name` score=0 (3 nodes); `[code]` `index.html:302-320` (три `<a href="#"><svg … aria-hidden="true">…`) |
| Severity | **Висока** — WCAG 2.4.4 / 4.1.2 (link-name). |
| Recommendation | Додати `aria-label` (напр. «Twitter») або візуально прихований текст усередину кожного `<a>` у `index.html`. |
| Verification | axe `link-name` = 0; Lighthouse `link-name` = pass. |

#### A-10 — Низький контраст `--ink-muted` (#939ba7)
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Сірий `#939ba7` використовується для звичайного тексту: на білому — **2.8:1**, на `#f7f8fb` — **2.64:1**, суттєво нижче 4.5:1. Це основний текст-опис у секціях. |
| Evidence | `[axe]` `color-contrast` (impact **serious**), **18 вузлів** (index) + 4 (about). Приклади: `.hero__note.muted` 2.8:1 (`#939ba7/#ffffff`, 14px); `#features > .shell > .section__head > .muted` 2.64:1 (`#939ba7/#f7f8fb`, 17px); `.plan__period` 2.8:1; `.quote__role` 2.8:1; `.legal` 2.8:1. `[LH]` `color-contrast` score=0. `[code]` `css/styles.css:12` `--ink-muted: #939ba7;` |
| Severity | **Висока** — WCAG 1.4.3; основний текст фактично нечитабельний для багатьох користувачів; Lighthouse weight=7. |
| Recommendation | Затемнити `--ink-muted` до ≥4.5:1 (напр. `#5b6472`) у `css/styles.css:12`; перевірити всі місця вживання (`.muted`, `.hero__note`, `.plan__period`, `.quote__role`, `.legal`). |
| Verification | axe `color-contrast` = 0 порушень; перерахунок контрасту нового значення ≥4.5:1. |

#### A-11 — Контраст `--ink-soft` (#717985) трохи нижче AA
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | `#717985` для `.soft`-тексту дає **4.39:1** на білому — формально трохи нижче 4.5:1. |
| Evidence | `[axe]` `color-contrast`: `.soft` — «insufficient color contrast of **4.39** (foreground `#717985`, background `#ffffff`, 17px)» (index + about); `[code]` `css/styles.css:13` `--ink-soft: #717985;`, вжиток `index.html:83` (`.soft`) |
| Severity | **Середня** — межове порушення, легко виправляється затемненням. |
| Recommendation | Затемнити `--ink-soft` до ≥4.5:1 (напр. `#646c78`) у `css/styles.css:13`. |
| Verification | axe `color-contrast` = 0. |

#### A-12 — Порушена ієрархія заголовків (h1 → h4)
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Після `<h1>FlowTask</h1>` наступний заголовок секції — `<h4>Why FlowTask?</h4>`, тоді як решта — `<h2>`. Рівень пропущено. |
| Evidence | `[axe]` `heading-order` (impact **moderate**), target `h4`, html `<h4>Why FlowTask?</h4>`; `[LH]` `heading-order` score=0; `[code]` `index.html:61` `<h1>`, `index.html:74` `<h4>`, інші — `<h2>` (`:105`, `:160`) |
| Severity | **Середня** — WCAG 1.3.1; ускладнює навігацію заголовками. |
| Recommendation | Замінити `<h4>` на `<h2>` у `index.html:74`, розмір узгодити класом (правило `h4` у `css/styles.css:679-681` залишиться для інших випадків). |
| Verification | axe `heading-order` = 0; Lighthouse `heading-order` = pass. |

#### A-13 — Замалі цілі натискання (18×18 px)
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Іконки соцмереж мають розмір 18×18 px — менше рекомендованих 24×24 px. |
| Evidence | `[LH]` `target-size` score=0 (desktop і mobile), nodes `div.site-footer__cols > div > div.social > a` (3); `[code]` `css/styles.css:490-494` `.social a { width: 18px; height: 18px; }`. `[axe]` окремий CLI не звітує `target-size` у своєму наборі. |
| Severity | **Середня** — WCAG 2.5.8 / Lighthouse target-size; ускладнює натискання на тач. |
| Recommendation | Збільшити клікабельну область до ≥24×24 px (`min-width/min-height:24px` + `padding`) у `css/styles.css:490`. |
| Verification | Lighthouse `target-size` = pass; ручний тест на 320 px. |

#### A-14 — Мобільне меню повністю приховане
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | На ширині ≤900 px усе меню `.nav` зникає без альтернативи (немає кнопки-гамбургера) — мобільний користувач втрачає навігацію по секціях. |
| Evidence | `[code]` `css/styles.css:664` `@media (max-width: 900px)`, `:679-681` `.nav { display: none; }` |
| Severity | **Середня** — навігація недоступна на мобільних, але лишаються якорі у футері. |
| Recommendation | Додати доступне розкривне меню (кнопка `aria-expanded` + `aria-controls`) або не приховувати `.nav`. |
| Verification | Ручний тест 320–900 px; axe `aria-expanded` для кнопки меню. |

#### A-15 — Неінформативний `alt="icon"`
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | Іконка першої картки має `alt="icon"` — технічний шум замість опису; решта іконок коректно `alt=""`. |
| Evidence | `[code]` `index.html:80` `alt="icon"`; `index.html:88,96` `alt=""` |
| Severity | **Низька** — WCAG 1.1.1, не блокує (поруч є заголовок). |
| Recommendation | Змінити на `alt=""` у `index.html:80`. |
| Verification | axe `image-alt` = 0; ручна перевірка озвучення. |

#### A-16 — Надлишкові ARIA-атрибути
| Поле | Зміст |
|---|---|
| Category | Accessibility |
| Problem | `role="button"` на справжніх `<button>`, `role="navigation"` на `<nav>` (неявна роль), `aria-label`, що дублює видимий текст — зайвий шум. |
| Evidence | `[code]` `index.html:41` `<nav … role="navigation">`; `index.html:51` `<button … role="button" aria-label="Get started button">`; `index.html:50` `<a … aria-label="Sign in">Sign in</a>`; ті самі патерни `about.html:17,26,27`. `[LH]`/`[axe]` ARIA-аудити = pass (валідно, але надлишково). |
| Severity | **Низька** — WCAG 4.1.2 (надлишковість), не блокує. |
| Recommendation | Прибрати надлишкові `role` та `aria-label`, що дублює текст, в обох сторінках. |
| Verification | axe `aria-allowed-attr`/`aria-roles` = 0; Lighthouse ARIA-аудити без зауважень. |

### 3.2 SEO

#### S-01 — `noindex` на головній сторінці
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | У `<head>` головної стоїть `meta robots = noindex`, що прямо забороняє індексацію; `about.html` такого тега не має — поведінка неузгоджена. |
| Evidence | `[LH]` `is-crawlable` **score=0**, title «Page is blocked from indexing» (desktop і mobile); `[code]` `index.html:7` `<meta name="robots" content="noindex">`; `about.html` — тега немає |
| Severity | **Висока** — блокує появу головної в індексі пошукових систем. |
| Recommendation | Якщо сторінка має індексуватися — видалити рядок `index.html:7`; якщо ні — додати `noindex` і на `about.html` для узгодженості. |
| Verification | Lighthouse `is-crawlable` = pass; перевірка `<meta name="robots">` у DevTools. |

#### S-02 — Відсутній meta description
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | На обох сторінках немає `<meta name="description">`, тому пошукові системи формують сніпет довільно. |
| Evidence | `[LH]` `meta-description` **score=0** (desktop і mobile); `[code]` `index.html` head (`:3-36`) — тега немає; `about.html` head (`:3-10`) — тега немає |
| Severity | **Середня** — не блокує індексацію, але помітно знижує якість сніпета й CTR. |
| Recommendation | Додати унікальний `<meta name="description" content="…">` (80–160 символів) у `<head>` обох сторінок. |
| Verification | Lighthouse `meta-description` = pass. |

#### S-03 — Короткий і однаковий `<title>`
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | `<title>` = «FlowTask» — надто короткий, не містить суті й однаковий на обох сторінках. |
| Evidence | `[LH]` `document-title` **score=1** (тег є — тож це не помилка Lighthouse, а якість); `[code]` `index.html:6` та `about.html:6` — ідентичний `<title>FlowTask</title>` |
| Severity | **Низька** — сторінки не розрізняються заголовком, але індексація не блокується. |
| Recommendation | Зробити унікальні описові `title` (напр. «FlowTask — task board for teams», «About — FlowTask»). |
| Verification | Ручний огляд вкладок; Lighthouse `document-title` = pass. |

#### S-04 — Відсутній canonical
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | Жодна сторінка не має `<link rel="canonical">`; README описує два деплої (Vercel і GitHub Pages) з різними URL. |
| Evidence | `[LH]` `canonical` = **notApplicable** (аудит активний лише за наявності тега — тому це **гіпотеза, потребує ручної перевірки**); `[code]` тега немає в обох файлах; `README.md` вказує два різні URL одного проєкту |
| Severity | **Середня** — ризик дублювання між двома origin. |
| Recommendation | Додати `<link rel="canonical" href="<абсолютний URL>">` в обидві сторінки після вибору канонічного origin. |
| Verification | Ручна перевірка тега; Lighthouse `canonical` = pass (після додавання). |

#### S-05 — `robots.txt` блокує CSS/зображення, немає `Sitemap`
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | `robots.txt` забороняє `/css/` та `/img/` (заважає рендерингу/індексації ресурсів), містить неіснуючий `/admin/` і не вказує `Sitemap:`. |
| Evidence | `[URL]` `curl .../robots.txt` → 200, тіло: `Disallow: /css/`, `Disallow: /img/`, `Disallow: /admin/`; `[code]` `robots.txt:2-4`. `[LH]` `robots-txt` = **notApplicable** на GitHub Pages (нюанс §4.6: файл читається лише з кореня origin). |
| Severity | **Середня** — впливає на рендеринг/індексацію ресурсів, сторінка лишається доступною. |
| Recommendation | Прибрати `Disallow: /css/` і `/img/`, видалити `/admin/`, додати `Sitemap:` у `robots.txt`. |
| Verification | Валідатор robots.txt; перевірка на Vercel (§4.6). |

#### S-06 — Відсутній `sitemap.xml`
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | README згадує sitemap, але файлу немає. |
| Evidence | `[URL]` `curl .../sitemap.xml` → **404**; `[code]` `find` по проєкту не містить `sitemap.xml` |
| Severity | **Середня** — ускладнює індексацію другої сторінки. |
| Recommendation | Створити `sitemap.xml` з абсолютними URL головної та `about.html`, додати `Sitemap:` у `robots.txt`. |
| Verification | Валідатор XML; `Sitemap:` у robots. |

#### S-07 — Немає Open Graph / Twitter meta
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | Відсутні `og:*` та `twitter:*` — поширення посилання не формує насиченого прев'ю. |
| Evidence | `[code]` `<head>` обох сторінок — таких тегів немає (жоден інструмент це не перевіряє автоматично) |
| Severity | **Низька** — не впливає на індексацію напряму. |
| Recommendation | Додати `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` у `<head>` обох сторінок. |
| Verification | Валідатор Open Graph. |

#### S-08 — Структуровані дані `Product` без `url`/`image`, рейтинг без відгуків
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | JSON-LD `Product` містить `aggregateRating` (4.9, 1284 відгуки), але без `url`/`image` і без відгуків на сторінці — дані не підкріплені видимим контентом. |
| Evidence | `[LH]` `structured-data` = **manual** (автоматично не верифікується); `[code]` `index.html:11-35` (`"@type":"Product" … "aggregateRating"… "reviewCount":"1284"`) |
| Severity | **Низька** — нешкідливо для індексації, але може не пройти Rich Results. |
| Recommendation | Доповнити `url`/`image` або прибрати `aggregateRating`, якщо відгуків на сторінці немає. |
| Verification | Google Rich Results Test — без помилок. |

#### S-09 — Заголовок секції не узгоджений із SEO-структурою
| Поле | Зміст |
|---|---|
| Category | SEO |
| Problem | Ключова секція «Why FlowTask?» використовує `<h4>` замість `<h2>` — послаблює семантичну структуру (та сама причина, що й A-12). |
| Evidence | `[code]` `index.html:74` `<h4>` при наявних `<h2>` (`index.html:105,160,188,227,279`) |
| Severity | **Низька** — структурний недолік. |
| Recommendation | Спільне виправлення з A-12. |
| Verification | Lighthouse `heading-order` = pass. |

### 3.3 Performance

#### P-01 — Hero-зображення 2.79 MB без розмірів і `srcset` (LCP)
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `img/hero.jpg` = **2 782 688 байт** віддається як є; це і LCP-елемент, і найбільший ресурс. Немає `width`/`height` (CLS) та `srcset`/сучасного формату. |
| Evidence | `[LH]` `image-delivery-insight` **score=0**, «Est savings of **2 775 KiB**», node `main > section.hero > div.shell > img.hero__image`; `[LH]` `largest-contentful-paint` desktop 2.66 s / **mobile 14.89 s**, `lcp-discovery-insight` → LCP-елемент = той самий hero (`fetchpriority=high` не застосовано); `[LH]` `network-requests` → `img/hero.jpg` transferSize **2 784 475**, resourceSize 2 782 688; `[code]` `index.html:67` `<img class="hero__image" src="img/hero.jpg">` |
| Severity | **Висока** — LCP mobile 14.9 s (>4 s) і надважкий payload 2 860 KiB; прямо шкодить метриці. |
| Recommendation | Ресайз + перекодування hero у WebP/AVIF (ціль суттєво менша), додати `width`/`height`, `srcset`/`sizes`, `fetchpriority="high"`; решту зображень — `loading="lazy"` (`index.html:67`, `img/hero.jpg`). |
| Verification | Lighthouse `largest-contentful-paint` ≤2.5 s і `image-delivery-insight` без великих savings. |

#### P-02 — Зображення без explicit `width`/`height` → CLS 0.171
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `unsized-images`: hero та аватари не мають явних розмірів; виміряний CLS = **0.171** (desktop) / 0.129 (mobile), вище порогу 0.10. |
| Evidence | `[LH]` `cumulative-layout-shift` score=0.7 desktop / 0.82 mobile; `unsized-images` score=0.5 «Image elements do not have explicit width and height»; `layout-shifts` (3 shifts) — culprits `body > main > section#features` (0.0905) і `body > main` (0.0806, subitem — `img.hero__image`); `[code]` `index.html:67` без `width`/`height` |
| Severity | **Середня** — CLS 0.171 < 0.25, але вище «добре» (0.10). |
| Recommendation | Додати `width`/`height` (або `aspect-ratio`) до hero та CSS для зображень у `index.html`/`css/styles.css`. |
| Verification | Lighthouse `cumulative-layout-shift` < 0.1; `unsized-images` = pass. |

#### P-03 — Синхронний busy-wait 300 мс у обробнику кліку
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `startSignup()` крутить `while (Date.now() - started < 300)` з `Math.sqrt`, блокуючи головний потік на 300 мс при кожному кліку CTA — штучна затримка взаємодії (INP). |
| Evidence | `[code]` `js/main.js:18-24` `var started = Date.now(); var total = 0; while (Date.now() - started < 300) { total += Math.sqrt(total + 1); }`; `[USER]` скріншот DevTools Performance користувача: **INP 341 ms**, long task при взаємодії. `[LH]` TBT 14 ms desktop / 100 ms mobile — цикл виконується лише на клік, тому Lighthouse його не бачить. |
| Severity | **Висока** — 300 мс блокування головної дії → INP 341 ms («needs improvement»). |
| Recommendation | Прибрати цикл з `js/main.js:18-24` (він не виконує роботи); за потреби прогріву — `requestIdleCallback`. |
| Verification | DevTools Performance: короткий task при кліку; INP < 200 ms. |

#### P-04 — Локальний шрифт без `font-display`
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `@font-face` не має `font-display`, тому під час завантаження шрифту текст може бути невидимим (FOIT). |
| Evidence | `[LH]` `font-display-insight` score=0, «Est savings of 280 ms» (desktop) / 70 ms (mobile); `[code]` `css/styles.css:3-8` `@font-face { … src: url("../fonts/inter-latin.woff2") … }` (без `font-display`) |
| Severity | **Середня** — тимчасове приховування тексту; є системний fallback. |
| Recommendation | Додати `font-display: swap;` у `@font-face` (`css/styles.css:3-8`). |
| Verification | Lighthouse `font-display-insight` без savings. |

#### P-05 — Render-blocking скрипт у `<head>`
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `js/main.js` підключено в `<head>` без `defer`/`async` — парсинг HTML зупиняється до завантаження й виконання скрипта. |
| Evidence | `[LH]` `render-blocking-insight` score=0.5, items `…/js/main.js` (1096 B) та `…/css/styles.css` (2874 B); `[code]` `index.html:10` `<script src="js/main.js"></script>`; `about.html:9` — так само |
| Severity | **Середня** — скрипт малий, але це avoidable render-blocking. |
| Recommendation | Додати `defer` до обох `<script>` (`index.html:10`, `about.html:9`). |
| Verification | Lighthouse `render-blocking-insight` без скрипта. |

#### P-06 — Мертвий блок «UI kit» у CSS (не підтверджено інструментом)
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | У `styles.css` є блок класів (`.dashboard*`, `.board*`, `.tag*`, `.avatar-stack`, `.modal*`, `.toast`, `.table*`), не вживаний у HTML — мертвий код. |
| Evidence | `[code]` `css/styles.css:520-660`; у `index.html`/`about.html` цих класів немає; `[LH]` `unused-css-rules` **score=1** (Lighthouse не вважає CSS суттєво невикористаним, бо файл малий). Тому це code-hygiene, а не метрика. |
| Severity | **Низька** — вплив на payload мінімальний (CSS ~2.9 KB transfer). |
| Recommendation | Винести/видалити блок `css/styles.css:520-660` або перенести в окремий файл. |
| Verification | Перевірка, що класи не вживаються; Lighthouse `unused-css-rules` = pass. |

#### P-07 — Аватари у JPEG завеликі для 44×44
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | Три аватари зберігаються як JPEG ~28 KB, хоча показуються 44×44 px і розташовані нижче першого екрана — без `loading="lazy"`. |
| Evidence | `[LH]` `image-delivery-insight` — серед items аватари по 44×44 (`div.grid-3 > div.quote > div.quote__person > img.quote__avatar`); `[code]` `index.html:203,221,239` `<img class="quote__avatar" … width="44" height="44">`; `ls` → `avatar-1..3.jpg ≈ 28 KB` |
| Severity | **Низька** — надлишковий розмір, легко оптимізувати. |
| Recommendation | Перекодувати аватари у WebP під `@2x` (≈88 px), додати `loading="lazy"`. |
| Verification | Lighthouse `image-delivery-insight` без аватарів. |

#### P-08 — CSS/JS не мініфіковані (не підтверджено інструментом)
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | `styles.css` та `main.js` віддаються без мініфікації/стиснення на рівні файлів. |
| Evidence | `[code]` `css/styles.css` 686 рядків, `js/main.js` 80; `[LH]` `unminified-css` і `unminified-javascript` = **score=1** (Lighthouse не вважає виграш суттєвим). Отже — не підтверджено як впливова проблема. |
| Severity | **Низька** — добра практика, а не виміряний вплив. |
| Recommendation | Мініфікувати під час деплою (GitHub Pages віддає файли як є — потрібен крок збірки). |
| Verification | Lighthouse `unminified-*` = pass. |

#### P-09 — Короткий cache lifetime на статиці (поза кодом)
| Поле | Зміст |
|---|---|
| Category | Performance |
| Problem | Lighthouse оцінює економію 2 618 KiB через неефективні cache lifetimes — це поведінка хостингу GitHub Pages, а не коду. |
| Evidence | `[LH]` `cache-insight` score=0, «Est savings of 2,618 KiB»; cache header-и керуються GitHub Pages, у `network-requests` `cache: "none"` |
| Severity | **Низька** — не виправляється в межах статичного проєкту. |
| Recommendation | Свідомо **не виправляти** (код не керує цими заголовками). Зафіксувати як обмеження/середовище. |
| Verification | — |

---

## 4. Що зроблено добре

1. **Best Practices = 100** (обидва formFactor): HTTPS, без помилок у консолі (`errors-in-console` = pass), без deprecated APIs, коректний `charset` і `<doctype>`.
2. **Viewport-мета коректна** — `meta-viewport` = pass: немає `user-scalable="no"` і `maximum-scale < 5`, сторінка масштабується.
3. **Основні зображення мають коректні формати/розміри там, де це вже зроблено** — логотип і feature-іконки з `width`/`height`, `image-size-responsive` = 1, `image-aspect-ratio` = 1.
4. **Семантика списків і landmark-структура** — `list`, `listitem`, `landmark-one-main` = pass; є `<main>`, `<nav>`, `<header>`, `<footer>`.
5. **Семантика контролів частково правильна** — реальні `<button>` для header-CTA та FAQ, `tabindex` без значень > 0 (`tabindex` = pass), `aria-allowed-attr`/`aria-roles`/`aria-valid-attr*` = pass.

---

## 5. Рекомендований порядок виправлення

1. **Швидкі й безризикові (SEO + A11y інфраструктура):** S-01 (`noindex`), A-01 (`lang`), A-06 (`alt`), A-09 (`link-name`), S-02 (meta description).
2. **Контраст:** A-10 → A-11 (зміна двох CSS-змінних `--ink-muted`, `--ink-soft` ліквідує 22 axe-вузли одразу).
3. **Клавіатура/семантика (найбільший a11y-ефект, але торкається розмітки й JS):** A-02 (`:focus-visible`), A-03 (меню), A-04 (hero-CTA), A-05 (trial submit), A-08 (FAQ `aria-expanded`).
4. **Performance (найбільший ефект на метрики):** P-01 (hero), P-02 (`width`/`height`), P-03 (busy-loop), P-04 (`font-display`), P-05 (`defer`).
5. **Дрібне й гігієна:** A-12/S-09 (heading), A-13 (target-size), A-14 (мобільне меню), A-15, A-16, S-03, S-05, S-06, S-07, S-08, P-06, P-07, P-08.
6. **Не виправляти:** P-09 (керується хостингом).

---

## 6. Обмеження аудиту

- **Лише автоматизовані перевірки + код.** Ручні тести (клавіатура, скрінрідер, 320 px) **не виконані** — A-02, A-03, A-04, A-05, A-08, A-13, A-14 потребують ручної верифікації; вони підтверджені лише читанням коду, тому позначені як ручні.
- **`robots.txt` на GitHub Pages не перевіряється Lighthouse** (`robots-txt` = notApplicable), бо crawler читає `/robots.txt` з кореня origin. S-05 підтверджено лише мережевим запитом до `…/frontend-lab-4-5/robots.txt`, не інструментом (§4.6 ТЗ — перевірку слід повторити на Vercel).
- **`canonical` (S-04)** — Lighthouse = notApplicable (аудит активний лише за наявності тега) → це **гіпотеза**, не машинно підтверджене порушення.
- **`structured-data` (S-08)** — Lighthouse = manual, автоматичної валідації немає.
- **A-07 (поля без `<label>`)** — автоінструменти **не** вважають це порушенням (placeholder дає accessible name); знижено до низької.
- **P-06, P-08** — Lighthouse ставить pass (`unused-css-rules`, `unminified-*` = 1); залишено як code-hygiene, не як виміряну проблему.
- **P-03 (busy-loop)** — Lighthouse не бачить (виконується на клік, не на load); підтверджено кодом і ручним скріншотом DevTools (INP 341 ms).
- **Розбіжність метрики Performance** з ручним скріншотом користувача (85 проти 78): інше оточення/версія; зафіксовано умови вимірювання в п. 1.
- **Порівняння «до/після»** вимагає повторного запуску тими самими командами на тому самому URL після виправлень.
- Задеплоєна версія **збігається** з локальним кодом (розбіжностей не знайдено).

### Артефакти

```text
reports/before-desktop-1..3.report.{json,html}
reports/before-mobile-1..3.report.{json,html}
reports/before-axe-index.json, reports/before-axe-about.json
screenshots/before-desktop-viewport.png, before-desktop-fullpage.png
screenshots/before-mobile-viewport.png,  before-mobile-fullpage.png
```
