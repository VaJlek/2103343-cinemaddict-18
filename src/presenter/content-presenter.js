import { render, remove } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import PopupPresenter from './popup-presenter.js';
import {updateItem} from '../utils/utils.js';

const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #contentContainer = null;
  #moviesModel = null;
  #commentsModel = null;

  #contentComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();


  #films = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #comments = [];
  #popupPresenter = new Map();

  constructor(contentContainer, moviesModel, commentsModel){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

  }


  init = () => {
    this.#films = [...this.#moviesModel.films];
    this.#comments = [...this.#commentsModel.comments];

    this.#renderContent();
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);

    render(filmCardComponent, this.#filmListContainerComponent.element);
    this.#addPopup(filmCardComponent, film);

  };

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmsList = () => {
    render(this.#filmListComponent, this.#contentComponent.element);
    this.#renderFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };


  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #addPopup = (filmCard, filmData) => {
    filmCard.setClickHandler(() => {
      new PopupPresenter().init(this.#contentContainer.parentNode, filmData, this.#comments);
    });
  };

  #showEmptyListTitle() {
    const emptyListTitleElement = this.#filmListComponent.element.querySelector('.films-list__title');

    emptyListTitleElement.textContent = 'There are no movies in our database';
    emptyListTitleElement.classList.remove('visually-hidden');
  }

  #handleShowMoreButtonClick = () => {

    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove (this.#showMoreButtonComponent);
    }
  };

  #renderContent = () => {

    render(this.#contentComponent, this.#contentContainer);

    if (this.#films.length === 0) {
      render(this.#showEmptyListTitle());

    } else {

      this.#renderFilmsList();

    }
  };

}
