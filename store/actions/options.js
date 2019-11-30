export const OPTIONS_SET = 'OPTIONS_SET';
export const OPTIONS_RESET_ALL = 'OPTIONS_RESET_ALL';
export const OPTIONS_RESET_TYPE = 'OPTIONS_RESET_TYPE';

export const actions = {
  setOption: data => ({
    type: OPTIONS_SET,
    payload: data,
  }),
  resetOption: type => ({
    type: OPTIONS_RESET_TYPE,
    payload: type,
  }),
  resetAllOptions: () => ({
    type: OPTIONS_RESET_ALL,
  }),
};
