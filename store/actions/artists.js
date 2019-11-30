import { getTopArtists } from '../../lib/api';

export const TOP_ARTISTS_REQUEST = 'TOP_ARTISTS_REQUEST';
export const TOP_ARTISTS_REQUEST_SUCCESS = 'TOP_ARTISTS_REQUEST_SUCCESS';
export const TOP_ARTISTS_RANDOM_SELECT = 'TOP_ARTISTS_RANDOM_SELECT';

export const actions = {
  topArtists: data => ({
    type: TOP_ARTISTS_REQUEST_SUCCESS,
    payload: data.items,
  }),
  load: data => ({
    type: TOP_ARTISTS_REQUEST,
    payload: data,
  }),
  randomize: () => ({
    type: TOP_ARTISTS_RANDOM_SELECT,
    payload: null,
  }),
};

export const asyncActions = {
  requestTopArtists: () => (dispatch) => {
    dispatch(actions.load(true));
    return getTopArtists()
      .then(axRes => dispatch(actions.topArtists(axRes.data)))
      .then(() => dispatch(actions.randomize()));
  },
};
