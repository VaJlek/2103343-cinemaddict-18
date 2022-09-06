import { createElement } from '../render.js';

const createFilmDetailsContentTemplate = () => '<div class="film-details__inner"> </div>';

export default class FilmDetailsContentView {
  getTemplate() {
    return createFilmDetailsContentTemplate();
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
