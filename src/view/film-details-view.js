import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsTemplate = () => '<section class="film-details"></section>';//<div class="film-details__inner"> </div>

export default class FilmDetailsView extends AbstractView{

  get template() {
    return createFilmDetailsTemplate();
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };
}
