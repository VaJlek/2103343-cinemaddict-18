import { createElement } from '../render.js';

const createFilmFormTemplate = () => `<div class="film-details__top-container">
<div class="film-details__close">
  <button class="film-details__close-btn" type="button">close</button>
</div> </div>`;

export default class FilmDetailsFormView {
  #element = null;

  get template() {
    return createFilmFormTemplate();
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
