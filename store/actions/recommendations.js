import { getRecommendations } from '../../lib/api';

export const RECOMMENDATIONS_REQUEST = 'RECOMMENDATIONS_REQUEST';
export const RECOMMENDATIONS_REQUEST_SUCCESS = 'RECOMMENDATIONS_REQUEST_SUCCESS';

export const actions = {
  recommendations: data => ({
    type: RECOMMENDATIONS_REQUEST_SUCCESS,
    payload: data.tracks,
  }),
  load: data => ({
    type: RECOMMENDATIONS_REQUEST,
    payload: data,
  }),
};

export const asyncActions = {
  fetchRecommendations: options => (dispatch) => {
    dispatch(actions.load(true));
    return getRecommendations(options).then(axRes => dispatch(actions.recommendations(axRes.data)));
  },
};
