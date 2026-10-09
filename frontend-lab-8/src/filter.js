/** @typedef {import('./normalize.js').Show} Show */

/**
 * @typedef {object} FilterOptions
 * @property {string | null} [query] частина назви
 * @property {string | null} [genre] жанр
 * @property {number | null} [minRating] мінімальна оцінка
 */

/**
 * C2. Повертає серіали, які відповідають усім заданим фільтрам.
 * Специфікація — ТЗ, C2.
 *
 * Кожен фільтр може бути не заданий: `null`, `undefined`, порожній рядок і рядок
 * із самих пробілів означають «не фільтрувати». `minRating: 0` теж «не задано»:
 * обидва варіанти відсіюють однаковий набір (поріг 0 не відкидає нічого), і ТЗ
 * вимагає саме такого трактування, тому перевірка `> 0`, а не `!== null`.
 *
 * @param {Show[]} shows
 * @param {FilterOptions} [options]
 * @returns {Show[]}
 */
export function filterShows(shows, options = {}) {
  const query = normalizeQuery(options.query);
  const genre = normalizeText(options.genre);
  const minRating = typeof options.minRating === 'number' && options.minRating > 0
    ? options.minRating
    : null;

  return shows.filter((show) => {
    if (query !== null && !show.name.toLowerCase().includes(query)) return false;
    if (genre !== null && !show.genres.includes(genre)) return false;
    // Серіал без оцінки (null) не проходить жоден числовий поріг.
    if (minRating !== null && !(typeof show.rating === 'number' && show.rating >= minRating)) {
      return false;
    }
    return true;
  });
}

/**
 * Порожній рядок, рядок із пробілів і не-рядок стають «не задано» (null).
 *
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function normalizeText(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Пошук за назвою — без урахування регістру, тому запит зводимо до нижнього
 * регістру, а назву — при кожному порівнянні. Жанр так не можна: у C2 він
 * порівнюється точно (`genre: 'Drama'`), бо регістр назв жанрів фіксований TVmaze.
 *
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function normalizeQuery(value) {
  const trimmed = normalizeText(value);
  return trimmed === null ? null : trimmed.toLowerCase();
}
