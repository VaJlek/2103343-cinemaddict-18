import { render } from '../render.js';

import FilmCardView from '../view/film-card-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import PopupPresenter from './popup-presenter.js';

export default class ContentPresenter {
  contentComponent = new FilmsView;
  filmListComponent = new FilmListView;
  filmListContainerComponent = new FilmListContainerView;
  showMoreButtonComponent = new ShowMoreButtonView;

  init = (contentContainer, moviesModel) => {
    this.contentContainer = contentContainer;
    this.films = moviesModel.films;

    render(this.contentComponent, this.contentContainer);
    render(this.filmListComponent, this.contentComponent.getElement());
    render(this.filmListContainerComponent, this.filmListComponent.getElement());
    render(this.showMoreButtonComponent, this.filmListComponent.getElement());

    for (let i = 1; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmListContainerComponent.getElement());

      this.filmListContainerComponent.getElement().lastChild.addEventListener('click', () => {
        new PopupPresenter().init(contentContainer.parentNode, this.films[i]);//, this.commentsModel.comments);
      });
    }
  };

}

