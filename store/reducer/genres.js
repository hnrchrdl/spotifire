import { GENRES_REQUEST_SUCCESS, GENRES_REQUEST, GENRES_RANDOM_SELECT } from '../actions/genres';
import randomize from '../../lib/randomize';

export default (state = { items: [], loading: false, rndm: [] }, action) => {
  if (action.type === GENRES_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  }
  if (action.type === GENRES_REQUEST_SUCCESS) {
    return {
      ...state,
      items: action.payload,
      loading: false,
    };
  }
  if (action.type === GENRES_RANDOM_SELECT) {
    const rndm = randomize(state.items, 5);
    return {
      ...state,
      rndm,
    };
  }
  return state;
};
