import { render, remove, RenderPosition } from '../framework/render.js';

import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FooterView from '../view/footer-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import {updateItem, sortDate, sortRating} from '../utils/utils.js';
import { SortType } from '../const.js';


const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #contentContainer = null;
  #footerContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #sortComponent = new SortingView();
  #contentComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #footerComponent = new FooterView();

  #filmListContainerComponent = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #comments = [];
  #filmCardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor(contentContainer, moviesModel, commentsModel, footer){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#footerContainer = footer;

  }


  init = () => {
    this.#films = [...this.#moviesModel.films];
    this.#comments = [...this.#commentsModel.comments];
    this.#sourcedFilms = [...this.#moviesModel.films];
    this.#renderContent();
    //this.#renderFooter();

  };

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #sortFilms = (sortType) => {

    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortRating);
        break;
      default:

        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#contentContainer, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearFilmsList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(
      this.#filmListContainerComponent.element,
      this.#handleFilmChange,
      this.#handleModeChange,
      this.#contentContainer,
      this.#comments);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);

  };

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmsList = () => {

    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
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

  #renderFooter = () => {
    render(this.#footerComponent, this.#footerContainer);
  };

  #renderContent = () => {

    this.#renderSort();
    render(this.#contentComponent, this.#contentContainer);
    render(this.#filmListComponent, this.#contentComponent.element);

    if (this.#films.length === 0) {
      render(this.#showEmptyListTitle());

    } else {

      this.#renderFilmsList();

    }
  };

}
