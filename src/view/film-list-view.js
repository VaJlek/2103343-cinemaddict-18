import { createElement } from '../render.js';

const createFilmListTemplate = () => (`<section class="films-list">
<h2 class="films-list__title">There are no movies in our database</h2></section>`);

export default class FilmListView {
  getTemplate() {
    return createFilmListTemplate();
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