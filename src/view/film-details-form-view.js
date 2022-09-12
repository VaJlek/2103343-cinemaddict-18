import AbstractView from '../framework/view/abstract-view.js';

const createFilmFormTemplate = () => `<div class="film-details__top-container">
<div class="film-details__close">
  <button class="film-details__close-btn" type="button">close</button>
</div> </div>`;

export default class FilmDetailsFormView extends AbstractView{

  get template() {
    return createFilmFormTemplate();
  }

}
