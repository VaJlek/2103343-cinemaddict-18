const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_FILM_DETAILS: 'UPDATE_FILM_DETAILS', //?
  ADD: 'ADD_COMMENT',
  DELETE: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  MODEL: 'MODEL',
};

const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup',
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

export {
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  Mode,
  Method,
  TimeLimit
};
