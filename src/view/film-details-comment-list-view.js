import {createElement} from '../render.js';

const createFilmDetailsCommentListTemplate = () => '<ul class="film-details__comments-list"> </ul>';

export default class FilmDetailsCommentListView {

  getTemplate() {
    return createFilmDetailsCommentListTemplate();
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
