import { render } from '../render.js';

import FilmInfoView from '../view/film-details-info-view.js';
import AddFilmCommentView from '../view/film-details-add-comment-view.js';
import FilmControlsView from '../view/film-details-controls-view.js';
import FilmFormView from '../view/film-details-form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmCommentView from '../view/film-detalis-comment-view.js';

export default class PopupPresenter {
  init(contentContainer, films) {
    this.controlsComponent = new FilmControlsView;
    this.addCommentComponent = new AddFilmCommentView;
    this.filmInfoComponent = new FilmInfoView;
    this.filmFormComponent = new FilmFormView;
    this.filmDetailsComponent = new FilmDetailsView;
    this.commentsComponent = new FilmCommentView;

    render(this.filmDetailsComponent, contentContainer);
    render(this.filmInfoComponent, this.filmDetailsComponent.getElement());

    this.filmFormComponent.getElement().children[0].children[0].addEventListener('click', () => {
      const currentPopup = contentContainer.querySelector('.film-details');
      currentPopup.remove();
    });
    render(new FilmInfoView(films), this.filmFormComponent.getElement() );

    render(this.controlsComponent, this.filmFormComponent.getElement());

  }
}
