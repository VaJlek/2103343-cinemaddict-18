import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createFilmDetailsTemplate = () => '<section class="film-details"></section>';

export default class FilmDetailsView extends AbstractStatefulView{

  constructor(film, comments) {
    super();
    this._state.comments = FilmDetailsView.parseFilmToState(film, comments);
    this.#setHandlers();

  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  #restoreScrollPosition = () => {
    document.querySelector('.film-details').scrollTop = this._state.scrollTop;
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseButtonHandler);
  };

  #clickCloseButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };


  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
    this.#restoreScrollPosition();
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
    this.#restoreScrollPosition();
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
    this.#restoreScrollPosition();
  };

  #scrollHandler = (evt) => {
    evt.preventDefault();
    this._setState({ scrollTop: evt.target.scrollTop });
  };

  #setHandlers = () => {
    this.element
      .addEventListener('scroll', this.#scrollHandler);
  };

  _restoreHandlers = () => {
    this.#setHandlers();
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  static parseFilmToState = (film) => ({...film, scrollTop: 0,}
  );

  static parseStateToFilm = (state) => ({ ...state });

}
