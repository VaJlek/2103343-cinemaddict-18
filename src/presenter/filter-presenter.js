import {render, replace, remove} from '../framework/render.js';
import NavigationView from '../view/navigation-view.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(contentContainer, filtersModel, moviesModel) {
    this.#filterContainer = contentContainer;
    this.#filtersModel = filtersModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new NavigationView(filters);
    this.#filterComponent.setFilterTypeChangeHandler(this.#filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
