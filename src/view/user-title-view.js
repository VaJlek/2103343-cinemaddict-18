import AbstractView from '../framework/view/abstract-view.js';

const createUserTitleTemplate = (ratingName) => `<section class="header__profile profile">
<p class="profile__rating">${ratingName}</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
export default class UserTitleView extends AbstractView{
  #ratingName = null;

  constructor(ratingName) {
    super();
    this.#ratingName = ratingName;
  }

  get template() {
    return createUserTitleTemplate(this.#ratingName);
  }

}
