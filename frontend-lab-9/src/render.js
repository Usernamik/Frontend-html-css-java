/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/** Заповнювач для відсутніх даних. */
const EMPTY = '—';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const template = document.querySelector('#show-card');
  const results = document.querySelector('#results');
  const status = document.querySelector('#status');

  const cards = list.map((show) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.id = String(show.id);

    // Назва трапляється кілька разів: заголовок і приховані частини обох кнопок.
    for (const slot of card.querySelectorAll('[data-field="name"]')) slot.textContent = show.name;

    card.querySelector('[data-field="year"]').textContent = show.year ?? EMPTY;
    card.querySelector('[data-field="genres"]').textContent = show.genres.length ? show.genres.join(', ') : EMPTY;
    card.querySelector('[data-field="rating"]').textContent = show.rating ?? EMPTY;

    const note = notes.get(show.id);
    if (note) {
      card.querySelector('.card__mine').hidden = false;
      card.querySelector('[data-field="my-rating"]').textContent = String(note.rating);
      const text = card.querySelector('[data-field="note"]');
      text.textContent = note.text;
      text.hidden = note.text === '';
    }

    card.querySelector('[data-action="toggle"]').setAttribute('aria-pressed', watchlist.has(show.id) ? 'true' : 'false');
    return card;
  });

  results.replaceChildren(...cards);
  status.textContent = list.length ? `Знайдено: ${list.length} з ${shows.length}` : 'Нічого не знайдено';
}
