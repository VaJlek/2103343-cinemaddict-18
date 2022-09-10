import { createElement } from '../render.js';

const createFooterTemplate = () => `<section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>`;

export default class FooterView {
  #element = null;

  get template() {
    return createFooterTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
