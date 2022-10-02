import AbstractView from '../framework/view/abstract-view.js';
import { humanizeToDate, formatDuration } from '../utils/utils.js';

const createFilmDetailsTemplate = (film) => {

  const {
    filmInfo: {
      title,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: { date, releaseCountry},
      runtime,
      genre,
      description
    },
    userDetails: { watchlist, alreadyWatched, favorite}
  } = film;

  const normDate = humanizeToDate(date);
  const duration = formatDuration(runtime);

  const detailsWatchlistClassName = watchlist
    ? 'film-details__control-button--active'
    : '';
  const detailsWatchedClassName = alreadyWatched
    ? 'film-details__control-button--active'
    : '';
  const detailsFavoriteClassName = favorite
    ? 'film-details__control-button--active'
    : '';

  return `<div class="film-details__inner">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
  <div class="film-details__info-wrap">
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
      <p class="film-details__total-rating">${totalRating}</p>
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
      <td class="film-details__cell">${normDate}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${duration}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${releaseCountry}</td>
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
</div>
<section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${detailsWatchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched  ${detailsWatchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${detailsFavoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
    </div>`;
};

export default class FilmDetailsInfoView extends AbstractView{
  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film,);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    console.log('## click2: ', this._callback.watchlistClick);
    this._callback.watchlistClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
