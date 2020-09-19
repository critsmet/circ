import { BASE } from '../../index.js'

export default (state = [], action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return action.payload
    case 'ADD_EVENT':
      return [...state, action.payload]
    default:
      return state
  }
}

export const getEvents = schedule => dispatch => {
  fetch(BASE + "/events")
    .then(res => res.json())
    .then((res) => dispatch({type: "SET_EVENTS", payload: res}))
}

export const addEvent = (newEventObj, history) => dispatch => {
  fetch(BASE + "/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({event: newEventObj})
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === 201){
      if (res.response === "E-mail already confirmed"){
        history.push("/messages/submitted-event/approved")
      } else if (res.response === "E-mail confirmation required"){
        history.push("/messages/submitted-event/email-confirmation-required")
      }
    } else {
      history.push("/messages/submitted-event/denied")
    }
  })
  .catch((e) => alert(e))
}
