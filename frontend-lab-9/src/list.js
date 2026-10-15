import { openDetails } from './details.js';
import { toggle, watchlist } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const list = document.querySelector('#results');
  const counter = document.querySelector('#watchlist-count');
  const heading = document.querySelector('#results-heading');

  // Заголовок має приймати фокус програмно (C3.7), але не потрапляти в порядок Tab.
  heading.tabIndex = -1;

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    const card = button?.closest('li[data-id]');
    if (!button || !card) return;

    const id = Number(card.dataset.id);
    if (button.dataset.action === 'details') {
      openDetails(id);
      return;
    }

    // Місце картки серед сусідів — потрібне, якщо після перемальовування вона зникне.
    const index = [...list.children].indexOf(card);
    toggle(id);
    counter.textContent = String(watchlist.size);
    refresh();

    const same = list.querySelector(`li[data-id="${id}"] [data-action="toggle"]`);
    if (same) {
      same.focus();
      return;
    }
    const cards = [...list.children];
    const neighbor = cards[index] ?? cards[index - 1];
    if (neighbor) neighbor.querySelector('[data-action="toggle"]')?.focus();
    else heading.focus();
  });
}
