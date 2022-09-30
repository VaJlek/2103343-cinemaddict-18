import { render, remove, RenderPosition } from '../framework/render.js';

//import NavigationView from '../view/navigation-view.js';
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
  #filterModel = null;

  #sortComponent = null;
  #contentComponent = null;
  #filmListComponent = null;
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

  constructor(contentContainer, moviesModel, commentsModel, filterModel, footer){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#footerContainer = footer;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {

    this.#filterType = this.#filterModel.filter;
    const films = this.#moviesModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredFilms].sort(sortDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortRating);
    }

    return filteredFilms;
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
        this.#clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderContent();
        break;
    }
  };

  #renderFilmsListTopRated = () => {
    const films = this.films;
    render(this.#filmsListTopRatedComponent, this.#contentComponent.element);
    render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
    this.#renderFilms(films.slice().sort(sortRating).slice(0, 2), this.#filmsListTopRatedContainerComponent.element );


  };

  #renderFilmsListMostCommented = () => {

    render(this.#filmsListMostCommentedComponent, this.#contentComponent.element);
    render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
    this.#renderFilms(this.films.slice().sort(sortRating).slice(0, 2), this.#filmsListMostCommentedContainerComponent.element);
    //сделать отрисовку по комментариям
  };

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmsList({resetRenderedFilmsCount: true});
    this.#renderContent();
  };

  #renderSort = () => {

    this.#sortComponent = new SortingView(this.#currentSortType);
    render( this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

  };

  #clearFilmsList = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#filmCardTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardTopRatedPresenter.clear();
    this.#filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardMostCommentedPresenter.clear();
    remove(this.#filmListComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);

    if(resetRenderedFilmsCount){
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmCard = (film, container) => {
    const filmCardPresenter = new FilmCardPresenter(
      this.#handleViewAction,
      this.#handleModeChange,
      this.#contentContainer,
      this.#commentsModel,
      this.#filterModel
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

  #renderFilmsListContainer = () => {
    const films = this.films;
    const filmCount = films.length;

    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmsCount)), this.#filmListContainerComponent.element);

    if (filmCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmListContainerComponent.element);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount === filmCount) {
      remove (this.#showMoreButtonComponent);
    }
  };

  #renderFooter = () => {
    this.#footerComponent = new FooterView(this.films.length);
    render(this.#footerComponent, this.#footerContainer);
  };

  #renderFilmsList = () => {

    this.#contentComponent = new FilmsView();
    this.#filmListComponent = new FilmListView(this.#filterModel.filter, !this.films.length);


    render(this.#contentComponent, this.#contentContainer);
    render(this.#filmListComponent, this.#contentComponent.element);

    this.#renderFilmsListContainer();
    this.#renderFilmsListTopRated();
    this.#renderFilmsListMostCommented();
  };

  #renderContent = () => {

    this.#renderSort();
    this.#renderFilmsList();

  };

}
