/** @typedef {import('./normalize.js').Show} Show */

/**
 * @typedef {object} GenreStats
 * @property {number} count скільки серіалів мають цей жанр
 * @property {number | null} averageRating середня оцінка цих серіалів
 */

/**
 * C4. Рахує статистику для кожного жанру.
 * Специфікація — ТЗ, C4.
 *
 * Середнє рахується лише за серіалами з оцінкою: `null` у суму не входить
 * (інакше `null` став би 0 і занизив середнє), але оцінка 0 входить — це
 * справжня оцінка. Жанр без оцінок дає `averageRating: null`, а не `NaN`
 * (0/0) і не 0. Округлення до одного знака — `Math.round(x * 10) / 10`, бо
 * `5.775.toFixed(1)` дало б рядок '5.8' замість числа (тести перевіряють
 * `typeof averageRating === 'number'`).
 *
 * @param {Show[]} shows
 * @returns {Record<string, GenreStats>} ключ — назва жанру
 */
export function genreStats(shows) {
  /** @type {Map<string, { count: number, sum: number, rated: number }>} */
  const byGenre = new Map();

  for (const show of shows) {
    for (const genre of show.genres) {
      const entry = byGenre.get(genre) ?? { count: 0, sum: 0, rated: 0 };
      entry.count += 1;
      if (typeof show.rating === 'number') {
        entry.sum += show.rating;
        entry.rated += 1;
      }
      byGenre.set(genre, entry);
    }
  }

  /** @type {Record<string, GenreStats>} */
  const stats = {};
  for (const [genre, { count, sum, rated }] of byGenre) {
    stats[genre] = {
      count,
      averageRating: rated === 0 ? null : Math.round((sum / rated) * 10) / 10,
    };
  }
  return stats;
}
