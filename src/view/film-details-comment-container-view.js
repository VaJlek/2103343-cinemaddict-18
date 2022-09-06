import { createElement } from '../render.js';

const createFilmDetailsCommentContainerTemplate = () => `<div class="film-details__bottom-container">
<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
</section>
</div>`;

export default class FilmDetailsCommentContainerView {

  getTemplate() {
    return createFilmDetailsCommentContainerTemplate();
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
