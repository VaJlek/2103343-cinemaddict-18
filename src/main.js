import { render } from './render.js';
import NavigationView from './view/navigation-view.js';
import SortingView from './view/sorting-view.js';
import UserTitleView from './view/user-title-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FooterView from './view/footer-view.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const contentPresenter = new ContentPresenter;
const moviesModel = new MoviesModel;
const commentsModel = new CommentsModel;

render(new UserTitleView, siteHeaderElement);
render(new NavigationView, siteMainElement);
render(new SortingView, siteMainElement);
render(new FooterView, siteFooterElement);

contentPresenter.init(siteMainElement, moviesModel, commentsModel);
