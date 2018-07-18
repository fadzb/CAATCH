import { combineReducers } from 'redux';
import { UPDATE_COPING, GET_COPING, UPDATE_SIGN, GET_SIGN, GET_CONTACT, UPDATE_CONTACT } from './actions';

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

const reducer = combineReducers({
  coping: copingReducer,
  sign: signReducer,
  contact: contactReducer,
});
// as reducers grow, add to this object

export default reducer;
