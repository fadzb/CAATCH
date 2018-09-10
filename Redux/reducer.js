import {combineReducers} from 'redux';
import {
    UPDATE_COPING, GET_COPING, UPDATE_SIGN, GET_SIGN, GET_CONTACT, UPDATE_CONTACT, UPDATE_REASON,
    GET_REASON, GET_DISTRACTION, UPDATE_DISTRACTION, UPDATE_DATE, UPDATE_SKILL_RATING, RESET_SKILL_RATING,
    UPDATE_USAGE, UPDATE_FEELING_RATING, RESET_FEELING_RATING, UPDATE_SLEEP_RATING, RESET_SLEEP_RATING,
    UPDATE_MOOD_RATING, RESET_MOOD_RATING, UPDATE_SCHEDULE_DATE, GET_SCHEDULE, UPDATE_DBT_SETTING
} from "./actions";
import Moment from 'moment';

//SafetyPlan

const copingReducer = (state = [], action) => {
    if(action.type === UPDATE_COPING) {
        return [...state, action.payload];
    }
    // used for when a new coping strategy is added

    if(action.type === GET_COPING) {
        return action.payload
    }
    // used to get the complete coping strategy list from the DB

    return state
};

const signReducer = (state = [], action) => {
    if(action.type === UPDATE_SIGN) {
        return [...state, action.payload];
    }
    // used for when a new warning sign is added

    if(action.type === GET_SIGN) {
        return action.payload
    }
    // used to get the complete warning sign list from the DB

    return state
};

const contactReducer = (state = [], action) => {
    if(action.type === UPDATE_CONTACT) {
        return [...state, action.payload];
    }
    // used for when a new contact is added

    if(action.type === GET_CONTACT) {
        return action.payload
    }
    // used to get the complete contact list from the DB

    return state
};

const reasonReducer = (state = [], action) => {
    if(action.type === UPDATE_REASON) {
        return [...state, action.payload];
    }
    // used for when a new reason is added

    if(action.type === GET_REASON) {
        return action.payload
    }
    // used to get the complete contact list from the DB

    return state
};

const distractionReducer = (state = [], action) => {
    if(action.type === UPDATE_DISTRACTION) {
        return [...state, action.payload];
    }
    // used for when a new distraction is added

    if(action.type === GET_DISTRACTION) {
        return action.payload
    }
    // used to get the complete contact list from the DB

    return state
};


//Diary

const diaryReducer = (state = {moodRating: 3, sleepRating: 3, feelingRating: [], skillRating: [], date: Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')}, action) => {
    if(action.type === UPDATE_DATE) {
        return {...state, date: action.payload};
    }
    // used for when a new date is selected

    if(action.type === UPDATE_SKILL_RATING) {
        return {...state, skillRating: state.skillRating.map(rating => {
            if(rating.id === action.payload.id) {
                return action.payload
            } else {
                return rating
            }
        })}
    }
    // used for when a new skill rating is recorded

    if(action.type === RESET_SKILL_RATING) {
        return {...state, skillRating: action.payload};
    }
    // used for when skill ratings are reset

    if(action.type === UPDATE_FEELING_RATING) {
        return {...state, feelingRating: state.feelingRating.map(rating => {
            if(rating.id === action.payload.id) {
                return action.payload
            } else {
                return rating
            }
        })}
    }
    // used for when a new feeling rating is recorded

    if(action.type === RESET_FEELING_RATING) {
        return {...state, feelingRating: action.payload};
    }
    // used for when feeling ratings are reset

    if(action.type === UPDATE_SLEEP_RATING) {
        return {...state, sleepRating: action.payload}
    }
    // used for when a new sleep rating is recorded

    if(action.type === RESET_SLEEP_RATING) {
        return {...state, sleepRating: 3};
    }
    // used for when sleep rating are reset

    if(action.type === UPDATE_MOOD_RATING) {
        return {...state, moodRating: action.payload}
    }
    // used for when a new mood rating is recorded

    if(action.type === RESET_MOOD_RATING) {
        return {...state, moodRating: 3};
    }
    // used for when mood rating are reset

    return state
};

//Usage

const usageReducer = (state = 0, action) => {
    if(action.type === UPDATE_USAGE) {
        return action.payload;
    }
    // store usageId when app is started up

    return state
};

//Schedule

const scheduleReducer = (state = {appointments: {}, date: new Date()}, action) => {
    if(action.type === GET_SCHEDULE) {
        return {...state, appointments: action.payload}
    }
    // used to get the complete appt list from the DB

    if(action.type === UPDATE_SCHEDULE_DATE) {
        return {...state, date: action.payload}
    }
    // used to update agenda date on new day selection

    return state
};

//Setting

const settingReducer = (state = {dbt: false}, action) => {
    if(action.type === UPDATE_DBT_SETTING) {
        return {...state, dbt: action.payload};
    }
    // used to update global DBT setting

    return state
};

const reducer = combineReducers({
    coping: copingReducer,
    sign: signReducer,
    contact: contactReducer,
    reason: reasonReducer,
    distraction: distractionReducer,
    diary: diaryReducer,
    usage: usageReducer,
    schedule: scheduleReducer,
    setting: settingReducer,
});
// as reducers grow, add to this object

export default reducer;