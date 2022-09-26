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
  SORT_FILM: 'SORT_FILM',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  FilterType,
  SortType,
  UserAction,
  UpdateType
};
