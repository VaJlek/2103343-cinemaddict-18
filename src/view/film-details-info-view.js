import { createElement } from '../render.js';

const createFilmInfoTemplate = (film) => {

  const {title, rating, poster, ageRating, director, writers, actors, releaseDate, runtime, country, genre, description } = film.movie_info;
  return `<div class="film-details__info-wrap">
<div class="film-details__poster">
  <img class="film-details__poster-img" src="${poster}" alt="">

  <p class="film-details__age">${ageRating}</p>
</div>

<div class="film-details__info">
  <div class="film-details__info-head">
    <div class="film-details__title-wrap">
      <h3 class="film-details__title">${title}</h3>
      <p class="film-details__title-original">Original: ${title}</p>
    </div>

    <div class="film-details__rating">
      <p class="film-details__total-rating">${rating}</p>
    </div>
  </div>

  <table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${actors}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${releaseDate}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${runtime}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${country}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Genres</td>
      <td class="film-details__cell">
        <span class="film-details__genre">${genre}</span>
        </td>
    </tr>
  </table>

  <p class="film-details__film-description">
  ${description}
  </p>
</div>
</div>`;
};

export default class FilmInfoView {
  constructor (film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmInfoTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
