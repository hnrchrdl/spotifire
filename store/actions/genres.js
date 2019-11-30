import { getGenres } from '../../lib/api';

export const GENRES_REQUEST = 'GENRES_REQUEST';
export const GENRES_REQUEST_SUCCESS = 'GENRES_REQUEST_SUCCESS';
export const GENRES_RANDOM_SELECT = 'GENRES_RANDOM_SELECT';

export const actions = {
  genres: data => ({
    type: GENRES_REQUEST_SUCCESS,
    payload: data.genres,
  }),
  load: data => ({
    type: GENRES_REQUEST,
    payload: data,
  }),
  randomize: () => ({
    type: GENRES_RANDOM_SELECT,
    payload: null,
  }),
};

export const asyncActions = {
  requestGenres: () => (dispatch) => {
    dispatch(actions.load(true));
    return getGenres()
      .then(axRes => dispatch(actions.genres(axRes.data)))
      .then(() => dispatch(actions.randomize()));
  },
};
