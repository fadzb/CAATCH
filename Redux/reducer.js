import { combineReducers } from 'redux';
import {
  UPDATE_COPING,
  GET_COPING,
  UPDATE_SIGN,
  GET_SIGN,
  GET_CONTACT,
  UPDATE_CONTACT,
  UPDATE_REASON,
  GET_REASON,
  GET_DISTRACTION,
  UPDATE_DISTRACTION,
  UPDATE_DATE,
  UPDATE_SKILL_RATING,
  RESET_SKILL_RATING,
  UPDATE_USAGE,
  UPDATE_FEELING_RATING,
  RESET_FEELING_RATING,
  UPDATE_SLEEP_RATING,
  RESET_SLEEP_RATING,
} from './actions';
import Moment from 'moment';
import { defaultSkillRating, defaultFeelingRating } from '../Constants/ReduxConstants';

//SafetyPlan

const copingReducer = (state = [], action) => {
  if (action.type === UPDATE_COPING) {
    return [...state, action.payload];
  }
  // used for when a new coping strategy is added

  if (action.type === GET_COPING) {
    return action.payload;
  }
  // used to get the complete coping strategy list from the DB

  return state;
};

const signReducer = (state = [], action) => {
  if (action.type === UPDATE_SIGN) {
    return [...state, action.payload];
  }
  // used for when a new warning sign is added

  if (action.type === GET_SIGN) {
    return action.payload;
  }
  // used to get the complete warning sign list from the DB

  return state;
};

const contactReducer = (state = [], action) => {
  if (action.type === UPDATE_CONTACT) {
    return [...state, action.payload];
  }
  // used for when a new contact is added

  if (action.type === GET_CONTACT) {
    return action.payload;
  }
  // used to get the complete contact list from the DB

  return state;
};

const reasonReducer = (state = [], action) => {
  if (action.type === UPDATE_REASON) {
    return [...state, action.payload];
  }
  // used for when a new reason is added

  if (action.type === GET_REASON) {
    return action.payload;
  }
  // used to get the complete contact list from the DB

  return state;
};

const distractionReducer = (state = [], action) => {
  if (action.type === UPDATE_DISTRACTION) {
    return [...state, action.payload];
  }
  // used for when a new distraction is added

  if (action.type === GET_DISTRACTION) {
    return action.payload;
  }
  // used to get the complete contact list from the DB

  return state;
};

//Diary

const defaultSkillRatings = defaultSkillRating();
const defaultFeelingRatings = defaultFeelingRating();

const diaryReducer = (
  state = {
    sleepRating: 3,
    feelingRating: defaultFeelingRatings,
    skillRating: defaultSkillRatings,
    date: Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
  },
  action
) => {
  if (action.type === UPDATE_DATE) {
    return { ...state, date: action.payload };
  }
  // used for when a new date is selected

  if (action.type === UPDATE_SKILL_RATING) {
    return {
      ...state,
      skillRating: [...state.skillRating].map((rating) => {
        if (rating.id === action.payload.id) {
          return action.payload;
        } else {
          return rating;
        }
      }),
    };
  }
  // used for when a new skill rating is recorded

  if (action.type === RESET_SKILL_RATING) {
    return { ...state, skillRating: [...defaultSkillRatings] };
  }
  // used for when skill ratings are reset

  if (action.type === UPDATE_FEELING_RATING) {
    return {
      ...state,
      feelingRating: [...state.feelingRating].map((rating) => {
        if (rating.id === action.payload.id) {
          return action.payload;
        } else {
          return rating;
        }
      }),
    };
  }
  // used for when a new feeling rating is recorded

  if (action.type === RESET_FEELING_RATING) {
    return { ...state, feelingRating: [...defaultFeelingRatings] };
  }
  // used for when feeling ratings are reset

  if (action.type === UPDATE_SLEEP_RATING) {
    return { ...state, sleepRating: action.payload };
  }
  // used for when a new sleep rating is recorded

  if (action.type === RESET_SLEEP_RATING) {
    return { ...state, sleepRating: 3 };
  }
  // used for when sleep rating are reset

  return state;
};

//Usage

const usageReducer = (state = 0, action) => {
  if (action.type === UPDATE_USAGE) {
    return action.payload;
  }
  // store usageId when app is started up

  return state;
};

const reducer = combineReducers({
  coping: copingReducer,
  sign: signReducer,
  contact: contactReducer,
  reason: reasonReducer,
  distraction: distractionReducer,
  diary: diaryReducer,
  usage: usageReducer,
});
// as reducers grow, add to this object

export default reducer;
