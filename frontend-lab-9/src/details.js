import { getShow, notes, saveNote } from './state.js';

/** id серіалу, для якого зараз відкрито діалог. @type {number | null} */
let currentId = null;

/**
 * Опис TVmaze — HTML-розмітка. Розбираємо її в інертному документі (жоден ресурс не
 * завантажується, жоден обробник не виконується) і повертаємо тексти абзаців.
 *
 * @param {string} html
 * @returns {string[]}
 */
function summaryParagraphs(html) {
  const doc = new DOMParser().parseFromString(html ?? '', 'text/html');
  return [...doc.body.children].map((element) => element.textContent.trim()).filter(Boolean);
}

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  currentId = id;

  const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('#details'));
  document.querySelector('#details-title').textContent = show.name;
  /** @type {HTMLAnchorElement} */ (document.querySelector('#details-link')).href = show.url;

  const summary = document.querySelector('#details-summary');
  summary.replaceChildren(
    ...summaryParagraphs(show.summary).map((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }),
  );

  const form = /** @type {HTMLFormElement} */ (document.querySelector('#note-form'));
  const rating = /** @type {HTMLInputElement} */ (form.elements.namedItem('rating'));
  const note = /** @type {HTMLTextAreaElement} */ (form.elements.namedItem('note'));
  const error = document.querySelector('#note-rating-error');

  const saved = notes.get(id);
  rating.value = saved ? String(saved.rating) : '';
  note.value = saved ? saved.text : '';
  rating.removeAttribute('aria-invalid');
  error.textContent = '';

  dialog.showModal();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('#details'));
  const form = /** @type {HTMLFormElement} */ (document.querySelector('#note-form'));
  const rating = /** @type {HTMLInputElement} */ (form.elements.namedItem('rating'));
  const note = /** @type {HTMLTextAreaElement} */ (form.elements.namedItem('note'));
  const error = document.querySelector('#note-rating-error');
  const status = document.querySelector('#status');
  const list = document.querySelector('#results');

  // Валідацію робимо самі, щоб показати текст помилки під полем, а не бульбашку браузера.
  form.noValidate = true;
  rating.setAttribute('aria-describedby', 'note-rating-error');

  // Esc закриває діалог сам; «Скасувати» — теж кнопка закриття.
  const cancel = [...dialog.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Скасувати');
  cancel?.addEventListener('click', () => dialog.close());

  // Щойно значення виправлено — помилка зникає.
  rating.addEventListener('input', () => {
    rating.removeAttribute('aria-invalid');
    error.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const raw = rating.value.trim();
    const value = Number(raw);
    if (raw === '' || !Number.isInteger(value) || value < 1 || value > 10) {
      rating.setAttribute('aria-invalid', 'true');
      error.textContent = 'Укажіть ціле число від 1 до 10';
      rating.focus();
      return;
    }

    saveNote(currentId, { rating: value, text: note.value });
    const name = getShow(currentId).name;

    // Картку треба перемальовану, тож статус і фокус ставимо після refresh().
    refresh();
    status.textContent = `Нотатку до ${name} збережено`;
    dialog.close();
    list.querySelector(`li[data-id="${currentId}"] [data-action="details"]`)?.focus();
  });
}
