# ЛР-3. AI-assisted semantic HTML та SEO

Рефакторинг сторінки тарифів з ЛР-2: семантична структура, метадані,
SEO-контент. Візуальна концепція ЛР-2 збережена. Дослідження розділу 4
та AI-аудит захищаються усно.

## Структура

| Файл | Призначення |
| --- | --- |
| `index.html` | Сторінка тарифів CloudDesk (семантична розмітка) |
| `css/styles.css` | Токени, компоненти + стилі header/footer (темна тема за замовчуванням) |
| `box-model.html` | Сторінка експерименту 4.1 ЛР-2 (content-box vs border-box) |

Особисті конспекти (`lab2-notes.md`, `lab3-notes.md`) у репозиторії —
для підготовки до усного захисту.

## Що зроблено відносно ЛР-2

- **Semantic HTML:** `header > nav` → `main > section` → `footer`;
  картки планів — `article`.
- **Heading hierarchy:** `h1` (тема сторінки) → `h2` (тарифні плани) →
  `h3` (плани), без пропусків рівнів; розмір керується CSS.
- **Metadata:** `lang="uk"`, `charset`, `viewport`, змістовний `title`,
  `meta description`, `link rel="canonical"`.
- **Content:** опис продукту, короткі описи планів, фічі українською,
  без keyword stuffing; усі CTA ведуть до секції контактів.
- **Links vs buttons:** якорі-переходи — `<a>`; справжніх дій (form,
  submit) на сторінці немає, тому `button` не використовується.
- **AI-assisted workflow:** аудит ЛР-2 → 7 рекомендацій AI → перевірка
  за MDN/Google → 5 прийнято, 1 частково, 1 відхилено.

## Деплой

GitHub Pages (Deploy from branch) або Vercel (Framework Preset: Other).

## Посилання

- Repository: https://github.com/&lt;username&gt;/&lt;repository&gt;
- GitHub Pages: https://&lt;username&gt;.github.io/&lt;repository&gt;/
- Vercel: https://&lt;project&gt;.vercel.app/
