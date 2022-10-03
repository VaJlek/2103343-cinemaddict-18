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

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex(({ id }) => id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    const film = await this.#filmsApiService.update(update);

    this.#films = [
      ...this.#films.slice(0, index),
      film,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, film);
  };

}
