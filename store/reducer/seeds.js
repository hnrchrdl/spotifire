import { SET_SELECTED, REMOVE_SELECTED } from '../actions/seeds';

export default (state = { selection: [] }, action) => {
  if (action.type === SET_SELECTED) {
    if (state.selection.length <= 5 && !state.selection.find(item => item.id === action.payload.id)) {
      return {
        ...state,
        selection: [...state.selection, action.payload],
      };
    }
  }
  if (action.type === REMOVE_SELECTED) {
    return {
      ...state,
      selection: state.selection.filter(item => item.id !== action.payload.id),
    };
  }
  return state;
};
