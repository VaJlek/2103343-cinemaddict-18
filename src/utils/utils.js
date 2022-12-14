import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

const getFilteredFilmsCount = (filters, name) =>
  filters.find((filter) => filter.name === name).count;

const humanizeToYear = (dueDate) => dayjs(dueDate).format('YYYY');

const humanizeToDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');

const humanizeToDateWithTime = (dueDate) => dayjs(dueDate).fromNow();

const formatDuration = (minutes) => dayjs.duration(minutes, 'minutes').format('H[h] mm[m]');

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;
const sortComments = (a, b) => b.comments.length - a.comments.length;

export {
  getRandomInteger,
  getRandomBoolean,
  getFilteredFilmsCount,
  sortDate,
  sortRating,
  sortComments,
  humanizeToYear,
  humanizeToDate,
  humanizeToDateWithTime,
  formatDuration,
};
