import { BASE } from '../../index.js'

export function appReducer(state = {loading: true, categories: [], events: [], searchParams: ''}, action){
  switch(action.type){
    case "ADD_CATEGORIES":
      return {...state, categories: action.payload}
    case "ADD_EVENTS":
      return {...state, loading: false, events: action.payload}
    case "UPDATE_SEARCH_PARAMS":
      console.log("UPDATING");
      return {...state, searchParams: action.payload}
    case "LOADING_TRUE":
      return {...state, loading: true}
    default:
      return state;
    }
}

export function fetchCategories(){
  return function (dispatch){
    fetch(BASE + "/categories")
      .then(res => res.json())
      .then(categoriesArray => dispatch({type: "ADD_CATEGORIES", payload: categoriesArray.sort((a, b) => a.name.length < b.name.length ? -1 : 1)}))
  }
}

export function fetchEvents(params){
  return function(dispatch){
    fetch(BASE + `/events/${params}`)
      .then(res => res.json())
      .then(events => dispatch({type: "ADD_EVENTS", payload: events}))
  }
}
