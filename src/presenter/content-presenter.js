import { render, remove, RenderPosition, replace } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import FilmListContainerView from '../view/film-list-container-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FooterView from '../view/footer-view.js';
import LoadingView from '../view/loading-view.js';
import UserTitleView from '../view/user-title-view.js';

import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import { sortDate, sortRating, sortComments} from '../utils/utils.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit, RatingCountToName } from '../const.js';
import { filter } from '../utils/filter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {

  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #headerContainer = null;
  #contentContainer = null;
  #footerContainer = null;

  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #contentComponent = null;
  #filmListComponent = null;
  #footerComponent = null;
  #headerComponent = null;


  #filmListContainerComponent = new FilmListContainerView();
  #filmsListTopRatedContainerComponent = new FilmListContainerView();
  #filmsListMostCommentedContainerComponent = new FilmListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #showMoreButtonComponent = null;


  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  #filmCardPresenter = new Map();
  #filmDetailsPresenter = null;
  #filmCardTopRatedPresenter = new Map();
  #filmCardMostCommentedPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(contentContainer, moviesModel, commentsModel, filterModel, siteHeaderElement,siteFooterElement){
    this.#contentContainer = contentContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#footerContainer = siteFooterElement;
    this.#headerContainer = siteHeaderElement;

    this.#filmDetailsPresenter = new FilmDetailsPresenter(
      this.#moviesModel,
      this.#commentsModel,
    );
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {

    this.#filterType = this.#filterModel.filter;
    const films = this.#moviesModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortDate);
      case SortType.RATING:
        return filteredFilms.sort(sortRating);
    }

    return filteredFilms;
  }

  init = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderContent();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          this.#filmCardPresenter.get(update.id)?.setSaving();
          this.#filmCardTopRatedPresenter.get(update.id)?.setSaving();
          this.#filmCardMostCommentedPresenter.get(update.id)?.setSaving();
          await this.#moviesModel.update(updateType, update);
        } catch (err) {
          this.#filmCardPresenter.get(update.id)?.setAborting();
          this.#filmCardTopRatedPresenter.get(update.id)?.setAborting();
          this.#filmCardMostCommentedPresenter.get(update.id)?.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id)?.init(data);
        this.#filmCardTopRatedPresenter.get(data.id)?.init(data);
        this.#filmCardMostCommentedPresenter.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderContent();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentContainer);
  };

  #renderFilmsListTopRated = () => {
    const films = [...this.#moviesModel.films].sort(sortRating);
    render(this.#filmsListTopRatedComponent, this.#contentComponent.element);
    render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
    this.#renderFilms(films.slice().slice(0, 2), this.#filmsListTopRatedContainerComponent.element );
  };

  #renderFilmsListMostCommented = () => {
    const films = [...this.#moviesModel.films].sort(sortComments);
    render(this.#filmsListMostCommentedComponent, this.#contentComponent.element);
    render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
    this.#renderFilms(films.slice().slice(0, 2), this.#filmsListMostCommentedContainerComponent.element);
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
    render( this.#sortComponent, this.#contentContainer, RenderPosition.BEFOREEND);
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
    remove(this.#contentComponent);
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
      //this.#filmListContainerComponent.element,
      this.#filmDetailsPresenter.init,
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
  };/*
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };*/

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
    const prevFooterComponent = this.#footerComponent;
    this.#footerComponent = new FooterView(this.#moviesModel.films.length);
    if (prevFooterComponent === null){
      render(this.#footerComponent, this.#footerContainer);
      return;
    }
    replace(this.#footerComponent, prevFooterComponent);
    remove(prevFooterComponent);

  };

  #renderFilmsList = () => {

    this.#contentComponent = new FilmsView();
    this.#filmListComponent = new FilmListView(this.#filterModel.filter, !this.films.length);


    render(this.#contentComponent, this.#contentContainer);
    render(this.#filmListComponent, this.#contentComponent.element);

    this.#renderFilmsListContainer();
  };

  #renderHeader = () => {

    const prevHeaderComponent = this.#headerComponent;

    const countWatched = filter[FilterType.HISTORY](this.#moviesModel.films).length;
    const ratingName = RatingCountToName.find(({ count }) => count > countWatched).name;
    this.#headerComponent = new UserTitleView(ratingName);

    if (prevHeaderComponent === null) {
      render(this.#headerComponent, this.#headerContainer);
      return;
    }

    replace(this.#headerComponent, prevHeaderComponent);
    remove(prevHeaderComponent);
  };

  #renderContent = () => {
    this.#renderHeader();
    this.#renderSort();
    this.#renderFilmsList();
    this.#renderFilmsListTopRated();
    this.#renderFilmsListMostCommented();
    this.#renderFooter();
  };

}
