import {combineReducers} from 'redux';
import {
    UPDATE_COPING, GET_COPING, UPDATE_SIGN, GET_SIGN, GET_CONTACT, UPDATE_CONTACT, UPDATE_REASON,
    GET_REASON, GET_DISTRACTION, UPDATE_DISTRACTION, UPDATE_DATE
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

const diaryReducer = (state = {date: Moment(new Date()).format('LL')}, action) => {
    if(action.type === UPDATE_DATE) {
        return {...state, date: action.payload};
    }
    // used for when a new date is selected

    return state
};

const reducer = combineReducers({
    coping: copingReducer,
    sign: signReducer,
    contact: contactReducer,
    reason: reasonReducer,
    distraction: distractionReducer,
    diary: diaryReducer
});
// as reducers grow, add to this object

export default reducer;