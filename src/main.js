import { render } from './framework/render.js';
import UserTitleView from './view/user-title-view.js';
import ContentPresenter from './presenter/content-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel(moviesModel);

const contentPresenter = new ContentPresenter(siteMainElement, moviesModel, commentsModel, siteFooterElement);

render(new UserTitleView, siteHeaderElement);

contentPresenter.init();

