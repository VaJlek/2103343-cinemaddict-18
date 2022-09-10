import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  #films = Array.from({length: 22}, generateMovie);

  get films() {
    return this.#films;
  }
}
