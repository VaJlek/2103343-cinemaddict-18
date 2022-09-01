import { getRandomInteger } from '../utils.js';

const MOVIE_DATA = {
  posters: {
    'Made for each other': './images/posters/made-for-each-other.png',
    'Popeye meets Sindbad': './images/posters/popeye-meets-sinbad.png',
    'Sagebrush trail': './images/posters/sagebrush-trail.jpg',
    'Santa Claus conquers the martians': './images/posters/santa-claus-conquers-the-martians.jpg',
    'The dance of life': './images/posters/the-dance-of-life.jpg',
    'The greate flamarion': './images/posters/the-great-flamarion.jpg',
    'The man with the golden': './images/posters/the-man-with-the-golden-arm.jpg'
  },
  description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.,', 'In rutrum ac purus sit amet tempus.',]

};

const generateMovieTitle = (movieTitle) => {
  const titles = Object.keys(movieTitle);

  return titles[getRandomInteger(0, titles.length - 1)];
};

export const generateMovie = () => {
  const randomTitle = generateMovieTitle(MOVIE_DATA.posters);
  const posterLink = MOVIE_DATA.posters[randomTitle];
  return {
    'id': '0',
    'comments': [],
    'film_info' : {
      'title': randomTitle,
      'rating': 7,
      'poster': posterLink,
    }
  };

};

