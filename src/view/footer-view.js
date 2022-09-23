import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = (film) =>{

  const filmsCount = film;

  return `<section class="footer__statistics">
  <p>${filmsCount} movies inside</p>
</section>`;
};
export default class FooterView extends AbstractView{

  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFooterTemplate(this.#film);
  }

}
