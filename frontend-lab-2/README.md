# ЛР-2. Секція тарифних планів (CSS)

Адаптивна секція тарифів за ТЗ: лише HTML і CSS, без JavaScript.
Дослідження розділу 4 захищаються усно.

## Структура

| Файл | Призначення |
| --- | --- |
| `index.html` | Секція тарифів + перемикач теми |
| `css/styles.css` | Єдиний стиль: токени, компоненти, тема |

Запуск: відкрити `index.html` у браузері (або Live Server / `npx serve .`).

## Що всередині

- Три картки: Basic $10, Pro $29 (виділена), Enterprise $99.
- Темна тема без JS: прихований checkbox стоїть перед `.page` у DOM, тому
  `.theme-toggle-input:checked ~ .page` перевизначає лише токени —
  компоненти темніють автоматично (scope CSS Variables).
- Адаптивність: >768px — три картки в ряд, ≤768px — стовпчик.

## Застосування принципів CSS

- **Box Model** — глобальний `box-sizing: border-box`; картки з
  padding/border/radius, ширина через `flex: 1 1 220px`.
- **Inheritance** — шрифт, вага, колір задані один раз на `body`.
- **Specificity** — максимум (0,4,0) у стані темної теми; без `!important` і ID.
- **CSS Variables** — усе в `:root`; темна тема та Pro-картка — локальні
  перевизначення токенів.
- **Reuse / DRY** — `.container`, `.card`, `.btn` + модифікатори,
  `.card-tag`; `.pricing-card` містить лише унікальне для тарифів.


## Деплой
GitHubPages: https://usernamik.github.io/Frontend-html-css-java/
GitHub: https://github.com/Usernamik/Frontend-html-css-java/edit/main/frontend-lab-2

