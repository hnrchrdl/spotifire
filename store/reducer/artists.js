import {
  TOP_ARTISTS_REQUEST,
  TOP_ARTISTS_REQUEST_SUCCESS,
  TOP_ARTISTS_RANDOM_SELECT,
} from '../actions/artists';
import randomize from '../../lib/randomize';

export default (state = { topArtists: [], topArtistsLoading: false, rndm: [] }, action) => {
  if (action.type === TOP_ARTISTS_REQUEST) {
    return {
      ...state,
      topArtistsLoading: true,
    };
  }
  if (action.type === TOP_ARTISTS_REQUEST_SUCCESS) {
    return {
      ...state,
      topArtists: action.payload,
      topArtistsLoading: false,
    };
  }
  if (action.type === TOP_ARTISTS_RANDOM_SELECT) {
    const rndm = randomize(state.topArtists, 5);
    return {
      ...state,
      rndm,
    };
  }
  return state;
};
