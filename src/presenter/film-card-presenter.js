import { remove, render, replace, RenderPosition } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

import FilmCardView from '../view/film-card-view.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsView from '../view/film-details-view.js';

import FilmDetailsCommentsView from '../view/film-details-comments-view.js';
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmCardPresenter {

  #contentContainer = null;
  #filmCardComponent = null;
  #filmDetailsInfoComponent = null;
  #filmDetailsCommentsComponent = null;

  #changeData = null;
  #changeMode = null;
  #container = null;

  #commentsModel = null;
  #film = null;

  #mode = Mode.DEFAULT;

  #filmDetailsComponent = null;

  constructor(film, changeData, changeMode,contentContainer, commentsModel) {
    this.#film = film;
    this.#contentContainer = contentContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init(film, container) {

    this.#film = film;
    this.#container = container;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    render(this.#filmCardComponent, this.#container);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if(prevFilmCardComponent === null) {

      render(this.#filmCardComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.POPUP){

      replace(this.#filmCardComponent, prevFilmCardComponent);

    }
    remove(prevFilmCardComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.POPUP) {
      remove (this.#filmDetailsComponent);
      this.#container.classList.remove('hide-overflow');
      this.#mode = Mode.DEFAULT;
    }
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film,);
  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film,);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film,
    );
  };

  #onFilmDetailsClosePopupButton = () => {
    this.#mode = Mode.DEFAULT;
    remove (this.#filmDetailsComponent);
    this.#contentContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);

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

  #renderFilmDetails = () => {
    if (this.#mode !== Mode.DEFAULT) {
      remove(this.#filmDetailsComponent);

      this.#hideOverflow();

      this.#changeMode();

      this.#filmDetailsComponent = new FilmDetailsView();
      this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);

      render(this.#filmDetailsComponent, this.#contentContainer, RenderPosition.AFTEREND);
      render(this.#filmDetailsInfoComponent, this.#filmDetailsComponent.element);

      this.#renderFilmComments();

      this.#filmDetailsComponent.setClickHandler(this.#onFilmDetailsClosePopupButton);
      this.#filmDetailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
      this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);


      document.addEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderFilmComments = () => {

    this.#filmDetailsCommentsComponent = new FilmDetailsCommentsView(this.#film, this.#commentsModel.comments);

    render(this.#filmDetailsCommentsComponent, this.#filmDetailsInfoComponent.element, RenderPosition.BEFOREEND);

    this.#filmDetailsCommentsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
    this.#filmDetailsCommentsComponent.setAddCommentHandler(this.#handleAddCommentClick);

  };

  #handleFilmCardLinkClick = () => {
    this.#changeMode();
    this.#mode = Mode.POPUP;
    this.#renderFilmDetails();
  };

  #handleAddCommentClick = (comment) => {
    this.#film.comments.push(comment.id);
    const film = this.#film;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      { comment, film }
    );
  };


  #handleDeleteCommentClick = (id) => {

    const index = this.#film.comments.findIndex((commentId) => id === commentId);
    this.#film.comments.splice(index, 1);
    const film = this.#film;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      { id, film }
    );
  };

}
