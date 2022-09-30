import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeToDateWithTime } from '../utils/utils.js';
import dayjs from 'dayjs';
import he from 'he';

const DEFAULT_STATE = {
  id: null,
  author: 'USERNAME',
  comment: '',
  date: dayjs().format(),
  emotion: null
};

const createComment = (userCommentData) => {

  const {id ,author, comment, date, emotion } = userCommentData;
  const normDate = humanizeToDateWithTime(date);

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${normDate}</span>
      <button id=${id} class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;

};


const createCommentsTemplate = (comments, userComment) => {

  const commentsCount = comments.length;

  const createComments = comments.length
    ? comments
      .map((comment) => createComment(comment))
      .join('')
    : '';


  const emojiLabelTemplate = userComment.emotion
    ? `<img src="images/emoji/${userComment.emotion}.png" width="55" height="55" alt="emoji-smile">`
    : '';

  return `<div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
            <ul class="film-details__comments-list">${createComments}</ul>
            <form class="film-details__new-comment" action="" method="get">
            <div class="film-details__add-emoji-label">${emojiLabelTemplate}</div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(userComment.comment)}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </form>
        </section>
      </div>`;
};

export default class FilmDetailsCommentView extends AbstractStatefulView {
  #comments = null;
  constructor(comments) {
    super();
    this.#comments = comments.slice();
    this._state.comments = comments.slice().map((comment) => FilmDetailsCommentView.parseCommentToState(comment));
    this._state.userComment = {...DEFAULT_STATE};
    this.#setHandlers();
  }

  get template() {
    return createCommentsTemplate(this._state.comments, this._state.userComment);
  }

  removeElement() {
    super.removeElement();
  }

  reset() {
    const state = {
      comments: this.#comments.slice().map((comment) => FilmDetailsCommentView.parseCommentToState(comment)),
      userComment: {...DEFAULT_STATE}
    };
    this.updateElement(state);
    this.#setHandlers();
  }

  setAddCommentHandler = (callback) => {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this.#addCommentHandler);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteCommentHandler);
  };

  #setHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#inputHandler);
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteCommentHandler);
    this.element
      .addEventListener('keydown', this.#addCommentHandler);
  };

  #emojiClickHandler = (evt) => {
    if (evt.target.classList.contains('film-details__emoji-item')) {
      this._state.userComment.emotion = evt.target.value;
      this.updateElement({...this._state.userComment, emotion: evt.target.value});
    }
  };

  #inputHandler = (evt) => {
    this._state.userComment.comment = evt.target.value;
    this._setState({...this._state.userComment, comment: evt.target.value});
  };

  #addCommentHandler = (evt) => {
    if (!evt.ctrlKey || evt.key !== 'Enter') {
      if (this._state.userComment.emotion && this._state.userComment.comment) {
        this._callback.formSubmit(FilmDetailsCommentView.parseStateToComment(this._state.userComment));
      }
    }
  };

  #deleteCommentHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      const toBeDeleted = this.#comments.slice().find((comment) => comment.id === evt.target.id);
      this._callback.deleteComment(toBeDeleted);
    }
  };

  _restoreHandlers = () => {
    this.#setHandlers();
  };


  static parseCommentToState = (comment) => ({...comment});

  static parseStateToComment = (state) => ({...state});
}
