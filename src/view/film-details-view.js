import AbstractStatrfulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import { humanizeToDateWithTime, humanizeToDate, formatDuration } from '../utils/utils.js';
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
  //listComments = listComments.filter(Boolean);
  const template = comments.length
    ? comments.map((index) => createComment(listComments.find(
      ({ id }) => id === index)))
      .join('')
    : '';
  return `<ul class="film-details__comments-list">${template}</ul>`;
};

const createCountComments = (count) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
${count ? count : 0}</span></h3>`;

const createFilmDetailsInfoTemplate = (film) => {
  const {
    filmInfo: {
      title,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: { date, releaseCountry},
      runtime,
      genre,
      description
    },
    userDetails: { watchlist, alreadyWatched, favorite}
  } = film;
  const normDate = humanizeToDate(date);
  const duration = formatDuration(runtime);

  const detailsWatchlistClassName = watchlist
    ? 'film-details__control-button--active'
    : '';
  const detailsWatchedClassName = alreadyWatched
    ? 'film-details__control-button--active'
    : '';
  const detailsFavoriteClassName = favorite
    ? 'film-details__control-button--active'
    : '';

  return `
        <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
  <div class="film-details__info-wrap">
<div class="film-details__poster">
  <img class="film-details__poster-img" src="${poster}" alt="">

  <p class="film-details__age">${ageRating}</p>
</div>

<div class="film-details__info">
  <div class="film-details__info-head">
    <div class="film-details__title-wrap">
      <h3 class="film-details__title">${title}</h3>
      <p class="film-details__title-original">Original: ${title}</p>
    </div>

    <div class="film-details__rating">
      <p class="film-details__total-rating">${totalRating}</p>
    </div>
  </div>

  <table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${actors}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${normDate}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${duration}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${releaseCountry}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Genres</td>
      <td class="film-details__cell">
        <span class="film-details__genre">${genre}</span>
        </td>
    </tr>
  </table>

  <p class="film-details__film-description">
  ${description}
  </p>
</div>
</div>
<section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${detailsWatchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched  ${detailsWatchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${detailsFavoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
    </div>`;
};


const createFilmDetailsTemplate = (state) => {
  const {film, listComments, emotion, message} = state;
  const {comments} = state.film;
  const isChecked = (current, type) => (current === type ? 'checked' : '');
  const emojiLabelTemplate = emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';

  return `<section class="film-details">
          <div class="film-details__inner">
          ${createFilmDetailsInfoTemplate(film)}
  <div class="film-details__bottom-container">
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
</div>
</div>
</section>`;

};


export default class FilmDetailsView extends AbstractStatrfulView{

  constructor(film, comments) {
    super();
    this._state = FilmDetailsView.parseFilmsToState(film, comments);
    this._restoreHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  static parseFilmsToState = (film, comments) => ({
    film,
    listComments: comments,
    emotion: null,
    scroll: null,
    message: null
  });

  static parseStateToFilms = (state) => ({
    'film': state.film,
    'comments': state.message
  });

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
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickCloseButtonHandler);


    this.element.scrollTop = this._state.scroll;
    this.element
      .addEventListener('scroll', this.#positionScrollHandler);

  };

  #emojiClickHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }
    evt.preventDefault();
    this._state.emotion = evt.target.dataset.emotion;
    this.updateElement({ emotion: evt.target.dataset.emotion});

  };

  #inputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      message: evt.target.value
    });
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

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
  };

  #clickCloseButtonHandler = () => {
    this._callback.closeButtonClick();
  };

  #positionScrollHandler = () => {
    this._setState({ scroll: this.element.scrollTop
    });
  };
}
