import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class MoviesModel extends Observable {

  #filmsApiService = null;
  #films = [];

  constructor (filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      this.#films = await this.#filmsApiService.films;
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  get films() {
    return this.#films;
  }

  get = (id) => this.#films.find((film) => film.id === id);

  update = async (updateType, update) => {
    try {
      const film = await this.#filmsApiService.update(update);
      this.#setFilm(film);
      this._notify(updateType, film);
    } catch (err) {
      throw new Error('MovieModel.update()');
    }
  };

  updateModel = (updateType, update) => {
    if (updateType === UpdateType.MODEL) {
      this.#setFilm(update);
    }
  };

  #setFilm = (film) => {
    const index = this.#films.findIndex(({ id }) => id === film.id);

    if (index === -1) {
      throw new Error('MovieModel.#setFilm');
    }
    this.#films = [
      ...this.#films.slice(0, index),
      film,
      ...this.#films.slice(index + 1),
    ];
  };
}
