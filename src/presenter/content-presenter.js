import { render } from '../render.js';

import FilmCardView from '../view/film-card-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import PopupPresenter from './popup-presenter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #contentContainer = null;

  #moviesModel = null;
  #films = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  #commentsModel = null;
  #comments = [];

  #contentComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  init = (contentContainer, moviesModel, commentsModel) => {
    this.#contentContainer = contentContainer;

    this.#moviesModel = moviesModel;
    this.#films = [...this.#moviesModel.films];

    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    render(this.#contentComponent, this.#contentContainer);
    render(this.#filmListComponent, this.#contentComponent.element);

    if (this.#films.length === 0) {
      render(this.#showEmptyListTitle());
    } else {

      render(this.#filmListContainerComponent, this.#filmListComponent.element);

      for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilmCard(this.#films[i]);
      }
      if (this.#films.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmListComponent.element);

        this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick);
      }
    }
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);

    render(filmCardComponent, this.#filmListContainerComponent.element);
    this.#addPopup(filmCardComponent, film);

  };

  #addPopup = (filmCard, filmData) => {
    filmCard.element.addEventListener('click', () => {
      new PopupPresenter().init(this.#contentContainer.parentNode, filmData, this.#comments);
    });
  };

  #showEmptyListTitle() {
    const emptyListTitleElement = this.#filmListComponent.element.querySelector('.films-list__title');

    emptyListTitleElement.textContent = 'There are no movies in our database';
    emptyListTitleElement.classList.remove('visually-hidden');
  }

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

}
