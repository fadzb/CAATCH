// action types

export const UPDATE_COPING = "UPDATE_COPING";
export const GET_COPING = "GET_COPING";

// action creators

export const updateCoping = update => ({
    type: UPDATE_COPING,
    payload: update
});

export const getCoping = copeList => ({
    type: GET_COPING,
    payload: copeList
});