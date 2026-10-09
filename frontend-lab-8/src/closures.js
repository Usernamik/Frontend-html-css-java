/**
 * @typedef {object} Counter
 * @property {() => number} increment збільшує значення на 1 і повертає нове
 * @property {() => number} reset повертає значення до початкового і повертає його
 * @property {() => number} value поточне значення
 */

/**
 * C5.1. Створює лічильник.
 * Специфікація — ТЗ, C5.
 *
 * @param {number} [start]
 * @returns {Counter}
 */
export function createCounter(start = 0) {
  // `current` живе тільки в цьому виклику createCounter і в замиканні трьох
  // методів нижче: назовні його не видно й не можна зіпсувати. Два лічильники
  // не заважають один одному, бо кожен виклик створює окрему змінну.
  let current = start;
  return {
    increment: () => (current += 1),
    reset: () => (current = start),
    value: () => current,
    // Стрілкові функції не мають власного this, тому методи працюють навіть
    // коли їх витягли з об'єкта: `const { increment } = createCounter()`.
  };
}

/**
 * C5.2. Обгортає `fn` так, що вона виконується щонайбільше один раз.
 * Специфікація — ТЗ, C5.
 *
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {F}
 */
export function once(fn) {
  // Прапорець `called`, а не перевірка результату: fn може законно повернути
  // undefined, 0 або null, і `if (!result)` викликав би її знову.
  let called = false;
  /** @type {ReturnType<F>} */
  let result;
  return /** @type {F} */ ((...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  });
}

/**
 * C5.3. Запам'ятовує результати `fn` для кожного значення її єдиного аргументу.
 * Специфікація — ТЗ, C5.
 *
 * @template T, R
 * @param {(arg: T) => R} fn
 * @returns {(arg: T) => R}
 */
export function memoize(fn) {
  // Map, а не звичайний об'єкт: ключами можуть бути будь-які значення, а
  // `map.has(arg)` відрізняє закешований результат `0` від «ще не рахували»
  // (перевірка `if (cache[arg])` викликала б fn для кожного нуля знову).
  // Map зберігає типи ключів, тому 1 і '1' — різні записи.
  /** @type {Map<T, R>} */
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
