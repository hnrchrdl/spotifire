export const SET_SELECTED = 'ADD_SELECTED';
export const REMOVE_SELECTED = 'REMOVE_SELECTED';

export const actions = {
  select: item => ({
    type: SET_SELECTED,
    payload: item,
  }),
  remove: item => ({
    type: REMOVE_SELECTED,
    payload: item,
  }),
};
