import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no history movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmListTemplate = (filterType, isEmpty) => {
  const hiddenClass = isEmpty ? '' : ' visually-hidden';
  const noFilmTextValue = isEmpty ? NoFilmTextType[filterType] : '';
  return (
    `<section class="films-list">
<h2 class="films-list__title ${hiddenClass}">${noFilmTextValue}
</h2></section>`);

};

export default class FilmListView extends AbstractView{
  #isEmpty = null;
  #filterType = null;

  constructor(filterType, isEmpty) {
    super();
    this.#isEmpty = isEmpty;
    this.#filterType = filterType;
  }

  get template() {
    return createFilmListTemplate(this.#filterType, this.#isEmpty);
  }

}
