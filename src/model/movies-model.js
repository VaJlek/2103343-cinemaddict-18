import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  _films = Array.from({length: 5}, generateMovie);

  get films() {
    return this._films;
  }
}
