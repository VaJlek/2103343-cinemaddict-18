import { generateComment } from '../mock/comments.js';

export default class CommentsModel {
  #comments = Array.from({length: 5}, generateComment);

  get comments() {
    return this.#comments;

  }
}

