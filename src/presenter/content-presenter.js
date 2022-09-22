import { render, remove, RenderPosition, replace } from '../framework/render.js';

import NavigationView from '../view/navigation-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FooterView from '../view/footer-view.js';

import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import {updateItem, sortDate, sortRating} from '../utils/utils.js';
import { SortType } from '../const.js';
import { generateFilter } from '../mock/filter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #contentContainer = null;
  #footerContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #filters = null;
  #mainNavigationComponent = null;
  #sortComponent = null;
  #contentComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #footerComponent = null;

  #filmListContainerComponent = new FilmListContainerView();
  #filmsListTopRatedContainerComponent = new FilmListContainerView();
  #filmsListMostCommentedContainerComponent = new FilmListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #comments = [];
  #filmCardPresenter = new Map();

  #filmCardTopRatedPresenter = new Map();
  #filmCardMostCommentedPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor(contentContainer, moviesModel, commentsModel, footer){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#footerContainer = footer;
    this.#filters = generateFilter(moviesModel.films);
    this.#mainNavigationComponent = new NavigationView(this.#filters);
  }


  init = () => {
    this.#films = [...this.#moviesModel.films];
    this.#comments = [...this.#commentsModel.comments];
    this.#sourcedFilms = [...this.#moviesModel.films];
    render(this.#mainNavigationComponent, this.#contentContainer, RenderPosition.BEFOREBEGIN);
    this.#renderContent();
    this.#renderFooter();

  };

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCardTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCardMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm, container) => {

    const prevMainNavigationComponent = this.#mainNavigationComponent;

    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmCardPresenter.get(updatedFilm.id).init(updatedFilm, container);

    if (this.#filmCardTopRatedPresenter.get(updatedFilm.id)) {
      this.#filmCardTopRatedPresenter.get(updatedFilm.id).init(updatedFilm, container);
    }
    if (this.#filmCardMostCommentedPresenter.get(updatedFilm.id)) {
      this.#filmCardMostCommentedPresenter.get(updatedFilm.id).init(updatedFilm, container);
    }
    this.#filters = generateFilter(this.#films);
    this.#mainNavigationComponent = new NavigationView(this.#filters);

    replace(this.#mainNavigationComponent, prevMainNavigationComponent);

  };

  #renderFilmsListTopRated = () => {

    render(this.#filmsListTopRatedComponent, this.#contentComponent.element);
    render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
    this.#renderFilms(0, 2, this.#filmsListTopRatedContainerComponent.element );
  };

  #renderFilmsListMostCommented = () => {

    render(this.#filmsListMostCommentedComponent, this.#contentComponent.element);
    render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
    this.#renderFilms(0, 2, this.#filmsListMostCommentedContainerComponent.element);

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
    this.#renderContent();
  };

  #renderSort = () => {

    if(this.#sortComponent) {
      const prevSortComponent = this.#sortComponent;
      this.#sortComponent = new SortingView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      replace(this.#sortComponent, prevSortComponent);

    } else {
      this.#sortComponent = new SortingView(this.#currentSortType);
      render( this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
  };

  #clearFilmsList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this.#filmCardTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardTopRatedPresenter.clear();
    this.#filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardMostCommentedPresenter.clear();
    remove(this.#showMoreButtonComponent);
  };

  #renderFilmCard = (film, container) => {
    const filmCardPresenter = new FilmCardPresenter(
      this.#handleFilmChange,
      this.#handleModeChange,
      this.#contentContainer,
      this.#comments);
    filmCardPresenter.init(film, container);
    switch (container) {
      case this.#filmsListTopRatedContainerComponent.element:
        this.#filmCardTopRatedPresenter.set(film.id, filmCardPresenter);
        break;
      case this.#filmsListMostCommentedContainerComponent.element:
        this.#filmCardMostCommentedPresenter.set(film.id, filmCardPresenter);
        break;
      default:
        this.#filmCardPresenter.set(film.id, filmCardPresenter);
    }

  };

  #renderFilms = (from, to, container) => {
    this.#films.slice(from, to).forEach((film) => this.#renderFilmCard(film, container));
  };

  #renderFilmsList = () => {

    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP), this.#filmListContainerComponent.element);

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

    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP, this.#filmListContainerComponent.element );

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove (this.#showMoreButtonComponent);
    }
  };

  #renderFooter = () => {
    this.#footerComponent = new FooterView(this.#films.length);
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
      this.#renderFilmsListTopRated();
      this.#renderFilmsListMostCommented();

    }
  };

}
