/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Поки C3 не виконано, фільтрів немає,
 * і список показує всі серіали. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const form = /** @type {HTMLFormElement} */ (document.querySelector('#filters'));
  return {
    query: /** @type {HTMLInputElement} */ (form.elements.namedItem('query')).value,
    genre: /** @type {HTMLSelectElement} */ (form.elements.namedItem('genre')).value,
    mine: /** @type {HTMLInputElement} */ (form.elements.namedItem('mine')).checked,
  };
}

/**
 * C3. Підключає форму фільтрів: після кожної зміни — refresh(). main.js викликає цю функцію
 * один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = /** @type {HTMLFormElement} */ (document.querySelector('#filters'));

  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  // Enter у полі пошуку: без скасування сторінка перезавантажиться (C3.3).
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    refresh();
  });

  // Подія reset настає до очищення полів, а form.reset() усередині неї нічого не робить,
  // тож скасовуємо стандартну дію й очищаємо поля самі, після чого перемальовуємо список.
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    for (const control of /** @type {Iterable<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (form.elements)) {
      if (control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio')) {
        control.checked = control.defaultChecked;
      } else {
        control.value = control.defaultValue;
      }
    }
    refresh();
  });
}
