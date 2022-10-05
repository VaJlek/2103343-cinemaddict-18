import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import FilmApiService from './film-api-service.js';
import CommentApiService from './comment-api-service.js';

const AUTHORIZATION = 'Basic vm089809aksda';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const filmApiService = new FilmApiService(END_POINT, AUTHORIZATION);
const commentApiService = new CommentApiService(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel(filmApiService);
const commentsModel = new CommentsModel(commentApiService);
const filterModel = new FilterModel();


const contentPresenter = new ContentPresenter(siteMainElement, moviesModel, commentsModel, filterModel, siteHeaderElement, siteFooterElement);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

commentsModel.addObserver(moviesModel.updateModel);

filterPresenter.init();
contentPresenter.init();
moviesModel.init();

