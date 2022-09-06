import { render } from '../render.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsAddCommentView from '../view/film-details-add-comment-view.js';
import FilmDetailsControlsView from '../view/film-details-controls-view.js';
import FilmDetailsFormView from '../view/film-details-form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';
import FilmDetailsContentView from '../view/film-details-content-view.js';

export default class PopupPresenter {
  init(contentContainer, film) {
    this.controlsComponent = new FilmDetailsControlsView;
    this.addCommentComponent = new FilmDetailsAddCommentView;
    //this.filmInfoComponent = new FilmDetailsInfoView;
    this.filmFormComponent = new FilmDetailsFormView;
    this.filmDetailsComponent = new FilmDetailsView;
    this.commentsComponent = new FilmDetailsCommentView;
    this.filmDetailsContentComponent = new FilmDetailsContentView;

    render(this.filmDetailsComponent, contentContainer);
    render(this.filmDetailsContentComponent, this.filmDetailsComponent.getElement());
    render(this.filmFormComponent, this.filmDetailsContentComponent.getElement());

    render(new FilmDetailsInfoView(film), this.filmFormComponent.getElement() );

    render(this.controlsComponent, this.filmFormComponent.getElement());

  }
}
