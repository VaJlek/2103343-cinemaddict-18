import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  _films = Array.from({length: 9}, generateMovie);

  get films() {
    return this._films;
  }
}
