import { combineReducers } from 'redux'

import eventsReducer from '../components/events/eventsMod'

export default combineReducers({
  events: eventsReducer
})
