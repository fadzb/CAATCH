// action types

//SafetyPlan

export const UPDATE_COPING = "UPDATE_COPING";
export const GET_COPING = "GET_COPING";

export const UPDATE_SIGN = "UPDATE_SIGN";
export const GET_SIGN = "GET_SIGN";

export const UPDATE_CONTACT = "UPDATE_CONTACT";
export const GET_CONTACT = "GET_CONTACT";

export const UPDATE_REASON = "UPDATE_REASON";
export const GET_REASON = "GET_REASON";

export const UPDATE_DISTRACTION = "UPDATE_DISTRACTION";
export const GET_DISTRACTION = "GET_DISTRACTION";

//Diary

export const UPDATE_DATE = "UPDATE_DATE";

export const UPDATE_SKILL_RATING = "UPDATE_SKILL_RATING";
export const RESET_SKILL_RATING = "RESET_SKILL_RATING";

export const UPDATE_FEELING_RATING = "UPDATE_FEELING_RATING";
export const RESET_FEELING_RATING = "RESET_FEELING_RATING";

export const UPDATE_SLEEP_RATING = "UPDATE_SLEEP_RATING";
export const RESET_SLEEP_RATING = "RESET_SLEEP_RATING";

export const UPDATE_MOOD_RATING = "UPDATE_MOOD_RATING";
export const RESET_MOOD_RATING = "RESET_MOOD_RATING";

//Usage

export const UPDATE_USAGE = "UPDATE_USAGE";

// action creators

//Usage

export const updateUsage = update => ({
    type: UPDATE_USAGE,
    payload: update
});

//SafetyPlan

export const updateCoping = update => ({
    type: UPDATE_COPING,
    payload: update
});

export const getCoping = copeList => ({
    type: GET_COPING,
    payload: copeList
});


export const updateSign = update => ({
    type: UPDATE_SIGN,
    payload: update
});

export const getSign = signList => ({
    type: GET_SIGN,
    payload: signList
});


export const updateContact = update => ({
    type: UPDATE_CONTACT,
    payload: update
});

export const getContact = contactList => ({
    type: GET_CONTACT,
    payload: contactList
});


export const updateReason = update => ({
    type: UPDATE_REASON,
    payload: update
});

export const getReason = reasonList => ({
    type: GET_REASON,
    payload: reasonList
});


export const updateDistraction = update => ({
    type: UPDATE_DISTRACTION,
    payload: update
});

export const getDistraction = distractionList => ({
    type: GET_DISTRACTION,
    payload: distractionList
});

//Diary

export const updateDate = update => ({
    type: UPDATE_DATE,
    payload: update
});

export const updateSkillRating = update => ({
    type: UPDATE_SKILL_RATING,
    payload: update
});

export const resetSkillRating = () => ({
    type: RESET_SKILL_RATING,
});

export const updateFeelingRating = update => ({
    type: UPDATE_FEELING_RATING,
    payload: update
});

export const resetFeelingRating = () => ({
    type: RESET_FEELING_RATING,
});

export const updateSleepRating = update => ({
    type: UPDATE_SLEEP_RATING,
    payload: update
});

export const resetSleepRating = () => ({
    type: RESET_SLEEP_RATING,
});

export const updateMoodRating = update => ({
    type: UPDATE_MOOD_RATING,
    payload: update
});

export const resetMoodRating = () => ({
    type: RESET_MOOD_RATING,
});