import AbstractStatrfulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import { humanizeToDateWithTime } from '../utils/utils.js';
import { nanoid } from 'nanoid';

const createComment = (message) => message ?
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${message.emotion}.png" width="55" height="55" alt="emoji-${message.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${message.comment ? he.encode(message.comment) : ''}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${message.author}</span>
        <span class="film-details__comment-day">${humanizeToDateWithTime(message.date)}</span>
        <button class="film-details__comment-delete"
        data-id ="${message.id}">Delete</button>
      </p>
    </div>
  </li>` : '';

const createComments = (comments, listComments) => {
  listComments = listComments.filter(Boolean);
  const template = comments.length
    ? comments.map((index) => createComment(listComments.find(
      ({ id }) => id === index)))
      .join('')
    : '';
  return `<ul class="film-details__comments-list">${template}</ul>`;
};

const createCountComments = (count) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
${count ? count : 0}</span></h3>`;

const createFilmCommentsTemplate = (state) => {
  const {listComments, emotion, message} = state.comments;
  const {comments} = state.comments.film;
  const isChecked = (current, type) => (current === type ? 'checked' : '');
  const emojiLabelTemplate = emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';

  return `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    ${createCountComments(comments.length)}
    ${createComments(comments, listComments)}
    <form class="film-details__new-comment" action="" method="get">

    <div class="film-details__add-emoji-label">${emojiLabelTemplate}</div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${message ? he.encode(message) : ''}</textarea>
    </label>
    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isChecked(emotion, 'smile',)}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emotion="smile">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"  ${isChecked(emotion, 'sleeping',)}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emotion="sleeping">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isChecked(emotion, 'puke',)}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emotion="puke">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isChecked(emotion, 'angry',)}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emotion="angry">
      </label>
    </div>
    </form>
  </section>
</div>`;

};

export default class FilmDetailsCommentsView extends AbstractStatrfulView{

  constructor(film, comments) {
    super();
    this._state.comments = FilmDetailsCommentsView.parseCommentToState(film, comments);
    this._restoreHandlers();
  }

  get template() {
    return createFilmCommentsTemplate(this._state);
  }


  #emojiClickHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }
    evt.preventDefault();
    this._state.comments.emotion = evt.target.dataset.emotion;
    this.updateElement({ emotion: evt.target.dataset.emotion});

  };

  #inputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      message: evt.target.value
    });
  };

  _restoreHandlers = () => {
    this.element
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#inputHandler);
    this.element
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteCommentHandler);
    this.element
      .addEventListener('keydown', this.#addCommentHandler);

  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
  };

  #addCommentHandler = (evt) => {
    if (!evt.ctrlKey || evt.key !== 'Enter') {
      return;
    }
    evt.preventDefault();
    const message = this._state.message;
    const emotion = this._state.emotion;

    const comment = {
      'id': nanoid(),
      'author': 'Movie Buff',
      'comment': message,
      'date': new Date,
      emotion
    };
    this._callback.addComment(comment);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
  };

  #deleteCommentHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.deleteComment(evt.target.dataset.id);
  };

  static parseCommentToState = (film, comments) => ({
    film,
    listComments: comments,
    emotion: null,
    message: null
  });

  static parseStateToComment = (state) => ({
    'film': state.film,
    'comments': state.comments.message
  });
}
