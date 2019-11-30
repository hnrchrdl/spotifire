import { OPTIONS_SET, OPTIONS_RESET_ALL, OPTIONS_RESET_TYPE } from '../actions/options';

const defaultRange = {
  min: 0,
  max: 100,
};

const defaultState = {
  limit: 20,
  popularity: defaultRange,
  energy: defaultRange,
  danceability: defaultRange,
  valence: defaultRange,
  acousticness: defaultRange,
  instrumentalness: defaultRange,
  speechiness: defaultRange,
  liveness: defaultRange,
  key: null,
  mode: null,
  time_signature: null,
  tempo: null,
};

export default (state = defaultState, action) => {
  if (action.type === OPTIONS_SET) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === OPTIONS_RESET_ALL) {
    return {
      ...state,
      ...defaultState,
    };
  }
  if (action.type === OPTIONS_RESET_TYPE) {
    return {
      ...state,
      ...{ [action.payload]: defaultState[action.payload] },
    };
  }
  return state;
};
