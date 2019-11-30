import { getTopTracks } from '../../lib/api';

export const TOP_TRACKS_REQUEST = 'TOP_TRACKS_REQUEST';
export const TOP_TRACKS_REQUEST_SUCCESS = 'TOP_TRACKS_REQUEST_SUCCESS';
export const TOP_TRACKS_RANDOM_SELECT = 'TOP_TRACKS_RANDOM_SELECT';

export const actions = {
  topTracks: data => ({
    type: TOP_TRACKS_REQUEST_SUCCESS,
    payload: data.items,
  }),
  load: data => ({
    type: TOP_TRACKS_REQUEST,
    payload: data,
  }),
  randomize: () => ({
    type: TOP_TRACKS_RANDOM_SELECT,
    payload: null,
  }),
};

export const asyncActions = {
  requestTopTracks: () => (dispatch) => {
    dispatch(actions.load(true));
    return getTopTracks()
      .then(axRes => dispatch(actions.topTracks(axRes.data)))
      .then(() => dispatch(actions.randomize()));
  },
};
