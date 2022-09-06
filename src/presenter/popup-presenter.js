import { render } from '../render.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsAddCommentView from '../view/film-details-add-comment-view.js';
import FilmDetailsControlsView from '../view/film-details-controls-view.js';
import FilmDetailsFormView from '../view/film-details-form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';

export default class PopupPresenter {
  init(contentContainer, film) {
    this.controlsComponent = new FilmDetailsControlsView;
    this.addCommentComponent = new FilmDetailsAddCommentView;
    this.filmInfoComponent = new FilmDetailsInfoView;
    this.filmFormComponent = new FilmDetailsFormView;
    this.filmDetailsComponent = new FilmDetailsView;
    this.commentsComponent = new FilmDetailsCommentView;

    render(this.filmDetailsComponent, contentContainer);
    render(this.filmInfoComponent, this.filmDetailsComponent.getElement());

    render(new FilmDetailsInfoView(film), this.filmDetailsComponent.getElement() );

    render(this.controlsComponent, this.filmInfoComponent.getElement());

  }
}
