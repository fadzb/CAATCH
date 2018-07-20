// action types

export const UPDATE_COPING = 'UPDATE_COPING';
export const GET_COPING = 'GET_COPING';

export const UPDATE_SIGN = 'UPDATE_SIGN';
export const GET_SIGN = 'GET_SIGN';

export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const GET_CONTACT = 'GET_CONTACT';

export const UPDATE_REASON = 'UPDATE_REASON';
export const GET_REASON = 'GET_REASON';

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

export const updateContact = (update) => ({
  type: UPDATE_CONTACT,
  payload: update,
});

export const getContact = (contactList) => ({
  type: GET_CONTACT,
  payload: contactList,
});

export const updateReason = (update) => ({
  type: UPDATE_REASON,
  payload: update,
});

export const getReason = (reasonList) => ({
  type: GET_REASON,
  payload: reasonList,
});
