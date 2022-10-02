import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsTemplate = () => '<section class="film-details"></section>';

export default class FilmDetailsView extends AbstractView{

  get template() {
    return createFilmDetailsTemplate();
  }

  closeAllPopups = () => {
    document.querySelectorAll('.film-details')
      .forEach((node) => node.remove());
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

}
