import { remove, render, replace } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';
import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsControlsView from '../view/film-details-controls-view.js';
import FilmDetailsFormView from '../view/film-details-form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmDetailsContentView from '../view/film-details-content-view.js';

import FilmDetailsCommentView from '../view/film-detalis-comment-view.js';
//import FilmDetailsCommentContainerView from '../view/film-details-comment-container-view.js';
//import FilmDetailsCommentListView from '../view/film-details-comment-list-view.js';
import FilmDetailsAddCommentView from '../view/film-details-add-comment-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmCardPresenter {

  #container = null;
  #contentContainer = null;
  #filmCardComponent = null;
  #filmDetailsInfoComponent = null;
  //#filmDetailsComponent = null;
  #changeData = null;
  #changeMode = null;

  #film = null;
  #comments = [];
  #commentsModel = null;

  #mode = Mode.DEFAULT;

  #controlsComponent = new FilmDetailsControlsView();
  #filmFormComponent = new FilmDetailsFormView();
  #filmDetailsComponent = new FilmDetailsView();
  #filmDetailsContentComponent = new FilmDetailsContentView();




  constructor(commentsModel, changeData, changeMode) {
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(film, container) {

    this.#container = container;
    this.#film = film;

    //const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmDetailsInfoComponent = new FilmDetailsInfoView(this.#film);

    //this.#filmCardComponent.setClickHandler(this.#handleFilmCardLinkClick);
/*
    if(prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#container);
    } else {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }
    remove(prevFilmCardComponent);
/*
    this.#hideOverflow();
    this.#removePreviousPopup();
    render(this.#filmDetailsComponent, this.#contentContainer);
    render(this.#filmDetailsContentComponent, this.#filmDetailsComponent.element);
    render(this.#filmFormComponent, this.#filmDetailsContentComponent.element);


    render(new FilmDetailsInfoView(this.#film), this.#filmFormComponent.element);

    render(this.#controlsComponent, this.#filmFormComponent.element);

    render(this.#filmDetailsCommentContainerComponent, this.#filmFormComponent.element);
    render(this.#filmDetailsCommentListComponent, this.#filmDetailsCommentContainerComponent.element);
    render(this.#filmDetailsAddCommentComponent, this.#filmDetailsCommentContainerComponent.element);

    render(new FilmDetailsCommentView(this.#comments[this.#film.comments]), this.#filmDetailsCommentListComponent.element);

    this.#filmDetailsComponent.setCloseClickHandler(() => {
      this.#onFilmDetailsClosePopupButton();
    }
    );
    */
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmDetailsInfoComponent);
  };

  #onFilmDetailsClosePopupButton = () => {

    remove (this.#filmDetailsComponent);
    this.#container.classList.remove('hide-overflow');

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

  #removePreviousPopup() {
    if (this.#contentContainer.querySelector('.film-details')) {
      this.#contentContainer.querySelector('.film-details').remove();
    }
  }

  #renderFilmDetails = () =>{
    this.#hideOverflow();
    render(this.#filmDetailsComponent);
    this.#filmDetailsComponent.setClickHandler(this.#onFilmDetailsClosePopupButton);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #renderFilmComments = () => {
    //#filmDetailsCommentContainerComponent = new FilmDetailsCommentContainerView();
    //#filmDetailsCommentListComponent = new FilmDetailsCommentListView();
    //#filmDetailsAddCommentComponent = new FilmDetailsAddCommentView();

  };

  #handleFilmCardLinkClick = () => {
    this.#changeMode();
    this.#mode = Mode.POPUP;
    this.#renderFilmDetails();
  };

}
