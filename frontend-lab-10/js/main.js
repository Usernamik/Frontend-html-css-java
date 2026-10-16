/* Courtly Booking — entry point */

import { fetchVenues } from './api.js';
import { renderResults } from './render.js';
import { openBooking } from './booking.js';
import { toISODate } from './format.js';

const form = document.getElementById('search-form');
const results = document.getElementById('results');
const status = document.getElementById('status');

// Venues currently on screen
let venues = [];

/* Mobile menu */

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav.classList.toggle('is-open', !isOpen);
});

/* Search */

form.date.value = toISODate(new Date());

function readFilters() {
  return { city: form.city.value, sport: form.sport.value };
}

async function handleSearch(event) {
  event.preventDefault();
  status.textContent = 'Шукаємо…';
  results.setAttribute('aria-busy', 'true');

  const found = await fetchVenues(readFilters());
  renderResults(results, found);
  venues = found;
  results.setAttribute('aria-busy', 'false');
  // Рядок статусу рахуємо тут, після рендера: окремий обробник submit
  // виконувався синхронно, до розв'язання await, і показував старий список.
  status.textContent = found.length ? `Знайдено: ${found.length}` : 'Нічого не знайдено';
}

form.addEventListener('submit', handleSearch);

/* Booking */

// Один делегований обробник: картки перемальовуються після кожного пошуку,
// а обробник прив'язаний до вузла, тому прив'язка до самих карток їх губила.
function bindBookButtons() {
  results.addEventListener('click', (event) => {
    const button = event.target.closest('.venue-card__book');
    if (!button) return;
    const venue = venues.find((item) => item.id === button.dataset.id);
    openBooking(venue, form.date.value || toISODate(new Date()));
  });
}

/* Initial state: popular venues */

venues = await fetchVenues({ popular: true });
renderResults(results, venues);
results.setAttribute('aria-busy', 'false');
status.textContent = `Популярні майданчики: ${venues.length}`;
bindBookButtons();
