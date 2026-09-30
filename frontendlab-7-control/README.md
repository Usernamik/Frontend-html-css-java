# Courtly — проміжний контроль №1 (ЛР-7)

Адаптивна landing page сервісу бронювання спортивних майданчиків Courtly.

## Структура

```
frontendlab-7-control/
├── index.html        # сторінка з усіма секціями
├── css/styles.css    # власний CSS (без фреймворків), mobile-first
├── js/menu.js        # єдиний JS — mobile menu
├── images/           # зображення (тимчасові SVG-заглушки)
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## Що реалізовано

- Секції з id: `#search`, `#venues` (6 карток, featured Arena Sport 2×2 на desktop), `#how` (3 кроки в `<ol>`), `#about`, `#contacts`; Final CTA → `#search`
- Форма: `<label>` + `required` на всіх полях, `action="#venues"`
- Кнопки «Забронювати» — `<button type="button">` з унікальними доступними іменами
- Токени з tokens.css без змін; `--color-focus` перевизначено на CTA та footer
- Fluid typography через `clamp()`; Montserrat (cyrillic)
- Grid карток 1 → 2 (640 px) → 3 (1024 px); Flexbox у header, формі, картках
- Mobile menu: `aria-expanded`, `aria-controls`, працює з клавіатури (Escape)
- Hero: `srcset`, `width`/`height`, `fetchpriority="high"`, без lazy; решта — lazy
- SEO: `lang="uk"`, title, description, canonical, Open Graph, favicon, robots.txt, sitemap.xml

## Локальний перегляд

Відкрити `index.html` у браузері або:

```bash
npx serve frontendlab-7-control
```

## Заміна заглушок

Зображення в `images/` — тимчасові SVG. Після розпакування `courtly-assets.zip` замінити файли на webp/jpg і оновити розширення в `index.html` (та og:image на абсолютний URL og-image.jpg).
