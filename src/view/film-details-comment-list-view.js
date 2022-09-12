import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsCommentListTemplate = () => '<ul class="film-details__comments-list"> </ul>';

export default class FilmDetailsCommentListView extends AbstractView{

  get template() {
    return createFilmDetailsCommentListTemplate();
  }

}
