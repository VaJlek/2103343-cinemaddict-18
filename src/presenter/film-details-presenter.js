import { remove, render, replace } from '../framework/render.js';
import { UpdateType, Mode} from '../const.js';

import FilmDetailsView from '../view/film-details-view.js';


export default class FilmDetailsPresenter {
  #film = null;
  #filmDetailsComponent = null;
  #commentsModel = null;
  #moviesModel = null;

  constructor(moviesModel, commentsModel) {
    this.#commentsModel = commentsModel;
    this.#moviesModel = moviesModel;
  }

  init = (film) => {
    this.#film = film;
    this.#moviesModel.addObserver(this.#handleModelEvent);
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
    this.#moviesModel.updateFilm(UpdateType.MINOR, this.#film);

  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#moviesModel.updateFilm(UpdateType.MINOR, this.#film);

  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#moviesModel.updateFilm(UpdateType.MINOR, this.#film);
  };

  #handleAddCommentClick = (comment) => {
    this.#film.comments.push(comment.id);

    this.#moviesModel.updateFilm(UpdateType.PATCH, this.#film);
    this.#commentsModel.addComment(UpdateType.PATCH, comment);
  };


  #handleDeleteCommentClick = (id) => {

    const index = this.#film.comments.findIndex((commentId) => id === commentId);
    this.#film.comments.splice(index, 1);

    this.#moviesModel.updateFilm(UpdateType.PATCH, this.#film);
    this.#commentsModel.deleteComment(UpdateType.PATCH, id);

  };

  #updateDetailsComponent = () => {
    this.#filmDetailsComponent.updateElement(
      {
        film: this.#film,
        listComments: this.#commentsModel.comments,
        emotion: null,
        message: null
      });};

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


