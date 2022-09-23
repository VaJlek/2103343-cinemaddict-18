import AbstractStatrfulView from '../framework/view/abstract-stateful-view.js';

const createAddFilmCommentsTemplate = (state) => {

  const {selectedEmoji} = state;

  const showSelectedEmoji = (emoji) =>
    emoji
      ? `<img src="images/emoji/${emoji}.png" width="70" height="70" alt="emoji-${emoji}"></img>`
      : '';

  const isCheckedEmoji = (currentEmoji, emoji) => (currentEmoji === emoji ? 'checked' : '');

  return `<form class="film-details__new-comment" action="" method="get">
    <div class="film-details__add-emoji-label">
    ${showSelectedEmoji(selectedEmoji)}
    </div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
    </label>
    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isCheckedEmoji(selectedEmoji, 'smile',)}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emotion="smile">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isCheckedEmoji(selectedEmoji, 'sleeping',)}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emotion="sleeping">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isCheckedEmoji(selectedEmoji, 'puke',)}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emotion="puke">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isCheckedEmoji(selectedEmoji, 'angry',)}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emotion="angry">
      </label>
    </div>
  </form>`;
};


export default class FilmDetailsAddCommentView extends AbstractStatrfulView{

  constructor(comments) {
    super();
    this._state = FilmDetailsAddCommentView.parseCommentToState(comments);
    this.#setHandlers();
  }

  get template() {
    return createAddFilmCommentsTemplate(this._state);
  }

  #emojiClickHandler = (evt) => {

    if (evt.target.tagName !== 'IMG') {
      return;
    }
    evt.preventDefault();
    const selectedEmoji = evt.target.dataset.emotion;

    if (this._state.selectedEmoji !== selectedEmoji) {
      this.updateElement({
        selectedEmoji: evt.target.dataset.emotion
      });
    }
  };

  #scrollHandler = (evt) => {
    evt.preventDefault();
    this._setState({ scrollTop: evt.target.scrollTop });
  };

  #inputHandler = (evt) => {
    evt.preventDefault();
    this._setState({ currentComment: evt.target.value });
  };

  #setHandlers = () => {
    this.element
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element
      .addEventListener('scroll', this.#scrollHandler);
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#inputHandler);
  };

  _restoreHandlers = () => {
    this.#setHandlers();
  };

  static parseCommentToState = (comment) => ({
    ...comment,
    selectedEmoji: null,
    scrollTop: 0,
    currentComment: null,
  });


  static parseStateToComment = (state) => {
    const comment = { ...state};

    delete comment.selectedEmoji;
    delete comment.scrollTop;
    delete comment.currentComment;

    return comment;
  };


}
