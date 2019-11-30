import {
  RECOMMENDATIONS_REQUEST,
  RECOMMENDATIONS_REQUEST_SUCCESS,
} from '../actions/recommendations';

export default (state = { items: [], loading: false }, action) => {
  if (action.type === RECOMMENDATIONS_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  }
  if (action.type === RECOMMENDATIONS_REQUEST_SUCCESS) {
    return {
      ...state,
      items: action.payload || state.items,
      loading: false,
    };
  }
  return state;
};
