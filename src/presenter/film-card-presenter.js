import { remove, render, replace, RenderPosition } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

import FilmCardView from '../view/film-card-view.js';

import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsView from '../view/film-details-view.js';

import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';
import FilmDetailsCommentContainerView from '../view/film-details-comment-container-view.js';
import FilmDetailsAddCommentView from '../view/film-details-add-comment-view.js';
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmCardPresenter {

  #contentContainer = null;
  #filmCardComponent = null;
  #filmDetailsInfoComponent = null;
  #filmDetailsCommentContainerComponent = null;
  #filmDetailsAddCommentComponent = null;
  #changeData = null;
  #changeMode = null;
  #container = null;

  #commentsModel = null;
  #filterModel = null;
  #film = null;

  #mode = Mode.DEFAULT;

  #filmDetailsComponent = new FilmDetailsView();

  constructor(changeData, changeMode,contentContainer, commentsModel, filterModel ) {

    this.#contentContainer = contentContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

  }

  init(film, container) {

    this.#film = film;
    this.#container = container;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmDetailsInfoComponent = new FilmDetailsInfoView(film);

    render(this.#filmCardComponent, this.#container);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if(prevFilmCardComponent === null) {

      render(this.#filmCardComponent, this.#container);

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
      this.#mode = Mode.DEFAULT;
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist },
      this.#container,);
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched },
      this.#container,);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite },
      this.#container,
    );
  };

  #handleDetailWatchlistClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist },
      this.#container,
    );
    this.#renderFilmDetails();
  };

  #handleDetailsAlreadyWatchedClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched },
      this.#container,
    );
    this.#renderFilmDetails();
  };

  #handleDetailsFavoriteClick = () => {
    remove(this.#filmDetailsComponent);
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite },
      this.#container,
    );
    this.#renderFilmDetails();
  };

  #onFilmDetailsClosePopupButton = () => {

    remove (this.#filmDetailsComponent);
    this.#container.classList.remove('hide-overflow');
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

  #renderFilmDetails = () =>{
    this.#hideOverflow();

    render(this.#filmDetailsComponent, this.#contentContainer, RenderPosition.AFTEREND);
    render(this.#filmDetailsInfoComponent, this.#filmDetailsComponent.element);

    this.#renderFilmComments();

    this.#filmDetailsComponent.setClickHandler(this.#onFilmDetailsClosePopupButton);
    this.#filmDetailsComponent.setWatchlistClickHandler(this.#handleDetailWatchlistClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleDetailsAlreadyWatchedClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleDetailsFavoriteClick);
    this.#filmDetailsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
    this.#filmDetailsComponent.setAddCommentHandler(this.#handleAddCommentClick);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #renderFilmComments = () => {

    this.#filmDetailsCommentContainerComponent = new FilmDetailsCommentContainerView(this.#film.comments.length);
    this.#filmDetailsAddCommentComponent = new FilmDetailsAddCommentView(this.#commentsModel.comments);
    this.#renderFilmComment();
    render(this.#filmDetailsCommentContainerComponent, this.#filmDetailsInfoComponent.element, RenderPosition.BEFOREEND);

    render(this.#filmDetailsAddCommentComponent, this.#filmDetailsCommentContainerComponent.element);

  };

  #renderFilmComment = () => {

    for (let i = 0; i < this.#film.comments.length; i++ ) {
      const comment = this.#commentsModel.comments[this.#film.comments[i]];
      render(new FilmDetailsCommentView(comment), this.#filmDetailsCommentContainerComponent.element);
    }
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
      UpdateType.PATCH,
      { comment, film }
    );
  };


  #handleDeleteCommentClick = (id) => {

    const index = this.#film.comments.findIndex((commentId) => id === commentId);
    this.#film.comments.splice(index, 1);
    const film = this.#film;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { id, film }
    );
  };

}
