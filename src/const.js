const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const filterTypeToText = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_FILM_DETAILS: 'UPDATE_FILM_DETAILS',
  ADD: 'ADD_COMMENT',
  DELETE: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup',
};

export {
  FilterType,
  filterTypeToText,
  SortType,
  UserAction,
  UpdateType,
  Mode
};
