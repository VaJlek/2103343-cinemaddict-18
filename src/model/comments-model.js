import Observable from '../framework/observable';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable{

  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }


  get comments() {
    return this.#comments;
  }

  download = async (updateType, data) => {
    try {
      this.#comments = await this.#commentsApiService.get(data.id);
    } catch (err) {
      this.#comments = [];
    }
    this._notify(updateType, data);
  };

  add = async (updateType, { id, comment }) => {
    let data;
    try {
      data = await this.#commentsApiService.add(id, comment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
    this.#comments = data.comment;
    this._notify(UpdateType.MODEL, data.film);
    this._notify(updateType, data.film);
  };

  delete = async (updateType, { id, film }) => {
    try {
      await this.#commentsApiService.delete(id);
      const index = film.comments.findIndex((comment) => comment === id);
      film.comments.splice(index, 1);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }

    this._notify(UpdateType.MODEL, film);
    this._notify(updateType, film);
  };

}

