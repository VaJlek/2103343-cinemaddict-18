import { render } from './framework/render.js';
import UserTitleView from './view/user-title-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel(moviesModel);
const filtersModel = new FiltersModel;

const contentPresenter = new ContentPresenter(siteMainElement, moviesModel, commentsModel, filtersModel, siteFooterElement);
const filterPresenter = new FilterPresenter(siteMainElement, filtersModel, moviesModel);

render(new UserTitleView, siteHeaderElement);

filterPresenter.init();
contentPresenter.init();

