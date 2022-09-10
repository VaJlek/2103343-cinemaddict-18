import { createElement } from '../render.js';

const createFilmDetailsTemplate = () => '<section class="film-details"></section>';//<div class="film-details__inner"> </div>

export default class FilmDetailsView {
  #element = null;

  get template() {
    return createFilmDetailsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
