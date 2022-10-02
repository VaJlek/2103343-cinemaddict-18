import Observable from '../framework/observable.js';
import { generateMovie } from '../mock/movie.js';

export default class MoviesModel extends Observable {
  #films = Array.from({length: 9}, generateMovie);

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

}
