import AbstractView from '../framework/view/abstract-view.js';

const MESSAGES = {
  'all': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'alreadyWatched': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now'
};

const createFilmListTemplate = (filterName) => (`<section class="films-list">
<h2 class="films-list__title">${MESSAGES[filterName]}</h2></section>`);

export default class FilmListView extends AbstractView{
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilmListTemplate(this.#filter);
  }

  removeElement() {
    super.removeElement();
    this.#filter = null;
  }

}
