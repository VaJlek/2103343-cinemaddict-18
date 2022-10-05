import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, text, count} = filter;

  return (`<a href="#${name}"
            class="main-navigation__item
            ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
            data-filter-type="${name}">
            ${text}
            <span class="main-navigation__item-count">${count}</span>
            </a>`);
};

const createNavigationTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`);
};

export default class NavigationView extends AbstractView{
  #filter = null;
  #currentFilter = null;

  constructor(filter, currentFilter) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createNavigationTemplate(this.#filter, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  };
}


