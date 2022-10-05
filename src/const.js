const MAX_LENGTH_DESCRIPTION = 140;
const FILMS_COUNT_PER_STEP = 5;

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no history movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  MODEL: 'MODEL',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const TimeLimit = {
  LOWER_LIMIT: 500,
  UPPER_LIMIT: 1000
};

const RatingCountToName = [
  {
    name: '',
    count: 1
  },
  {
    name: 'Novice',
    count: 11
  },
  {
    name: 'Fan',
    count: 21
  },
  {
    name: 'Movie Buff',
    count: Infinity
  },
];

export {
  MAX_LENGTH_DESCRIPTION,
  FILMS_COUNT_PER_STEP,
  FilterType,
  NoFilmTextType,
  SortType,
  UserAction,
  UpdateType,
  Mode,
  Method,
  TimeLimit,
  RatingCountToName
};
