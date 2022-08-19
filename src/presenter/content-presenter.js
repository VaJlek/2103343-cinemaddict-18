import { render } from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import ContentView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class ContentPresenter {
  contentComponent = new ContentView;
  filmListComponent = new FilmListView;
  filmListContainerComponent = new FilmListContainerView;
  showMoreButtonComponent = new ShowMoreButtonView;

  init = (contentContainer) => {
    this.contentContainer = contentContainer;

    render(this.contentComponent, this.contentContainer);
    render(this.filmListComponent, this.contentComponent.getElement());
    render(this.filmListContainerComponent, this.filmListComponent.getElement());
    render(this.showMoreButtonComponent, this.filmListComponent.getElement());

    for (let i = 1; i <= 5; i++) {
      render(new FilmCardView, this.filmListContainerComponent.getElement());
    }
  };

}

