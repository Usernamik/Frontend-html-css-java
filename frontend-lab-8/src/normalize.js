/**
 * @typedef {object} RawShow Запис із `data/shows.json` у форматі TVmaze.
 * @property {number} id
 * @property {string} name
 * @property {string[]} [genres]
 * @property {number | null} [runtime] тривалість серії, хв
 * @property {string | null} [premiered] дата прем'єри, "YYYY-MM-DD"
 * @property {{ average: number | null } | null} [rating]
 * @property {{ id: number, name: string } | null} [network]
 */

/**
 * @typedef {object} Show Серіал після normalizeShow() — з таким форматом працюють C2–C4.
 * @property {number} id
 * @property {string} name
 * @property {number | null} year рік прем'єри
 * @property {number | null} rating середня оцінка глядачів
 * @property {number | null} runtime тривалість серії, хв
 * @property {string | null} network назва телемережі
 * @property {string[]} genres
 */

/**
 * Витягує рік із `premiered` ("YYYY-MM-DD"). Будь-що інше — null: `new Date(null)`
 * дав би 1970, а `Number('не число')` — NaN, і обидва значення зіпсували б сортування C3.
 *
 * @param {string | null | undefined} premiered
 * @returns {number | null}
 */
function toYear(premiered) {
  if (typeof premiered !== 'string') return null;
  const year = Number.parseInt(premiered.slice(0, 4), 10);
  return Number.isInteger(year) ? year : null;
}

/**
 * C1. Перетворює запис TVmaze на {@link Show}.
 * Специфікація — ТЗ, C1.
 *
 * Замість `raw.rating.average` беремо `raw.rating?.average ?? null`: у записах
 * буває і `rating: null`, і `rating: { average: null }`. Важливо, що це саме `??`,
 * а не `||`: оцінка 0 — справжня оцінка, а `0 || null` перетворило б її на null.
 *
 * @param {RawShow} raw
 * @returns {Show}
 */
export function normalizeShow(raw) {
  return {
    id: raw.id,
    name: raw.name,
    year: toYear(raw.premiered),
    rating: raw.rating?.average ?? null,
    runtime: raw.runtime ?? null,
    network: raw.network?.name ?? null,
    // Саме копія, а не `raw.genres`: інакше повернений об'єкт і вхідний запис
    // ділили б один масив, і будь-яка правка `show.genres` змінювала б джерело.
    genres: Array.isArray(raw.genres) ? [...raw.genres] : [],
  };
}
