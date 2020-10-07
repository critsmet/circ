//This is the base reducer for forms using the Form component, a 'smart' form that uses React's Context API
//Each input in the form will register itself with this reducer when the component mounts,
//and will clear itself when it unmounts, essentially making the Form component and its context 100% reusable
//This just makes the lives of coders easier so that we don't have to write reducers for every form we use.
//the form will make it for itself

export const stateObjTemplate = {value: null, approved: false, errors: []}

export function formReducer(state={}, action){
  switch (action.type){

    case 'UPDATE_STATE':
      return {...state, [action.name]: {...state[action.name], ...action.payload}}
    case 'ADD_FIELD':
      return {...state, ...action.payload}
    case 'REMOVE_FIELD':
      let newState = {...state}
      delete newState[action.payload]
      return newState
    default:
      return state;
  }
}
