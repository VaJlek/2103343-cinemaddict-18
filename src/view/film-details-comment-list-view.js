import {createElement} from '../render.js';

const createFilmDetailsCommentListTemplate = () => '<ul class="film-details__comments-list"> </ul>';

export default class FilmDetailsCommentListView {
  #element = null;

  get template() {
    return createFilmDetailsCommentListTemplate();
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
