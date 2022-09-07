import { render } from '../render.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsControlsView from '../view/film-details-controls-view.js';
import FilmDetailsFormView from '../view/film-details-form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmDetailsContentView from '../view/film-details-content-view.js';
import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';
import FilmDetailsCommentContainerView from '../view/film-details-comment-container-view.js';
import FilmDetailsCommentListView from '../view/film-details-comment-list-view.js';
import FilmDetailsAddCommentView from '../view/film-details-add-comment-view.js';


export default class PopupPresenter {
  init(contentContainer, film, comments) {
    this.controlsComponent = new FilmDetailsControlsView;
    this.filmFormComponent = new FilmDetailsFormView;
    this.filmDetailsComponent = new FilmDetailsView;
    this.filmDetailsContentComponent = new FilmDetailsContentView;

    this.filmDetailsCommentContainerComponent = new FilmDetailsCommentContainerView;
    this.filmDetailsCommentListComponent = new FilmDetailsCommentListView;
    this.filmDetailsAddCommentComponent = new FilmDetailsAddCommentView;

    render(this.filmDetailsComponent, contentContainer);
    render(this.filmDetailsContentComponent, this.filmDetailsComponent.getElement());
    render(this.filmFormComponent, this.filmDetailsContentComponent.getElement());


    render(new FilmDetailsInfoView(film), this.filmFormComponent.getElement() );

    render(this.controlsComponent, this.filmFormComponent.getElement());

    render(this.filmDetailsCommentContainerComponent, this.filmFormComponent.getElement());
    render(this.filmDetailsCommentListComponent, this.filmDetailsCommentContainerComponent.getElement());
    render(this.filmDetailsAddCommentComponent, this.filmDetailsCommentContainerComponent.getElement());
    for (let i = 1; i < 5; i++) {
      render(new FilmDetailsCommentView(comments[i]), this.filmDetailsCommentListComponent.getElement());
    }
  }
}
