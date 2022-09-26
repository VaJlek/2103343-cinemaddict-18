import Observable from '../framework/observable.js';
import { generateMovie } from '../mock/movie.js';

export default class MoviesModel extends Observable {
  #films = Array.from({length: 12}, generateMovie);

  get films() {
    return this.#films;
  }

}
