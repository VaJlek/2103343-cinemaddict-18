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
  #resetAllView = null;
  //#container = null;

  #commentsModel = null;
  #film = null;

  #mode = Mode.DEFAULT;

  #filmDetailsComponent = null;

  constructor( changeData, resetAllView, contentContainer, commentsModel) {

    this.#contentContainer = contentContainer;
    this.#changeData = changeData;
    this.#resetAllView = resetAllView;
    this.#commentsModel = commentsModel;

    this.#filmDetailsComponent = new FilmDetailsView();
    //this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);
    //this.#filmDetailsCommentsComponent = new FilmDetailsCommentsView(this.#film, this.#commentsModel.comments);

  }

  init(film) {

    this.#film = film;
    //this.#container = container;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);


    render(this.#filmCardComponent, this.#contentContainer);//this.#container);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if(prevFilmCardComponent === null) {

      render(this.#filmCardComponent, this.#contentContainer);// this.#container);
      return;
    } else {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.POPUP) {
      this.#resetDetailsView();
    }
  };


  #resetDetailsView = () =>{
    remove(this.#filmDetailsInfoComponent);
    remove(this.#filmDetailsCommentsComponent);
    remove (this.#filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
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
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);

  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onFilmDetailsClosePopupButton();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderFilmDetails = () => {

    if (this.#mode !== Mode.DEFAULT) {
      this.#filmDetailsComponent.closeAllPopups();
      this.#resetAllView();
      this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);

      this.#filmDetailsCommentsComponent = new FilmDetailsCommentsView(this.#film, this.#commentsModel.comments);

      render(this.#filmDetailsComponent,document.body);
      render(this.#filmDetailsInfoComponent, this.#filmDetailsComponent.element);
      render(this.#filmDetailsCommentsComponent, this.#filmDetailsInfoComponent.element, RenderPosition.BEFOREEND);

      this.#filmDetailsComponent.setCloseButtonClickHandler(this.#onFilmDetailsClosePopupButton);
      this.#filmDetailsInfoComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      this.#filmDetailsInfoComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
      this.#filmDetailsInfoComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#filmDetailsCommentsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
      this.#filmDetailsCommentsComponent.setAddCommentHandler(this.#handleAddCommentClick);

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#mode = Mode.POPUP;
    }
  };
  /*
  #renderFilmDetails = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmDetailsComponent.closeAllPopups();
      document.body.classList.remove('hide-overflow');
    }

    const prevInfoComponent = this.#filmDetailsInfoComponent;
    const prevCommentsComponent = this.#filmDetailsCommentsComponent;

    this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);
    console.log(this.#film);
    this.#filmDetailsCommentsComponent = new FilmDetailsCommentsView(this.#film, this.#commentsModel.comments);

    if (this.#filmDetailsInfoComponent !== prevInfoComponent || this.#filmDetailsCommentsComponent !== prevCommentsComponent) {
      document.body.classList.add('hide-overflow');
      remove(prevInfoComponent);
      remove(prevCommentsComponent);
      this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);
      this.#filmDetailsCommentsComponent = new FilmDetailsCommentsView(this.#film, this.#commentsModel.comments);

      render(this.#filmDetailsComponent,document.body);
      render(this.#filmDetailsInfoComponent, this.#filmDetailsComponent.element);
      render(this.#filmDetailsCommentsComponent, this.#filmDetailsInfoComponent.element, RenderPosition.BEFOREEND);

      this.#filmDetailsComponent.setCloseButtonClickHandler(this.#onFilmDetailsClosePopupButton);
      this.#filmDetailsInfoComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      this.#filmDetailsInfoComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
      this.#filmDetailsInfoComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#filmDetailsCommentsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
      this.#filmDetailsCommentsComponent.setAddCommentHandler(this.#handleAddCommentClick);
      document.addEventListener('keydown', this.#onEscKeyDown);
      return;
    }
    if (this.#filmDetailsComponent.element.contains(prevInfoComponent?.element)) {
      console.log("asdsad");
      replace(this.#filmDetailsInfoComponent, prevInfoComponent);
    }
    if (this.#filmDetailsComponent.element.contains(prevCommentsComponent?.element)) {
      replace(this.#filmDetailsCommentsComponent,prevCommentsComponent);
    }
  };
  */

  #handleFilmCardLinkClick = () => {
    this.#resetAllView();
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
      UpdateType.MINOR,
      { id, film }
    );
  };

}
