import {
  TOP_TRACKS_REQUEST,
  TOP_TRACKS_REQUEST_SUCCESS,
  TOP_TRACKS_RANDOM_SELECT,
} from '../actions/tracks';
import randomize from '../../lib/randomize';

export default (state = { topTracks: [], topTracksLoading: false, rndm: [] }, action) => {
  if (action.type === TOP_TRACKS_REQUEST) {
    return {
      ...state,
      topTracksLoading: true,
    };
  }
  if (action.type === TOP_TRACKS_REQUEST_SUCCESS) {
    return {
      ...state,
      topTracks: action.payload,
      topTracksLoading: false,
    };
  }
  if (action.type === TOP_TRACKS_RANDOM_SELECT) {
    const rndm = randomize(state.topTracks, 5);
    return {
      ...state,
      rndm,
    };
  }
  return state;
};
