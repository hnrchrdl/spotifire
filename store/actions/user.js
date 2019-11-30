export const SET_USER = 'SET_USER';

export const actions = {
  setUser: user => ({
    type: SET_USER,
    payload: user,
  }),
};

export const asyncActions = {};
