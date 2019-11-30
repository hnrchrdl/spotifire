import { SET_USER } from '../actions/user';

export default (state = null, action) => {
  if (action.type === SET_USER) {
    return action.payload;
  }
  return state;
};
