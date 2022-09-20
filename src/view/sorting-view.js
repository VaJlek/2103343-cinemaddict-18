import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortingTemplate = (sortType) => {
  const defaultClassName = sortType === SortType.DEFAULT
    ? 'sort__button--active'
    : '';
  const dateClassName = sortType === SortType.DATE
    ? 'sort__button--active'
    : '';
  const ratingClassName = sortType === SortType.RATING
    ? 'sort__button--active'
    : '';

  return `<ul class="sort">
<li><a href="#" class="sort__button ${defaultClassName}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button ${dateClassName}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${ratingClassName}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;
};

export default class SortingView extends AbstractView{

  #sortType = null;

  constructor(sortType) {
    super();
    this.#sortType = sortType;

  }

  get template() {
    return createSortingTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
