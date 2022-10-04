import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class FilmApiService extends ApiService {

  get films() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse)
      .then((films) => films.map(FilmApiService.adaptToClient));

  }

  update = async (film) => {
    try {
      const response = await this._load({
        url: `movies/${film.id}`,
        method: Method.PUT,
        body: JSON.stringify(this.#adaptToServer(film)),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const parseResponse = await ApiService.parseResponse(response);
      return FilmApiService.adaptToClient(parseResponse);
    } catch (err) {
      throw new Error('FilmApi.update()');
    }
  };

  static adaptToClient = (film) => {
    const {
      id,
      comments,
      film_info:
      {
        title,
        alternative_title: alternativeTitle,
        total_rating: totalRating,
        poster,
        age_rating: ageRating,
        director,
        writers,
        actors,
        release:
        {
          date,
          release_country: releaseCountry
        },
        runtime,
        genre,
        description
      },
      user_details:
      {
        watchlist,
        already_watched: alreadyWatched,
        watching_date: watchingDate,
        favorite
      }
    } = film;

    return {
      id,
      comments,
      filmInfo:
      {
        title,
        alternativeTitle,
        totalRating,
        poster,
        ageRating,
        director,
        writers,
        actors,
        release:
        {
          date,
          releaseCountry
        },
        runtime,
        genre,
        description
      },
      userDetails:
      {
        watchlist,
        alreadyWatched,
        watchingDate,
        favorite
      }
    };
  };

  #adaptToServer = (film) => {
    const {
      id,
      comments,
      filmInfo:
      {
        title,
        alternativeTitle,
        totalRating,
        poster,
        ageRating,
        director,
        writers,
        actors,
        release:
        {
          date,
          releaseCountry
        },
        runtime,
        genre,
        description
      },
      userDetails:
      {
        watchlist,
        alreadyWatched,
        watchingDate,
        favorite
      }
    } = film;

    return {
      id,
      comments,
      'film_info':
      {
        title,
        'alternative_title': alternativeTitle,
        'total_rating': totalRating,
        poster,
        'age_rating': ageRating,
        director,
        writers,
        actors,
        release:
        {
          date,
          'release_country': releaseCountry
        },
        runtime,
        genre,
        description
      },
      'user_details':
      {
        watchlist,
        'already_watched': alreadyWatched,
        'watching_date': watchingDate,
        favorite
      }
    };
  };
}
