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
    this._setState({
      scroll: this.element.scrollTop
    });
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseButtonHandler);
  };

  #clickCloseButtonHandler = () => {
    this._callback.closeButtonClick();
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
    this.element.scrollTop = this._state.scroll;
    this.element.addEventListener('scroll', this.#restoreScrollPosition);
  };

  static parseFilmToState = (film) => ({...film, scroll: 0,}
  );

  static parseStateToFilm = (state) => ({ ...state });

}
