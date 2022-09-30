import { render } from './framework/render.js';
import UserTitleView from './view/user-title-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel(moviesModel);
const filterModel = new FilterModel;

const contentPresenter = new ContentPresenter(siteMainElement, moviesModel, commentsModel, filterModel, siteFooterElement);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

render(new UserTitleView, siteHeaderElement);

filterPresenter.init();
contentPresenter.init();

