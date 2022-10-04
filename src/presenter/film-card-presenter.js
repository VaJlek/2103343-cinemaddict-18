import { remove, render, replace } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

import FilmCardView from '../view/film-card-view.js';

export default class FilmCardPresenter {

  #contentContainer = null;
  #filmCardComponent = null;
  #changeData = null;
  #film = null;
  #filmDetailsPresenter = null;

  constructor( changeData, contentContainer, filmDetailsPresenter) {

    this.#contentContainer = contentContainer;
    this.#changeData = changeData;
    this.#filmDetailsPresenter = filmDetailsPresenter;
  }

  init(film) {

    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if(prevFilmCardComponent === null) {

      render(this.#filmCardComponent, this.#contentContainer);
      return;
    } else {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  setSaving = () => {
    this.#filmCardComponent.updateElement({
      isDisabled: true
    });
  };

  #resetState = () => {
    this.#filmCardComponent.updateElement({
      isDisabled: false
    });
  };

  setAborting = () => {
    this.#filmCardComponent.shake(this.#resetState);
  };

  #handleFilmCardLinkClick = () => {
    this.#filmDetailsPresenter.init(this.#film);
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
}
