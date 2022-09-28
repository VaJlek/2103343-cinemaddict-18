import { render, remove, RenderPosition, replace } from '../framework/render.js';

import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FooterView from '../view/footer-view.js';

import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import { sortDate, sortRating} from '../utils/utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #contentContainer = null;
  #footerContainer = null;

  #moviesModel = null;
  #commentsModel = null;
  #filtersModel = null;

  #sortComponent = null;
  #contentComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #footerComponent = null;

  #filmListContainerComponent = new FilmListContainerView();
  #filmsListTopRatedContainerComponent = new FilmListContainerView();
  #filmsListMostCommentedContainerComponent = new FilmListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #showMoreButtonComponent = null;


  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  #filmCardPresenter = new Map();

  #filmCardTopRatedPresenter = new Map();
  #filmCardMostCommentedPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(contentContainer, moviesModel, commentsModel, filtersModel, footer){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filtersModel = filtersModel;
    this.#footerContainer = footer;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get films() {

    this.#filterType = this.#filtersModel.filter;
    const films = this.#moviesModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredFilms].sort(sortDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortRating);
    }

    return this.filteredFilms;
  }

  init = () => {

    this.#renderContent();
    this.#renderFooter();

  };

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCardTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCardMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#moviesModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update.comment);
        this.#moviesModel.updateFilm(updateType, update.film);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update.id);
        this.#moviesModel.updateFilm(updateType, update.film);
        break;
    }

  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList(SortType.DEFAULT);
        this.#renderContent();
        break;
    }
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

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#clearFilmsList(sortType);
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
    //this.#currentSortType = sortType;
    remove(this.#showMoreButtonComponent);
  };

  #renderFilmCard = (film, container) => {
    const filmCardPresenter = new FilmCardPresenter(
      this.#handleViewAction,
      this.#handleModeChange,
      this.#contentContainer,
      this.#commentsModel,
      this.#filtersModel
    );
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

  #renderFilms = (films, container) => {

    films.forEach((film) => this.#renderFilmCard(film, container));
  };

  #renderFilmsList = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILMS_COUNT_PER_STEP));
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilms(films);
    if (filmCount > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #showEmptyListTitle() {
    const emptyListTitleElement = this.#filmListComponent.element.querySelector('.films-list__title');

    emptyListTitleElement.textContent = 'There are no movies in our database';
    emptyListTitleElement.classList.remove('visually-hidden');
  }

  #handleShowMoreButtonClick = () => {
    //this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP, this.#filmListContainerComponent.element );
    //this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;
    const filmCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= films) {
      remove (this.#showMoreButtonComponent);
    }
  };

  #renderFooter = () => {
    this.#footerComponent = new FooterView(this.films.length); //this.#films.length
    render(this.#footerComponent, this.#footerContainer);
  };

  #renderContent = () => {
    const filmsCount = this.films.length;
    this.#renderSort();

    render(this.#contentComponent, this.#contentContainer);
    render(this.#filmListComponent, this.#contentComponent.element);

    if (filmsCount === 0) {
      render(this.#showEmptyListTitle());

    } else {

      this.#renderFilmsList();
      this.#renderFilmsListTopRated();
      this.#renderFilmsListMostCommented();

    }
  };

}
