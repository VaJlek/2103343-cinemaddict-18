import { remove, render, replace, RenderPosition } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsView from '../view/film-details-view.js';

import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';
import FilmDetailsCommentContainerView from '../view/film-details-comment-container-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmCardPresenter {

  #filmListContainer = null;
  #contentContainer = null;
  #filmCardComponent = null;
  #filmDetailsInfoComponent = null;
  #filmDetailsCommentComponent = null;
  #changeData = null;
  #changeMode = null;

  #film = [];
  #comments = [];
  #commentsModel = null;

  #mode = Mode.DEFAULT;


  #filmDetailsComponent = new FilmDetailsView();
  #filmDetailsCommentContainerComponent = new FilmDetailsCommentContainerView();

  constructor(filmListContainer, changeData, changeMode, contentContainer) {
    this.#filmListContainer = filmListContainer;
    this.#contentContainer = contentContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(film) {

    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmDetailsInfoComponent = new FilmDetailsInfoView(film);

    this.#filmDetailsCommentComponent = new FilmDetailsCommentView(film);

    render(this.#filmCardComponent, this.#filmListContainer);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if(prevFilmCardComponent === null) {

      render(this.#filmCardComponent, this.#filmListContainer);

    } else {

      replace(this.#filmCardComponent, prevFilmCardComponent);
    }
    remove(prevFilmCardComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmDetailsInfoComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      remove (this.#filmDetailsInfoComponent);
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist },
    }, this.#filmListContainer,);
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched },
    }, this.#filmListContainer,);
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite },
    }, this.#filmListContainer,);
  };

  #handleDetailWatchlistClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist },
    }, this.#filmListContainer,);
    this.#renderFilmDetails();
  };

  #handleDetailsAlreadyWatchedClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched },
    }, this.#filmListContainer,);
    this.#renderFilmDetails();
  };

  #handleDetailsFavoriteClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData({
      ...this.#film, userDetails: { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite },
    }, this.#filmListContainer,);
    this.#renderFilmDetails();
  };

  #onFilmDetailsClosePopupButton = () => {

    remove (this.#filmDetailsComponent);
    this.#filmListContainer.classList.remove('hide-overflow');

  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onFilmDetailsClosePopupButton();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #hideOverflow() {
    if (!(this.#contentContainer.classList.contains('hide-overflow'))) {
      this.#contentContainer.classList.add('hide-overflow');
    }
  }
  /*
  #removePreviousPopup() {
    if (this.#contentContainer.querySelector('.film-details')) {
      this.#contentContainer.querySelector('.film-details').remove();
    }
  }
  */

  #renderFilmDetails = () =>{
    this.#hideOverflow();

    render(this.#filmDetailsComponent, this.#contentContainer, RenderPosition.AFTEREND);
    render(this.#filmDetailsInfoComponent, this.#filmDetailsComponent.element);

    this.#renderFilmComments();

    this.#filmDetailsComponent.setClickHandler(this.#onFilmDetailsClosePopupButton);
    this.#filmDetailsComponent.setWatchlistClickHandler(this.#handleDetailWatchlistClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleDetailsAlreadyWatchedClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleDetailsFavoriteClick);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #renderFilmComments = () => {

    render(this.#filmDetailsCommentContainerComponent, this.#contentContainer);
    render(this.#filmDetailsCommentComponent, this.#filmDetailsCommentContainerComponent.element);
  };


  #handleFilmCardLinkClick = () => {
    this.#changeMode();
    this.#mode = Mode.POPUP;
    this.#renderFilmDetails();
  };

}
