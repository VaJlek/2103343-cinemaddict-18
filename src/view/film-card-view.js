import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { humanizeToYear, formatDuration } from '../utils/utils.js';

const createFilmCardTemplate = ({film, isDisabled}) => {
  const { comments, filmInfo, userDetails } = film;
  const { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  //: {date},
  const { watchlist, alreadyWatched, favorite} = userDetails;


  const commentsCount = comments.length ? `${comments.length} comments` : 'No comments yet';

  const normDate = humanizeToYear(release);
  const duration = formatDuration(runtime);

  const watchlistClassName = watchlist
    ? 'film-card__controls-item--active'
    : '';
  const watchedClassName = alreadyWatched
    ? 'film-card__controls-item--active'
    : '';
  const favoriteClassName = favorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${normDate}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genre}</span>
  </p>
  <img src=${poster} alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <span class="film-card__comments">${commentsCount}</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Mark as favorite</button>
</div>
</article>`;
};
export default class FilmCardView extends AbstractStatefulView{

  constructor (film) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  static parseFilmToState = (film) => ({
    film,
    isDisabled: false
  });

  _restoreHandlers = () => {
    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickHandler);
    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);

  };

  setClickHandler = (callback) => {

    this._callback.click = callback;
    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}


