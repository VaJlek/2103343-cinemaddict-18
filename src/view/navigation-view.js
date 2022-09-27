import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';
import { getFilteredFilmsCount } from '../utils/utils.js';

const createNavigationTemplate = (filters) => `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getFilteredFilmsCount(
    filters,
    FilterType.WATCHLIST,
  )}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${getFilteredFilmsCount(
    filters,
    FilterType.HISTORY,
  )}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getFilteredFilmsCount(
    filters,
    FilterType.FAVORITES,
  )}</span></a>
  </nav>`;

export default class NavigationView extends AbstractView{
  #filters = null;


  constructor(filters) {
    super();
    this.#filters = filters;

  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      this._callback.filterTypeChange(evt.target.id);
    }
  };
}


