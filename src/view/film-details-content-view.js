import { createElement } from '../render.js';

const createFilmDetailsContentTemplate = () => '<div class="film-details__inner"> </div>';

export default class FilmDetailsContentView {
  #element = null;

  get template() {
    return createFilmDetailsContentTemplate();
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
