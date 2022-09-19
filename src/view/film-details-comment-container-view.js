import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsCommentContainerTemplate = () => `<div class="film-details__bottom-container">
<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
    <ul class="film-details__comments-list">
    </ul>
  </section>
</div>`;

export default class FilmDetailsCommentContainerView extends AbstractView{

  get template() {
    return createFilmDetailsCommentContainerTemplate();
  }

}
