import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () => (`<section class="films-list">
<h2 class="films-list__title"></h2></section>`);

export default class FilmListView extends AbstractView {

  get template() {
    return createFilmListTemplate();
  }
}
