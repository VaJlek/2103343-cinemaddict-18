import { render } from './render.js';
import NavigationView from './view/navigation-view.js';
import SortingView from './view/sorting-view.js';
import UserTitleView from './view/user-title-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FooterView from './view/footer-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const contentPresenter = new ContentPresenter;

render(new UserTitleView, siteHeaderElement);
render(new NavigationView, siteMainElement);
render(new SortingView, siteMainElement);
render(new FooterView, siteFooterElement);

contentPresenter.init(siteMainElement);
