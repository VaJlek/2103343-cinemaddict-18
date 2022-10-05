import { remove, render, replace } from '../framework/render.js';
import { UpdateType, Mode, TimeLimit, UserAction} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmDetailsPresenter {
  #film = null;
  #filmDetailsComponent = null;
  #commentsModel = null;
  #moviesModel = null;
  mode = Mode.DEFAULT;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(moviesModel, commentsModel) {
    this.#commentsModel = commentsModel;
    this.#moviesModel = moviesModel;
  }

  init = (film) => {
    this.#film = film;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film);
    render(this.#filmDetailsComponent,document.body);
    this.#filmDetailsComponent.setCloseButtonClickHandler(this.#onFilmDetailsClosePopupButton);
    this.#filmDetailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setDeleteCommentHandler(this.#handleDeleteCommentClick);
    this.#filmDetailsComponent.setAddCommentHandler(this.#handleAddCommentClick);

    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevFilmDetailsComponent === null || this.mode === Mode.DEFAULT ) {
      this.#renderFilmDetails();
      this.mode = Mode.POPUP;
    } else {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }
    this.#commentsModel.download(UpdateType.PATCH, this.#film);
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
    this.destroy();
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
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleAddCommentClick = (comment) => {
    this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, { comment, id: this.#film.id });
  };

  #handleDeleteCommentClick = (id) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, { id, film: this.#film });
  };

  #updateDetailsComponent = () => this.#filmDetailsComponent.updateElement(
    {
      film: this.#film,
      comments: this.#commentsModel.comments,
      isBlocked: false,
      deleteId: null
    });

  #handleModelEvent = (updateType, data) => {
    if (!this.mode === Mode.DEFAULT) {
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          this.#filmDetailsComponent.updateElement({ isBlocked: true });
          await this.#moviesModel.update(updateType, update);
        } catch (err) {
          this.#filmDetailsComponent.shakeControls(this.#updateDetailsComponent);
        }
        break;

      case UserAction.DELETE_COMMENT:
        try {
          this.#filmDetailsComponent.updateElement({ deleteId: update.id, isBlocked: true });
          await this.#commentsModel.delete(updateType, update);
        } catch (err) {
          this.#filmDetailsComponent.shakeComment(this.#updateDetailsComponent, {deleteId: update.id});
        }
        break;

      case UserAction.ADD_COMMENT:
        try {
          this.#filmDetailsComponent.updateElement({ isBlocked: true });
          await this.#commentsModel.add(updateType, update);
          this.#filmDetailsComponent.updateElement({ message: null, emotion: null });
        } catch (err) {
          this.#filmDetailsComponent.shakeInput(this.#updateDetailsComponent);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

}


