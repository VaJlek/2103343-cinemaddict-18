import AbstractView from '../framework/view/abstract-view.js';

const createFilmDetailsContentTemplate = () => '<div class="film-details__inner"> </div>';

export default class FilmDetailsContentView extends AbstractView{

  get template() {
    return createFilmDetailsContentTemplate();
  }

}
