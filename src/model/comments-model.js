import { generateComment } from '../mock/comments.js';

export default class CommentsModel {
  _comments = Array.from({length: 3}, generateComment);

  get comments() {
    return this._comments;
  }
}
