/** @typedef {import('./normalize.js').Show} Show */

/**
 * C3. Повертає новий масив серіалів, відсортований за полем `key`.
 * Специфікація — ТЗ, C3.
 *
 * `[...shows]` обов'язковий: `Array.prototype.sort` сортує **на місці** й
 * повертає той самий масив, тож `shows.sort(...)` змінив би аргумент (у тестах
 * він заморожений — було б TypeError) і «відсортував для показу» вхідні дані
 * для всього іншого коду. Копія сортується вже безпечно.
 *
 * `sort` у сучасних рушіях стабільний, тому однакові значення зберігають
 * вихідний порядок — це окремо перевіряють два тести про `year`.
 *
 * @param {Show[]} shows
 * @param {'name' | 'year' | 'rating'} key
 * @param {'asc' | 'desc'} [direction]
 * @returns {Show[]}
 */
export function sortShows(shows, key, direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1;
  return [...shows].sort((a, b) => compareBy(a[key], b[key], sign));
}

/**
 * Порівнює два значення поля. `null` (серіал без оцінки) завжди в кінці — і в
 * asc, і в desc: ця гілка повертає результат до множення на `sign`, інакше при
 * `desc` серіали без оцінки очолили б список. Рядки порівнюються через
 * `localeCompare`, а не `<`: `'Z' < 'a'` у посимвольному порядку дав би не
 * абетковий порядок, і `black-ish` стояв би після `Utopia`.
 *
 * @param {string | number | null | undefined} a
 * @param {string | number | null | undefined} b
 * @param {1 | -1} sign
 * @returns {number}
 */
function compareBy(a, b, sign) {
  const aMissing = a === null || a === undefined;
  const bMissing = b === null || b === undefined;
  if (aMissing || bMissing) return aMissing === bMissing ? 0 : aMissing ? 1 : -1;
  const order = typeof a === 'string' ? String(a).localeCompare(String(b)) : a - b;
  return sign * order;
}
