import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsCommentContainerTemplate = (userCommentsCount) => {

  const commentsCount = userCommentsCount;

  return `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    <ul class="film-details__comments-list">

    </ul>
  </section>
</div>`;
};
export default class FilmDetailsCommentContainerView extends AbstractView{

  #comment = null;

  constructor (comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createFilmDetailsCommentContainerTemplate(this.#comment);
  }

}
