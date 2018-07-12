// action types

export const UPDATE_COPING = 'UPDATE_COPING';
export const GET_COPING = 'GET_COPING';

export const UPDATE_SIGN = 'UPDATE_SIGN';
export const GET_SIGN = 'GET_SIGN';

// action creators

export const updateCoping = (update) => ({
  type: UPDATE_COPING,
  payload: update,
});

export const getCoping = (copeList) => ({
  type: GET_COPING,
  payload: copeList,
});

export const updateSign = (update) => ({
  type: UPDATE_SIGN,
  payload: update,
});

export const getSign = (signList) => ({
  type: GET_SIGN,
  payload: signList,
});
