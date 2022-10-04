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

const MAX_LENGTH_DESCRIPTION = 140;

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
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  Mode,
  Method,
  TimeLimit,
  MAX_LENGTH_DESCRIPTION,
  RatingCountToName
};
