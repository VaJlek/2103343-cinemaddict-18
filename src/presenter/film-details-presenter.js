import { remove, render, replace } from '../framework/render.js';
import {UserAction, UpdateType, Mode} from '../const.js';

//import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsView from '../view/film-details-view.js';
//import FilmDetailsCommentsView from '../view/film-details-comments-view.js';

export default class FilmDetailsPresenter {
  #film = null;
  #filmDetailsComponent = null;
  //#filmDetailsInfoComponent = null;
  //#filmDetailsCommentsComponent = null;
  #changeData = null;
  #commentsModel = null;

  constructor(commentsModel, changeData) {
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    this.#commentsModel.addObserver(this.#handleModelEvent);

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#commentsModel.comments);

    this.#filmDetailsComponent.setCloseButtonClickHandler(this.#onFilmDetailsClosePopupButton);
    this.#filmDetailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
    this.#filmDetailsComponent.setAddCommentHandler(this.#handleAddCommentClick);

    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevFilmDetailsComponent === null || this.mode === Mode.DEFAULT ) {
      this.#renderFilmDetails();
      this.mode = 'popup';
    } else {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }
  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  #renderFilmDetails = () => {
    document.body.classList.add('hide-overflow');
    render(this.#filmDetailsComponent,document.body);
  };

  #onFilmDetailsClosePopupButton = () => {
    this.mode = Mode.DEFAULT;
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


  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(
      UserAction.UPDATE_FILM_DETAILS,
      UpdateType.MINOR,
      this.#film,);

  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(
      UserAction.UPDATE_FILM_DETAILS,
      UpdateType.MINOR,
      this.#film,);

  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(
      UserAction.UPDATE_FILM_DETAILS,
      UpdateType.MINOR,
      this.#film,
    );
  };

  #handleAddCommentClick = (comment) => {
    this.#film.comments.push(comment.id);
    this.#commentsModel.addComment(UpdateType.PATCH, comment);
  };


  #handleDeleteCommentClick = (id) => {

    const index = this.#film.comments.findIndex((commentId) => id === commentId);
    this.#film.comments.splice(index, 1);
    this.#commentsModel.deleteComment(UpdateType.PATCH, id);

  };

  #updateDetailsComponent = () => this.#filmDetailsComponent.updateElement(
    {
      film: this.#film,
      comments: this.#commentsModel.comments,
    });

  #handleModelEvent = (updateType, data) => {

    if (!this.mode === Mode.POPUP) {
      return;
    }

    switch (updateType) {

      case UpdateType.PATCH:
        this.#film = data;
        this.#updateDetailsComponent();
        break;

      case UpdateType.MINOR:
        this.#film = data;
        this.#updateDetailsComponent();
        break;
    }
  };

}


/*


  /*
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
  }; */
