import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = (filmsCount) => `<section class="footer__statistics">
<p>${filmsCount} movies inside</p>
</section>`;

export default class FooterView extends AbstractView{
  #filmsCount = null;

  constructor (filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterTemplate(this.#filmsCount);
  }
}
